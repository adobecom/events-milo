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
        metadata: { key: 'testKey', expectedValue: 'expected' },
        pathToFragment: '/next',
      };

      worker.plugins.set('metadata', new Map([['testKey', 'expected']]));

      const result = await worker.shouldTriggerNextSchedule(nextItem);
      expect(result).to.be.true;
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
        metadata: { key1: 'value1' },
        mobileRider: { session1: true },
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
});
