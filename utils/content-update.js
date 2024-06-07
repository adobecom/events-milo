import { getAttendee } from './esp-controller.js';

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

async function updateRSVPButtonState(rsvpData, rsvpBtn, miloLibs) {
  if (rsvpData) return;

  const { getConfig } = await import(`${miloLibs}/utils/utils.js`);
  const { replaceKey } = await import(`${miloLibs}/features/placeholders.js`);
  const config = getConfig();

  rsvpBtn.textContent = await replaceKey('rsvp-loading-cta-text', config);
  const attendeeData = await getAttendee(rsvpData.eventId || getMetadata('event-id'), rsvpData.attendeeId);

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

  updateRSVPButtonState(window.bm8tr.get('rsvpdata'), rsvpBtn, miloLibs);

  window.bm8tr.subscribe('rsvpdata', ({ newValue }) => {
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

function autoUpdateLinks(scope) {
  scope.querySelectorAll('a[href*="#"]').forEach((a) => {
    try {
      const url = new URL(a.href);

      if (/#rsvp-form.*/.test(a.href)) {
        const profile = window.bm8tr.get('imsProfile');
        if (profile?.noProfile) {
          handleRegisterButton(a);
        } else if (!profile) {
          window.bm8tr.subscribe('imsProfile', ({ newValue }) => {
            if (newValue?.noProfile) {
              handleRegisterButton(a);
            }
          });
        }
      }

      if (a.href.endsWith('#event-template')) {
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
      } else if (getMetadata(url.hash.replace('#', ''))) {
        a.href = getMetadata(url.hash.replace('#', ''));
      }
    } catch (e) {
      window.lana?.log(`Error while attempting to replace link ${a.href}: ${e}`);
    }
  });
}

function updateImgTag(child, matchCallback, parentElement) {
  const parentPic = child.closest('picture');
  const originalAlt = child.alt;
  const replacedSrc = originalAlt.replace(REG, (_match, p1) => matchCallback(_match, p1, child));

  if (replacedSrc && parentPic && replacedSrc !== originalAlt) {
    parentPic.querySelectorAll('source').forEach((el) => {
      try {
        el.srcset = el.srcset.replace(/.*\?/, `${replacedSrc}?`);
      } catch (e) {
        window.lana?.log(`failed to convert optimized picture source from ${el} with dynamic data: ${e}`);
      }
    });

    parentPic.querySelectorAll('img').forEach((el) => {
      const onImgLoad = () => {
        el.removeEventListener('load', onImgLoad);
      };

      try {
        el.src = el.src.replace(/.*\?/, `${replacedSrc}?`);
      } catch (e) {
        window.lana?.log(`failed to convert optimized img from ${el} with dynamic data: ${e}`);
      }

      el.addEventListener('load', onImgLoad);
    });
  } else if (originalAlt.match(REG)) {
    parentElement.remove();
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
      const bladesDiv = productBlades.querySelector(':scope > div > div');
      const fragmentLinks = relatedProducts.split(',');
      fragmentLinks.forEach((l) => {
        createTag('a', { href: new URL(l).pathname }, l, { parent: bladesDiv });
      });
    }
  }
}

// data -> dom gills
export default function autoUpdateContent(parent, miloLibs, extraData) {
  if (!parent) {
    window.lana?.log('page server block cannot find its parent element');
    return;
  }

  const getContent = (_match, p1, n) => {
    let content;
    if (document.title === 'Event Preview') {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const eventId = urlParams.get('eventId');
      content = JSON.parse(localStorage.getItem(eventId))[p1] || '';
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
          updateImgTag(n, getContent, element);
        }

        if (n.nodeType === 3) {
          updateTextNode(n, getContent);
        }
      });
    }
  });

  // handle link replacement. To keep when switching to metadata based rendering
  autoUpdateLinks(parent);
  injectFragments(parent);
}
