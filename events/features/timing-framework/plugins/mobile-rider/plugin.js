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

export default async function init(schedule) {
  const controller = new MobileRiderController();
  const mobileRiderSchedules = schedule.filter((entry) => entry.mobileRider);

  // Wait for all async operations to complete before returning store
  await Promise.all(mobileRiderSchedules.map(async (s) => {
    // Handle mobileRider as an object with sessionId property
    if (s.mobileRider && typeof s.mobileRider === 'object' && s.mobileRider.sessionId) {
      const { sessionId } = s.mobileRider;
      const isActive = await controller.isMediaActive(sessionId);
      mobileRiderStore.set(sessionId, isActive);
    } else if (Array.isArray(s.mobileRider)) {
      // Backward compatibility for array format
      await Promise.all(s.mobileRider.map(async (condition) => {
        if (condition && condition.sessionId) {
          const { sessionId } = condition;
          const isActive = await controller.isMediaActive(sessionId);
          mobileRiderStore.set(sessionId, isActive);
        }
      }));
    }
  }));

  return mobileRiderStore;
}
