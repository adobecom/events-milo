import { getMetadata } from '../../utils/utils.js';
import { getLibs } from '../../scripts/utils.js';

const API_ENDPOINT = 'https://14257-chimera-dev.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection';
const API_QUERY_PARAM = 'featuredCards';

function flattenObject(obj, parentKey = '', result = {}) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (key === 'arbitrary' && Array.isArray(value)) {
      value.forEach((item) => {
        const itemKey = `${newKey}.${item.key}`;
        result[itemKey] = item.value;
      });
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && !Array.isArray(item) && key !== 'arbitrary') {
          flattenObject(item, `${newKey}[${index}]`, result);
        } else {
          result[`${newKey}[${index}]`] = item;
        }
      });
    } else {
      result[newKey] = value;
    }
  });

  return result;
}

// data -> dom gills
async function autoUpdatePage(main, hash) {
  if (!main) {
    window.lana?.log('page server block cannot find it\'s parent main');
    return;
  }

  const json = await fetch(`${API_ENDPOINT}?${API_QUERY_PARAM}=${hash}`).then((resp) => {
    if (resp.ok) {
      return resp.json();
    }

    window.lana?.log('Error while attempting to fetch event data event service layer');
    return null;
  });

  if (json) {
    const [pageData] = json.cards;
    if (!pageData) {
      document.body.style.display = 'none';
      window.location.replace('/404');
    }

    const res = flattenObject(pageData);
    console.log(res);
    const findRegexMatch = (_match, p1) => res[p1] || '';
    const allElements = main.querySelectorAll('*');
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
  }

  // handle link replacement
  main.querySelectorAll('a[href*="#"]').forEach((a) => {
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
}

export default async function init(el) {
  const { default: getUuid } = await import(`${getLibs()}/utils/getUuid.js`);
  const hash = await getUuid(window.location.pathname);
  await autoUpdatePage(el.closest('main'), hash);
}
