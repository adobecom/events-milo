import { getLibs } from '../../scripts/utils.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

const ENCODED_API_KEY = 'QUl6YVN5RHZ5cXdhVXMtSXZNS1BTb3RkV2JVRFJETmtUbkhXMlpB';
const SIGNATURE = 'strata';
const GOOGLE_MAP_ID = 'd3555ecb8ace8a82';

function loadMapboxConfigs(el) {
  const configs = {};
  const configsDiv = el.querySelector(':scope > div:last-of-type');

  if (!configsDiv) return null;

  Array.from(configsDiv.children).forEach((col, i) => {
    if (i === 0) configs.mapStyle = col.textContent.trim();
    if (i === 1) configs.coordinates = col.textContent.split(',');
    if (i === 2) configs.zoom = parseInt(col.textContent.trim(), 10);
  });

  configs.mapContainer = configsDiv;
  return configs;
}

function decorateMapContainer(configs) {
  const { mapContainer } = configs;
  mapContainer.innerHTML = '';
  mapContainer.classList.add('map-container');
  mapContainer.id = 'map-container';

  const coordString = `${configs.coordinates[1]},${configs.coordinates[0]}`;
  const img = createTag('img', { src: `https://maps.googleapis.com/maps/api/staticmap?map_id=${GOOGLE_MAP_ID}&center=${coordString}&zoom=${configs.zoom}&size=600x400&key=${window.atob(ENCODED_API_KEY)}&markers=color:red%7C${coordString}` });
  mapContainer.append(img);
}

export default async function init(el) {
  const configs = loadMapboxConfigs(el);
  if (!configs) return;

  decorateMapContainer(configs);
}
