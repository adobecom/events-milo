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
    it('should return the first item if no toggleTime has passed', () => {
      const schedule = {
        toggleTime: Date.now() + 1000,
        next: null,
      };

      const result = TimingWorker.getStartScheduleItemByToggleTime(schedule);
      expect(result).to.equal(schedule);
    });

    it('should return the last passed item if toggleTime has passed', () => {
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

      const result = TimingWorker.getStartScheduleItemByToggleTime(schedule);
      expect(result).to.equal(schedule.next);
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
    it('should set up plugins and channels', () => {
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

      worker.handleMessage({
        data: {
          plugins,
          schedule: { toggleTime: Date.now() },
        },
      });

      expect(worker.plugins.size).to.equal(2);
      expect(worker.channels.size).to.equal(2);
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
      const metadataStore = new Map();
      metadataWorker.plugins.set('metadata', metadataStore);

      // Set up the channel
      metadataWorker.setupBroadcastChannels(new Set(['metadata']));
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
      const mobileRiderStore = new Map();
      riderWorker.plugins.set('mobileRider', mobileRiderStore);

      // Set up the channel
      riderWorker.setupBroadcastChannels(new Set(['mobileRider']));
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
});
