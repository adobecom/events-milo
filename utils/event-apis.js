import BlockMediator from '../deps/block-mediator.min.js';

const CAAS_API_ENDPOINT = 'https://14257-chimera-dev.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection';
const API_QUERY_PARAM = 'featuredCards';

const pageDataCache = {};

export function flattenObject(obj, parentKey = '', result = {}) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (key === 'arbitrary' && Array.isArray(value)) {
      value.forEach((item) => {
        const itemKey = `${newKey}.${item.key}`;
        result[itemKey] = item.value;
      });
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && !Array.isArray(item) && key !== 'arbitrary') {
          flattenObject(item, `${newKey}[${index}]`, result);
        } else {
          result[`${newKey}[${index}]`] = item;
        }
      });
    } else {
      result[newKey] = value;
    }
  });

  return result;
}

export async function fetchAvatar() {
  const te = await window.adobeIMS.tokenService.getTokenAndProfile();
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${te.tokenFields.tokenValue}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  const avatar = await fetch('https://cc-collab-stage.adobe.io/profile', requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));

  return avatar?.user?.avatar;
}

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

  const [profile, avatar] = await Promise.all([
    getUserProfile(),
    fetchAvatar(),
  ]);

  if (profile) {
    profile.avatar = avatar;
    return profile;
  }

  return {};
}

export async function getAttendeeData(email, eventId) {
  const myHeaders = new Headers();
  myHeaders.append('x-api-key', 'CCHomeWeb1');

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(`https://cchome-stage.adobe.io/lod/v1/events/st-${eventId}/attendees/${email}`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.error(error));
}

function lazyCaptureProfile() {
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
      const profile = await getProfile();
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

export default async function fetchPageData(hash) {
  window.bm8tr = BlockMediator;
  if (pageDataCache[hash]) {
    return pageDataCache[hash];
  }

  try {
    const response = await fetch(`${CAAS_API_ENDPOINT}?${API_QUERY_PARAM}=${hash}`);
    if (!response.ok) {
      window.lana?.log('Error while attempting to fetch event data event service layer');
      return null;
    }

    const json = await response.json();

    if (!json) return null;

    const [pageData] = json.cards;
    pageDataCache[hash] = pageData;

    lazyCaptureProfile(pageData);

    return pageData;
  } catch (error) {
    window.lana?.log('Fetch error:', error);
    return null;
  }
}