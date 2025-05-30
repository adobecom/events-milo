import { LIBS } from '../../scripts/utils.js';

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

export default async function init(el) {
  const h2 = el.querySelector('h2');
  let url = h2?.textContent;

  h2.remove();
  const button = createTag('button', { class: 'button' }, 'Join the event', { parent: el });

  button.addEventListener('click', () => {
    const params = new URL(window.location.href).searchParams;
    const searchParams = {};
    addParams(searchParams, params, 'mkto_trk', 'marketo_tracker');
    addParams(searchParams, params, 'mkt_tok', 'marketo_token');
    addParams(searchParams, params, 'ecid', 'experience_cloud_id');
    addParams(searchParams, params, 'mkto_event_id', 'marketo_event_id');

    if (window.join_url) {
      url = window.join_url;
    }
    url = addSearchParams(url, searchParams);
    
    // Create overlay
    const overlay = createTag('div', {
      class: 'iframe-overlay',
      style: 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.9); display: flex; align-items: center; justify-content: center; z-index: 1000;',
    });
    
    // Create loading text
    const loadingText = createTag('div', {
      style: 'font-size: 1.2em; color: #333;',
    }, 'Loading event...');
    
    overlay.appendChild(loadingText);
    el.appendChild(overlay);
    
    // Create iframe
    const iframe = createTag('iframe', {
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
    
    button.remove();
    document.body.querySelector('#webinar-marketo-form')?.remove();
  });
}
