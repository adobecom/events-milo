import { LIBS, getMetadata } from '../../scripts/utils.js';

function decorateTextContainer(el, createTag, decorateButtons) {
  const wrapper = el.querySelector('.event-map-wrapper');
  const textContentWrapper = el.querySelector(':scope > div:first-of-type > div');
  const additionalInfoBtn = el.querySelector(':scope > div:first-of-type > div > p:last-of-type:has(a)');

  if (!textContentWrapper) return;

  textContentWrapper.classList.add('text-wrapper');
  wrapper.append(textContentWrapper);

  // forward and backward compatibility

  textContentWrapper.querySelectorAll('p').forEach((p) => {
    p.remove();
  });

  let venueObj;

  try {
    venueObj = JSON.parse(getMetadata('venue'));
  } catch (e) {
    window.lana?.log(`Error while parsing venue metadata:\n${JSON.stringify(e, null, 2)}`);
  }

  if (!venueObj) {
    el.remove();
    return;
  }

  const { formattedAddress, venueName, additionalInformation } = venueObj;

  let venueAdditionalImageObj;

  try {
    venueAdditionalImageObj = JSON.parse(getMetadata('photos')).find((photo) => photo.imageKind === 'venue-additional-image');
  } catch (e) {
    window.lana?.log(`Error while parsing venue additional image metadata:\n${JSON.stringify(e, null, 2)}`);
  }

  createTag('p', { class: 'venue-name-text' }, createTag('strong', {}, venueName), { parent: textContentWrapper });

  if (formattedAddress) {
    createTag('p', { class: 'venue-address-text' }, formattedAddress, { parent: textContentWrapper });
  } else {
    const { address, city, state, postalCode } = venueObj;

    if (address) createTag('p', { class: 'venue-address-text' }, address, { parent: textContentWrapper });
    if (city && state && postalCode) createTag('p', { class: 'venue-address-text' }, `${city}, ${state} ${postalCode}`, { parent: textContentWrapper });
  }

  if (getMetadata('show-venue-additional-info-post-event') !== 'true' && document.body.classList.contains('timing-post-event')) return;

  if (additionalInfoBtn && (additionalInformation || venueAdditionalImageObj)) {
    decorateButtons(additionalInfoBtn, 'button-l');
    textContentWrapper.append(additionalInfoBtn);
  }
}

function decorateMap(el, createTag) {
  let venueMapImageObj;
  try {
    venueMapImageObj = JSON.parse(getMetadata('photos')).find((photo) => photo.imageKind === 'venue-map-image');
  } catch (e) {
    window.lana?.log(`Error while parsing venue map image metadata:\n${JSON.stringify(e, null, 2)}`);
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
      window.lana?.log(`Error while parsing SharePoint URL:\n${JSON.stringify(e, null, 2)}`);
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
  const [{ createTag }, { decorateButtons }] = await Promise.all([
    import(`${LIBS}/utils/utils.js`),
    import(`${LIBS}/utils/decorate.js`),
  ]);
  if (getMetadata('show-venue-post-event') !== 'true' && document.body.classList.contains('timing-post-event')) {
    el.remove();
    return;
  }

  const wrapper = createTag('div', { class: 'event-map-wrapper dark' });
  el.append(wrapper);

  decorateTextContainer(el, createTag, decorateButtons);
  decorateMap(el, createTag);
}
