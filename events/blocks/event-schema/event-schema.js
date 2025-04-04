import { getMetadata } from '../../scripts/utils.js';

export function injectEventSchema() {
  let venueObject;
  let photos;

  try {
    venueObject = JSON.parse(getMetadata('venue'));
    photos = JSON.parse(getMetadata('photos'));
  } catch (error) {
    window.lana?.log(`Failed to parse venue or photos metadata:\n${JSON.stringify(error, null, 2)}`);
  }

  if (!venueObject || !photos) return;

  const imageHeroImage = photos.find((photo) => photo.imageKind === 'event-hero-image');

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: getMetadata('event-title'),
    startDate: getMetadata('start-date'),
    endDate: getMetadata('end-date'),
    location: {
      '@type': 'Place',
      name: venueObject.venueName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: venueObject.address,
        addressLocality: venueObject.city,
        addressRegion: venueObject.stateCode,
        postalCode: venueObject.postalCode,
        addressCountry: venueObject.country,
      },
    },
    image: imageHeroImage?.sharepointUrl || imageHeroImage?.imageUrl,
    description: getMetadata('description') || '',
    organizer: {
      '@type': 'Organization',
      name: 'Adobe',
      url: window.location.href,
    },
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemaData);
  document.head.appendChild(script);
}

export default function init(el) {
  el.remove();
  injectEventSchema();
}
