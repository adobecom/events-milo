let currentState;

onmessage = async (event) => {
  const timings = event.data;

  if (!timings) {
    postMessage('no-timing-data');
    return;
  }

  async function runTimingCheck() {
    const currentTime = new Date().getTime();

    const nextVariation = timings.filter((timingObj) => {
      const { toggleValue } = timingObj;
      return currentTime > toggleValue && currentState !== toggleValue;
    })[timings.length - 1];

    if (!nextVariation) {
      postMessage('no-next-variation');
      return;
    }

    if (nextVariation && nextVariation.toggleValue !== currentState) {
      postMessage(nextVariation);
      currentState = nextVariation.toggleValue;
    }

    setTimeout(runTimingCheck, 1000);
  }

  runTimingCheck();
};
