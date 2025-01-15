import { LIBS, getMetadata } from '../../scripts/utils.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

function decorateTextContainer(el) {
  const wrapper = el.querySelector('.event-map-wrapper');
  const textContentWrapper = el.querySelector(':scope > div:first-of-type > div');

  if (!textContentWrapper) return;

  textContentWrapper.classList.add('text-wrapper');
  wrapper.append(textContentWrapper);
}

function decorateMap(el) {
  let venueMapImageObj;
  try {
    venueMapImageObj = JSON.parse(getMetadata('photos')).find((photo) => photo.imageKind === 'venue-map-image');
  } catch (e) {
    window.lana?.log('Error while parsing venue map image metadata:', e);
  }

  if (!venueMapImageObj) return;

  const wrapper = el.querySelector('.event-map-wrapper');
  const mapContainer = createTag('div', { id: 'map-container', class: 'map-container' });
  wrapper.append(mapContainer);

  let spUrlObj;

  if (venueMapImageObj.sharepointUrl?.startsWith('https')) {
    try {
      spUrlObj = new URL(venueMapImageObj.sharepointUrl);
    } catch (e) {
      window.lana?.log('Error while parsing SharePoint URL:', e);
    }
  }

  if (spUrlObj) {
    const spUrl = spUrlObj.pathname;
    const img = createTag('img', { src: `${spUrl}`, alt: venueMapImageObj.altText || '' });
    mapContainer.append(img);
    wrapper.append(mapContainer);

    return;
  }

  const img = createTag('img', { src: `${venueMapImageObj.sharepointUrl || venueMapImageObj.imageUrl}`, alt: venueMapImageObj.altText || '' });
  mapContainer.append(img);
  wrapper.append(mapContainer);
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
