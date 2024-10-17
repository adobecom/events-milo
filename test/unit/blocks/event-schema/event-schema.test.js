import { expect } from '@esm-bundle/chai';
import init, { injectEventSchema } from '../../../../events/blocks/event-schema/event-schema.js';
import { createTag, setMetadata } from '../../../../events/scripts/utils.js';

describe('Event Schema Module', () => {
  describe('injectEventSchema', () => {
    beforeEach(() => {
      document.head.innerHTML = '';
      document.body.innerHTML = '';
    });

    it('should inject event schema into the document head', () => {
      setMetadata('event-title', 'Sample Event');
      setMetadata('start-date', '2024-08-01T00:00:00Z');
      setMetadata('end-date', '2024-08-02T00:00:00Z');
      setMetadata('description', 'This is a sample event.');
      setMetadata('venue', JSON.stringify({
        venueName: 'Sample Venue',
        address: '123 Main St',
        city: 'Sample City',
        stateCode: 'SC',
        postalCode: '12345',
        country: 'US',
      }));
      setMetadata('photos', JSON.stringify([
        { imageKind: 'event-hero-image', imageUrl: 'http://example.com/hero.jpg' },
      ]));

      injectEventSchema();

      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).to.not.be.null;
      const schemaData = JSON.parse(script.textContent);
      expect(schemaData).to.deep.equal({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: 'Sample Event',
        startDate: '2024-08-01T00:00:00Z',
        endDate: '2024-08-02T00:00:00Z',
        location: {
          '@type': 'Place',
          name: 'Sample Venue',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Main St',
            addressLocality: 'Sample City',
            addressRegion: 'SC',
            postalCode: '12345',
            addressCountry: 'US',
          },
        },
        image: 'http://example.com/hero.jpg',
        description: 'This is a sample event.',
        organizer: {
          '@type': 'Organization',
          name: 'Adobe',
          url: window.location.href,
        },
      });
    });

    it('should handle missing metadata gracefully', () => {
      injectEventSchema();

      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).to.be.null;
    });

    it('should inject schema without optional metadata fields', () => {
      setMetadata('event-title', 'Sample Event');
      setMetadata('start-date', '2024-08-01T00:00:00Z');
      setMetadata('end-date', '2024-08-02T00:00:00Z');
      setMetadata('venue', JSON.stringify({
        venueName: 'Sample Venue',
        address: '123 Main St',
        city: 'Sample City',
        stateCode: 'SC',
        postalCode: '12345',
        country: 'US',
      }));
      setMetadata('photos', JSON.stringify([
        { imageKind: 'event-hero-image', imageUrl: 'http://example.com/hero.jpg' },
      ]));

      injectEventSchema();

      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).to.not.be.null;
      const schemaData = JSON.parse(script.textContent);
      expect(schemaData).to.deep.equal({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: 'Sample Event',
        startDate: '2024-08-01T00:00:00Z',
        endDate: '2024-08-02T00:00:00Z',
        image: 'http://example.com/hero.jpg',
        location: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'US',
            addressLocality: 'Sample City',
            addressRegion: 'SC',
            postalCode: '12345',
            streetAddress: '123 Main St',
          },
          name: 'Sample Venue',
        },
        description: '',
        organizer: {
          '@type': 'Organization',
          name: 'Adobe',
          url: window.location.href,
        },
      });
    });
  });

  describe('init', () => {
    let el;

    beforeEach(() => {
      // Setup the DOM element for testing
      el = createTag('div', { class: 'event-schema' });
      document.head.innerHTML = '';
      document.body.appendChild(el);
    });

    afterEach(() => {
      el.remove();
    });

    it('should remove the element and inject event schema', () => {
      setMetadata('event-title', 'Sample Event');
      setMetadata('start-date', '2024-08-01T00:00:00Z');
      setMetadata('end-date', '2024-08-02T00:00:00Z');
      setMetadata('description', 'This is a sample event.');
      setMetadata('venue', JSON.stringify({
        venueName: 'Sample Venue',
        address: '123 Main St',
        city: 'Sample City',
        stateCode: 'SC',
        postalCode: '12345',
        country: 'US',
      }));
      setMetadata('photos', JSON.stringify([
        { imageKind: 'event-hero-image', imageUrl: 'http://example.com/hero.jpg' },
      ]));

      init(el);

      expect(el.parentNode).to.be.null;

      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).to.not.be.null;
      const schemaData = JSON.parse(script.textContent);
      expect(schemaData).to.deep.equal({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: 'Sample Event',
        startDate: '2024-08-01T00:00:00Z',
        endDate: '2024-08-02T00:00:00Z',
        location: {
          '@type': 'Place',
          name: 'Sample Venue',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Main St',
            addressLocality: 'Sample City',
            addressRegion: 'SC',
            postalCode: '12345',
            addressCountry: 'US',
          },
        },
        image: 'http://example.com/hero.jpg',
        description: 'This is a sample event.',
        organizer: {
          '@type': 'Organization',
          name: 'Adobe',
          url: window.location.href,
        },
      });
    });

    it('should handle missing metadata gracefully', () => {
      init(el);

      expect(el.parentNode).to.be.null;

      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).to.be.null;
    });

    it('should log an error if metadata parsing fails and remove the element', () => {
      setMetadata('venue', 'invalid JSON');
      setMetadata('photos', 'invalid JSON');

      init(el);

      expect(el.parentNode).to.be.null;
    });
  });
});
