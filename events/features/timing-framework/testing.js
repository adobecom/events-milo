export function getToggleTimeFromParams() {
  const params = new URLSearchParams(document.location.search);
  const testTiming = params.get('timing');
  return testTiming;
}

export function getScheduleItemFromParams() {
  const params = new URLSearchParams(document.location.search);
  const scheduleItemId = params.get('scheduleItemId');
  return scheduleItemId;
}
