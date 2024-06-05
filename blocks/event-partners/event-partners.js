import { getLibs } from '../../scripts/utils.js';

const { createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`);

export default function init(el) {
  const partnersData = JSON.parse(getMetadata('partners'));

  const eventPartnersSection = createTag('section', { class: 'event-partners images' });

  partnersData.forEach((partner) => {
    const aTag = createTag('a', { href: `${partner.externalLink}` }, '', { parent: eventPartnersSection });

    const article = createTag('article', { class: 'event-partners logo' }, '', { parent: aTag });
    createTag('img', { src: `${partner.imageUrl}` }, '', { parent: article });

    eventPartnersSection.append(aTag);
  });

  el.append(eventPartnersSection);
}

export { init };
