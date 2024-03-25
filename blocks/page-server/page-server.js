import { getMetadata } from '../../utils/utils.js';
import fetchPageData, { flattenObject } from '../../utils/event-apis.js';
import { getLibs } from '../../scripts/utils.js';

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
  const reg = /\[\[(.*?)\]\]/g;

  allElements.forEach((element) => {
    if (element.childNodes.length) {
      element.childNodes.forEach((child) => {
        if (child.tagName === 'IMG' && child.nodeType === 1) {
          const parentPic = child.closest('picture');
          const originalAlt = child.alt;
          const replacedSrc = originalAlt.replace(reg, findRegexMatch);

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
          } else if (originalAlt.match(reg)) {
            element.remove();
          }
        }

        if (child.nodeType === 3) {
          const originalText = child.nodeValue;
          const replacedText = originalText.replace(reg, findRegexMatch);
          if (replacedText !== originalText) child.nodeValue = replacedText;
        }
      });
    }
  });

  // handle link replacement
  parent.querySelectorAll('a[href*="#"]').forEach((a) => {
    try {
      let url = new URL(a.href);
      if (getMetadata(url.hash.replace('#', ''))) {
        a.href = getMetadata(url.hash.replace('#', ''));
        url = new URL(a.href);
      }
    } catch (e) {
      window.lana?.log(`Error while attempting to replace link ${a.href}: ${e}`);
    }
  });

  return res;
}

export default async function init(el) {
  const { default: getUuid } = await import(`${getLibs()}/utils/getUuid.js`);
  const hash = await getUuid(window.location.pathname);
  await autoUpdateContent(el.closest('main'), await fetchPageData(hash), true);
}
