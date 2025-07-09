import TestingManager from './testing.js';

/**
 * Gets the current tabId from sessionStorage
 * This function is used by plugins that are not part of the worker context
 * @returns {string} The current tabId
 * @throws {Error} If tabId is not found in sessionStorage
 */
export function getCurrentTabId() {
  const tabId = sessionStorage.getItem('chrono-box-tab-id');
  if (!tabId) {
    throw new Error('tabId not found in sessionStorage. Ensure chrono-box is initialized first.');
  }
  return tabId;
}

class TimingWorker {
  constructor() {
    this.tabId = null;
    this.plugins = new Map();
    this.channels = new Map();
    this.timerId = null;
    this.currentScheduleItem = null;
    this.nextScheduleItem = null;
    this.previouslySentItem = null;
    this.testingManager = new TestingManager();
    this.setupMessageHandler();
  }

  setupBroadcastChannels(plugins) {
    // Close any existing channels
    this.channels.forEach((channel) => {
      try {
        if (channel && typeof channel.close === 'function') {
          channel.close();
        }
      } catch (error) {
        window.lana?.log(`Error closing BroadcastChannel: ${JSON.stringify(error)}`);
      }
    });
    this.channels.clear();

    // Only set up channels for enabled plugins
    if (plugins.has('metadata')) {
      try {
        const channel = new BroadcastChannel('metadata-store');
        channel.onmessage = (event) => {
          const { tabId, key, value } = event.data;
          // Only process messages from this tab
          if (tabId === this.tabId) {
            const metadataStore = this.plugins.get('metadata');
            if (metadataStore) {
              metadataStore.set(key, value);
            }
          }
        };
        this.channels.set('metadata', channel);
      } catch (error) {
        window.lana?.log(`Error setting up metadata BroadcastChannel: ${JSON.stringify(error)}`);
      }
    }

    if (plugins.has('mobileRider')) {
      try {
        const channel = new BroadcastChannel('mobile-rider-store');
        channel.onmessage = (event) => {
          const { tabId, sessionId, isActive } = event.data;
          // Only process messages from this tab
          if (tabId === this.tabId) {
            const mobileRiderStore = this.plugins.get('mobileRider');
            if (mobileRiderStore) {
              mobileRiderStore.set(sessionId, isActive);
            }
          }
        };
        this.channels.set('mobileRider', channel);
      } catch (error) {
        window.lana?.log(`Error setting up mobileRider BroadcastChannel: ${JSON.stringify(error)}`);
      }
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
    if (scheduleItem.metadata && Array.isArray(scheduleItem.metadata)) {
      const metadataStore = this.plugins.get('metadata');
      if (metadataStore) {
        // Require all metadata conditions to be met
        const allConditionMet = scheduleItem.metadata.every(({ key, expectedValue }) => {
          const value = metadataStore.get(key);
          const isEmpty = !value
            || (Array.isArray(value) && value.length === 0)
            || (typeof value === 'object' && Object.keys(value).length === 0);
          const isAnyVal = !expectedValue && !isEmpty;
          const matchesExpectedValue = expectedValue && value === expectedValue;
          return isAnyVal || matchesExpectedValue;
        });
        return allConditionMet;
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

    let itemToSend = null;

    if (shouldTrigger) {
      itemToSend = this.nextScheduleItem;
      this.currentScheduleItem = { ...this.nextScheduleItem };
      this.nextScheduleItem = this.nextScheduleItem.next;
    } else {
      // If no items are triggered and we've reached the end, send the first item as fallback
      itemToSend = this.getFirstScheduleItem();
    }

    // Send the item if it's different from what we previously sent
    if (itemToSend && itemToSend !== this.previouslySentItem) {
      postMessage(itemToSend);
      this.previouslySentItem = itemToSend;
    }

    if (!this.nextScheduleItem) return;

    // Stop polling in testing mode - we want to see exact state at the simulated timestamp
    if (this.testingManager.isTesting()) return;

    this.timerId = setTimeout(() => this.runTimer(), TimingWorker.getRandomInterval());
  }

  getFirstScheduleItem() {
    // Find the first item in the schedule by traversing backwards from current
    let item = this.currentScheduleItem;
    while (item?.prev) {
      item = item.prev;
    }
    return item;
  }

  handleMessage(event) {
    const { schedule, plugins, testing, tabId } = event.data;

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    // Initialize testing manager with testing data
    this.testingManager.init(testing);

    // Set the tabId from the message (required for plugin communication)
    if (!tabId) {
      throw new Error('tabId is required for worker initialization');
    }
    this.tabId = tabId;

    if (plugins) {
      // Recreate store interfaces from the data
      const pluginStores = new Map();
      Object.entries(plugins).forEach(([name, pluginInfo]) => {
        const store = new Map(Object.entries(pluginInfo.data));
        pluginStores.set(name, {
          get: (key) => store.get(key),
          set: (key, value) => store.set(key, value),
          getAll: () => Object.fromEntries(store),
        });
      });
      this.plugins = pluginStores;
      this.setupBroadcastChannels(this.plugins);
    }

    if (schedule) {
      this.nextScheduleItem = TimingWorker.getStartScheduleItemByToggleTime(schedule);
      this.currentScheduleItem = this.nextScheduleItem?.prev || schedule;
      this.previouslySentItem = null;
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
