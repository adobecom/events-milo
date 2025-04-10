let currentConditions = null;
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
 * @returns {Object}
 * @description Returns the first schedule item that should be shown
 */
function getStartScheduleItem(scheduleRoot) {
  console.log('scheduleRoot', scheduleRoot);
  const currentTime = new Date().getTime();
  let pointer = scheduleRoot;
  let lastPassed = scheduleRoot;

  while (pointer && pointer.next) {
    const { toggleTime: currentToggleTime } = pointer;
    const { toggleTime: nextToggleTime } = pointer.next;

    if ((currentToggleTime && currentTime < currentToggleTime) || !currentToggleTime) {
      return lastPassed;
    }

    if (nextToggleTime && currentTime < nextToggleTime) {
      return pointer;
    }

    lastPassed = pointer;
    pointer = pointer.next;
  }

  return pointer;
}

/**
 * @returns {number}
 * @description Returns a random interval between 1 and 1.5 seconds
 */
function getRandomInterval() {
  const min = 1000;
  const max = 1500;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Object} scheduleItem
 * @param {Object} cs (conditionStore)
 * @returns {boolean}
 * @description Returns true if the next schedule item is triggered
 */
function isNextScheduleTriggered(scheduleItem, cs) {
  const { conditions: c, toggleTime: t } = scheduleItem;
  const currentTime = new Date().getTime();

  const toggleTimePassed = !t || currentTime > t;

  const conditionsMet = !c || c.every(({ bmKey: k, expectedValue: v }) => cs?.[k] === v);

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
  const { message, schedule, conditions } = event.data;

  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }

  if (message === 'schedule') {
    currentScheduleItem = schedule;
    nextScheduleItem = getStartScheduleItem(schedule);
    console.log('nextScheduleItem', nextScheduleItem);
  }

  if (message === 'conditions') {
    currentConditions = conditions;
  }

  if (!nextScheduleItem) return;

  const runTimer = async () => {
    const triggered = isNextScheduleTriggered(nextScheduleItem, currentConditions);

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
