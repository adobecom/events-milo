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

function getAPIConfig() {
  return {
    esl: {
      local: { host: 'http://localhost:8499' },
      dev: { host: 'https://wcms-events-service-layer-deploy-ethos102-stage-va-9c3ecd.stage.cloud.adobe.io' },
      stage: { host: 'https://events-service-layer-stage.adobe.io/' },
      prod: { host: 'https://wcms-events-service-layer-deploy-ethos102-stage-va-9c3ecd.stage.cloud.adobe.io' },
    },
    esp: {
      local: { host: 'http://localhost:8500' },
      dev: { host: 'https://wcms-events-service-platform-deploy-ethos102-stage-caff5f.stage.cloud.adobe.io' },
      stage: { host: 'https://events-service-platform-stage.adobe.io/' },
      prod: { host: 'https://wcms-events-service-platform-deploy-ethos102-stage-caff5f.stage.cloud.adobe.io' },
    },
  };
}

function waitForAdobeIMS() {
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

async function constructRequestOptions(method, body = null) {
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
  const { host } = getAPIConfig().esl[window.eccEnv];
  const options = await constructRequestOptions('GET');

  const resp = await fetch(`${host}/v1/events/${eventId}`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to get details for event ${eventId}. Error: ${error}`));
  return resp;
}

export async function getAttendee(eventId) {
  if (!eventId) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const options = await constructRequestOptions('GET');

  const resp = await fetch(`${host}/v1/events/${eventId}/attendees/me`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to get details of attendee me for event ${eventId}. Error: ${error}`));
  return resp;
}

export async function getAttendeeStatus(eventId) {
  if (!eventId) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const options = await constructRequestOptions('GET');

  const resp = await fetch(`${host}/v1/events/${eventId}/attendees/me/status`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to get details of attendee me for event ${eventId}. Error: ${error}`));
  return resp;
}

export async function getCompleteAttendeeData(eventId) {
  const [attendee, status] = await Promise.all([
    getAttendee(eventId),
    getAttendeeStatus(eventId),
  ]);

  return { attendee, status };
}

export async function createAttendee(eventId, attendeeData) {
  if (!eventId || !attendeeData) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const raw = JSON.stringify(attendeeData);
  const options = await constructRequestOptions('POST', raw);

  const resp = await fetch(`${host}/v1/events/${eventId}/attendees`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to create attendee for event ${eventId}. Error: ${error}`));

  if (!resp || resp.errors || resp.message) {
    return false;
  }

  // FIXME: create attendee doesn't respond with attendee data
  const rsvpData = await getCompleteAttendeeData(eventId);
  return rsvpData;
}

export async function updateAttendee(eventId, attendeeData) {
  if (!eventId) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const raw = JSON.stringify(attendeeData);
  const options = await constructRequestOptions('PUT', raw);

  const resp = await fetch(`${host}/v1/events/${eventId}/attendees/me`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to update attendee me for event ${eventId}. Error: ${error}`));

  if (!resp || resp.errors || resp.message) {
    return false;
  }
  // FIXME: update attendee doesn't update attendee data.
  // instead, it actually strips the previously submitted data and returns only the basic info
  const rsvpData = await getCompleteAttendeeData(eventId);
  return rsvpData;
}

export async function deleteAttendee(eventId) {
  if (!eventId) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const options = await constructRequestOptions('DELETE');

  const resp = await fetch(`${host}/v1/events/${eventId}/attendees/me`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to delete attendee me for event ${eventId}. Error: ${error}`));

  if (!resp || resp.errors || resp.message) {
    return false;
  }

  const rsvpData = await getCompleteAttendeeData(eventId);
  return rsvpData;
}

export async function getAttendees(eventId) {
  if (!eventId) return false;

  const { host } = getAPIConfig().esl[window.eccEnv];
  const options = await constructRequestOptions('GET');

  const resp = await fetch(`${host}/v1/events/${eventId}/attendees`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to fetch attendees for event ${eventId}. Error: ${error}`));
  return resp;
}
