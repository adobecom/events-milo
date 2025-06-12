import MobileRiderController from './mobile-rider-controller.js';

const store = new Map();
const channel = new BroadcastChannel('mobile-rider-store');

export const mobileRiderStore = {
  get(sessionId) {
    return store.get(sessionId);
  },

  set(sessionId, isActive) {
    store.set(sessionId, isActive);
    channel.postMessage({ sessionId, isActive });
  },

  getAll() {
    return Object.fromEntries(store);
  },
};

export default function init(schedule) {
  const controller = new MobileRiderController();

  const mobileRiderSchedules = schedule.filter((entry) => entry.mobileRider);
  mobileRiderSchedules.forEach((s) => {
    s.mobileRider.forEach((condition) => {
      const { sessionId } = condition;
      const isActive = controller.isMediaActive(sessionId);
      mobileRiderStore.set(sessionId, isActive);
    });
  });

  return mobileRiderStore;
}