function constructRequestOptions(method, body = null) {
  const headers = new Headers();
  headers.append('Authorization', 'Bearer');
  headers.append('content-type', 'application/json');

  const options = {
    method,
    headers,
  };

  if (body) options.body = body;

  return options;
}

export async function createAttendee(eventId, attendeeData) {
  if (!eventId || !attendeeData) return false;

  const raw = JSON.stringify(attendeeData);
  const options = constructRequestOptions('POST', raw);

  const resp = await fetch(`http://localhost:8500/v1/events/${eventId}/attendees`, options).then((res) => res.json()).catch((error) => console.log(error));
  return resp;
}

export async function updateAttendee(eventId, attendeeData) {
  if (!eventId || !attendeeData) return false;

  const raw = JSON.stringify(attendeeData);
  const options = constructRequestOptions('PUT', raw);

  const resp = await fetch(`http://localhost:8500/v1/events/${eventId}/attendees/${attendeeId}`, options).then((res) => res.json()).catch((error) => console.log(error));
  return resp;
}

export async function deleteAttendee(eventId, attendeeId) {
  if (!eventId || !attendeeId) return false;

  const options = constructRequestOptions('DELETE');

  const resp = await fetch(`http://localhost:8500/v1/events/${eventId}/attendees/${attendeeId}`, options).then((res) => res.json()).catch((error) => console.log(error));
  return resp;
}

export async function getAttendees(eventId) {
  if (!eventId) return false;

  const options = constructRequestOptions('GET');

  const resp = await fetch(`http://localhost:8500/v1/events/${eventId}/attendees`, options).then((res) => res.json()).catch((error) => console.log(error));
  return resp;
}

export async function getAttendee(eventId, attendeeId) {
  if (!eventId || !attendeeId) return false;

  const options = constructRequestOptions('GET');

  const resp = await fetch(`http://localhost:8500/v1/events/${eventId}/attendees/${attendeeId}`, options).then((res) => res.json()).catch((error) => console.log(error));
  return resp;
}
