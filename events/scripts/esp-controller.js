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

export function getAPIConfig() {
  return {
    esl: {
      local: { host: 'http://localhost:8499' },
      dev: { host: 'https://wcms-events-service-layer-deploy-ethos102-stage-va-9c3ecd.stage.cloud.adobe.io' },
      stage: { host: 'https://events-service-layer-stage.adobe.io' },
      prod: { host: 'https://wcms-events-service-layer-deploy-ethos102-stage-va-9c3ecd.stage.cloud.adobe.io' },
    },
    esp: {
      local: { host: 'http://localhost:8500' },
      dev: { host: 'https://wcms-events-service-platform-deploy-ethos102-stage-caff5f.stage.cloud.adobe.io' },
      stage: { host: 'https://events-service-platform-stage.adobe.io' },
      prod: { host: 'https://wcms-events-service-platform-deploy-ethos102-stage-caff5f.stage.cloud.adobe.io' },
    },
  };
}

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
  headers.append('Authorization', `Bearer ${authToken}`);
  headers.append('content-type', 'application/json');

  const options = {
    method,
    headers,
  };

  if (body) options.body = body;

  return options;
}

export async function getEvent(eventId) {
  const { host } = getAPIConfig().esp[window.eccEnv];
  const options = await constructRequestOptions('GET');

  try {
    const response = await fetch(`${host}/v1/events/${eventId}`, options);
    const data = await response.json();

    if (!response.ok) {
      window.lana?.log(`Failed to get details for event ${eventId}. Status:`, response.status, 'Error:', data);
      return { ok: response.ok, status: response.status, error: data };
    }

    return data;
  } catch (error) {
    window.lana?.log(`Failed to get details for event ${eventId}. Error:`, error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function getAttendee(eventId) {
  if (!eventId) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const options = await constructRequestOptions('GET');

  try {
    const response = await fetch(`${host}/v1/attendees/me`, options);

    if (!response.ok) {
      window.lana?.log(`Failed to get details for event ${eventId}. Status:`, response.status);
      return { ok: response.ok, status: response.status, error: response.text() };
    }

    return response.json();
  } catch (error) {
    window.lana?.log(`Failed to get attendee for event ${eventId}. Error:`, error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function createAttendee(eventId, attendeeData) {
  if (!eventId || !attendeeData) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const raw = JSON.stringify(attendeeData);
  const options = await constructRequestOptions('POST', raw);

  try {
    const response = await fetch(`${host}/v1/attendees`, options);
    const data = await response.json();

    if (!response.ok) {
      window.lana?.log('Failed to create attendee. Status:', response.status, 'Error:', data);
      return { ok: response.ok, status: response.status, error: data };
    }

    return data;
  } catch (error) {
    window.lana?.log('Failed to create attendee. Error:', error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function addAttendeeToEvent(eventId, attendeeData) {
  if (!eventId || !attendeeData) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const raw = JSON.stringify(attendeeData);
  const options = await constructRequestOptions('POST', raw);

  try {
    const response = await fetch(`${host}/v1/events/${eventId}/attendees`, options);
    const data = await response.json();

    if (!response.ok) {
      window.lana?.log(`Failed to add attendee for event ${eventId}. Status:`, response.status, 'Error:', data);
      return { ok: response.ok, status: response.status, error: data };
    }

    return data;
  } catch (error) {
    window.lana?.log(`Failed to add attendee for event ${eventId}. Error:`, error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function updateAttendee(eventId, attendeeData) {
  if (!eventId) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const raw = JSON.stringify(attendeeData);
  const options = await constructRequestOptions('PUT', raw);

  try {
    const response = await fetch(`${host}/v1/attendees/me`, options);
    const data = await response.json();

    if (!response.ok) {
      window.lana?.log(`Failed to update attendee for event ${eventId}. Status:`, response.status, 'Error:', data);
      return { ok: response.ok, status: response.status, error: data };
    }

    return data;
  } catch (error) {
    window.lana?.log(`Failed to update attendee for event ${eventId}. Error:`, error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function deleteAttendee(eventId) {
  if (!eventId) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const options = await constructRequestOptions('DELETE');

  try {
    const response = await fetch(`${host}/v1/events/${eventId}/attendees/me`, options);
    const data = await response.json();

    if (!response.ok) {
      window.lana?.log(`Failed to delete attendee for event ${eventId}. Status:`, response.status, 'Error:', data);
      return { ok: response.ok, status: response.status, error: data };
    }

    return data;
  } catch (error) {
    window.lana?.log(`Failed to delete attendee for event ${eventId}. Error:`, error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}

export async function getAttendees(eventId) {
  if (!eventId) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const options = await constructRequestOptions('GET');

  try {
    const response = await fetch(`${host}/v1/events/${eventId}/attendees`, options);
    const data = await response.json();

    if (!response.ok) {
      window.lana?.log(`Failed to fetch attendees for event ${eventId}. Status:`, response.status, 'Error:', data);
      return { ok: response.ok, status: response.status, error: data };
    }

    return data;
  } catch (error) {
    window.lana?.log(`Failed to fetch attendees for event ${eventId}. Error:`, error);
    return { ok: false, status: 'Network Error', error: error.message };
  }
}
