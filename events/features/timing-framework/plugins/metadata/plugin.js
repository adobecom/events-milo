import { parseMetadataPath, getCurrentTabId } from '../../../../scripts/utils.js';

const store = new Map();
const channel = new BroadcastChannel('metadata-store');

export const metadataStore = {
  get(key) {
    return store.get(key);
  },

  set(key, value) {
    const tabId = getCurrentTabId();
    store.set(key, value);
    channel.postMessage({ key, value, tabId });
  },

  getAll() {
    return Object.fromEntries(store);
  },
};

// Listen for custom events from other blocks
function setupCustomEventListeners() {
  // Listen for marketo-form completion events
  document.addEventListener('marketo-form-completed', (event) => {
    const { detail } = event;

    // Update metadata store based on event type
    if (detail.type === 'adobe_connect' && detail.url) {
      metadataStore.set('adobe-connect-url', detail.url);
      console.log('Metadata updated from marketo-form-completed event:', detail);
    }
  });
}

export default function init(schedule) {
  const allMetadataInSchedules = schedule.filter((entry) => entry.metadata);
  allMetadataInSchedules.forEach(({ metadata }) => {
    metadata.forEach((m) => {
      const value = parseMetadataPath(m.key);
      metadataStore.set(m.key, value);
    });
  });

  // Set up event listeners for custom events
  setupCustomEventListeners();

  return metadataStore;
}
