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

function getRandomInterval() {
  const min = 45000;
  const max = 60000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

onmessage = async (event) => {
  const targetTimestamp = event.data;

  async function checkTime() {
    const currentTime = await getCurrentTimeFromAPI();

    if (currentTime === null) {
      setTimeout(checkTime, getRandomInterval());
      return;
    }

    if (currentTime > targetTimestamp) {
      postMessage('next-event-state');
      return;
    }

    setTimeout(checkTime, getRandomInterval());
  }

  checkTime();
};
