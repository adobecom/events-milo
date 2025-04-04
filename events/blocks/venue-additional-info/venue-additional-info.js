import { LIBS, getMetadata } from '../../scripts/utils.js';

async function decorateTextContainer(el, createTag) {
  const wrapper = el.querySelector('.venue-additional-info-wrapper');
  const textContentWrapper = el.querySelector(':scope > div');
  if (!textContentWrapper) return;

  textContentWrapper.classList.add('text-wrapper');
  wrapper.append(textContentWrapper);

  textContentWrapper.querySelectorAll('div').forEach((div) => {
    div.remove();
  });

  const venueObj = JSON.parse(getMetadata('venue'));

  if (!venueObj) return;

  const { venueName, additionalInformation } = venueObj;

  createTag('p', { class: 'venue-name-text' }, createTag('strong', {}, venueName), { parent: textContentWrapper });

  if (!additionalInformation) return;

  textContentWrapper.insertAdjacentHTML('beforeend', additionalInformation);
}

function decorateImage(el, createTag) {
  let venueAdditionalImageObj;
  try {
    venueAdditionalImageObj = JSON.parse(getMetadata('photos')).find((photo) => photo.imageKind === 'venue-additional-image');
  } catch (e) {
    window.lana?.log(`Error while parsing venue additional image metadata:\n${JSON.stringify(e, null, 2)}`);
  }

  if (!venueAdditionalImageObj) return;

  const wrapper = el.querySelector('.venue-additional-info-wrapper');
  const imageContainer = createTag('div', { id: 'additional-image-container', class: 'additional-image-container' });
  wrapper.append(imageContainer);

  let spUrlObj;

  if (venueAdditionalImageObj.sharepointUrl?.startsWith('https')) {
    try {
      spUrlObj = new URL(venueAdditionalImageObj.sharepointUrl);
    } catch (e) {
      window.lana?.log(`Error while parsing SharePoint URL:\n${JSON.stringify(e, null, 2)}`);
    }
  }

  if (spUrlObj) {
    const spUrl = spUrlObj.pathname;
    const img = createTag('img', { src: `${spUrl}`, alt: venueAdditionalImageObj.altText || '' });
    imageContainer.append(img);
    wrapper.append(imageContainer);

    return;
  }

  const img = createTag('img', { src: `${venueAdditionalImageObj.sharepointUrl || venueAdditionalImageObj.imageUrl}`, alt: venueAdditionalImageObj.altText || '' });
  imageContainer.append(img);
  wrapper.append(imageContainer);
}

function decorateModal(el, createTag) {
  decorateImage(el, createTag);
  decorateTextContainer(el, createTag);
}

export default async function init(el) {
  const { createTag } = await import(`${LIBS}/utils/utils.js`);

  if (getMetadata('show-venue-additional-info-post-event') !== 'true' && document.body.classList.contains('timing-post-event')) {
    el.remove();
    return;
  }

  const wrapper = createTag('div', { class: 'venue-additional-info-wrapper' });
  el.append(wrapper);

  decorateModal(el, createTag);
}
