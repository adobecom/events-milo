import { CheckResourceLocation } from '../../../rs/360-KCI-804/images/mktoTestFormConfig.js';

export default async function init(el) {
  const rows = Array.from(el.children);
  const resourceLocation = `#${rows[0].textContent.trim().toLowerCase()}`;

  const resourceWatch = 'main .section .chrono-box';

  el.innerHTML = '';

  el.setAttribute('data-mcz-dl-status', 'loading');

  await CheckResourceLocation(el, resourceWatch, resourceLocation);

  function mczMarketoFormAdobeConnectEvent() {
    if (window.mcz_marketoForm_pref?.form?.success?.type === 'adobe_connect') {
      const eventUrl = window.mcz_marketoForm_pref?.form?.success?.content;

      // Dispatch custom event for any systems that want to listen
      const customEvent = new CustomEvent('marketo-form-completed', {
        detail: {
          type: 'adobe_connect',
          url: eventUrl,
          formData: window.mcz_marketoForm_pref?.form || {},
          timestamp: Date.now(),
        },
        bubbles: true,
        cancelable: false,
      });

      // Dispatch on document for global listening
      document.dispatchEvent(customEvent);

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
    console.log(
      'Attribute "data-mcz-dl-status" changed to',
      el.getAttribute('data-mcz-dl-status'),
    );
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
