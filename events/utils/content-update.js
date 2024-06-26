import BlockMediator from '../deps/block-mediator.min.js';
import { getAttendee } from './esp-controller.js';
import { handlize } from './utils.js';

export const REG = /\[\[(.*?)\]\]/g;

const preserveFormatKeys = [
  'description',
];

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

function getMetadata(name, doc = document) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

export function setMetadata(name, value, doc = document) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);

  if (name === 'title') document.title = value;

  if (meta) {
    meta.content = value;
  } else {
    const newMeta = doc.createElement('meta');
    newMeta.setAttribute(attr, name);
    newMeta.content = value;
    doc.head.appendChild(newMeta);
  }
}

async function updateRSVPButtonState(rsvpData, rsvpBtn, miloLibs) {
  if (!rsvpData) return;

  const { getConfig } = await import(`${miloLibs}/utils/utils.js`);
  const { replaceKey } = await import(`${miloLibs}/features/placeholders.js`);
  const config = getConfig();

  rsvpBtn.textContent = await replaceKey('rsvp-loading-cta-text', config);
  const eventId = rsvpData.eventId ?? getMetadata('event-id');
  const attendeeId = rsvpData.attendeeId ?? BlockMediator.get('imsProfile')?.userId;
  const attendeeData = await getAttendee(eventId, attendeeId);

  if (attendeeData.id) {
    rsvpBtn.textContent = await replaceKey('registered-cta-text', config);
  } else {
    rsvpBtn.textContent = rsvpBtn.originalText;
  }

  // FIXME: no waitlisted state yet.
}

function handleRegisterButton(a, miloLibs) {
  const urlParams = new URLSearchParams(window.location.search);
  const devMode = urlParams.get('devMode');

  if (devMode) return;

  const signIn = () => {
    if (typeof window.adobeIMS?.signIn !== 'function') {
      window?.lana.log({ message: 'IMS signIn method not available', tags: 'errorType=warn,module=gnav' });
      return;
    }

    // add custom SUSI page id, sth like this:
    // adobeIMS.signIn({dctx_id: 'v:2,s,bg:expressUpsell,85709a30-0d87-11ef-a91c-2be7a9b482cb'})

    window.adobeIMS.signIn();
  };

  a.addEventListener('click', (e) => {
    e.preventDefault();
    signIn();
  });

  const rsvpBtn = {
    el: a,
    originalText: a.textContent,
  };

  updateRSVPButtonState(BlockMediator.get('rsvpData'), rsvpBtn, miloLibs);

  BlockMediator.subscribe('rsvpData', ({ newValue }) => {
    updateRSVPButtonState(newValue, rsvpBtn, miloLibs);
  });
}

export function toClassName(name) {
  return name && typeof name === 'string'
    ? name.trim().toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const valueEl = cols[1];
        const name = toClassName(cols[0].textContent.trim());
        let value;
        if (valueEl.querySelector('a')) {
          const as = [...valueEl.querySelectorAll('a')];
          if (as.length === 1) {
            value = as[0].href;
          } else {
            value = as.map((a) => a.href);
          }
        } else if (valueEl.querySelector('p')) {
          const ps = [...valueEl.querySelectorAll('p')];
          if (ps.length === 1) {
            value = ps[0].textContent.trim();
          } else {
            value = ps.map((p) => p.textContent.trim());
          }
        } else value = row.children[1].textContent.trim();
        config[name] = value;
      }
    }
  });
  return config;
}

export function removeIrrelevantSections(area) {
  area.querySelectorAll(':scope > div').forEach((section) => {
    const sectionMetaBlock = section.querySelector('div.section-metadata');
    if (sectionMetaBlock) {
      const sectionMeta = readBlockConfig(sectionMetaBlock);
      let sectionRemove;

      if (sectionMeta.timing !== undefined) {
        let timingSearchParam = null;
        if (!['www.adobe.com'].includes(window.location.hostname)) {
          const urlParams = new URLSearchParams(window.location.search);
          timingSearchParam = urlParams.get(`${sectionMeta.timing.toLowerCase()}`)
            || urlParams.get(`${sectionMeta.timing}`);
        }
        sectionRemove = timingSearchParam !== null ? timingSearchParam !== 'true' : getMetadata(sectionMeta.timing.toLowerCase()) !== 'true';
      }

      if (sectionRemove) section.remove();
    }
  });
}

function autoUpdateLinks(scope, miloLibs) {
  scope.querySelectorAll('a[href*="#"]').forEach((a) => {
    try {
      const url = new URL(a.href);

      if (/#rsvp-form.*/.test(a.href)) {
        const profile = BlockMediator.get('imsProfile');
        if (profile?.noProfile) {
          handleRegisterButton(a, miloLibs);
        } else if (!profile) {
          BlockMediator.subscribe('imsProfile', ({ newValue }) => {
            if (newValue?.noProfile) {
              handleRegisterButton(a, miloLibs);
            }
          });
        }
      }

      if (a.href.endsWith('#event-template')) {
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
        }
      } else if (getMetadata(url.hash.replace('#', ''))) {
        a.href = getMetadata(url.hash.replace('#', ''));
      }
    } catch (e) {
      window.lana?.log(`Error while attempting to replace link ${a.href}: ${e}`);
    }
  });
}

function updatePictureElement(imageUrl, parentPic, altText) {
  parentPic.querySelectorAll('source').forEach((el) => {
    try {
      el.srcset = el.srcset.replace(/.*\?/, `${imageUrl}?`);
    } catch (e) {
      window.lana?.log(`failed to convert optimized picture source from ${el} with dynamic data: ${e}`);
    }
  });

  parentPic.querySelectorAll('img').forEach((el) => {
    const onImgLoad = () => {
      el.removeEventListener('load', onImgLoad);
    };

    try {
      el.src = el.src.replace(/.*\?/, `${imageUrl}?`);
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
  const photoMeta = originalAlt.replace(REG, (_match, p1) => matchCallback(_match, p1, child));

  try {
    const photoData = JSON.parse(photoMeta);
    const { imageUrl, altText } = photoData;

    if (imageUrl && parentPic && imageUrl !== originalAlt) {
      updatePictureElement(imageUrl, parentPic, altText);
    } else if (originalAlt.match(REG)) {
      parentElement.remove();
    }
  } catch (e) {
    window.lana?.log(`Error while attempting to update image: ${e}`);
  }
}

function updateTextNode(child, matchCallback) {
  const originalText = child.nodeValue;
  const replacedText = originalText.replace(REG, (_match, p1) => matchCallback(_match, p1, child));
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
            { href: '/fragments/product-blades/explore-creative-cloud' },
            '/fragments/product-blades/explore-creative-cloud',
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
            const fragmentLink = `/fragments/product-blades/${p}`;
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
    const pageData = json.data.find((d) => d.url === window.location.pathname);

    if (pageData) return pageData;

    window.lana?.log('Failed to find non-prod metadata for current page');
    return null;
  }

  window.lana?.log('Failed to fetch non-prod metadata:', resp);
  return null;
}

// data -> dom gills
export default function autoUpdateContent(parent, miloLibs, extraData) {
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
    return content;
  };

  const allElements = parent.querySelectorAll('*');
  allElements.forEach((element) => {
    if (element.childNodes.length) {
      element.childNodes.forEach((n) => {
        if (n.tagName === 'IMG' && n.nodeType === 1) {
          updateImgTag(n, getImgData, element);
        }

        if (n.nodeType === 3) {
          updateTextNode(n, getContent);
        }
      });
    }
  });

  // handle link replacement. To keep when switching to metadata based rendering
  autoUpdateLinks(parent, miloLibs);
  injectFragments(parent);
}
