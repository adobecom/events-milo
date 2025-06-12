import TestingManager from './testing.js';

class TimingWorker {
  constructor() {
    this.currentScheduleItem = null;
    this.nextScheduleItem = null;
    this.timerId = null;
    this.plugins = new Map();
    this.channels = new Map();
    this.testingManager = new TestingManager();
    this.setupMessageHandler();
  }

  setupBroadcastChannels(plugins) {
    // Close any existing channels
    this.channels.forEach((channel) => channel.close());
    this.channels.clear();

    // Only set up channels for enabled plugins
    if (plugins.has('metadata')) {
      const channel = new BroadcastChannel('metadata-store');
      channel.onmessage = (event) => {
        const { key, value } = event.data;
        const metadataStore = this.plugins.get('metadata');
        if (metadataStore) {
          metadataStore.set(key, value);
        }
      };
      this.channels.set('metadata', channel);
    }

    if (plugins.has('mobileRider')) {
      const channel = new BroadcastChannel('mobile-rider-store');
      channel.onmessage = (event) => {
        const { sessionId, isActive } = event.data;
        const mobileRiderStore = this.plugins.get('mobileRider');
        if (mobileRiderStore) {
          mobileRiderStore.set(sessionId, isActive);
        }
      };
      this.channels.set('mobileRider', channel);
    }
  }

  /**
   * @returns {number}
   * @description Returns the current time from the API
   */
  static async getCurrentTimeFromAPI() {
    try {
      const response = await fetch('https://worldtimeapi.org/api/ip');
      const data = await response.json();
      return new Date(data.datetime).getTime();
    } catch (error) {
      window.lana?.log(`Error fetching time from API: ${JSON.stringify(error)}`);
      return null;
    }
  }

  /**
   * @param {Object} scheduleRoot - The root of the schedule tree
   * @returns {Object}
   * @description Returns the first schedule item that should be shown based on toggleTime
   */
  static getStartScheduleItemByToggleTime(scheduleRoot) {
    const currentTime = new Date().getTime();
    let pointer = scheduleRoot;
    let start = null;

    while (pointer) {
      const { toggleTime: t } = pointer;
      const toggleTimePassed = typeof t !== 'number' || currentTime > t;

      if (!toggleTimePassed) break;

      start = pointer;
      pointer = pointer.next;
    }

    return start || scheduleRoot;
  }

  /**
   * @returns {number}
   * @description Returns a random interval between 1 and 1.5 seconds
   */
  static getRandomInterval() {
    const min = 500;
    const max = 1500;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * @returns {number}
   * @description Returns the current time adjusted by the time offset if in test mode
   */
  getCurrentTime() {
    const currentTime = new Date().getTime();
    return this.testingManager.isTesting()
      ? this.testingManager.adjustTime(currentTime)
      : currentTime;
  }

  /**
   * @param {Object} scheduleItem
   * @returns {boolean}
   * @description Returns true if the next schedule item should be triggered based on plugins
   */
  async shouldTriggerNextSchedule(scheduleItem) {
    if (!scheduleItem) return false;

    // Check if previous item has mobileRider that's still active (overrun)
    if (this.currentScheduleItem?.mobileRider) {
      const mobileRiderStore = this.plugins.get('mobileRider');
      if (mobileRiderStore) {
        const { sessionId } = this.currentScheduleItem.mobileRider;
        const isActive = mobileRiderStore.get(sessionId);
        if (isActive) return false; // Wait for session to end
      }
    }

    // Check if current item has mobileRider that's ended (underrun)
    if (scheduleItem.mobileRider) {
      const mobileRiderStore = this.plugins.get('mobileRider');
      if (mobileRiderStore) {
        const { sessionId } = scheduleItem.mobileRider;
        const isActive = mobileRiderStore.get(sessionId);
        if (!isActive) return true; // Move on if session ended
      }
    }

    // Check metadata conditions if present
    if (scheduleItem.metadata) {
      const metadataStore = this.plugins.get('metadata');
      if (metadataStore) {
        const { key, expectedValue } = scheduleItem.metadata;
        const value = metadataStore.get(key);
        if ((expectedValue && value !== expectedValue) || (!expectedValue && !value)) return false;
      }
    }

    // If no plugins are blocking, check toggleTime
    const { toggleTime } = scheduleItem;
    if (toggleTime) {
      return this.getCurrentTime() > toggleTime;
    }

    return true;
  }

  async runTimer() {
    const shouldTrigger = await this.shouldTriggerNextSchedule(this.nextScheduleItem);

    const { pathToFragment: currentPath } = this.currentScheduleItem;
    const { pathToFragment: nextPath, prev: nextPrev } = this.nextScheduleItem;

    if (shouldTrigger && (nextPath !== currentPath || nextPrev === null)) {
      postMessage(this.nextScheduleItem);

      this.currentScheduleItem = { ...this.nextScheduleItem };
      this.nextScheduleItem = this.nextScheduleItem.next;
    }

    if (!this.nextScheduleItem) return;

    // Stop polling in testing mode - we want to see exact state at the simulated timestamp
    if (this.testingManager.isTesting()) return;

    this.timerId = setTimeout(() => this.runTimer(), TimingWorker.getRandomInterval());
  }

  handleMessage(event) {
    const { schedule, plugins, testing } = event.data;

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    // Initialize testing manager with testing data
    this.testingManager.init(testing);

    if (plugins) {
      this.plugins = new Map(Object.entries(plugins));
      this.setupBroadcastChannels(this.plugins);
    }

    if (schedule) {
      this.nextScheduleItem = TimingWorker.getStartScheduleItemByToggleTime(schedule);
      this.currentScheduleItem = this.nextScheduleItem?.prev || schedule;
    }

    if (!this.nextScheduleItem) return;

    this.runTimer();
  }

  setupMessageHandler() {
    onmessage = (event) => this.handleMessage(event);
  }
}

// Initialize the worker
(() => new TimingWorker())();

export default TimingWorker;
