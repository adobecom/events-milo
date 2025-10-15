import TestingManager from './testing.js';

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

    // Time management properties - optimized for scale
    this.cachedApiTime = null;
    this.lastApiCall = 0;
    this.lastApiCallPerformance = 0;
    this.apiCallInterval = 300000; // 5 minutes minimum between API calls
    this.cacheTtl = 600000; // 10 minutes cache TTL (longer for better scaling)
    this.fallbackToLocal = true;
    this.consecutiveFailures = 0;
    this.maxFailures = 3;
    this.backoffMultiplier = 2;
    this.maxBackoffInterval = 1800000; // 30 minutes max backoff
    this.maxAllowedDrift = 60000; // 1 minute max drift before cache invalidation

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
        TimingWorker.logError('Error closing BroadcastChannel', error);
      }
    });
    this.channels.clear();

    // Helper to create plugin channels with consistent pattern
    const createPluginChannel = (channelName, pluginName, messageHandler) => {
      try {
        const channel = new BroadcastChannel(channelName);
        channel.onmessage = (event) => {
          const { tabId } = event.data;
          // Only process messages from this tab
          if (tabId === this.tabId) {
            const store = this.plugins.get(pluginName);
            if (store) {
              messageHandler(event.data, store);
            }
          }
        };
        this.channels.set(pluginName, channel);
      } catch (error) {
        TimingWorker.logError(`Error setting up ${pluginName} BroadcastChannel`, error);
      }
    };

    // Set up plugin-specific channels
    if (plugins.has('metadata')) {
      createPluginChannel('metadata-store', 'metadata', (data, store) => {
        store.set(data.key, data.value);
      });
    }

    if (plugins.has('mobileRider')) {
      createPluginChannel('mobile-rider-store', 'mobileRider', (data, store) => {
        store.set(data.sessionId, data.isActive);
      });
    }

    // Set up shared time cache channel
    try {
      const timeChannel = new BroadcastChannel('time-cache-store');
      timeChannel.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === 'time-update' && data) {
          // Validate the shared time data before using it
          const now = Date.now();
          const age = now - data.timestamp;

          // Only accept recent time updates (within TTL)
          if (age < this.cacheTtl && age >= 0) {
            // Validate that performanceTimestamp exists (new format)
            if (data.performanceTimestamp !== undefined) {
              // Reconstruct the cache with our local performance timestamp
              // to ensure monotonic time calculations work correctly
              this.cachedApiTime = {
                time: data.time + age, // Adjust for age
                timestamp: now,
                performanceTimestamp: performance.now(),
              };
              this.consecutiveFailures = 0; // Reset failures when we get shared time
            } else {
              // Legacy format without performanceTimestamp - ignore for safety
              window.lana?.log('Received time update in legacy format, ignoring for safety');
            }
          }
        }
      };
      this.channels.set('timeCache', timeChannel);
    } catch (error) {
      TimingWorker.logError('Error setting up time cache BroadcastChannel', error);
    }
  }

  /**
   * Helper to calculate elapsed time from cached API time using monotonic clock
   * @returns {number}
   */
  getCachedTimeWithElapsed() {
    const elapsedMs = performance.now() - this.cachedApiTime.performanceTimestamp;
    return this.cachedApiTime.time + elapsedMs;
  }

  /**
   * Helper to convert toggleTime to number
   * @param {string|number} toggleTime
   * @returns {number}
   */
  static parseToggleTime(toggleTime) {
    return typeof toggleTime === 'string' ? parseInt(toggleTime, 10) : toggleTime;
  }

  /**
   * Helper to log errors properly
   * @param {string} message
   * @param {Error} error
   */
  static logError(message, error) {
    const errorDetails = error?.message || error?.stack || String(error);
    window.lana?.log(`${message}: ${errorDetails}`);
  }

  /**
   * @returns {number}
   * @description Returns the current time from the API with caching and rate limiting
   */
  static async getCurrentTimeFromAPI() {
    try {
      const response = await fetch('https://time.akamai.com/');
      const data = await response.text();
      return Number.parseInt(data, 10) * 1000;
    } catch (error) {
      TimingWorker.logError('Error fetching time from API', error);
      return null;
    }
  }

  /**
   * @returns {Promise<number>}
   * @description Returns the authoritative current time, using API with fallback to local
   */
  async getAuthoritativeTime() {
    const now = Date.now();
    const perfNow = performance.now();

    // If in testing mode, skip API calls and use local time
    if (this.testingManager.isTesting()) {
      return now;
    }

    // Detect clock drift if we have cached time
    if (this.cachedApiTime) {
      const wallClockElapsed = now - this.cachedApiTime.timestamp;
      const monotonicElapsed = perfNow - this.cachedApiTime.performanceTimestamp;
      const drift = Math.abs(wallClockElapsed - monotonicElapsed);

      // If drift exceeds threshold, invalidate cache to force fresh API call
      if (drift > this.maxAllowedDrift) {
        window.lana?.log(`Clock drift detected: ${drift}ms. Invalidating cache.`);
        this.cachedApiTime = null;
      }
    }

    // If we have a valid cached API time, use it with monotonic clock
    if (this.cachedApiTime && (now - this.cachedApiTime.timestamp) < this.cacheTtl) {
      return this.getCachedTimeWithElapsed();
    }

    // Calculate backoff interval based on consecutive failures
    const backoffInterval = Math.min(
      this.apiCallInterval * (this.backoffMultiplier ** this.consecutiveFailures),
      this.maxBackoffInterval,
    );

    // Add jitter to prevent thundering herd (random offset between 0-30% of interval)
    const jitter = Math.random() * 0.3 * backoffInterval;
    const effectiveInterval = backoffInterval + jitter;

    // Check if enough time has passed since last API call (with backoff) using monotonic clock
    const timeSinceLastCall = this.lastApiCallPerformance > 0
      ? perfNow - this.lastApiCallPerformance
      : Infinity; // Force API call if never called

    if (timeSinceLastCall < effectiveInterval) {
      // Use cached time if available, otherwise fall back to local
      return this.cachedApiTime ? this.getCachedTimeWithElapsed() : now;
    }

    // Try to get fresh time from API
    try {
      const apiTime = await TimingWorker.getCurrentTimeFromAPI();
      this.lastApiCall = now;
      this.lastApiCallPerformance = perfNow;

      if (apiTime !== null) {
        this.cachedApiTime = {
          time: apiTime,
          timestamp: now,
          performanceTimestamp: perfNow,
        };
        // Reset failure count on success
        this.consecutiveFailures = 0;

        // Broadcast the new time to other tabs to reduce API calls
        try {
          const timeChannel = this.channels.get('timeCache');
          if (timeChannel) {
            timeChannel.postMessage({
              type: 'time-update',
              data: this.cachedApiTime,
            });
          }
        } catch (error) {
          TimingWorker.logError('Error broadcasting time update', error);
        }

        return apiTime;
      }
      // Increment failure count if API returns null
      this.consecutiveFailures = Math.min(this.consecutiveFailures + 1, this.maxFailures);
    } catch (error) {
      TimingWorker.logError('Error getting authoritative time', error);
      // Increment failure count on error
      this.consecutiveFailures = Math.min(this.consecutiveFailures + 1, this.maxFailures);
    }

    // Fall back to cached time or local time depending on settings
    if (this.cachedApiTime && !this.fallbackToLocal) {
      return this.getCachedTimeWithElapsed();
    }
    return now;
  }

  /**
   * @param {Object} scheduleRoot - The root of the schedule tree
   * @returns {Object}
   * @description Returns the first schedule item that should be shown based on toggleTime
   */
  async getStartScheduleItemByToggleTime(scheduleRoot) {
    const currentTime = await this.getAuthoritativeTime();
    const adjustedTime = this.testingManager.isTesting()
      ? this.testingManager.adjustTime(currentTime)
      : currentTime;

    let pointer = scheduleRoot;
    let start = null;

    while (pointer) {
      const { toggleTime } = pointer;
      const numericToggleTime = TimingWorker.parseToggleTime(toggleTime);
      const toggleTimePassed = typeof numericToggleTime !== 'number' || adjustedTime > numericToggleTime;

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
  async getCurrentTime() {
    const currentTime = await this.getAuthoritativeTime();
    const adjustedTime = this.testingManager.isTesting()
      ? this.testingManager.adjustTime(currentTime)
      : currentTime;

    return adjustedTime;
  }

  /**
   * Check if toggleTime has passed for a schedule item
   * @param {Object} scheduleItem
   * @returns {Promise<boolean>}
   */
  async hasToggleTimePassed(scheduleItem) {
    const { toggleTime } = scheduleItem;
    if (!toggleTime) return true; // No toggleTime means no time restriction

    const currentTime = await this.getCurrentTime();
    const numericToggleTime = TimingWorker.parseToggleTime(toggleTime);
    return currentTime > numericToggleTime;
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

    if (scheduleItem.mobileRider) {
      // Check if toggleTime has passed before checking mobileRider status
      const timePassed = await this.hasToggleTimePassed(scheduleItem);
      if (!timePassed) return false;

      const mobileRiderStore = this.plugins.get('mobileRider');
      if (mobileRiderStore) {
        const { sessionId } = scheduleItem.mobileRider;
        const isActive = mobileRiderStore.get(sessionId);
        if (!isActive) {
          this.nextScheduleItem = scheduleItem.next;
          return true;
        }
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
    return this.hasToggleTimePassed(scheduleItem);
  }

  async runTimer() {
    const shouldTrigger = await this.shouldTriggerNextSchedule(this.nextScheduleItem);

    let itemToSend = null;

    if (shouldTrigger) {
      itemToSend = this.nextScheduleItem;
      this.currentScheduleItem = { ...this.nextScheduleItem };
      this.nextScheduleItem = this.nextScheduleItem.next;
    } else {
      // If no items are triggered, send the current schedule item
      // This handles cases where mobileRider is still active or other blocking conditions
      itemToSend = this.currentScheduleItem;

      // If we don't have a current item, fall back to the first item
      if (!itemToSend) {
        itemToSend = this.getFirstScheduleItem();
      }
    }

    // Send the item if it's different from what we previously sent
    const isSameItem = (itemToSend && this.previouslySentItem)
      && itemToSend.pathToFragment === this.previouslySentItem.pathToFragment;
    if (itemToSend && !isSameItem) {
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
      // Initialize schedule asynchronously since getStartScheduleItemByToggleTime is now async
      this.initializeSchedule(schedule);
    }
  }

  /**
   * @param {Object} schedule - The schedule to initialize
   * @description Initializes the schedule asynchronously
   */
  async initializeSchedule(schedule) {
    this.nextScheduleItem = await this.getStartScheduleItemByToggleTime(schedule);
    this.currentScheduleItem = this.nextScheduleItem?.prev || schedule;
    this.previouslySentItem = null;

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
