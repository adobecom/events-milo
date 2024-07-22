import BlockMediator from './deps/block-mediator.min.js';
import { getAttendee, getCompleteAttendeeData } from './esp-controller.js';
import { getMetadata } from './utils.js';

export async function getProfile() {
  const { feds, adobeProfile, fedsConfig, adobeIMS } = window;

  const getUserProfile = () => {
    if (fedsConfig?.universalNav) {
      return feds?.services?.universalnav?.interface?.adobeProfile?.getUserProfile()
          || adobeProfile?.getUserProfile();
    }

    return (
      feds?.services?.profile?.interface?.adobeProfile?.getUserProfile()
      || adobeProfile?.getUserProfile()
      || adobeIMS?.getProfile()
    );
  };

  const profile = await getUserProfile();

  return profile;
}

export function lazyCaptureProfile() {
  let attempCounter = 0;
  const profileRetryer = setInterval(async () => {
    if (!window.adobeIMS) {
      attempCounter += 1;
      return;
    }

    if (attempCounter >= 10) {
      clearInterval(profileRetryer);
    }

    try {
      const [profile, rsvpData] = await Promise.all([
        getProfile(),
        getCompleteAttendeeData(getMetadata('event-id')),
      ]);

      if (rsvpData) {
        BlockMediator.set('rsvpData', rsvpData);
      } else {
        BlockMediator.set('rsvpData', null);
      }

      BlockMediator.set('imsProfile', profile);

      clearInterval(profileRetryer);
    } catch {
      if (window.adobeIMS) {
        clearInterval(profileRetryer);
        BlockMediator.set('imsProfile', { noProfile: true });
      }

      attempCounter += 1;
    }
  }, 1000);
}
