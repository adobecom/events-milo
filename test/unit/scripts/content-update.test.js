import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setMetadata, LIBS } from '../../../events/scripts/utils.js';
import BlockMediator from '../../../events/scripts/deps/block-mediator.min.js';

const { default: autoUpdateContent } = await import('../../../events/scripts/content-update.js');
const { getConfig } = await import(`${LIBS}/utils/utils.js`);
const body = await readFile({ path: './mocks/full-event.html' });
const defaultDoc = await readFile({ path: './mocks/event-default-doc.html' });

function prepareDOM() {
  setMetadata('event-id', 'dee89ecc-0f3a-4a8d-a0d1-3037df512181');
  setMetadata('cloud-type', 'CreativeCloud');
  setMetadata('template-id', '/events/fragments/event-templates/dme/simple');
  setMetadata('series', '{"seriesId":"3fd45107-16ee-49cd-aa1f-8dfd87368d38","seriesName":"Create Now","creationTime":1719258418200,"modificationTime":1719258418200}');
  setMetadata('event-type', 'InPerson');
  setMetadata('title', 'Create Now Chicago 2024 Test');
  setMetadata('event-title', '');
  setMetadata('description', "Dive into an evening of creativity with Adobe!\n\nJoin the design community at Adobe Create Now to connect with fellow local creators, explore new ways to collaborate, and enhance your creative process. Discover Adobe's latest features, and get pro tips for Photoshop, Illustrator, Adobe Firefly, Adobe Express, and more. Enjoy appetizers, drinks, and a chance to win a Creative Cloud membership program");
  setMetadata('start-date', '2024-07-27T13:00:00.000Z');
  setMetadata('end-date', '2024-07-31T22:00:00.000Z');
  setMetadata('timezone', 'America/Chicago');
  setMetadata('agenda', '[{"description":"Doors open / networking and demo stations","startTime":"17:30:00"},{"description":"Presentation begins","startTime":"18:15:00"},{"description":"Presentation ends / Enjoy additional networking time after the presentation before the event ends at 8 PM","startTime":"19:00:00"},{"description":"Event wrap","startTime":"20:00:00"}]');
  setMetadata('speakers', JSON.stringify([
    {
      speakerId: '0af2df7c-4747-416f-b362-35b26d41aa73',
      ordinal: 0,
      speakerType: 'Host',
      firstName: 'Hallease',
      lastName: 'Narvaez',
      socialLinks: [
        {
          link: 'https://www.instagram.com/adobe/?hl=en',
          serviceName: 'Instagram',
        },
      ],
      isPlaceholder: false,
      bio: "Hallease Narvaez, known simply as Hallease, is a filmmaker, digital storyteller, and creative entrepreneur based in Atlanta. She's produced original online content for PBS Digital Studios, Target, Google, and YouTube through her creative production company StumbleWell. She is a former YouTube Black Voices recipient and a former Adobe Creative Resident. When she's not telling stories online and sparking creative conversations with fellow artists through her podcast \\\"Tryna Be Somebody\\\", she teaches everything she knows about storytelling via Skillshare.",
      photo: {
        s3Key: 'static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/speakers/0af2df7c-4747-416f-b362-35b26d41aa73/speaker-photo.jpg',
        imageId: '8722af76-4cc1-41ea-a755-7e8e79d24d52',
        altText: 'Hallease Narvaez photo',
        sharepointUrl: '/events/assets/static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/speakers/0af2df7c-4747-416f-b362-35b26d41aa73/media_19f4d2338af384cd0228bc205e5dd541332c860f3.jpeg',
        imageUrl: 'https://events-data-dev.aws125.adobeitc.com/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/speakers/0af2df7c-4747-416f-b362-35b26d41aa73/speaker-photo.jpg',
        mimeType: 'image/jpeg',
        imageKind: 'speaker-photo',
        s3Bucket: 'adobe-events-data-dev',
        creationTime: 1722026001727,
        modificationTime: 1722028621282,
        pk: 'speaker#0af2df7c-4747-416f-b362-35b26d41aa73',
        sk: 'image#8722af76-4cc1-41ea-a755-7e8e79d24d52',
      },
      socialMedia: [
        {
          link: 'https://www.instagram.com/adobe',
          serviceName: 'instagram',
        },
        {
          link: 'https://www.facebook.com/Adobe/',
          serviceName: 'facebook',
        },
        {
          link: 'https://www.youtube.com/user/AdobeSystems/Adobe',
          serviceName: 'youtube',
        },
      ],
      type: 'Host',
      title: 'EXECUTIVE PRODUCER & CREATIVE DIRECTOR',
      seriesId: '3fd45107-16ee-49cd-aa1f-8dfd87368d38',
      creationTime: 1720720268322,
      modificationTime: 1722029021518,
    },
    {
      speakerId: '89c4b2ae-0b3c-4b4b-b19c-91f6436c60dc',
      ordinal: 1,
      speakerType: 'Speaker',
      firstName: 'Toren',
      lastName: 'Reaves',
      socialLinks: [
        {
          link: 'https://www.instagram.com/adobe/?hl=en',
          serviceName: 'Instagram',
        },
      ],
      bio: 'Toren is a flourishing creative who founded the 1st Black-Owned & Operated ad agency, KESA, in his hometown of Rochester, NY. His mission is to develop creative talent in underserved communities, and he works with the Adobe Community team, with a focus on Adobe Express, to empower as many people as possible to create.',
      photo: {
        s3Key: 'static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/speakers/89c4b2ae-0b3c-4b4b-b19c-91f6436c60dc/speaker-photo.jpg',
        imageId: 'c4c99ea0-7a99-4842-8c1e-1e91f6ec7e8a',
        altText: 'Toren Reaves photo',
        sharepointUrl: '/events/assets/static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/speakers/89c4b2ae-0b3c-4b4b-b19c-91f6436c60dc/media_14969c9cc8ff368d51e420195d2b89d2a34b2eade.jpeg',
        imageUrl: 'https://events-data-dev.aws125.adobeitc.com/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/speakers/89c4b2ae-0b3c-4b4b-b19c-91f6436c60dc/speaker-photo.jpg',
        mimeType: 'image/jpeg',
        imageKind: 'speaker-photo',
        s3Bucket: 'adobe-events-data-dev',
        creationTime: 1722025941677,
        modificationTime: 1722028648977,
        pk: 'speaker#89c4b2ae-0b3c-4b4b-b19c-91f6436c60dc',
        sk: 'image#c4c99ea0-7a99-4842-8c1e-1e91f6ec7e8a',
      },
      socialMedia: [
        {
          link: 'https://www.instagram.com/adobe',
          serviceName: 'instagram',
        },
        {
          link: 'https://www.facebook.com/Adobe/',
          serviceName: 'facebook',
        },
        {
          link: 'https://www.youtube.com/user/AdobeSystems/Adobe',
          serviceName: 'youtube',
        },
      ],
      type: 'Speaker',
      title: 'COMMUNITY RELATIONSHIP MANAGER AND EVANGELIST - ADOBE EXPRESS',
      seriesId: '3fd45107-16ee-49cd-aa1f-8dfd87368d38',
      creationTime: 1720719981932,
      modificationTime: 1722029016927,
    },
    {
      speakerId: '1a9f02c6-2ff8-480a-9441-0962a9c50f4d',
      ordinal: 2,
      speakerType: 'Speaker',
      firstName: 'Varick',
      lastName: 'Rosete',
      socialLinks: [],
      isPlaceholder: false,
      bio: "Varick Rosete is a designer / illustrator living in Atlantic Beach, Florida where he's been designing everything for local Mom & Pop shops to worldwide clients like GE, Capital One and AT&T. He's helped them all with a strong sense of branding – heightening the experiences of their consumers. He has played in the traditional print background playground while also living and learning in the world wide web. The passion that drives him now, though, is focusing more on design direction and illustration, while learning more about animation and motion graphics.",
      photo: {
        s3Key: 'static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/speakers/1a9f02c6-2ff8-480a-9441-0962a9c50f4d/speaker-photo.jpg',
        imageId: '1575cfe7-9f24-4db8-8cc5-e6167bbb9822',
        altText: 'Varick Rosete photo',
        sharepointUrl: '/events/assets/static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/speakers/1a9f02c6-2ff8-480a-9441-0962a9c50f4d/media_157a8e21ae3ca20847df2b5fe0db484772f7f6db0.jpeg',
        imageUrl: 'https://events-data-dev.aws125.adobeitc.com/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/speakers/1a9f02c6-2ff8-480a-9441-0962a9c50f4d/speaker-photo.jpg',
        mimeType: 'image/jpeg',
        imageKind: 'speaker-photo',
        s3Bucket: 'adobe-events-data-dev',
        creationTime: 1722025961127,
        modificationTime: 1722028719205,
        pk: 'speaker#1a9f02c6-2ff8-480a-9441-0962a9c50f4d',
        sk: 'image#1575cfe7-9f24-4db8-8cc5-e6167bbb9822',
      },
      socialMedia: [
        {
          link: 'https://www.instagram.com/adobe',
          serviceName: 'instagram',
        },
        {
          link: 'https://www.facebook.com/Adobe/',
          serviceName: 'facebook',
        },
        {
          link: 'https://www.youtube.com/user/AdobeSystems/Adobe',
          serviceName: 'youtube',
        },
      ],
      type: 'Speaker',
      title: 'DESIGNER',
      seriesId: '3fd45107-16ee-49cd-aa1f-8dfd87368d38',
      creationTime: 1720720151947,
      modificationTime: 1722028705175,
    },
  ]));

  setMetadata('sponsors', JSON.stringify([
    {
      sponsorType: 'Partner',
      eventId: 'dee89ecc-0f3a-4a8d-a0d1-3037df512181',
      sponsorId: '68d33ae6-8796-45fa-b8de-dc6ccd854103',
      name: 'CM columbus',
      link: 'https://adobe.com',
      image: {
        s3Key: 'static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/sponsors/68d33ae6-8796-45fa-b8de-dc6ccd854103/sponsor-image.png',
        imageId: '15eb252a-d1e8-47cc-9cc7-f699298c1003',
        altText: 'CM columbus image',
        sharepointUrl: null,
        imageUrl: 'https://events-data-dev.aws125.adobeitc.com/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/sponsors/68d33ae6-8796-45fa-b8de-dc6ccd854103/sponsor-image.png',
        mimeType: 'image/png',
        imageKind: 'sponsor-image',
        s3Bucket: 'adobe-events-data-dev',
        creationTime: 1721679747977,
        modificationTime: 1721679747977,
        pk: 'sponsor#68d33ae6-8796-45fa-b8de-dc6ccd854103',
        sk: 'image#15eb252a-d1e8-47cc-9cc7-f699298c1003',
      },
      creationTime: 1721679745912,
      modificationTime: 1721679748059,
    },
    {
      sponsorType: 'Partner',
      eventId: 'dee89ecc-0f3a-4a8d-a0d1-3037df512181',
      sponsorId: '3dd83c30-125c-446c-8d54-bc960f44d2a9',
      name: 'SFDW',
      link: 'https://adobe.com',
      image: {
        s3Key: 'static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/sponsors/3dd83c30-125c-446c-8d54-bc960f44d2a9/sponsor-image.png',
        imageId: 'b0e44676-2ccd-4180-868e-78f1694bc846',
        altText: 'SFDW image',
        sharepointUrl: null,
        imageUrl: 'https://events-data-dev.aws125.adobeitc.com/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/sponsors/3dd83c30-125c-446c-8d54-bc960f44d2a9/sponsor-image.png',
        mimeType: 'image/png',
        imageKind: 'sponsor-image',
        s3Bucket: 'adobe-events-data-dev',
        creationTime: 1721679750958,
        modificationTime: 1721679750958,
        pk: 'sponsor#3dd83c30-125c-446c-8d54-bc960f44d2a9',
        sk: 'image#b0e44676-2ccd-4180-868e-78f1694bc846',
      },
      creationTime: 1721679749367,
      modificationTime: 1721679751037,
    },
    {
      sponsorType: 'Partner',
      eventId: 'dee89ecc-0f3a-4a8d-a0d1-3037df512181',
      sponsorId: '7a0c7e5e-d5fe-4f43-a214-f06eaf87d058',
      name: 'Design Buddies',
      link: 'https://adobe.com',
      image: {
        s3Key: 'static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/sponsors/7a0c7e5e-d5fe-4f43-a214-f06eaf87d058/sponsor-image.png',
        imageId: '607de091-7788-40ac-9e8b-f0eec438e74d',
        altText: 'Design Buddies image',
        sharepointUrl: null,
        imageUrl: 'https://events-data-dev.aws125.adobeitc.com/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/sponsors/7a0c7e5e-d5fe-4f43-a214-f06eaf87d058/sponsor-image.png',
        mimeType: 'image/png',
        imageKind: 'sponsor-image',
        s3Bucket: 'adobe-events-data-dev',
        creationTime: 1721669696959,
        modificationTime: 1721669696959,
        pk: 'sponsor#7a0c7e5e-d5fe-4f43-a214-f06eaf87d058',
        sk: 'image#607de091-7788-40ac-9e8b-f0eec438e74d',
      },
      creationTime: 1721669695479,
      modificationTime: 1721669697041,
    },
  ]));
  setMetadata('show-sponsors', 'true');
  setMetadata('host-email', 'cod87753@adobe.com');
  setMetadata('show-agenda-post-event', 'true');
  setMetadata('show-venue-post-event', 'true');
  setMetadata('wait-list-attendee-count', '0');
  setMetadata('event-materials', '[]');
  setMetadata('related-products', '[{"name":"Adobe Express","showProductBlade":true,"tags":"caas:product-categories/graphic-design/adobe-express,caas:product-categories/illustration/adobe-express"},{"name":"Illustrator","showProductBlade":true,"tags":"caas:product-categories/graphic-design/illustrator,caas:product-categories/illustration/illustrator"},{"name":"Photoshop","showProductBlade":true,"tags":"caas:product-categories/photography/photoshop"}]');
  setMetadata('topics', '["Graphic Design","Illustration","Photography"]');
  setMetadata('external-event-id', 'st-459020398');
  setMetadata('published', 'true');
  setMetadata('attendees', '');
  setMetadata('gmt-offset', '-5');
  setMetadata('display-date-time', 'Saturday, July 27 2024 8:00 AM - 5:00 PM');
  setMetadata('local-start-date', '2024-07-27');
  setMetadata('local-end-date', '2024-07-27');
  setMetadata('local-start-time', '08:00:00');
  setMetadata('local-end-time', '0.708333333333333');
  setMetadata('local-start-time-millis', '1722085200000');
  setMetadata('local-end-time-millis', '1722117600000');
  setMetadata('duration', '6300');
  setMetadata('url', '/events/create-now/create-now-chicago-2024-test/chicago/il/2024-07-27');
  setMetadata('community-topic-url', 'https://www.adobe.com/events/hub');
  setMetadata('photos', JSON.stringify([
    {
      s3Key: 'static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/events/dee89ecc-0f3a-4a8d-a0d1-3037df512181/event-card-image.png',
      imageId: '57442d12-cb2a-4eb2-b4ae-12e80444ee91',
      altText: 'Event card image',
      sharepointUrl: null,
      imageUrl: 'https://events-data-dev.aws125.adobeitc.com/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/events/dee89ecc-0f3a-4a8d-a0d1-3037df512181/event-card-image.png',
      mimeType: 'image/png',
      imageKind: 'event-card-image',
      s3Bucket: 'adobe-events-data-dev',
      creationTime: 1721679773733,
      modificationTime: 1721679773733,
      pk: 'event#dee89ecc-0f3a-4a8d-a0d1-3037df512181',
      sk: 'image#57442d12-cb2a-4eb2-b4ae-12e80444ee91',
    },
    {
      s3Key: 'static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/events/dee89ecc-0f3a-4a8d-a0d1-3037df512181/venue-map-image.png',
      imageId: '5befdf1c-f1a8-40e8-925b-daa9a4e01d33',
      altText: 'Venue Map Image',
      sharepointUrl: null,
      imageUrl: 'https://events-data-dev.aws125.adobeitc.com/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/events/dee89ecc-0f3a-4a8d-a0d1-3037df512181/venue-map-image.png',
      mimeType: 'image/png',
      imageKind: 'venue-map-image',
      s3Bucket: 'adobe-events-data-dev',
      creationTime: 1721679667969,
      modificationTime: 1721679667969,
      pk: 'event#dee89ecc-0f3a-4a8d-a0d1-3037df512181',
      sk: 'image#5befdf1c-f1a8-40e8-925b-daa9a4e01d33',
    },
    {
      s3Key: 'static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/events/dee89ecc-0f3a-4a8d-a0d1-3037df512181/event-hero-image.png',
      imageId: '9f0837db-6b12-48d6-95e1-4ecefa342071',
      altText: 'Event hero image',
      sharepointUrl: null,
      imageUrl: 'https://events-data-dev.aws125.adobeitc.com/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/events/dee89ecc-0f3a-4a8d-a0d1-3037df512181/event-hero-image.png',
      mimeType: 'image/png',
      imageKind: 'event-hero-image',
      s3Bucket: 'adobe-events-data-dev',
      creationTime: 1721679763694,
      modificationTime: 1721679763694,
      pk: 'event#dee89ecc-0f3a-4a8d-a0d1-3037df512181',
      sk: 'image#9f0837db-6b12-48d6-95e1-4ecefa342071',
    },
    {
      s3Key: 'static/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/events/dee89ecc-0f3a-4a8d-a0d1-3037df512181/venue-image.png',
      imageId: 'f4b48c91-379d-4a76-b8c9-e44f57bda6a4',
      altText: 'Event venue image',
      sharepointUrl: null,
      imageUrl: 'https://events-data-dev.aws125.adobeitc.com/images/series/3fd45107-16ee-49cd-aa1f-8dfd87368d38/events/dee89ecc-0f3a-4a8d-a0d1-3037df512181/venue-image.png',
      mimeType: 'image/png',
      imageKind: 'venue-image',
      s3Bucket: 'adobe-events-data-dev',
      creationTime: 1721679783284,
      modificationTime: 1721679811365,
      pk: 'event#dee89ecc-0f3a-4a8d-a0d1-3037df512181',
      sk: 'image#f4b48c91-379d-4a76-b8c9-e44f57bda6a4',
    },
  ]));
  setMetadata('attendee-limit', '100');
  setMetadata('allow-wait-listing', 'true');
  setMetadata('wait-list-attendess', '');
  setMetadata('creation-time', '2024-07-22T20:21:05.698Z');
  setMetadata('modification-time', '2024-07-31T21:21:04.769Z');
  setMetadata('tags', 'caas:events/type/tier-3,caas:cta/view-event,caas:events/series/create-now,caas:events/region/americas/chicago-il,caas:product-categories/graphic-design/adobe-express,caas:product-categories/illustration/adobe-express,caas:product-categories/graphic-design/illustrator,caas:product-categories/illustration/illustrator,caas:product-categories/photography/photoshop');
  setMetadata('venue', '{"venueName":"Morgan MFG","country":"US","address":"401 North Morgan Street","city":"Chicago","gmtOffset":-5,"postalCode":"60642","venueId":"99c5a8eb-b187-4d3f-9aa7-96a7e0b3ec3e","placeId":"ChIJXZfPFNEsDogRC_Qo9xOMLaA","mapUrl":"https://maps.google.com/?cid=11542035437399372811","coordinates":{"lat":41.8895808,"lon":-87.6516783},"stateCode":"IL","state":"Illinois","creationTime":1721679666445,"modificationTime":1721679666445}');
  setMetadata('rsvp-description', "Join the design community at Adobe Create Now to connect with fellow local creators, explore new ways to collaborate, and enhance your creative process. Discover Adobe's latest features, and get pro tips");
  setMetadata('rsvp-form-fields', '{"required":["firstName","lastName","email","jobTitle","phoneNumber","ageCategory","industry","jobFunction","companySize","productOfInterest","opt-inContact"],"visible":["firstName","lastName","email","jobTitle","phoneNumber","ageCategory","industry","jobFunction","companySize","productOfInterest","opt-inContact"]}');
}

function checkForDoubleSquareBrackets() {
  const bodyContent = document.body.innerHTML;
  const regex = /\[\[.*?\]\]/g;
  const matches = bodyContent.match(regex);
  return !!matches;
}

describe('Content Update Script', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    prepareDOM();
    window.isTestEnv = true;
  });

  it('leaves no placeholders behind', () => {
    document.body.innerHTML = body;
    const miloDeps = {
      getConfig,
      miloLibs: LIBS,
    };

    autoUpdateContent(document, miloDeps);
    expect(checkForDoubleSquareBrackets()).to.be.false;
  });

  it('handles #event-template special case', () => {
    document.body.innerHTML = defaultDoc;
    const miloDeps = {
      getConfig,
      miloLibs: LIBS,
    };

    autoUpdateContent(document, miloDeps);
    expect(checkForDoubleSquareBrackets()).to.be.false;
  });

  it('handles RSVP buttons correctly', async () => {
    document.body.innerHTML = body;
    const miloDeps = {
      getConfig,
      miloLibs: LIBS,
    };

    const profile = {
      account_type: 'type3',
      utcOffset: 'null',
      preferred_languages: null,
      displayName: 'Qiyun Dai',
      last_name: 'Dai',
      userId: 'B90719A765B288680A494219@c62f24cc5b5b7e0e0a494004',
      authId: 'B90719A765B288680A494219@c62f24cc5b5b7e0e0a494004',
      tags: [
        'agegroup_unknown',
        'edu',
        'edu_k12',
      ],
      emailVerified: 'true',
      phoneNumber: null,
      countryCode: 'US',
      name: 'Qiyun Dai',
      mrktPerm: 'EMAIL:false,MAIL:false,PHONE:false,PHONE_RENT:false,FAX:false,MAIL_RENT:false,EMAIL_RENT:false',
      mrktPermEmail: 'false',
      first_name: 'Qiyun',
      email: 'cod87753@adobe.com',
    };

    BlockMediator.set('imsProfile', profile);

    const buttonOriginalText = document.querySelector('a[href$="#rsvp-form-1"]').textContent;
    autoUpdateContent(document, miloDeps);
    BlockMediator.set('rsvpData', { status: { registered: false } });

    expect(document.querySelector('a[href$="#rsvp-form-1"]').textContent).to.be.equal(buttonOriginalText);
  });
});
