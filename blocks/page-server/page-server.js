import { getMetadata } from '../../utils/utils.js';
import { getLibs } from '../../scripts/utils.js';

const API_ENDPOINT = 'https://14257-chimera-dev.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection';
const API_QUERY_PARAM = 'featuredCards';

function flattenObject(obj, parent = '', res = {}) {
  Object.entries(obj).forEach(([key, value]) => {
    const newKey = parent ? `${parent}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, newKey, res);
    } else {
      res[newKey] = value;
    }
  });
  return res;
}

// data -> dom gills
async function autoUpdatePage(main, hash) {
  if (!main) {
    window.lana?.log('page server block cannot find it\'s parent main');
    return;
  }

  const json = await fetch(`${API_ENDPOINT}?${API_QUERY_PARAM}=${'435a285b-ae9b-3cb1-9de0-cc6d11747926' || hash}`).then((resp) => {
    if (resp.ok) {
      return resp.json();
    }

    window.lana?.log('Error while attempting to fetch /t3/event/default/metadata.json');
    return null;
  });

  if (json) {
    const [pageData] = json.cards;
    if (!pageData) window.location.replace('/404');
    const flatData = flattenObject(pageData);

    const findRegexMatch = (_match, p1) => {
      if (Array.isArray(flatData[p1])) {
        return flatData[p1].find((i) => i.key === p1).value;
      }

      return flatData[p1] || '';
    };

    console.log(flatData);

    const allElements = main.querySelectorAll('*');
    const reg = /\[\[(.*?)\]\]/g;
    allElements.forEach((element) => {
      if (element.childNodes.length) {
        element.childNodes.forEach((child) => {
          if (child.tagName === 'IMG' && child.nodeType === 1) {
            const parentPic = child.closest('picture');
            const originalAlt = child.alt;
            const replacedSrc = originalAlt.replace(reg, findRegexMatch).trim();

            if (replacedSrc && parentPic) {
              parentPic.querySelectorAll('source').forEach((el) => {
                console.log(el.srcset);
                // const srcsetUrl = new URL(el.srcset);
                // console.log(srcsetUrl);
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
