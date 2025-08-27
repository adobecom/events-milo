import { CheckResourceLocation } from '../../../rs/360-KCI-804/images/mktoTestFormConfig.js';
import { setMetadata, getMetadata } from '../../scripts/utils.js';

export default async function init(el) {
  const rows = Array.from(el.children);
  const resourceLocation = `#${rows[0].textContent.trim().toLowerCase()}`;
  // suggestion to use getElementbyId
  const key = rows[1].textContent.trim().toLowerCase();

  const resourceWatch = 'main .section .chrono-box';

  el.innerHTML = '';

  el.setAttribute('data-mcz-dl-status', 'loading');

  let mczId = null;
  if (getMetadata('eventExternalId')) {
    const eventExternalId = getMetadata('eventExternalId');
    // split the eventExternalId by - and get the last part
    mczId = eventExternalId.replace('-', '').toLowerCase();
  }

  await CheckResourceLocation(el, resourceWatch, resourceLocation, mczId);

  async function mczMarketoFormAdobeConnectEvent() {
    if (window.mcz_marketoForm_pref?.form?.success?.type === 'adobe_connect') {
      const { metadataStore } = await import('../../features/timing-framework/plugins/metadata/plugin.js');

      const eventUrl = window.mcz_marketoForm_pref?.form?.success?.content;
      setMetadata('adobe-connect-url', eventUrl);
      metadataStore.set(key, 'adobe-connect');

      console.log('Marketo form completed - Adobe Connect URL:', eventUrl);
    }
  }

  // Debounce function to limit rapid calls
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Debounced callback for observer
  const debouncedCallback = debounce(() => {
    const status = el.getAttribute('data-mcz-dl-status');

    // TODO: remove this console.log post validation with marketo integration.
    console.log('Attribute "data-mcz-dl-status" changed to', status);
    if (status === 'active') {
      mczMarketoFormAdobeConnectEvent();
    }
  }, 300); // 300ms debounce delay

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        debouncedCallback();
      }
    });
  });

  observer.observe(el, {
    attributes: true, // Observe attribute changes
    attributeFilter: ['data-mcz-dl-status'], // Optional: filter specific attributes
  });
}
