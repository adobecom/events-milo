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

  getAdjustedTime(currentTime) {
    return this.isTestMode ? currentTime + this.timeOffset : currentTime;
  }

  isTesting() {
    return this.isTestMode;
  }
}
