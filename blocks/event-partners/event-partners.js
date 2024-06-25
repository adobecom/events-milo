import { getLibs } from '../../events/scripts/utils.js';

const { createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`);

export default function init(el) {
  let partnersData;

  try {
    partnersData = JSON.parse(getMetadata('partners'));
  } catch (error) {
    window.lana?.log('Failed to parse partners metadata:', error);
    el.remove();
    return;
  }

  if (!partnersData || !partnersData.length) {
    el.remove();
    return;
  }

  const eventPartners = createTag('div', { class: 'event-partners images' });

  partnersData.forEach((partner) => {
    const logoWrapper = createTag('div', { class: 'event-partners logo' });
    createTag('img', { src: `${partner.imageUrl}` }, '', { parent: logoWrapper });

    if (partner.externalLink) {
      const aTag = createTag('a', { href: partner.externalLink }, '', { parent: eventPartners });
      eventPartners.append(aTag);
      aTag.append(logoWrapper);
    } else {
      eventPartners.append(logoWrapper);
    }
  });

  el.append(eventPartners);
}

export { init };
