import { getMetadata, LIBS } from '../../scripts/utils.js';

async function getPromotionalContent() {
  let promotionalItems = [];
  const eventPromotionalItemsMetadata = getMetadata('promotional-items');
  if (eventPromotionalItemsMetadata) {
    try {
      promotionalItems = JSON.parse(eventPromotionalItemsMetadata);
    } catch (error) {
      window.lana?.log(`Error parsing promotional items: ${JSON.stringify(error)}`);
      return promotionalItems;
    }
  }
  const { getConfig, getLocale } = await import(`${LIBS}/utils/utils.js`);
  const { prefix } = getLocale(getConfig().locales);
  const { data } = await fetch(`${prefix}/events/default/promotional-content.json`).then((res) => res.json());

  if (!data) {
    window.lana?.log(`Error: No promotional content found in ${prefix}/events/default/promotional-content.json`);
    return [];
  }

  const rehydratedPromotionalItems = promotionalItems.map((item) => {
    const promotionalItem = data.find((content) => content.name === item);
    return promotionalItem;
  });

  return rehydratedPromotionalItems;
}

function addMediaReversedClass(el) {
  const mediaBlocks = el.querySelectorAll('.media');
  mediaBlocks.forEach((blade, i) => {
    blade.classList.remove('media-reverse-mobile');
    if (Math.abs(i % 2) === 1) {
      blade.classList.add('media-reversed');
    }
  });
}

export default async function init(el) {
  const promotionalItems = await getPromotionalContent();
  if (!promotionalItems.length) return;

  const [{ default: loadFragment }, { createTag }] = await Promise.all([
    import(`${LIBS}/blocks/fragment/fragment.js`),
    import(`${LIBS}/utils/utils.js`),
  ]);

  const fragmentPromotionalItemsPromises = promotionalItems.map(async (item) => {
    const fragmentPath = item['fragment-path'];
    if (!fragmentPath) return;

    const fragmentLink = createTag('a', { href: fragmentPath }, '', { parent: el });
    await loadFragment(fragmentLink);
  });

  await Promise.all(fragmentPromotionalItemsPromises);
  addMediaReversedClass(el);
}
