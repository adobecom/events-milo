import { parseMetadataPath } from '../../../../scripts/utils.js';

const store = new Map();
const channel = new BroadcastChannel('metadata-store');

export const metadataStore = {
  get(key) {
    return store.get(key);
  },

  set(key, value) {
    store.set(key, value);
    channel.postMessage({ key, value });
  },

  getAll() {
    return Object.fromEntries(store);
  },
};

export default function init(schedule) {
  const allMetadataInSchedules = schedule.filter((entry) => entry.metadata);
  allMetadataInSchedules.forEach((metadata) => {
    metadata.forEach((m) => {
      const value = parseMetadataPath(metadata.key);
      metadataStore.set(m.key, value);
    });
  });

  return metadataStore;
}
