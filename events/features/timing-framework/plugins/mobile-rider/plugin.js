import MobileRiderController from './mobile-rider-controller.js';

export const mobileRiderStore = new Map();

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
