const API_ENDPOINT = 'https://14257-chimera-dev.adobeioruntime.net/api/v1/web/chimera-0.0.1/sm-collection';
const API_QUERY_PARAM = 'featuredCards';

const cache = {};

export function flattenObject(obj, parentKey = '', result = {}) {
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

export default async function fetchPageData(hash) {
  if (cache[hash]) {
    return cache[hash];
  }

  try {
    const response = await fetch(`${API_ENDPOINT}?${API_QUERY_PARAM}=${hash}`);
    if (!response.ok) {
      window.lana?.log('Error while attempting to fetch event data event service layer');
      return null;
    }

    const json = await response.json();

    if (!json) return null;

    const [pageData] = json.cards;

    cache[hash] = pageData;

    return pageData;
  } catch (error) {
    window.lana?.log('Fetch error:', error);
    return null;
  }
}
