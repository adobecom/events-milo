/**
 * @typedef {Object} EventAttendeeDataFilter
 * @property {string} type - The type of the attribute.
 * @property {boolean} submittable - Whether the attribute can be submitted.
 */

export const EVENT_ATTENDEE_DATA_FILTER = {
  attendeeId: { type: 'string', submittable: true },
  externalAttendeeId: { type: 'string', submittable: true },
  firstName: { type: 'string', submittable: true },
  lastName: { type: 'string', submittable: true },
  email: { type: 'string', submittable: true },
  registrationStatus: { type: 'string', submittable: true },
  invitedBy: { type: 'string', submittable: true },
  shareInfoWithPartners: { type: 'boolean', submittable: true },
};

/**
 * @typedef {Object} BaseAttendeeDataFilter
 * @property {string} type - The type of the attribute.
 * @property {boolean} submittable - Whether the attribute can be submitted.
 */

export const BASE_ATTENDEE_DATA_FILTER = {
  attendeeId: { type: 'string', submittable: true },
  firstName: { type: 'string', submittable: true },
  lastName: { type: 'string', submittable: true },
  email: { type: 'string', submittable: true },
  companyName: { type: 'string', submittable: true },
  jobTitle: { type: 'string', submittable: true },
  jobRole: { type: 'string', submittable: true },
  mobilePhone: { type: 'string', submittable: true },
  businessPhone: { type: 'string', submittable: true },
  organizationName: { type: 'string', submittable: true },
  countryRegion: { type: 'string', submittable: true },
  zipPostalCode: { type: 'string', submittable: true },
  industry: { type: 'string', submittable: true },
  productsOfInterest: { type: 'array', submittable: true },
  primaryProductOfInterest: { type: 'string', submittable: true },
  companySize: { type: 'string', submittable: true },
  specialRequirements: { type: 'string', submittable: true },
  website: { type: 'string', submittable: true },
  employeesInOrganization: { type: 'string', submittable: true },
  department: { type: 'string', submittable: true },
  dxDepartment: { type: 'string', submittable: true },
  title: { type: 'string', submittable: true },
  age: { type: 'string', submittable: true },
  jobLevel: { type: 'string', submittable: true },
  contactMethods: { type: 'array', submittable: true },
  isGuest: { type: 'boolean', submittable: true },
  consentStringId: { type: 'string', submittable: true },
  modificationTime: { type: 'string', submittable: true },
};

export function isValidAttribute(attr) {
  return (attr !== undefined && attr !== null && attr !== '') || attr === false;
}

export function getEventAttendeePayload(attendeeData) {
  if (!attendeeData) return attendeeData;
  return Object.entries(attendeeData).reduce((acc, [key, value]) => {
    if (EVENT_ATTENDEE_DATA_FILTER[key]?.submittable && isValidAttribute(value)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function getBaseAttendeePayload(attendeeData) {
  if (!attendeeData) return attendeeData;
  return Object.entries(attendeeData).reduce((acc, [key, value]) => {
    if (BASE_ATTENDEE_DATA_FILTER[key]?.submittable && isValidAttribute(value)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
