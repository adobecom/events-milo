import MobileRiderController from './mobile-rider-controller.js';
import { getCurrentTabId } from '../../../../scripts/utils.js';

const store = new Map();
const channel = new BroadcastChannel('mobile-rider-store');

export const mobileRiderStore = {
  get(sessionId) {
    return store.get(sessionId);
  },

  set(sessionId, isActive) {
    const tabId = getCurrentTabId();
    store.set(sessionId, isActive);
    channel.postMessage({ sessionId, isActive, tabId });
  },

  getAll() {
    return Object.fromEntries(store);
  },
};

export default function init(schedule) {
  const controller = new MobileRiderController();

  const mobileRiderSchedules = schedule.filter((entry) => entry.mobileRider);
  mobileRiderSchedules.forEach((s) => {
    // Handle mobileRider as an object with sessionId property
    if (s.mobileRider && typeof s.mobileRider === 'object' && s.mobileRider.sessionId) {
      const { sessionId } = s.mobileRider;
      const isActive = controller.isMediaActive(sessionId);
      mobileRiderStore.set(sessionId, isActive);
    } else if (Array.isArray(s.mobileRider)) {
      // Backward compatibility for array format
      s.mobileRider.forEach((condition) => {
        if (condition && condition.sessionId) {
          const { sessionId } = condition;
          const isActive = controller.isMediaActive(sessionId);
          mobileRiderStore.set(sessionId, isActive);
        }
      });
    }
  });

  return mobileRiderStore;
}
