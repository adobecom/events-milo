export default class TestingManager {
  constructor() {
    this.timeOffset = 0;
    this.isTestMode = false;
  }

  init(testingData) {
    if (testingData?.toggleTime) {
      const toggleTime = parseInt(testingData.toggleTime, 10);

      // Validate that toggleTime is a valid number
      if (!Number.isNaN(toggleTime) && Number.isFinite(toggleTime)) {
        this.isTestMode = true;
        const currentTime = new Date().getTime();
        this.timeOffset = toggleTime - currentTime;
      } else {
        window.lana?.log(`Invalid toggleTime provided for testing: ${testingData.toggleTime}`);
        this.isTestMode = false;
        this.timeOffset = 0;
      }
    } else {
      this.isTestMode = false;
      this.timeOffset = 0;
    }
  }

  adjustTime(currentTime) {
    return currentTime + this.timeOffset;
  }

  isTesting() {
    return this.isTestMode;
  }
}
