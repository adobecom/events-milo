let scheduleCache = null;
let conditionsCache = null;
let stopPreviousTimer = false;

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

function getStartScheduleItem() {
  let currentScheduleItem = scheduleCache;

  while (currentScheduleItem.next) {
    const { conditions, toggleTime } = currentScheduleItem;

    if (conditions) {
      // eslint-disable-next-line no-loop-func
      const triggered = conditions.every((condition) => {
        const { key, value } = condition;
        const currentValue = conditionsCache[key];
        return currentValue === value;
      });

      if (!triggered) {
        currentScheduleItem = currentScheduleItem.next;
        // eslint-disable-next-line no-continue
        continue;
      }
    }

    if (toggleTime) {
      const currentTime = new Date().getTime();

      if (currentTime > toggleTime) {
        return currentScheduleItem;
      }
    }

    currentScheduleItem = currentScheduleItem.next;
  }

  return null;
}

function getRandomInterval() {
  const min = 10000;
  const max = 15000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Object} scheduleItem
 * @param {Object} conditionsCache
 * @returns {boolean}
 */
function determineScheduleAction(scheduleItem, conditionStore) {
  console.log('Determining schedule action for item:', scheduleItem);
  console.log('Current condition store:', conditionStore);

  const { conditions, toggleTime } = scheduleItem;

  if (conditions) {
    console.log('Checking conditions:', conditions);
    const result = conditions.every((condition) => {
      const { bmKey, expectedValue } = condition;
      const currentValue = conditionStore[bmKey];
      console.log(`Condition check - key: ${bmKey}, expected: ${expectedValue}, current: ${currentValue}`);
      return currentValue === expectedValue;
    });
    console.log('All conditions met:', result);
    return result;
  }

  if (toggleTime) {
    const currentTime = new Date().getTime();
    console.log(`Checking toggleTime - current: ${currentTime}, toggle: ${toggleTime}`);
    const result = currentTime > toggleTime;
    console.log('Toggle time check result:', result);
    return result;
  }

  console.log('No conditions or toggle time found, returning false');
  return false;
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

  if (message === 'schedule') {
    scheduleCache = schedule;
  }

  if (message === 'conditions') {
    conditionsCache = conditions;
  }

  let nextScheduleItem = getStartScheduleItem();

  if (!nextScheduleItem) return;

  const runTimer = async () => {
    if (stopPreviousTimer) {
      stopPreviousTimer = false;
      return;
    }

    const currentTime = new Date().getTime();

    if (currentTime === null) {
      setTimeout(runTimer, getRandomInterval());
      return;
    }

    const triggered = determineScheduleAction(nextScheduleItem, conditionsCache);

    if (triggered) {
      const timeValid = await validateTime(currentTime);

      if (!timeValid) return;

      postMessage(nextScheduleItem);
      nextScheduleItem = nextScheduleItem.next;
    }

    if (!nextScheduleItem) return;

    setTimeout(runTimer, getRandomInterval());
  };

  runTimer();
};
