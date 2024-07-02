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

function getESLConfig() {
  return {
    local: { host: 'http://localhost:8499' },
    stage: { host: 'https://wcms-events-service-layer-deploy-ethos102-stage-va-9c3ecd.stage.cloud.adobe.io' },
    prod: { host: 'https://wcms-events-service-layer-deploy-ethos102-stage-va-9c3ecd.stage.cloud.adobe.io' },
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
  const { host } = getESLConfig()[window.eccEnv];
  const options = await constructRequestOptions('GET');

  const resp = await fetch(`${host}/v1/events/${eventId}`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to get details for event ${eventId}. Error: ${error}`));
  return resp;
}

export async function createAttendee(eventId, attendeeData) {
  if (!eventId || !attendeeData) return false;

  const { host } = getESLConfig()[window.eccEnv];
  const raw = JSON.stringify(attendeeData);
  const options = await constructRequestOptions('POST', raw);

  const resp = await fetch(`${host}/v1/events/${eventId}/attendees`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to create attendee for event ${eventId}. Error: ${error}`));
  return resp;
}

export async function updateAttendee(eventId, attendeeId, attendeeData) {
  if (!eventId || !attendeeData) return false;

  const { host } = getESLConfig()[window.eccEnv];
  const raw = JSON.stringify(attendeeData);
  const options = await constructRequestOptions('PUT', raw);

  const resp = await fetch(`${host}/v1/events/${eventId}/attendees/${attendeeId}`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to update attendee ${attendeeId} for event ${eventId}. Error: ${error}`));
  return resp;
}

export async function deleteAttendee(eventId, attendeeId) {
  if (!eventId || !attendeeId) return false;

  const { host } = getESLConfig()[window.eccEnv];
  const options = await constructRequestOptions('DELETE');

  const resp = await fetch(`${host}/v1/events/${eventId}/attendees/${attendeeId}`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to delete attendee ${attendeeId} for event ${eventId}. Error: ${error}`));
  return resp;
}

export async function getAttendees(eventId) {
  if (!eventId) return false;

  const { host } = getESLConfig()[window.eccEnv];
  const options = await constructRequestOptions('GET');

  const resp = await fetch(`${host}/v1/events/${eventId}/attendees`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to fetch attendees for event ${eventId}. Error: ${error}`));
  return resp;
}

export async function getAttendee(eventId, attendeeId) {
  if (!eventId || !attendeeId) return false;

  const { host } = getESLConfig()[window.eccEnv];
  const options = await constructRequestOptions('GET');

  const resp = await fetch(`${host}/v1/events/${eventId}/attendees/${attendeeId}`, options)
    .then((res) => res.json())
    .catch((error) => window.lana?.log(`Failed to get details of attendee ${attendeeId} for event ${eventId}. Error: ${error}`));
  return resp;
}
