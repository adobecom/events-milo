let scheduleCache = null;
let conditionsCache = null;
let stopPreviousTimer = false;

async function getCurrentTimeFromAPI() {
  try {
    console.log('Fetching current time from API...');
    const response = await fetch('https://worldtimeapi.org/api/ip');
    const data = await response.json();
    const time = new Date(data.datetime).getTime();
    console.log('API time fetched:', new Date(time).toISOString());
    return time;
  } catch (error) {
    console.error('Error fetching time from API:', error);
    return null;
  }
}

function getStartScheduleItem() {
  console.log('Getting start schedule item...');
  let currentScheduleItem = scheduleCache;
  const currentTime = new Date().getTime();
  console.log('Current time:', new Date(currentTime).toISOString());

  while (currentScheduleItem.next) {
    const { toggleTime: nextToggleTime } = currentScheduleItem.next;
    console.log('Checking next toggle time:', nextToggleTime ? new Date(nextToggleTime).toISOString() : 'none');

    if (nextToggleTime && currentTime > nextToggleTime) {
      console.log('Found start schedule item:', currentScheduleItem);
      return currentScheduleItem;
    }

    currentScheduleItem = currentScheduleItem.next;
  }

  console.log('No valid start schedule item found, using last item:', currentScheduleItem);
  return currentScheduleItem;
}

function getRandomInterval() {
  const min = 10000;
  const max = 15000;
  const interval = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log('Generated random interval:', interval, 'ms');
  return interval;
}

/**
 * @param {Object} scheduleItem
 * @param {Object} conditionsCache
 * @returns {boolean}
 */
function isScheduleTriggered(scheduleItem, conditionStore) {
  console.log('Checking if schedule is triggered for item:', scheduleItem);
  const { conditions, toggleTime } = scheduleItem;
  const currentTime = new Date().getTime();
  console.log('Current time:', new Date(currentTime).toISOString());
  console.log('Toggle time:', toggleTime ? new Date(toggleTime).toISOString() : 'none');

  let toggleTimePassed = true;
  let conditionsMet = true;

  if (toggleTime) {
    toggleTimePassed = currentTime > toggleTime;
    console.log('Toggle time passed:', toggleTimePassed);
  }

  if (conditions) {
    console.log('Checking conditions:', conditions);
    conditionsMet = conditions.every((condition) => {
      const { bmKey, expectedValue } = condition;
      const currentValue = conditionStore?.[bmKey];
      console.log(`Condition check - Key: ${bmKey}, Expected: ${expectedValue}, Current: ${currentValue}`);
      return currentValue === expectedValue;
    });
    console.log('All conditions met:', conditionsMet);
  }

  const triggered = toggleTimePassed && conditionsMet;
  console.log('Schedule triggered:', triggered);
  return triggered;
}

async function validateTime(currentTime) {
  console.log('Validating local time...');
  const apiCurrentTime = await getCurrentTimeFromAPI();
  const diff = apiCurrentTime - currentTime;
  console.log('Time difference:', diff, 'ms');

  if (diff > 10000) {
    console.error('Time validation failed: Local time is off by more than 10 seconds');
    window.alert('Sorry. Your local time is off by more than 10 seconds. Please check your system clock.');
    return false;
  }

  console.log('Time validation passed');
  return true;
}

onmessage = async (event) => {
  console.log('Worker received message:', event.data);
  const { message, schedule, conditions } = event.data;

  if (message === 'schedule') {
    console.log('Updating schedule cache');
    scheduleCache = schedule;
  }

  if (message === 'conditions') {
    console.log('Updating conditions cache');
    conditionsCache = conditions;
  }

  let nextScheduleItem = getStartScheduleItem();

  if (!nextScheduleItem) {
    console.log('No schedule items available');
    return;
  }

  const runTimer = async () => {
    if (stopPreviousTimer) {
      console.log('Stopping previous timer');
      stopPreviousTimer = false;
      return;
    }

    const currentTime = new Date().getTime();
    console.log('Timer tick at:', new Date(currentTime).toISOString());

    if (currentTime === null) {
      console.log('Current time is null, retrying...');
      setTimeout(runTimer, getRandomInterval());
      return;
    }

    const triggered = isScheduleTriggered(nextScheduleItem, conditionsCache);

    if (triggered) {
      console.log('Schedule triggered, validating time...');
      const timeValid = await validateTime(currentTime);

      if (!timeValid) {
        console.log('Time validation failed, skipping trigger');
        return;
      }

      console.log('Posting message for triggered schedule item:', nextScheduleItem);
      postMessage(nextScheduleItem);
      nextScheduleItem = nextScheduleItem.next;
    }

    if (!nextScheduleItem) {
      console.log('No more schedule items');
      return;
    }

    const nextInterval = getRandomInterval();
    console.log('Setting next timer interval:', nextInterval, 'ms');
    setTimeout(runTimer, nextInterval);
  };

  console.log('Starting timer loop');
  runTimer();
};
