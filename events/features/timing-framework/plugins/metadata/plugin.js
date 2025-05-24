import { getMetadata } from '../../../../scripts/utils.js';

export const metadataStore = new Map();

export default function init(schedule) {
  const allMetadataInSchedules = schedule.filter((entry) => entry.metadata);
  allMetadataInSchedules.forEach((metadata) => {
    metadata.forEach((m) => {
      metadataStore.set(m.key, getMetadata(metadata.key));
    });
  });

  return metadataStore;
}
