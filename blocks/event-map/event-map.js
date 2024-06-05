import { getLibs } from '../../scripts/utils.js';
import { createOptimizedPicture } from '../../utils/utils.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

const ENCODED_API_KEY = 'QUl6YVN5RHZ5cXdhVXMtSXZNS1BTb3RkV2JVRFJETmtUbkhXMlpB';

function decorateTextContainer(el) {
  const wrapper = el.querySelector('.event-map-wrapper');
  const textContentWrapper = el.querySelector(':scope > div:first-of-type > div');

  if (!textContentWrapper) return;

  textContentWrapper.classList.add('text-wrapper');
  wrapper.append(textContentWrapper);
}

function decorateMapContainer(el) {
  const configs = {
    mapId: 'd3555ecb8ace8a82',
    coordinates: '33.092360452674576, -117.26431350671739',
    zoom: 9,
  };

  const wrapper = el.querySelector('.event-map-wrapper');
  const mapContainer = createTag('div', { id: 'map-container', class: 'map-container' });
  wrapper.append(mapContainer);

  const img = createTag('img', { src: `https://maps.googleapis.com/maps/api/staticmap?map_id=${configs.mapId}&center=${configs.coordinates}&zoom=${configs.zoom}&size=600x400&key=${window.atob(ENCODED_API_KEY)}&markers=color:red%7C${configs.coordinates}` });
  mapContainer.append(img);
  wrapper.append(mapContainer);
}

export default async function init(el) {
  const wrapper = createTag('div', { class: 'event-map-wrapper' });
  el.append(wrapper);

  decorateTextContainer(el);
  decorateMapContainer(el);
}
