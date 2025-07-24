import { LIBS, getMetadata } from '../../scripts/utils.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function addParams(searchParams, params, key, value) {
  if (params.has(key)) {
    searchParams[key] = params.get(key);
  } else {
    searchParams[key] = value;
  }
}

function addSearchParams(url, searchParams) {
  const urlObj = new URL(url);
  for (const [key, value] of Object.entries(searchParams)) {
    urlObj.searchParams.append(key, value);
  }
  return urlObj.toString();
}

function getSearchParamsFromCurrentUrl() {
  const params = new URL(window.location.href).searchParams;
  const searchParams = {};
  addParams(searchParams, params, 'mkto_trk', 'marketo_tracker');
  addParams(searchParams, params, 'mkt_tok', 'marketo_token');
  addParams(searchParams, params, 'ecid', 'experience_cloud_id');
  addParams(searchParams, params, 'mkto_event_id', 'marketo_event_id');
  return searchParams;
}

function createOverlay(rowBlock) {
  // Show the overlay div if it exists and is hidden
  if (rowBlock.classList.contains('hidden')) {
    rowBlock.classList.remove('hidden');
  }

  // Overlay container
  const elements = {
    overlay: rowBlock.querySelector(':scope > div:nth-of-type(1)'),
    heading: rowBlock.querySelector(':scope > div:nth-of-type(1) > h2:nth-of-type(1)'),
    subheading: rowBlock.querySelector(':scope > div:nth-of-type(1) > p:nth-of-type(1)'),
    bestViewedInLandscape: rowBlock.querySelector(':scope > div:nth-of-type(1) > p:nth-of-type(2)'),
    rotateYourPhone: rowBlock.querySelector(':scope > div:nth-of-type(1) > p:nth-of-type(3)'),
    youAreAllSet: rowBlock.querySelector(':scope > div:nth-of-type(1) > h2:nth-of-type(2)'),
    continueBtn: rowBlock.querySelector(':scope > div:nth-of-type(1) > p:nth-of-type(4) > a'),
  };

  const overlay = rowBlock.querySelector(':scope > div:nth-of-type(1)');
  overlay.classList.add('iframe-overlay');

  // Close button (top right)
  const closeBtn = createTag(
    'img',
    {
      class: 'overlay-close-btn',
      'aria-label': 'Close overlay',
      src: '/events/blocks/adobe-connect/asset/Cross.svg',
      alt: 'Close overlay',
    },
  );
  overlay.insertAdjacentElement('beforeend', closeBtn);
  closeBtn.addEventListener('click', () => overlay.remove());

  // Heading
  elements.heading.classList.add('overlay-heading');

  // subheading
  elements.subheading.classList.add('overlay-subheading');

  // Illustration (SVG)
  const rotateImg = createTag('img', {
    class: 'overlay-illustration',
    src: '/events/blocks/adobe-connect/asset/Rotate.svg',
    alt: 'Phone rotation illustration',
  });
  elements.subheading.insertAdjacentElement('afterend', rotateImg);

  elements.bestViewedInLandscape.classList.add('overlay-landscape');
  elements.rotateYourPhone.classList.add('overlay-rotate-msg');
  // Message container
  const messageContainer = createTag('div', { class: 'overlay-message-container' }, [elements.bestViewedInLandscape, elements.rotateYourPhone]);
  rotateImg.insertAdjacentElement('afterend', messageContainer);

  elements.continueBtn.classList.add('overlay-continue-btn');
  elements.continueBtn.addEventListener('click', (event) => {
    event.preventDefault();
    overlay.remove();
  });

  // Message for landscape mode
  elements.youAreAllSet.classList.add('overlay-heading-yrs');

  return overlay;
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isPortraitMode() {
  return window.innerHeight > window.innerWidth;
}

function shouldShowOverlay() {
  return isMobileDevice() && isPortraitMode();
}

export default async function init(el) {
  const h2 = el.querySelector('h2');
  let url = h2?.textContent;
  el.setAttribute('data-mcz-dl-status', 'loading');

  h2.remove();

  // Hide the overlay div if it exists
  const overlayElem = el.querySelector(':scope > div:nth-of-type(2)');
  if (overlayElem) {
    overlayElem.classList.add('hidden');
  }

  const searchParams = getSearchParamsFromCurrentUrl();

  if (getMetadata('adobe-connect-url')) {
    url = getMetadata('adobe-connect-url');
  } else {
    console.log('No adobe-connect-url found');
    return;
  }

  // if (validateUrl(window.join_url)) {
  //   url = window.join_url;
  //   console.log("join_url in Window", window.join_url);
  // }
  url = addSearchParams(url, searchParams);

  if (overlayElem && shouldShowOverlay()) {
    createOverlay(overlayElem);
  } else if (overlayElem) {
    overlayElem.remove();
  }

  // Create iframe
  createTag('iframe', {
    src: url,
    frameborder: '0',
    allowfullscreen: 'true',
    class: 'fullwidth',
    style: 'position: relative; z-index: 1;',
  }, '', { parent: el });

  // Remove overlay after 7 seconds
  setTimeout(() => {
    overlay.remove();
  }, 7000);
}
