import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setMetadata } from '../../../events/scripts/utils.js';

// Import the functions to be tested
const { default: init } = await import('../../../events/blocks/event-map/event-map.js');
const body = await readFile({ path: './mocks/default.html' });

describe('Event Map', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    setMetadata('photos', JSON.stringify([
      {
        imageKind: 'venue-map-image',
        sharepointUrl: 'https://via.placeholder.com/150',
        altText: 'Venue Map Image',
      },
    ]));
    window.isTestEnv = true;
  });

  it('event map exists', () => {
    document.body.innerHTML = body;
    const block = document.querySelector('.event-map');
    init(block);
    expect(block).to.exist;
  });

  it('event map does not exist when toggled off for post event', () => {
    setMetadata('show-venue-post-event', 'false');
    document.body.innerHTML = body;
    document.body.classList.add('timing-post-event');
    const block = document.querySelector('.event-map');
    init(block);
    expect(document.querySelector('.event-map')).to.not.exist;
  });
});
