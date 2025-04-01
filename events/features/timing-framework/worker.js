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

function getStartScheduleItem(scheduleLinkedList) {
  const currentTime = new Date().getTime();

  let currentScheduleItem = scheduleLinkedList;

  while (currentScheduleItem.next) {
    if (currentScheduleItem.toggleTime > currentTime) {
      return currentScheduleItem;
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

onmessage = async (event) => {
  const scheduleLinkedList = event.data;

  let nextScheduleItem = getStartScheduleItem(scheduleLinkedList);

  if (!nextScheduleItem) return;

  async function checkTime() {
    const currentTime = new Date().getTime();

    if (currentTime === null) {
      setTimeout(checkTime, getRandomInterval());
      return;
    }

    if (currentTime > nextScheduleItem.toggleTime) {
      const apiCurrentTime = await getCurrentTimeFromAPI();
      const diff = apiCurrentTime - currentTime;

      if (diff > 10000) {
        window.alert('Sorry. Your local time is off by more than 10 seconds. Please check your system clock.');
        return;
      }

      postMessage(nextScheduleItem);
      nextScheduleItem = nextScheduleItem.next;
    }

    if (!nextScheduleItem) return;

    setTimeout(checkTime, getRandomInterval());
  }

  checkTime();
};
