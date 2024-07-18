import { getMetadata } from '../../scripts/utils.js';

function injectEventSchema() {
  const venueObject = JSON.parse(getMetadata('venue'));
  const photos = JSON.parse(getMetadata('photos'));

  if (!venueObject || !photos) return;

  const imageHeroImage = photos.find((photo) => photo.imageKind === 'event-hero-image');

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: getMetadata('title'),
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
    description: getMetadata('description'),
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
