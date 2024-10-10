import { getECCEnv } from './utils.js';

export const API_CONFIG = {
  esl: {
    local: { host: 'http://localhost:8499' },
    dev: { host: 'https://wcms-events-service-layer-deploy-ethos102-stage-va-9c3ecd.stage.cloud.adobe.io' },
    stage: { host: 'https://events-service-layer-stage.adobe.io' },
    prod: { host: 'https://events-service-layer.adobe.io' },
  },
  esp: {
    local: { host: 'http://localhost:8500' },
    dev: { host: 'https://wcms-events-service-platform-deploy-ethos102-stage-caff5f.stage.cloud.adobe.io' },
    stage: { host: 'https://events-service-platform-stage.adobe.io' },
    prod: { host: 'https://events-service-platform.adobe.io' },
  },
  imsToken: {
    local: { host: 'https://ims-na1-stg1.adobelogin.com/ims/check/v6/token?client_id=events-milo&scope=openid%2CAdobeID&guest_allowe=true' },
    dev: { host: 'https://ims-na1-stg1.adobelogin.com/ims/check/v6/token?client_id=events-milo&scope=openid%2CAdobeID&guest_allowe=true' },
    stage: { host: 'https://ims-na1-stg1.adobelogin.com/ims/check/v6/token?client_id=events-milo&scope=openid%2CAdobeID&guest_allowe=true' },
    prod: { host: 'https://ims-na1.adobelogin.com/ims/check/v6/token?client_id=events-milo&scope=openid%2CAdobeID&guest_allowe=true' },
  },
};

async function fetchGuestToken() {
  try {
    const response = await fetch(
      API_CONFIG.imsToken[getECCEnv()].host,
      { method: 'POST' },
    );

    if (!response.ok) {
      window.lana?.log(`Error fetching guest token: ${response.statusText}`);
    }

    const data = await response.json();

    // TODO: remove console.log
    console.log('Guest Access Token:', data.token);

    return data.token;
  } catch (error) {
    window.lana?.log('Error fetching guest token:', error);
    return null;
  }
}

export const getCaasTags = (() => {
  let cache;
  let promise;

  return () => {
    if (cache) {
      return cache;
    }

    if (!promise) {
      promise = fetch('https://www.adobe.com/chimera-api/tags')
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }

          throw new Error('Failed to load tags');
        })
        .then((data) => {
          cache = data;
          return data;
        })
        .catch((err) => {
          window.lana?.log(`Failed to load products map JSON. Error: ${err}`);
          throw err;
        });
    }

    return promise;
  };
})();

export function waitForAdobeIMS() {
  return new Promise((resolve) => {
    const checkIMS = () => {
      if (window.adobeIMS && window.adobeIMS.getAccessToken) {
        resolve();
      } else {
        setTimeout(checkIMS, 100);
      }
    };
    checkIMS();
  });
}

export async function constructRequestOptions(method, body = null) {
  await waitForAdobeIMS();

  const headers = new Headers();
  const authToken = window.adobeIMS?.getAccessToken()?.token;

  if (authToken) {
    headers.append('Authorization', `Bearer ${authToken}`);
  } else {
    const guestToken = await fetchGuestToken();
    if (guestToken) headers.append('Authorization', `Bearer ${guestToken}`);
  }
  headers.append('x-api-key', 'acom_event_service');
  headers.append('content-type', 'application/json');

  const options = {
    method,
    headers,
  };

  if (body) options.body = body;

  return options;
}

export async function getEvent(eventId) {
  const { host } = API_CONFIG.esp[getECCEnv()];
  const options = await constructRequestOptions('GET');

  try {
    const response = await fetch(`${host}/v1/events/${eventId}`, options);
    const data = await response.json();

    if (!response.ok) {
      window.lana?.log(`Error: Failed to get details for event ${eventId}. Status:`, response.status, 'E:', data);
      return { ok: response.ok, status: response.status, error: data };
    }

    return { ok: true, data };
  } catch (error) {
    window.lana?.log(`Error: Failed to get details for event ${eventId}:`, error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function getEventAttendee(eventId) {
  const { host } = API_CONFIG.esp[getECCEnv()];
  const options = await constructRequestOptions('GET');

  try {
    const response = await fetch(`${host}/v1/events/${eventId}/attendees/me`, options);

    if (!response.ok) {
      window.lana?.log(`Error: Failed to get attendee for event ${eventId}:`, response.status);
      return {
        ok: response.ok,
        status: response.status,
        error: response.text() || response.status,
      };
    }

    return { ok: true, data: await response.json() };
  } catch (error) {
    window.lana?.log(`Error: Failed to get attendee for event ${eventId}. E:`, error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function getAttendee() {
  const { host } = API_CONFIG.esl[getECCEnv()];
  const options = await constructRequestOptions('GET');

  try {
    const response = await fetch(`${host}/v1/attendees/me`, options);

    if (!response.ok) {
      window.lana?.log('Error: Failed to get attendee details. Status:', response.status);
      return {
        ok: response.ok,
        status: response.status,
        error: response.text() || response.status,
      };
    }

    return { ok: true, data: await response.json() };
  } catch (error) {
    window.lana?.log('Error: Failed to get attendee. Error:', error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function createAttendee(attendeeData) {
  if (!attendeeData) return false;

  const { host } = API_CONFIG.esl[getECCEnv()];
  const raw = JSON.stringify(attendeeData);
  const options = await constructRequestOptions('POST', raw);

  try {
    const response = await fetch(`${host}/v1/attendees`, options);
    const data = await response.json();

    if (!response.ok) {
      window.lana?.log('Error: Failed to create attendee. Status:', response.status, 'E:', data);
      return { ok: response.ok, status: response.status, error: data };
    }

    return { ok: true, data };
  } catch (error) {
    window.lana?.log('Error: Failed to create attendee. Error:', error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function addAttendeeToEvent(eventId, attendee) {
  if (!eventId || !attendee) return false;

  const { firstName, lastName, email } = attendee;
  const { host } = API_CONFIG.esl[getECCEnv()];
  const raw = JSON.stringify({ firstName, lastName, email });
  const options = await constructRequestOptions('POST', raw);

  try {
    const response = await fetch(`${host}/v1/events/${eventId}/attendees/me`, options);
    const data = await response.json();

    if (!response.ok) {
      window.lana?.log(`Error: Failed to add attendee for event ${eventId}. Status:`, response.status, 'E:', data);
      return { ok: response.ok, status: response.status, error: data };
    }

    return { ok: true, data };
  } catch (error) {
    window.lana?.log(`Error: Failed to add attendee for event ${eventId}:`, error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function updateAttendee(attendeeData) {
  if (!attendeeData) return false;

  const { host } = API_CONFIG.esl[getECCEnv()];
  const raw = JSON.stringify(attendeeData);
  const options = await constructRequestOptions('PUT', raw);

  try {
    const response = await fetch(`${host}/v1/attendees/me`, options);
    const data = await response.json();

    if (!response.ok) {
      window.lana?.log('Error: Failed to update attendee. Status:', response.status, 'E:', data);
      return { ok: response.ok, status: response.status, error: data };
    }

    return { ok: true, data };
  } catch (error) {
    window.lana?.log('Error: Failed to update attendee:', error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function deleteAttendeeFromEvent(eventId) {
  if (!eventId) return false;

  const { host } = API_CONFIG.esl[getECCEnv()];
  const options = await constructRequestOptions('DELETE');

  try {
    const response = await fetch(`${host}/v1/events/${eventId}/attendees/me`, options);

    if (!response.ok) {
      window.lana?.log(`Error: Failed to delete attendee for event ${eventId}. Status:`, response.status);
      return {
        ok: response.ok,
        status: response.status,
        error: response.text() || response.status,
      };
    }

    return { ok: true, data: await response.json() };
  } catch (error) {
    window.lana?.log(`Error: Failed to delete attendee for event ${eventId}:`, error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

// compound helper functions
export async function getAndCreateAndAddAttendee(eventId, attendeeData) {
  const attendeeResp = await getAttendee(eventId);
  let attendee;

  if (!attendeeResp.ok && attendeeResp.status === 404) {
    attendee = await createAttendee(attendeeData);
  } else if (attendeeResp.data?.attendeeId) {
    attendee = await updateAttendee({ ...attendeeResp.data, ...attendeeData });
  }

  if (!attendee?.ok) return { ok: false, error: 'Failed to create or update attendee' };

  const newAttendeeData = attendee.data;

  return addAttendeeToEvent(eventId, newAttendeeData);
}
