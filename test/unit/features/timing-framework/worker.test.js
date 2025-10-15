import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import TimingWorker from '../../../../events/features/timing-framework/worker.js';

// Mock BroadcastChannel
class MockBroadcastChannel {
  constructor(name) {
    this.name = name;
    this.onmessage = null;
  }

  postMessage(data) {
    if (this.onmessage) {
      this.onmessage({ data });
    }
  }
}

MockBroadcastChannel.prototype.close = () => {};

// Mock fetch
const mockFetch = sinon.stub();
window.fetch = mockFetch;

// Mock BroadcastChannel
window.BroadcastChannel = MockBroadcastChannel;

describe('TimingWorker', () => {
  let worker;
  let mockPostMessage;

  beforeEach(() => {
    // Reset mocks
    sinon.reset();
    mockPostMessage = sinon.stub();
    window.postMessage = mockPostMessage;

    // Create a new worker instance
    worker = new TimingWorker();
  });

  describe('getStartScheduleItemByToggleTime', () => {
    it('should return the first item if no toggleTime has passed', async () => {
      const schedule = {
        toggleTime: Date.now() + 1000,
        next: null,
      };

      const result = await worker.getStartScheduleItemByToggleTime(schedule);
      expect(result).to.equal(schedule);
    });

    it('should return the last passed item if toggleTime has passed', async () => {
      const now = Date.now();
      const schedule = {
        toggleTime: now - 2000,
        next: {
          toggleTime: now - 1000,
          next: {
            toggleTime: now + 1000,
            next: null,
          },
        },
      };

      const result = await worker.getStartScheduleItemByToggleTime(schedule);
      expect(result).to.equal(schedule.next);
    });

    it('should use testing time when in testing mode', async () => {
      const now = Date.now();
      const schedule = {
        toggleTime: now + 1000, // Future time
        next: null,
      };

      // Set up testing mode with a time offset that makes the current time
      // appear to be in the future
      worker.testingManager.init({ toggleTime: now + 2000 });

      const result = await worker.getStartScheduleItemByToggleTime(schedule);
      // Should return the schedule item because the testing time is in the future
      expect(result).to.equal(schedule);
    });

    it('should use testing time when in testing mode - past time', async () => {
      const now = Date.now();
      const schedule = {
        toggleTime: now - 1000, // Past time
        next: {
          toggleTime: now + 1000, // Future time
          next: null,
        },
      };

      // Set up testing mode with a time offset that makes the current time
      // appear to be in the past
      worker.testingManager.init({ toggleTime: now - 2000 });

      const result = await worker.getStartScheduleItemByToggleTime(schedule);
      // Should return the first item because the testing time is in the past
      expect(result).to.equal(schedule);
    });
  });

  describe('shouldTriggerNextSchedule', () => {
    it('should return false if scheduleItem is null', async () => {
      const result = await worker.shouldTriggerNextSchedule(null);
      expect(result).to.be.false;
    });

    it('should handle mobileRider overrun scenario', async () => {
      const currentItem = { mobileRider: { sessionId: 'session1' } };
      const nextItem = { pathToFragment: '/next' };

      worker.currentScheduleItem = currentItem;
      worker.plugins.set('mobileRider', new Map([['session1', true]]));

      const result = await worker.shouldTriggerNextSchedule(nextItem);
      expect(result).to.be.false;
    });

    it('should handle mobileRider underrun scenario', async () => {
      const nextItem = {
        mobileRider: { sessionId: 'session1' },
        pathToFragment: '/next',
      };

      worker.plugins.set('mobileRider', new Map([['session1', false]]));

      const result = await worker.shouldTriggerNextSchedule(nextItem);
      expect(result).to.be.true;
    });

    it('should handle metadata conditions', async () => {
      const nextItem = {
        metadata: [{ key: 'testKey', expectedValue: 'expected' }],
        pathToFragment: '/next',
      };

      worker.plugins.set('metadata', new Map([['testKey', 'expected']]));

      const result = await worker.shouldTriggerNextSchedule(nextItem);
      expect(result).to.be.true;
    });

    it('should handle multiple metadata conditions', async () => {
      const nextItem = {
        metadata: [
          { key: 'testKey1', expectedValue: 'expected1' },
          { key: 'testKey2', expectedValue: 'expected2' },
        ],
        pathToFragment: '/next',
      };

      worker.plugins.set('metadata', new Map([
        ['testKey1', 'wrong'],
        ['testKey2', 'expected2'],
      ]));

      const result = await worker.shouldTriggerNextSchedule(nextItem);
      expect(result).to.be.false;
    });

    it('should trigger when all metadata conditions are met', async () => {
      const nextItem = {
        metadata: [
          { key: 'testKey1', expectedValue: 'expected1' },
          { key: 'testKey2', expectedValue: 'expected2' },
        ],
        pathToFragment: '/next',
      };

      worker.plugins.set('metadata', new Map([
        ['testKey1', 'expected1'],
        ['testKey2', 'expected2'],
      ]));

      const result = await worker.shouldTriggerNextSchedule(nextItem);
      expect(result).to.be.true;
    });

    it('should not trigger when no metadata conditions are met', async () => {
      const nextItem = {
        metadata: [
          { key: 'testKey1', expectedValue: 'expected1' },
          { key: 'testKey2', expectedValue: 'expected2' },
        ],
        pathToFragment: '/next',
      };

      worker.plugins.set('metadata', new Map([
        ['testKey1', 'wrong1'],
        ['testKey2', 'wrong2'],
      ]));

      const result = await worker.shouldTriggerNextSchedule(nextItem);
      expect(result).to.be.false;
    });

    it('should fall back to toggleTime if no plugins are blocking', async () => {
      const now = Date.now();
      const nextItem = {
        toggleTime: now - 1000,
        pathToFragment: '/next',
      };

      const result = await worker.shouldTriggerNextSchedule(nextItem);
      expect(result).to.be.true;
    });
  });

  describe('handleMessage', () => {
    it('should set up plugins and channels', async () => {
      const plugins = {
        metadata: {
          type: 'metadata',
          data: { key1: 'value1' },
        },
        mobileRider: {
          type: 'mobileRider',
          data: { session1: true },
        },
      };

      await worker.handleMessage({
        data: {
          tabId: 'test-tab-id',
          plugins,
          schedule: { toggleTime: Date.now() },
        },
      });

      expect(worker.plugins.size).to.equal(2);
      expect(worker.channels.size).to.equal(3); // metadata, mobileRider, timeCache
    });
  });

  describe('getAuthoritativeTime', () => {
    let perfStub;

    beforeEach(() => {
      // Reset the worker's time management properties
      worker.cachedApiTime = null;
      worker.lastApiCallPerformance = 0;
      perfStub = sinon.stub(performance, 'now');
    });

    afterEach(() => {
      if (perfStub) perfStub.restore();
    });

    it('should return cached API time if valid', async () => {
      const now = Date.now();
      const apiTime = now - 1000; // API time is 1 second behind
      perfStub.returns(30000); // 30 seconds elapsed
      worker.cachedApiTime = { time: apiTime, timestamp: now - 30000, performanceTimestamp: 0 };

      const result = await worker.getAuthoritativeTime();
      expect(result).to.be.closeTo(apiTime + 30000, 100); // Allow 100ms tolerance
    });

    it('should call API if cache is expired', async () => {
      const now = Date.now();
      const apiTime = now - 1000;
      perfStub.returns(1000);
      // 700 seconds ago (expired)
      worker.cachedApiTime = { time: apiTime, timestamp: now - 700000, performanceTimestamp: 0 };
      worker.lastApiCallPerformance = 0;

      // Mock successful API response
      mockFetch.resolves({ text: () => Promise.resolve(Math.floor(apiTime / 1000).toString()) });

      const result = await worker.getAuthoritativeTime();
      expect(mockFetch.called).to.be.true;
      // The result should be close to the API time
      // but we need to account for the time elapsed during the test
      expect(result).to.be.closeTo(apiTime, 1000);
    });

    it('should not call API if rate limit not reached', async () => {
      const now = Date.now();
      perfStub.returns(100000); // 100 seconds
      // 100 seconds ago (rate limit not reached for 5 min interval)
      worker.lastApiCallPerformance = 1000; // Set to non-zero so rate limit is enforced

      const result = await worker.getAuthoritativeTime();
      expect(mockFetch.called).to.be.false;
      expect(result).to.be.closeTo(now, 100);
    });

    it('should fall back to local time if API fails', async () => {
      const now = Date.now();
      perfStub.returns(40000);
      worker.lastApiCallPerformance = 0;

      // Mock failed API response
      mockFetch.rejects(new Error('Network error'));

      const result = await worker.getAuthoritativeTime();
      expect(result).to.be.closeTo(now, 100);
    });

    it('should use cached time if API returns null', async () => {
      const now = Date.now();
      const apiTime = now - 1000;
      perfStub.returns(30000);
      worker.cachedApiTime = { time: apiTime, timestamp: now - 30000, performanceTimestamp: 0 };
      worker.lastApiCallPerformance = 0;

      // Mock API returning null
      mockFetch.resolves({ text: () => Promise.resolve('invalid') });

      const result = await worker.getAuthoritativeTime();
      expect(result).to.be.closeTo(apiTime + 30000, 100);
    });

    it('should implement progressive backoff on failures', async () => {
      perfStub.returns(400000);
      worker.lastApiCallPerformance = 0;
      worker.consecutiveFailures = 0; // Start with no failures

      // Mock failed API response
      mockFetch.rejects(new Error('Network error'));

      await worker.getAuthoritativeTime();
      expect(worker.consecutiveFailures).to.equal(1);
    });

    it('should reset failure count on successful API call', async () => {
      const now = Date.now();
      const apiTime = now - 1000;
      perfStub.returns(400000);
      worker.lastApiCallPerformance = 0;
      worker.consecutiveFailures = 0; // Start with no failures to ensure API call happens

      // Mock successful API response
      mockFetch.resolves({ text: () => Promise.resolve(Math.floor(apiTime / 1000).toString()) });

      await worker.getAuthoritativeTime();
      expect(worker.consecutiveFailures).to.equal(0);
    });

    it('should broadcast time updates to other tabs', async () => {
      const now = Date.now();
      const apiTime = now - 1000;
      perfStub.returns(400000);
      worker.lastApiCallPerformance = 0;

      // Mock successful API response
      mockFetch.resolves({ text: () => Promise.resolve(Math.floor(apiTime / 1000).toString()) });

      // Mock the time cache channel
      const mockChannel = { postMessage: sinon.stub() };
      worker.channels.set('timeCache', mockChannel);

      await worker.getAuthoritativeTime();
      expect(mockChannel.postMessage.called).to.be.true;
      expect(mockChannel.postMessage.firstCall.args[0]).to.deep.equal({
        type: 'time-update',
        data: worker.cachedApiTime,
      });
    });
  });

  describe('runTimer with testing', () => {
    it('should stop polling when in testing mode', async () => {
      const clock = sinon.useFakeTimers();

      // Set up testing mode
      worker.testingManager.init({ toggleTime: Date.now() + 1000 });

      // Set up a schedule item that should trigger
      worker.nextScheduleItem = {
        toggleTime: Date.now() - 1000,
        pathToFragment: '/test',
      };
      worker.currentScheduleItem = { pathToFragment: '/current' };

      // Run timer
      await worker.runTimer();

      // Verify no setTimeout was called (polling stopped)
      expect(worker.timerId).to.be.null;

      clock.restore();
    });

    it('should continue polling when not in testing mode', async () => {
      const clock = sinon.useFakeTimers();

      // Set up non-testing mode
      worker.testingManager.init(null);

      // Set up a schedule item
      worker.nextScheduleItem = {
        toggleTime: Date.now() + 1000,
        pathToFragment: '/test',
        next: { toggleTime: Date.now() + 2000, pathToFragment: '/next' },
      };
      worker.currentScheduleItem = { pathToFragment: '/current' };

      // Run timer
      await worker.runTimer();

      // Verify setTimeout was called (polling continues)
      expect(worker.timerId).to.not.be.null;

      clock.restore();
    });
  });

  describe('BroadcastChannel handling', () => {
    it('should only process messages from the same tab', () => {
      const metadataWorker = new TimingWorker();

      // Initialize the worker with a tabId and plugins
      metadataWorker.handleMessage({
        data: {
          tabId: 'test-tab-id',
          plugins: {
            metadata: {
              type: 'metadata',
              data: {},
            },
          },
          schedule: { toggleTime: Date.now() },
        },
      });

      // Get the store from the worker's plugins
      const metadataStore = metadataWorker.plugins.get('metadata');
      const channel = metadataWorker.channels.get('metadata');

      // Send message from different tab
      channel.postMessage({
        tabId: 'different-tab-id',
        key: 'testKey',
        value: 'testValue',
      });

      // Value should not be set
      expect(metadataStore.get('testKey')).to.be.undefined;

      // Send message from same tab
      channel.postMessage({
        tabId: metadataWorker.tabId,
        key: 'testKey',
        value: 'testValue',
      });

      // Value should be set
      expect(metadataStore.get('testKey')).to.equal('testValue');
    });

    it('should handle mobile rider messages with tab isolation', () => {
      const riderWorker = new TimingWorker();

      // Initialize the worker with a tabId and plugins
      riderWorker.handleMessage({
        data: {
          tabId: 'test-tab-id',
          plugins: {
            mobileRider: {
              type: 'mobileRider',
              data: {},
            },
          },
          schedule: { toggleTime: Date.now() },
        },
      });

      // Get the store from the worker's plugins
      const mobileRiderStore = riderWorker.plugins.get('mobileRider');
      const channel = riderWorker.channels.get('mobileRider');

      // Send message from different tab
      channel.postMessage({
        tabId: 'different-tab-id',
        sessionId: 'session1',
        isActive: true,
      });

      // Session should not be set
      expect(mobileRiderStore.get('session1')).to.be.undefined;

      // Send message from same tab
      channel.postMessage({
        tabId: riderWorker.tabId,
        sessionId: 'session1',
        isActive: true,
      });

      // Session should be set
      expect(mobileRiderStore.get('session1')).to.be.true;
    });
  });

  describe('Clock drift detection', () => {
    let perfStub;

    beforeEach(() => {
      perfStub = sinon.stub(performance, 'now');
      worker.cachedApiTime = null;
      worker.lastApiCallPerformance = 0;
    });

    afterEach(() => {
      perfStub.restore();
    });

    it('should detect clock jump forward and invalidate cache', async () => {
      const now = Date.now();
      const apiTime = now - 1000;

      // Set up initial cache
      perfStub.returns(1000); // performance.now() = 1s
      worker.cachedApiTime = {
        time: apiTime,
        timestamp: now,
        performanceTimestamp: 1000,
      };

      // Simulate clock jump forward by 10 minutes
      const futureTime = now + 600000; // 10 minutes later
      sinon.stub(Date, 'now').returns(futureTime);
      perfStub.returns(2000); // performance.now() only advanced 1s

      // Drift: wallClock = 600s, monotonic = 1s, drift = 599s > 60s threshold
      await worker.getAuthoritativeTime();

      // Cache should be invalidated due to drift
      expect(worker.cachedApiTime).to.be.null;

      Date.now.restore();
    });

    it('should detect clock jump backward and invalidate cache', async () => {
      const now = Date.now();
      const apiTime = now - 1000;

      // Set up initial cache
      perfStub.returns(1000);
      worker.cachedApiTime = {
        time: apiTime,
        timestamp: now,
        performanceTimestamp: 1000,
      };

      // Simulate clock jump backward by 10 minutes
      const pastTime = now - 600000;
      sinon.stub(Date, 'now').returns(pastTime);
      perfStub.returns(2000); // performance.now() moved forward normally

      // Drift: wallClock = -600s, monotonic = 1s, drift = 601s > 60s threshold
      await worker.getAuthoritativeTime();

      // Cache should be invalidated due to drift
      expect(worker.cachedApiTime).to.be.null;

      Date.now.restore();
    });

    it('should use monotonic time for elapsed calculations when no drift', async () => {
      const now = Date.now();
      const apiTime = now - 1000;

      // Set up cache with known values
      perfStub.returns(1000);
      worker.cachedApiTime = {
        time: apiTime,
        timestamp: now,
        performanceTimestamp: 1000,
      };

      // Advance performance.now() by 5 seconds
      perfStub.returns(6000);

      const result = await worker.getAuthoritativeTime();

      // Result should be apiTime + 5000ms (monotonic elapsed time)
      expect(result).to.equal(apiTime + 5000);
    });

    it('should handle small acceptable clock drift', async () => {
      const now = Date.now();
      const apiTime = now - 1000;

      // Set up cache
      perfStub.returns(1000);
      worker.cachedApiTime = {
        time: apiTime,
        timestamp: now,
        performanceTimestamp: 1000,
      };

      // Simulate small drift (30 seconds - below 60s threshold)
      const slightlyOffTime = now + 30000;
      sinon.stub(Date, 'now').returns(slightlyOffTime);
      perfStub.returns(31000); // performance.now() advanced 30s

      // Drift: wallClock = 30s, monotonic = 30s, drift = 0s (acceptable)
      const result = await worker.getAuthoritativeTime();

      // Cache should still be valid
      expect(worker.cachedApiTime).to.not.be.null;
      expect(result).to.equal(apiTime + 30000);

      Date.now.restore();
    });

    it('should use performance.now() for rate limiting checks', async () => {
      // Set last API call timestamp
      perfStub.returns(1000);
      worker.lastApiCallPerformance = 1000;

      // Advance performance.now() by 2 minutes (120 seconds)
      perfStub.returns(121000);

      // Mock API to ensure it's not called (rate limit not reached - need 5 min)
      mockFetch.resolves({ text: () => Promise.resolve('1234567890') });

      await worker.getAuthoritativeTime();

      // API should not be called because rate limit not reached
      expect(mockFetch.called).to.be.false;
    });

    it('should handle cache invalidation and force fresh API call', async () => {
      const now = Date.now();
      const apiTime = now - 1000;

      // Set up cache with drift
      perfStub.returns(1000);
      worker.cachedApiTime = {
        time: apiTime,
        timestamp: now,
        performanceTimestamp: 1000,
      };
      worker.lastApiCallPerformance = 0; // Allow API call

      // Simulate extreme drift
      const driftedTime = now + 1000000; // Way in future
      sinon.stub(Date, 'now').returns(driftedTime);
      perfStub.returns(2000);

      // Mock successful API response
      const newApiTime = driftedTime;
      mockFetch.resolves({ text: () => Promise.resolve(Math.floor(newApiTime / 1000).toString()) });

      await worker.getAuthoritativeTime();

      // API should have been called due to cache invalidation
      expect(mockFetch.called).to.be.true;

      Date.now.restore();
    });
  });

  describe('Shared cache validation', () => {
    let perfStub;
    let sharedWorker;

    beforeEach(() => {
      perfStub = sinon.stub(performance, 'now');
      // Create a new worker for these tests
      sharedWorker = new TimingWorker();
    });

    afterEach(() => {
      perfStub.restore();
    });

    it('should accept valid time updates from other tabs', async () => {
      const now = Date.now();
      const apiTime = now - 1000;

      perfStub.returns(5000);

      // Initialize worker - setupBroadcastChannels requires plugins to be provided
      sharedWorker.handleMessage({
        data: {
          tabId: 'test-tab-id',
          plugins: {}, // Empty plugins to trigger setupBroadcastChannels
          schedule: { toggleTime: Date.now() },
        },
      });

      // Wait for async initialization
      await new Promise((resolve) => { setTimeout(resolve, 0); });

      const timeChannel = sharedWorker.channels.get('timeCache');
      expect(timeChannel).to.exist;

      // Simulate receiving a time update from another tab
      if (timeChannel && timeChannel.onmessage) {
        timeChannel.onmessage({
          data: {
            type: 'time-update',
            data: {
              time: apiTime,
              timestamp: now - 5000, // 5 seconds old
              performanceTimestamp: 1000,
            },
          },
        });
      }

      // Cache should be updated with adjusted time
      expect(sharedWorker.cachedApiTime).to.not.be.null;
      expect(sharedWorker.cachedApiTime.performanceTimestamp).to.equal(5000);
    });

    it('should reject expired time updates', async () => {
      const now = Date.now();
      const apiTime = now - 1000000;

      perfStub.returns(5000);

      sharedWorker.handleMessage({
        data: {
          tabId: 'test-tab-id',
          plugins: {},
          schedule: { toggleTime: Date.now() },
        },
      });

      await new Promise((resolve) => { setTimeout(resolve, 0); });

      const timeChannel = sharedWorker.channels.get('timeCache');

      // Simulate receiving an expired time update (15 minutes old, TTL is 10 min)
      if (timeChannel && timeChannel.onmessage) {
        timeChannel.onmessage({
          data: {
            type: 'time-update',
            data: {
              time: apiTime,
              timestamp: now - 900000, // 15 minutes old
              performanceTimestamp: 1000,
            },
          },
        });
      }

      // Cache should not be updated
      expect(sharedWorker.cachedApiTime).to.be.null;
    });

    it('should reject time updates with negative age', async () => {
      const now = Date.now();
      const apiTime = now + 1000;

      perfStub.returns(5000);

      sharedWorker.handleMessage({
        data: {
          tabId: 'test-tab-id',
          plugins: {},
          schedule: { toggleTime: Date.now() },
        },
      });

      await new Promise((resolve) => { setTimeout(resolve, 0); });

      const timeChannel = sharedWorker.channels.get('timeCache');

      // Simulate receiving a time update from the future
      if (timeChannel && timeChannel.onmessage) {
        timeChannel.onmessage({
          data: {
            type: 'time-update',
            data: {
              time: apiTime,
              timestamp: now + 60000, // 1 minute in future
              performanceTimestamp: 1000,
            },
          },
        });
      }

      // Cache should not be updated
      expect(sharedWorker.cachedApiTime).to.be.null;
    });

    it('should reject legacy format time updates without performanceTimestamp', async () => {
      const now = Date.now();
      const apiTime = now - 1000;

      perfStub.returns(5000);

      sharedWorker.handleMessage({
        data: {
          tabId: 'test-tab-id',
          plugins: {},
          schedule: { toggleTime: Date.now() },
        },
      });

      await new Promise((resolve) => { setTimeout(resolve, 0); });

      const timeChannel = sharedWorker.channels.get('timeCache');

      // Simulate receiving a legacy format time update
      if (timeChannel && timeChannel.onmessage) {
        timeChannel.onmessage({
          data: {
            type: 'time-update',
            data: {
              time: apiTime,
              timestamp: now - 5000,
              // No performanceTimestamp
            },
          },
        });
      }

      // Cache should not be updated for safety
      expect(sharedWorker.cachedApiTime).to.be.null;
    });
  });

  describe('Last schedule item handling', () => {
    it('should stop polling when last schedule item is reached', async () => {
      const clock = sinon.useFakeTimers();
      const perfStub = sinon.stub(performance, 'now');
      perfStub.returns(1000);

      // Set up schedule with last item having no next
      worker.nextScheduleItem = { toggleTime: Date.now() - 1000, pathToFragment: '/last-item', next: null };
      worker.currentScheduleItem = { pathToFragment: '/previous-item' };

      // Run timer
      await worker.runTimer();

      // nextScheduleItem should now be null (moved to next which is null)
      expect(worker.nextScheduleItem).to.be.null;

      // Timer should not be set (polling stopped)
      expect(worker.timerId).to.be.null;

      clock.restore();
      perfStub.restore();
    });

    it('should send the last schedule item before stopping', async () => {
      const clock = sinon.useFakeTimers();
      const perfStub = sinon.stub(performance, 'now');
      perfStub.returns(1000);

      // Set up schedule with last item
      worker.nextScheduleItem = { toggleTime: Date.now() - 1000, pathToFragment: '/final-content', next: null };
      worker.currentScheduleItem = { pathToFragment: '/previous' };
      worker.previouslySentItem = null;

      // Run timer
      await worker.runTimer();

      // Should have posted the final item
      expect(mockPostMessage.called).to.be.true;
      expect(mockPostMessage.firstCall.args[0].pathToFragment).to.equal('/final-content');

      clock.restore();
      perfStub.restore();
    });

    it('should not send duplicate messages when staying on last item', async () => {
      const clock = sinon.useFakeTimers();
      const perfStub = sinon.stub(performance, 'now');
      perfStub.returns(1000);

      const lastItem = { pathToFragment: '/final-content', next: null };

      // Set up as if we're already on the last item
      worker.nextScheduleItem = null;
      worker.currentScheduleItem = lastItem;
      worker.previouslySentItem = lastItem;

      // Run timer
      await worker.runTimer();

      // Should not post message again (same item)
      expect(mockPostMessage.called).to.be.false;

      // Polling should have stopped
      expect(worker.timerId).to.be.null;

      clock.restore();
      perfStub.restore();
    });

    it('should continue polling when not on last item', async () => {
      const clock = sinon.useFakeTimers();
      const perfStub = sinon.stub(performance, 'now');
      perfStub.returns(1000);

      // Set up schedule with items remaining
      const futureTime1 = Date.now() + 1000;
      const futureTime2 = Date.now() + 2000;
      worker.nextScheduleItem = {
        toggleTime: futureTime1,
        pathToFragment: '/next-item',
        next: { toggleTime: futureTime2, pathToFragment: '/after-next', next: null },
      };
      worker.currentScheduleItem = { pathToFragment: '/current' };

      // Run timer
      await worker.runTimer();

      // Timer should be set (polling continues)
      expect(worker.timerId).to.not.be.null;

      clock.restore();
      perfStub.restore();
    });
  });
});
