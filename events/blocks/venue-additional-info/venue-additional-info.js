import { LIBS, getMetadata } from '../../scripts/utils.js';

async function decorateTextContainer(el, createTag, loadScript) {
  await loadScript('https://unpkg.com/showdown@2.1.0/dist/showdown.min.js');
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

  // eslint-disable-next-line no-undef
  const showdownService = new showdown.Converter();
  const content = showdownService.makeHtml(additionalInformation);
  textContentWrapper.insertAdjacentHTML('beforeend', content);
}

function decorateImage(el, createTag) {
  let venueAdditionalImageObj;
  try {
    venueAdditionalImageObj = JSON.parse(getMetadata('photos')).find((photo) => photo.imageKind === 'venue-additional-image');
  } catch (e) {
    window.lana?.log('Error while parsing venue additional image metadata:', e);
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
      window.lana?.log('Error while parsing SharePoint URL:', e);
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

function decorateModal(el, createTag, loadScript) {
  decorateImage(el, createTag);
  decorateTextContainer(el, createTag, loadScript);
}

export default async function init(el) {
  const { createTag, loadScript } = await import(`${LIBS}/utils/utils.js`);

  if (getMetadata('show-venue-additional-info-post-event') !== 'true' && document.body.classList.contains('timing-post-event')) {
    el.remove();
    return;
  }

  const wrapper = createTag('div', { class: 'venue-additional-info-wrapper' });
  el.append(wrapper);

  decorateModal(el, createTag, loadScript);
}
