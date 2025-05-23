class TimingWorker {
  constructor() {
    this.conditionStore = null;
    this.currentScheduleItem = null;
    this.nextScheduleItem = null;
    this.timerId = null;
    this.setupMessageHandler();
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
   * @param {Object} scheduleRoot
   * @param {Object} cs: conditionStore
   * @returns {Object}
   * @description Returns the first schedule item that should be shown
   */
  static getStartScheduleItem(scheduleRoot, cs, testing = {}) {
    const currentTime = testing.toggleTime || new Date().getTime();
    let pointer = scheduleRoot;
    let start = null;

    // Scan phase 1: Fast forward through toggleTime-only
    while (pointer) {
      const { toggleTime: t } = pointer;
      const toggleTimePassed = typeof t !== 'number' || currentTime > t;

      if (!toggleTimePassed) break;

      start = pointer;
      pointer = pointer.next;
    }

    // Scan Phase 2: Scan from last toggleTime match forward with condition checks
    pointer = start || scheduleRoot;

    while (pointer) {
      const { toggleTime: t, conditions: c } = pointer;
      const toggleTimePassed = !t || currentTime > t;
      const conditionsMet = !c || c.every(({ key: k, expectedValue: v }) => {
        const val = cs?.[k];
        const isAny = v.trim().toLowerCase() === 'any' && !!val;
        return isAny || val === v;
      });

      if (toggleTimePassed && conditionsMet) return pointer;

      pointer = pointer.next;
    }

    return scheduleRoot;
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
   * @param {Object} scheduleItem
   * @returns {boolean}
   * @description Returns true if the next schedule item is triggered
   */
  isNextScheduleTriggered(scheduleItem) {
    if (!scheduleItem) return false;
    const { conditions: c, toggleTime: t } = scheduleItem;
    const currentTime = new Date().getTime();

    const toggleTimePassed = !t || currentTime > t;

    const conditionsMet = !c || c.every(({ key: k, expectedValue: v }) => {
      const conditionValue = this.conditionStore?.[k];
      const isAnyVal = v.trim().toLowerCase() === 'any' && !!conditionValue;
      return isAnyVal || conditionValue === v;
    });

    return toggleTimePassed && conditionsMet;
  }

  /**
   * @param {number} currentTime
   * @returns {boolean}
   * @description Returns true if the current time is valid
   */
  static async validateTime(currentTime) {
    const apiCurrentTime = await TimingWorker.getCurrentTimeFromAPI();
    const diff = apiCurrentTime - currentTime;

    if (diff > 10000) {
      window.alert('Sorry. Your local time is off by more than 10 seconds. Please check your system clock.');
      return false;
    }

    return true;
  }

  async runTimer() {
    const triggered = this.isNextScheduleTriggered(this.nextScheduleItem);

    const { pathToFragment: currentPath } = this.currentScheduleItem;
    const { pathToFragment: nextPath, prev: nextPrev } = this.nextScheduleItem;

    if (triggered && (nextPath !== currentPath || nextPrev === null)) {
      // const timeValid = await this.validateTime(currentTime);
      // if (!timeValid) return;

      postMessage(this.nextScheduleItem);

      this.currentScheduleItem = { ...this.nextScheduleItem };
      this.nextScheduleItem = this.nextScheduleItem.next;
    }

    if (!this.nextScheduleItem) return;

    this.timerId = setTimeout(() => this.runTimer(), TimingWorker.getRandomInterval());
  }

  handleMessage(event) {
    const { schedule, conditions, testing } = event.data;

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    if (conditions) {
      this.conditionStore = { ...this.conditionStore, ...conditions };
    }

    if (schedule) {
      this.nextScheduleItem = TimingWorker.getStartScheduleItem(
        schedule,
        this.conditionStore,
        testing,
      );
      this.currentScheduleItem = this.nextScheduleItem?.prev || schedule;
    }

    if (testing.scheduleItemId) {
      this.nextScheduleItem = schedule.find((item) => item.id === testing.scheduleItemId);
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
