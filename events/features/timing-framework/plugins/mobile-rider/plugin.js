import MobileRiderController from './mobile-rider-controller.js';

const store = new Map();
const channel = new BroadcastChannel('mobile-rider-store');

export const mobileRiderStore = {
  get(sessionId) {
    return store.get(sessionId);
  },

  set(sessionId, isActive, tabId) {
    store.set(sessionId, isActive);
    channel.postMessage({ sessionId, isActive, tabId });
  },

  getAll() {
    return Object.fromEntries(store);
  },
};

export default function init(schedule, tabId) {
  const controller = new MobileRiderController();

  const mobileRiderSchedules = schedule.filter((entry) => entry.mobileRider);
  mobileRiderSchedules.forEach((s) => {
    s.mobileRider.forEach((condition) => {
      const { sessionId } = condition;
      const isActive = controller.isMediaActive(sessionId);
      mobileRiderStore.set(sessionId, isActive, tabId);
    });
  });

  return mobileRiderStore;
}
