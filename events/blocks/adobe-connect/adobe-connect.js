import { LIBS, getMetadata } from '../../scripts/utils.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

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

export default async function init(el) {
  const h2 = el.querySelector('h2');
  let url = h2?.textContent;

  h2.remove();

  const searchParams = getSearchParamsFromCurrentUrl();

  if(getMetadata('adobe-connect-url')) {
    url = getMetadata('adobe-connect-url');
  } else {
    console.log('No adobe-connect-url found');
    return;
  }

  url = addSearchParams(url, searchParams);
  
  // Create overlay
  const overlay = createTag('div', {
    class: 'iframe-overlay',
    style: 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.9); display: flex; align-items: center; justify-content: center; z-index: 1000;',
  }, '', { parent: el });
  
  // Create loading text
  createTag('div', {
    style: 'font-size: 1.2em; color: #333;',
  }, 'Loading event...', { parent: overlay });
  
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
