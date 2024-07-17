import { LIBS } from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/utils.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

function decorateTextContainer(el) {
  const wrapper = el.querySelector('.event-map-wrapper');
  const textContentWrapper = el.querySelector(':scope > div:first-of-type > div');

  if (!textContentWrapper) return;

  textContentWrapper.classList.add('text-wrapper');
  wrapper.append(textContentWrapper);
}

function decorateMap(el) {
  try {
    const venueMapImageObj = JSON.parse(getMetadata('photos')).find((photo) => photo.imageKind === 'venue-map-image');

    if (!venueMapImageObj) return;

    const wrapper = el.querySelector('.event-map-wrapper');
    const mapContainer = createTag('div', { id: 'map-container', class: 'map-container' });
    wrapper.append(mapContainer);

    const img = createTag('img', { src: `${venueMapImageObj.sharepointUrl || venueMapImageObj.imageUrl}` });
    mapContainer.append(img);
    wrapper.append(mapContainer);
  } catch (e) {
    window.lana?.log('Error while decorating venue map image');
  }
}

export default async function init(el) {
  if (getMetadata('show-venue-post-event') !== 'true' && document.body.classList.contains('timing-post-event')) {
    el.remove();
    return;
  }

  const wrapper = createTag('div', { class: 'event-map-wrapper' });
  el.append(wrapper);

  decorateTextContainer(el);
  decorateMap(el);
}
