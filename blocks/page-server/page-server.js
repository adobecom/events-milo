import { getMetadata } from '../../utils/utils.js';
import fetchPageData, { flattenObject } from '../../utils/event-apis.js';
import { getLibs } from '../../scripts/utils.js';

const PLACEHOLDER_REG = /\[\[(.*?)\]\]/g;

function handleRegisterButton(a) {
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
}

function autoUpdateLinks(scope) {
  scope.querySelectorAll('a[href*="#"]').forEach(async (a) => {
    try {
      let url = new URL(a.href);
      if (getMetadata(url.hash.replace('#', ''))) {
        a.href = getMetadata(url.hash.replace('#', ''));
        url = new URL(a.href);
      }

      if (a.href.endsWith('#rsvp-form')) {
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
    } catch (e) {
      window.lana?.log(`Error while attempting to replace link ${a.href}: ${e}`);
    }
  });
}

function updateImgTag(child, matchCallback, parentElement) {
  const parentPic = child.closest('picture');
  const originalAlt = child.alt;
  const replacedSrc = originalAlt.replace(PLACEHOLDER_REG, matchCallback);

  if (replacedSrc && parentPic && replacedSrc !== originalAlt) {
    parentPic.querySelectorAll('source').forEach((el) => {
      try {
        el.srcset = el.srcset.replace(/.*\?/, `${replacedSrc}?`);
      } catch (e) {
        window.lana?.log(`failed to convert optimized picture source from ${el} with dynamic data: ${e}`);
      }
    });

    parentPic.querySelectorAll('img').forEach((el) => {
      try {
        el.src = el.src.replace(/.*\?/, `${replacedSrc}?`);
      } catch (e) {
        window.lana?.log(`failed to convert optimized img from ${el} with dynamic data: ${e}`);
      }
    });
  } else if (originalAlt.match(PLACEHOLDER_REG)) {
    parentElement.remove();
  }
}

function updateTextNode(child, matchCallback) {
  const originalText = child.nodeValue;
  const replacedText = originalText.replace(PLACEHOLDER_REG, matchCallback);
  if (replacedText !== originalText) child.nodeValue = replacedText;
}

function autoUpdateMetadata(res) {
  if (!res) return;

  if (res['contentArea.title']) document.title = res['contentArea.title'];

  if (!res['contentArea.description']) return;

  const metaDescription = document.querySelector("meta[name='description']");
  if (metaDescription) {
    metaDescription.setAttribute('content', res['contentArea.description']);
  } else {
    const newMetaDescription = document.createElement('meta');
    newMetaDescription.setAttribute('name', 'description');
    newMetaDescription.setAttribute('content', res['contentArea.description']);
    document.head.appendChild(newMetaDescription);
  }
}

// data -> dom gills
export async function autoUpdateContent(parent, data, isStructured = false) {
  if (!parent) {
    window.lana?.log('page server block cannot find its parent element');
    return null;
  }

  if (!data) {
    document.body.style.display = 'none';
    window.location.replace('/404');
  }

  const res = isStructured ? flattenObject(data) : data;
  console.log('Replacing content with:', res);
  const findRegexMatch = (_match, p1) => res[p1] || '';
  const allElements = parent.querySelectorAll('*');

  allElements.forEach((element) => {
    if (element.childNodes.length) {
      element.childNodes.forEach((child) => {
        if (child.tagName === 'IMG' && child.nodeType === 1) {
          updateImgTag(child, findRegexMatch, element);
        }

        if (child.nodeType === 3) {
          updateTextNode(child, findRegexMatch);
        }
      });
    }
  });

  // handle link replacement. To keep when switching to metadata based rendering
  autoUpdateLinks(parent);

  // TODO: handle Metadata
  autoUpdateMetadata(res);
  return res;
}

export default async function init(el) {
  const { default: getUuid } = await import(`${getLibs()}/utils/getUuid.js`);
  const hash = await getUuid(window.location.pathname);
  await autoUpdateContent(el.closest('main'), await fetchPageData(hash, true), true);
}
