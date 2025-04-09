let currentConditions = null;
let currentScheduleItem = null;
let nextScheduleItem = null;
let timerId = null;

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

function getRandomInterval() {
  const min = 1000;
  const max = 1500;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isNextScheduleTriggered(scheduleItem, conditionStore) {
  const { conditions, toggleTime } = scheduleItem;
  const currentTime = new Date().getTime();

  const toggleTimePassed = !toggleTime || currentTime > toggleTime;

  const conditionsMet = !conditions || conditions.every(({ bmKey, expectedValue }) => {
    return conditionStore?.[bmKey] === expectedValue;
  });

  return toggleTimePassed && conditionsMet;
}

async function validateTime(currentTime) {
  const apiCurrentTime = await getCurrentTimeFromAPI();
  const diff = apiCurrentTime - currentTime;

  if (diff > 10000) {
    window.alert('Sorry. Your local time is off by more than 10 seconds. Please check your system clock.');
    return false;
  }

  return true;
}

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

    if (triggered && (nextScheduleItem.pathToFragment !== currentScheduleItem.pathToFragment || nextScheduleItem.prev === null)) {
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