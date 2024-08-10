import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setMetadata } from '../../../../events/scripts/utils.js';

const { default: init } = await import('../../../../events/blocks/event-map/event-map.js');
const body = await readFile({ path: './mocks/default.html' });
const faulty = await readFile({ path: './mocks/faulty.html' });

describe('Event Map', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.classList.remove('timing-post-event');
    document.head.innerHTML = '';
    window.isTestEnv = true;
  });

  it('event map exists', () => {
    setMetadata('photos', JSON.stringify([
      {
        imageKind: 'venue-map-image',
        sharepointUrl: 'https://via.placeholder.com/150',
        altText: 'Venue Map Image',
      },
    ]));
    document.body.innerHTML = body;
    const block = document.querySelector('.event-map');
    init(block);
    expect(block).to.exist;
  });

  it('has fallback alt-text', () => {
    setMetadata('photos', JSON.stringify([
      {
        imageKind: 'venue-map-image',
        sharepointUrl: 'https://via.placeholder.com/150',
      },
    ]));
    document.body.innerHTML = body;
    const block = document.querySelector('.event-map');
    init(block);
    expect(block.querySelector('img[alt="Venue Map Image"]')).to.exist;
  });

  it('event map does not exist when toggled off for post event', () => {
    setMetadata('show-venue-post-event', 'false');
    document.body.innerHTML = body;
    document.body.classList.add('timing-post-event');
    const block = document.querySelector('.event-map');
    init(block);
    expect(document.querySelector('.event-map')).to.not.exist;
  });

  it('fails early with faulty block authored', () => {
    setMetadata('show-venue-post-event', 'true');
    document.body.innerHTML = faulty;
    const block = document.querySelector('.event-map');
    init(block);
    expect(document.querySelector('.event-map > .event-map-wrapper > div')).to.not.exist;
  });

  it('triggers error handling for faulty data / DOM', () => {
    setMetadata('photos', 'faulty data');
    document.body.innerHTML = body;
    const block = document.querySelector('.event-map');
    init(block);
    expect(document.querySelector('.event-map .event-map-wrapper #map-container')).to.not.exist;
  });

  it('triggers error handling for malformatted sharepoint URL', () => {
    setMetadata('photos', JSON.stringify([
      {
        imageKind: 'venue-map-image',
        sharepointUrl: 'https/via.placeholder.com/150',
      },
    ]));
    document.body.innerHTML = body;
    const block = document.querySelector('.event-map');
    init(block);
    expect(document.querySelector('.event-map .event-map-wrapper #map-container > img[src="https/via.placeholder.com/150"]')).to.exist;
  });

  it('fallback from sharepoint URL to image URL', () => {
    setMetadata('photos', JSON.stringify([
      {
        imageKind: 'venue-map-image',
        imageUrl: 'https://via.placeholder.com/150',
      },
    ]));
    document.body.innerHTML = body;
    const block = document.querySelector('.event-map');
    init(block);
    expect(document.querySelector('.event-map .event-map-wrapper #map-container > img[src="https://via.placeholder.com/150"]')).to.exist;
  });
});
