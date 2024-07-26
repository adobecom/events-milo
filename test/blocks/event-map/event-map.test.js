import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { LIBS } from '../../../events/scripts/scripts.js';

// Mock dependencies
console.log(LIBS);
const { createTag, getMetadata } = await import(`${LIBS}/utils/utils.js`);

// Import the functions to be tested
const { decorateTextContainer, decorateMap } = await import('../../../events/blocks/event-map/event-map.js');

describe('event-map.js', () => {
  describe('decorateTextContainer', () => {
    it('should add text-wrapper class to the first div inside the element', () => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div class="event-map-wrapper">
          <div>
            <div>Text Content</div>
          </div>
        </div>
      `;

      decorateTextContainer(el);

      const textContentWrapper = el.querySelector(':scope > div:first-of-type > div');
      expect(textContentWrapper.classList.contains('text-wrapper')).to.be.true;
    });

    it('should do nothing if textContentWrapper is not found', () => {
      const el = document.createElement('div');
      el.innerHTML = `
        <div class="event-map-wrapper">
          <div></div>
        </div>
      `;

      decorateTextContainer(el);

      const textContentWrapper = el.querySelector(':scope > div:first-of-type > div');
      expect(textContentWrapper).to.be.null;
    });
  });

  describe('decorateMap', () => {
    let getMetadataStub;
    let createTagStub;

    beforeEach(() => {
      getMetadataStub = sinon.stub(getMetadata, 'default');
      createTagStub = sinon.stub(createTag, 'default');
    });

    afterEach(() => {
      getMetadataStub.restore();
      createTagStub.restore();
    });

    it('should append map container with image if venue map image is found', () => {
      const el = document.createElement('div');
      el.innerHTML = '<div class="event-map-wrapper"></div>';

      const venueMapImageObj = { imageKind: 'venue-map-image', imageUrl: 'http://example.com/map.jpg' };
      getMetadataStub.withArgs('photos').returns(JSON.stringify([venueMapImageObj]));
      createTagStub.withArgs('div', { id: 'map-container', class: 'map-container' }).returns(document.createElement('div'));
      createTagStub.withArgs('img', { src: venueMapImageObj.imageUrl }).returns(document.createElement('img'));

      decorateMap(el);

      const mapContainer = el.querySelector('#map-container');
      expect(mapContainer).to.not.be.null;
      expect(mapContainer.querySelector('img').src).to.equal(venueMapImageObj.imageUrl);
    });

    it('should do nothing if venue map image is not found', () => {
      const el = document.createElement('div');
      el.innerHTML = '<div class="event-map-wrapper"></div>';

      getMetadataStub.withArgs('photos').returns(JSON.stringify([]));

      decorateMap(el);

      const mapContainer = el.querySelector('#map-container');
      expect(mapContainer).to.be.null;
    });

    it('should log an error if JSON parsing fails', () => {
      const el = document.createElement('div');
      el.innerHTML = '<div class="event-map-wrapper"></div>';

      getMetadataStub.withArgs('photos').throws(new Error('Invalid JSON'));

      const logSpy = sinon.spy(window.lana, 'log');

      decorateMap(el);

      expect(logSpy.calledWith('Error while decorating venue map image')).to.be.true;
      logSpy.restore();
    });
  });
});
