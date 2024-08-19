import BlockMediator from './deps/block-mediator.min.js';
import { waitForAdobeIMS } from './esp-controller.js';
import { getProfile } from './profile.js';
import { handlize, getMetadata, setMetadata, getIcon, readBlockConfig } from './utils.js';

export const META_REG = /\[\[(.*?)\]\]/g;
export const ICON_REG = /@@(.*?)@@/g;

const preserveFormatKeys = [
  'description',
];

export async function miloReplaceKey(miloLibs, key) {
  try {
    const [utils, placeholders] = await Promise.all([
      import(`${miloLibs}/utils/utils.js`),
      import(`${miloLibs}/features/placeholders.js`),
    ]);

    const { getConfig } = utils;
    const { replaceKey } = placeholders;
    const config = getConfig();

    return await replaceKey(key, config);
  } catch (error) {
    window.lana?.log('Error trying to replace placeholder:', error);
    return 'RSVP';
  }
}

function updateAnalyticTag(el, newVal) {
  if (!el.getAttribute('daa-ll')) return;

  const currentText = el.textContent;
  const daaLL = el.getAttribute('daa-ll');
  const newDaaLL = daaLL.replace(currentText, newVal);
  el.setAttribute('daa-ll', newDaaLL);
}

function createSVGIcon(iconName) {
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgElement.setAttribute('width', '20');
  svgElement.setAttribute('height', '20');
  svgElement.setAttribute('class', 'ecc-icon');

  const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `/events/icons/events-icons.svg#${iconName}`);

  svgElement.appendChild(useElement);

  return svgElement;
}

function convertEccIcon(n) {
  const text = n.innerHTML;
  const eccIcons = [
    'events-calendar',
  ];

  return text.replace(ICON_REG, (match, iconName) => {
    if (eccIcons.includes(iconName)) {
      if (iconName === 'events-calendar') n.classList.add('display-event-date-time');
      return createSVGIcon(iconName).outerHTML;
    }

    return '';
  });
}

function createTag(tag, attributes, html, options = {}) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
      || html instanceof SVGElement
      || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  options.parent?.append(el);
  return el;
}

async function updateRSVPButtonState(rsvpBtn, miloLibs) {
  const rsvpData = BlockMediator.get('rsvpData');
  const checkRed = getIcon('check-circle-red');
  if (rsvpData) {
    const registeredText = await miloReplaceKey(miloLibs, 'registered-cta-text');
    updateAnalyticTag(rsvpBtn.el, registeredText);
    rsvpBtn.el.textContent = registeredText;
    rsvpBtn.el.prepend(checkRed);
  } else {
    updateAnalyticTag(rsvpBtn.el, rsvpBtn.originalText);
    rsvpBtn.el.textContent = rsvpBtn.originalText;
    checkRed.remove();
  }

  // FIXME: no waitlisted state yet.
}

const signIn = () => {
  if (typeof window.adobeIMS?.signIn !== 'function') {
    window?.lana.log({ message: 'IMS signIn method not available', tags: 'errorType=warn,module=gnav' });
    return;
  }

  // add custom SUSI page id, sth like this:
  // adobeIMS.signIn({dctx_id: 'v:2,s,bg:expressUpsell,85709a30-0d87-11ef-a91c-2be7a9b482cb'})

  window.adobeIMS?.signIn();
};

async function handleRSVPBtnBasedOnProfile(rsvpBtn, miloLibs, profile) {
  if (profile?.noProfile) {
    const signInText = await miloReplaceKey(miloLibs, 'sign-in-rsvp-cta-text');
    updateAnalyticTag(rsvpBtn.el, signInText);
    rsvpBtn.el.textContent = signInText;
    rsvpBtn.el.addEventListener('click', (e) => {
      e.preventDefault();
      signIn();
    });
  } else if (profile) {
    await updateRSVPButtonState(rsvpBtn, miloLibs);

    BlockMediator.subscribe('rsvpData', () => {
      updateRSVPButtonState(rsvpBtn, miloLibs);
    });
  }
}

export async function validatePageAndRedirect() {
  const env = window.eccEnv;
  const pagePublished = getMetadata('published') === 'true' || getMetadata('status') === 'live';
  const invalidStagePage = env === 'stage' && window.location.hostname === 'www.stage.adobe.com' && !getMetadata('event-id');
  const isPreviewMode = new URLSearchParams(window.location.search).get('previewMode');

  const organicHitUnpublishedOnProd = env === 'prod' && !pagePublished && !isPreviewMode;
  const purposefulHitOnProdPreview = env === 'prod' && isPreviewMode;

  if (organicHitUnpublishedOnProd || invalidStagePage) {
    window.location.replace('/404');
  }

  if (purposefulHitOnProdPreview) {
    waitForAdobeIMS().then(async () => {
      const profile = await getProfile();
      if (profile?.noProfile) {
        signIn();
      } else if (!profile.email.endsWith('@adobe.com')) {
        window.location.replace('/404');
      }
    });
  }
}

async function handleRegisterButton(a, miloLibs) {
  const urlParams = new URLSearchParams(window.location.search);
  const devMode = urlParams.get('devMode');
  if (devMode) return;

  const rsvpBtn = {
    el: a,
    originalText: a.textContent,
  };

  const loadingText = await miloReplaceKey(miloLibs, 'rsvp-loading-cta-text');
  updateAnalyticTag(rsvpBtn.el, loadingText);
  a.textContent = loadingText;
  a.classList.add('disabled', 'rsvp-btn');

  const profile = BlockMediator.get('imsProfile');
  if (profile) {
    a.classList.remove('disabled');
    handleRSVPBtnBasedOnProfile(rsvpBtn, miloLibs, profile);
  } else {
    BlockMediator.subscribe('imsProfile', ({ newValue }) => {
      a.classList.remove('disabled');
      handleRSVPBtnBasedOnProfile(rsvpBtn, miloLibs, newValue);
    });
  }
}

function autoUpdateLinks(scope, miloLibs) {
  scope.querySelectorAll('a[href*="#"]').forEach((a) => {
    try {
      const url = new URL(a.href);

      if (/#rsvp-form.*/.test(a.href)) {
        handleRegisterButton(a, miloLibs);
      } else if (a.href.endsWith('#event-template')) {
        if (getMetadata('template-id')) {
          const params = new URLSearchParams(document.location.search);
          const testTiming = params.get('timing');
          let timeSuffix = '';

          if (testTiming) {
            timeSuffix = +testTiming > +getMetadata('local-end-time-millis') ? '-post' : '-pre';
          } else {
            const currentDate = new Date();
            const currentTimestamp = currentDate.getTime();
            timeSuffix = currentTimestamp > +getMetadata('local-end-time-millis') ? '-post' : '-pre';
          }

          a.href = `${getMetadata('template-id')}${timeSuffix}`;
          const timingClass = `timing${timeSuffix}-event`;
          document.body.classList.add(timingClass);
        }
      } else if (a.href.endsWith('#host-email')) {
        if (getMetadata('host-email')) {
          a.href = `mailto:${getMetadata('host-email')}`;
        } else {
          a.remove();
        }
      } else if (getMetadata(url.hash.replace('#', ''))) {
        a.href = getMetadata(url.hash.replace('#', ''));
      } else if (url.pathname.startsWith('/events') && url.hash) {
        a.remove();
      }
    } catch (e) {
      window.lana?.log(`Error while attempting to replace link ${a.href}: ${e}`);
    }
  });
}

function updatePictureElement(imageUrl, parentPic, altText) {
  let imgUrlObj;
  let imgUrl = imageUrl;
  if (imageUrl.startsWith('https://www.adobe.com/')) {
    try {
      imgUrlObj = new URL(imageUrl);
    } catch (e) {
      window.lana?.log('Error while parsing absolute sharepoint URL:', e);
    }
  }

  if (imgUrlObj) imgUrl = imgUrlObj.pathname;

  parentPic.querySelectorAll('source').forEach((el) => {
    try {
      el.srcset = el.srcset.replace(/.*\?/, `${imgUrl}?`);
    } catch (e) {
      window.lana?.log(`failed to convert optimized picture source from ${el} with dynamic data: ${e}`);
    }
  });

  parentPic.querySelectorAll('img').forEach((el) => {
    const onImgLoad = () => {
      el.removeEventListener('load', onImgLoad);
    };

    try {
      el.src = el.src.replace(/.*\?/, `${imgUrl}?`);
      el.alt = altText;
    } catch (e) {
      window.lana?.log(`failed to convert optimized img from ${el} with dynamic data: ${e}`);
    }

    el.addEventListener('load', onImgLoad);
  });
}

function updateImgTag(child, matchCallback, parentElement) {
  const parentPic = child.closest('picture');
  const originalAlt = child.alt;
  const photoMeta = originalAlt.replace(META_REG, (_match, p1) => matchCallback(_match, p1, child));

  try {
    const photoData = JSON.parse(photoMeta);
    const { sharepointUrl, imageUrl, altText } = photoData;

    const imgUrl = sharepointUrl || imageUrl;

    if (imgUrl && parentPic && imgUrl !== originalAlt) {
      updatePictureElement(imgUrl, parentPic, altText);
    } else if (originalAlt.match(META_REG)) {
      parentElement.remove();
    }
  } catch (e) {
    window.lana?.log(`Error while attempting to update image: ${e}`);
  }
}

function updateTextNode(child, matchCallback) {
  const originalText = child.nodeValue;
  const replacedText = originalText.replace(
    META_REG,
    (_match, p1) => matchCallback(_match, p1, child),
  );

  if (replacedText !== originalText) {
    const lines = replacedText.split('\\n');
    lines.forEach((line, index) => {
      const textNode = document.createTextNode(line);
      child.parentElement.appendChild(textNode);
      if (index < lines.length - 1) {
        child.parentElement.appendChild(document.createElement('br'));
      }
    });
    child.remove();
  }
}

function updateTextContent(child, matchCallback) {
  const originalText = child.textContent;
  const replacedText = originalText.replace(
    META_REG,
    (_match, p1) => matchCallback(_match, p1, child),
  );

  if (replacedText !== originalText) {
    child.textContent = replacedText;
  }
}

function injectFragments(parent) {
  const productBlades = parent.querySelector('.event-product-blades');

  if (productBlades) {
    const relatedProducts = getMetadata('related-products');
    if (relatedProducts) {
      let products;

      try {
        products = JSON.parse(relatedProducts);
      } catch (e) {
        window.lana?.log('Invalid JSON metadata for product blades:', e);
      }

      if (products) {
        const bladesToShow = products
          .filter((p) => p.showProductBlade)
          .map((o) => handlize(o.name));
        const relatedPairs = { 'lightroom-photoshop': ['photoshop', 'lightroom'] };
        const bladesDiv = productBlades.querySelector(':scope > div > div');

        if (bladesToShow.length >= 4) {
          createTag(
            'a',
            { href: '/events/fragments/product-blades/explore-creative-cloud' },
            '/events/fragments/product-blades/explore-creative-cloud',
            { parent: bladesDiv },
          );
        } else {
          Object.entries(relatedPairs).forEach(([joinedName, [p1, p2]]) => {
            const [i1, i2] = [bladesToShow.indexOf(p1), bladesToShow.indexOf(p2)];

            if (i1 >= 0 && i2 >= 0) {
              bladesToShow.splice(Math.min(i1, i2), 1, joinedName);
              bladesToShow.splice(Math.max(i1, i2), 1);
            }
          });

          bladesToShow.forEach((p) => {
            const fragmentLink = `/events/fragments/product-blades/${p}`;
            createTag('a', { href: fragmentLink }, fragmentLink, { parent: bladesDiv });
          });
        }
      }
    }
  }
}

export async function getNonProdData(env) {
  const resp = await fetch(`/events/default/${env}/metadata.json`);
  if (resp.ok) {
    const json = await resp.json();
    let { pathname } = window.location;
    if (pathname.endsWith('.html')) pathname = pathname.slice(0, -5);
    const pageData = json.data.find((d) => d.url === pathname);

    if (pageData) return pageData;

    window.lana?.log('Failed to find non-prod metadata for current page');
    return null;
  }

  window.lana?.log('Failed to fetch non-prod metadata:', resp);
  return null;
}

function decorateProfileCardsZPattern(parent) {
  if (!getMetadata('speakers')) return;

  let speakerData;
  try {
    speakerData = JSON.parse(getMetadata('speakers'));
  } catch (e) {
    window.lana?.log('Failed to parse speakers metadata:', e);
    return;
  }

  if (!speakerData?.length) return;

  const profileBlocks = [];
  let flippedIndex = -1;

  const allBlocks = parent.querySelectorAll('body > div > div:not(.section-metadata)');
  allBlocks.forEach((block, index) => {
    if (!block.classList.contains('profile-cards')) return;

    const blockConfig = readBlockConfig(block);
    const relatedProfiles = speakerData.filter((speaker) => {
      const speakerType = speaker.speakerType || speaker.type;
      if (!speakerType) return false;
      return speakerType.toLowerCase() === blockConfig.type;
    });

    if (relatedProfiles.length === 1) {
      profileBlocks.push({ block, blockIndex: index });
    }
  });

  profileBlocks.forEach(({ block, blockIndex }, index) => {
    if (index <= 0) return;

    if (blockIndex - profileBlocks[index - 1].blockIndex === 1 && flippedIndex !== index - 1) {
      flippedIndex = index;
      block.classList.add('reverse');
    }
  });
}

function updateExtraMetaTags(parent) {
  if (parent !== document) return;

  const title = getMetadata('title');
  const description = getMetadata('description');
  let photos;

  try {
    photos = JSON.parse(getMetadata('photos'));
  } catch (e) {
    window.lana?.log('Failed to parse photos metadata for extra metadata tags generation:', e);
  }

  if (title) {
    setMetadata('og:title', title);
    setMetadata('twitter:title', title);
  }

  if (description) {
    setMetadata('og:description', description);
    setMetadata('twitter:description', description);
  }

  if (photos) {
    const cardImg = photos.find((p) => p.imageKind === 'event-card-image');
    if (cardImg) {
      const { imageUrl } = cardImg;
      let { sharepointUrl } = cardImg;

      if (sharepointUrl?.startsWith('https')) {
        try {
          sharepointUrl = new URL(sharepointUrl).pathname;
        } catch (e) {
          window.lana?.log('Error while parsing SharePoint URL for extra metadata tags generation:', e);
        }
      }

      setMetadata('og:image', sharepointUrl || imageUrl);
      setMetadata('twitter:image', sharepointUrl || imageUrl);
    }
  }
}

// data -> dom gills
export default function autoUpdateContent(parent, miloDeps, extraData) {
  const { getConfig, miloLibs } = miloDeps;
  if (!parent) {
    window.lana?.log('page server block cannot find its parent element');
    return;
  }

  if (!getMetadata('event-id')) return;

  const getImgData = (_match, p1, n) => {
    let data;
    if (p1.includes('.')) {
      const [key, subKey] = p1.split('.');
      try {
        const nestedData = JSON.parse(getMetadata(key));
        data = nestedData[subKey] || extraData?.[p1] || '';
      } catch (e) {
        window.lana?.log(`Error while attempting to replace ${p1}: ${e}`);
        return '';
      }
    } else {
      try {
        data = JSON.parse(getMetadata(p1)) || extraData?.[p1] || {};
      } catch (e) {
        window.lana?.log(`Error while attempting to parse ${p1}: ${e}`);
        return '';
      }
    }

    if (preserveFormatKeys.includes(p1)) {
      n.parentNode?.classList.add('preserve-format');
    }
    return JSON.stringify(data);
  };

  const getContent = (_match, p1, n) => {
    let content;
    if (p1.includes('.')) {
      const [key, subKey] = p1.split('.');
      try {
        const nestedData = JSON.parse(getMetadata(key));
        content = nestedData[subKey] || extraData?.[p1] || '';
      } catch (e) {
        window.lana?.log(`Error while attempting to replace ${p1}: ${e}`);
      }
    } else {
      content = getMetadata(p1) || extraData?.[p1] || '';
    }

    if (preserveFormatKeys.includes(p1)) {
      n.parentNode?.classList.add('preserve-format');
    }

    if (p1 === 'start-date' || p1 === 'end-date') {
      const date = new Date(content);
      const localeString = getConfig().locale?.ietf || 'en-US';
      content = date.toLocaleDateString(localeString, { month: 'long', day: 'numeric', year: 'numeric' });
    }

    return content;
  };

  const isImage = (n) => n.tagName === 'IMG' && n.nodeType === 1;
  const isTextNode = (n) => n.nodeType === 3;
  const isStyledTextTag = (n) => n.tagName === 'STRONG' || n.tagName === 'EM';
  const mightContainIcon = (n) => n.tagName === 'P' || n.tagName === 'A';

  const allElements = parent.querySelectorAll('*');
  allElements.forEach((element) => {
    if (element.childNodes.length) {
      element.childNodes.forEach((n) => {
        if (isImage(n)) {
          updateImgTag(n, getImgData, element);
        }

        if (isTextNode(n)) {
          updateTextNode(n, getContent);
        }

        if (isStyledTextTag(n)) {
          updateTextContent(n, getContent);
        }

        if (mightContainIcon(n)) {
          n.innerHTML = convertEccIcon(n);
        }
      });
    }
  });

  // handle link replacement. To keep when switching to metadata based rendering
  autoUpdateLinks(parent, miloLibs);
  injectFragments(parent);
  decorateProfileCardsZPattern(parent);
  if (window.eccEnv !== 'prod') updateExtraMetaTags(parent);
}
