import MobileRiderController from './mobile-rider-controller.js';

const store = new Map();
const channel = new BroadcastChannel('mobile-rider-store');

export const mobileRiderStore = {
  get(sessionId) {
    return store.get(sessionId);
  },

  set(sessionId, isActive) {
    const previousState = store.get(sessionId);
    store.set(sessionId, isActive);
    channel.postMessage({ sessionId, isActive });
    
    // Emit custom events for stream status changes
    if (previousState !== isActive) {
      const eventName = isActive ? 'streamStarted' : 'streamEnded';
      const event = new CustomEvent(eventName, {
        detail: { sessionId, isActive, previousState }
      });
      document.dispatchEvent(event);
      
      // Also emit a generic stream status change event
      const statusEvent = new CustomEvent('streamStatusChanged', {
        detail: { sessionId, isActive, previousState }
      });
      document.dispatchEvent(statusEvent);
    }
  },

  getAll() {
    return Object.fromEntries(store);
  },
};

// Global function for Mobile Rider blocks to update store
window.updateMobileRiderSession = (sessionId, isActive) => {
  mobileRiderStore.set(sessionId, isActive);
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

  // Listen for dynamic updates from Mobile Rider blocks
  channel.onmessage = (event) => {
    const { sessionId, isActive } = event.data;
    store.set(sessionId, isActive);
  };

  return mobileRiderStore;
}