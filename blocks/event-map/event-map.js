import { getLibs } from '../../scripts/utils.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

const ENCODED_API_KEY = 'QUl6YVN5RHZ5cXdhVXMtSXZNS1BTb3RkV2JVRFJETmtUbkhXMlpB';

function loadMapboxConfigs(el) {
  const configs = {};
  const configsDiv = el.querySelector(':scope > div:last-of-type');

  if (!configsDiv) return null;

  Array.from(configsDiv.children).forEach((col, i) => {
    if (i === 0) configs.mapId = col.textContent.trim();
    if (i === 1) configs.coordinates = col.textContent;
    if (i === 2) configs.zoom = parseInt(col.textContent.trim(), 10);
  });

  configs.mapContainer = configsDiv;
  return configs;
}

function decorateTextContainer(el) {
  const wrapper = el.querySelector('.event-map-wrapper');
  const textContentWrapper = el.querySelector(':scope > div:first-of-type > div');

  if (!textContentWrapper) return;

  textContentWrapper.classList.add('text-wrapper');
  wrapper.append(textContentWrapper);
}

function decorateMapContainer(el, configs) {
  const wrapper = el.querySelector('.event-map-wrapper');

  const { mapContainer } = configs;
  mapContainer.innerHTML = '';
  mapContainer.classList.add('map-container');
  mapContainer.id = 'map-container';

  const img = createTag('img', { src: `https://maps.googleapis.com/maps/api/staticmap?map_id=${configs.mapId}&center=${configs.coordinates}&zoom=${configs.zoom}&size=600x400&key=${window.atob(ENCODED_API_KEY)}&markers=color:red%7C${configs.coordinates}` });
  mapContainer.append(img);
  wrapper.append(mapContainer);
}

export default async function init(el) {
  const configs = loadMapboxConfigs(el);
  if (!configs) return;

  const wrapper = createTag('div', { class: 'event-map-wrapper' });
  el.append(wrapper);

  decorateTextContainer(el);
  decorateMapContainer(el, configs);
}
