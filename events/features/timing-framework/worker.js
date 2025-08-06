let conditionStore = null;
let currentScheduleItem = null;
let nextScheduleItem = null;
let timerId = null;

/**
 * @returns {number}
 * @description Returns the current time from the API
 */
async function getCurrentTimeFromAPI() {
  try {
    const response = await fetch('https://worldtimeapi.org/api/ip');
    const data = await response.json();
    return new Date(data.datetime).getTime();
  } catch (error) {
    console.error('Error fetching time from API:', error);
    return null;
  }
}

/**
 * @param {Object} scheduleRoot
 * @param {Object} cs: conditionStore
 * @returns {Object}
 * @description Returns the first schedule item that should be shown
 */
function getStartScheduleItem(scheduleRoot, cs) {
  const currentTime = new Date().getTime();
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
function getRandomInterval() {
  const min = 500;
  const max = 1500;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Object} scheduleItem
 * @returns {boolean}
 * @description Returns true if the next schedule item is triggered
 */
function isNextScheduleTriggered(scheduleItem) {
  if (!scheduleItem) return false;
  const { conditions: c, toggleTime: t } = scheduleItem;
  const currentTime = new Date().getTime();

  const toggleTimePassed = !t || currentTime > t;

  const conditionsMet = !c || c.every(({ key: k, expectedValue: v }) => {
    const conditionValue = conditionStore?.[k];
    const isEmpty = !conditionValue
      || (Array.isArray(conditionValue) && conditionValue.length === 0)
      || (typeof conditionValue === 'object' && Object.keys(conditionValue).length === 0);
    const isAnyVal = v.trim().toLowerCase() === 'any' && !isEmpty;
    return isAnyVal || conditionValue === v;
  });

  return toggleTimePassed && conditionsMet;
}

/**
 * @param {number} currentTime
 * @returns {boolean}
 * @description Returns true if the current time is valid
 */
// eslint-disable-next-line no-unused-vars
async function validateTime(currentTime) {
  const apiCurrentTime = await getCurrentTimeFromAPI();
  const diff = apiCurrentTime - currentTime;

  if (diff > 10000) {
    window.alert('Sorry. Your local time is off by more than 10 seconds. Please check your system clock.');
    return false;
  }

  return true;
}

/**
 * @param {Object} event
 * @description Handles messages from the main thread
 */
onmessage = async (event) => {
  const { schedule, conditions } = event.data;

  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }

  if (conditions) {
    conditionStore = { ...conditionStore, ...conditions };
  }

  if (schedule) {
    nextScheduleItem = getStartScheduleItem(schedule, conditionStore);
    currentScheduleItem = nextScheduleItem?.prev || schedule;
  }

  if (!nextScheduleItem) return;

  const runTimer = async () => {
    const triggered = isNextScheduleTriggered(nextScheduleItem);

    const { pathToFragment: currentPath } = currentScheduleItem;
    const { pathToFragment: nextPath, prev: nextPrev } = nextScheduleItem;

    if (triggered && (nextPath !== currentPath || nextPrev === null)) {
      // const timeValid = await validateTime(currentTime);
      // if (!timeValid) return;

      postMessage(nextScheduleItem);

      currentScheduleItem = { ...nextScheduleItem };
      nextScheduleItem = nextScheduleItem.next;
    }

    if (!nextScheduleItem) return;

    timerId = setTimeout(runTimer, getRandomInterval());
  };

  runTimer();
};
