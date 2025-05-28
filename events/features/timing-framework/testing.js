export default class TestingManager {
  constructor() {
    this.timeOffset = 0;
    this.isTestMode = false;
  }

  init(testingData) {
    if (testingData?.toggleTime) {
      this.isTestMode = true;
      const currentTime = new Date().getTime();
      this.timeOffset = testingData.toggleTime - currentTime;
    }
  }

  adjustTime(currentTime) {
    return currentTime + this.timeOffset;
  }

  isTesting() {
    return this.isTestMode;
  }
}
