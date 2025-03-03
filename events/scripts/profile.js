import BlockMediator from './deps/block-mediator.min.js';
import { getEventAttendee } from './esp-controller.js';
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
  let counter = 0;
  const profileRetryer = setInterval(async () => {
    if (!window.adobeIMS) {
      counter += 1;
      return;
    }

    if (counter >= 10) {
      clearInterval(profileRetryer);
    }

    try {
      const profile = await getProfile();
      BlockMediator.set('imsProfile', profile);

      if (!profile.noProfile && profile.account_type !== 'guest') {
        const resp = await getEventAttendee(getMetadata('event-id'));
        BlockMediator.set('rsvpData', resp.data);
      }

      clearInterval(profileRetryer);
    } catch {
      if (window.adobeIMS) {
        clearInterval(profileRetryer);
        BlockMediator.set('imsProfile', { noProfile: true });
      }

      counter += 1;
    }
  }, 1000);
}
