import { LIBS } from '../../scripts/scripts.js';

const { createTag, getMetadata } = await import(`${LIBS}/utils/utils.js`);

export default function init(el) {
  if (getMetadata('show-event-sponsors') !== 'true') {
    el.remove();
    return;
  }

  let partnersData;

  try {
    // FIXME: sponsors !== partners
    partnersData = JSON.parse(getMetadata('sponsors'));
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
    eventPartners.append(logoWrapper);

    if (partner.image) {
      createTag('img', { src: `${partner.image.sharepointUrl || partner.image.imageUrl}`, alt: partner.image.altText }, '', { parent: logoWrapper });
    }

    if (partner.link) {
      const aTag = createTag('a', { href: partner.link, target: '_blank', title: partner.name }, '', { parent: eventPartners });
      eventPartners.append(aTag);
      aTag.append(logoWrapper);
    }
  });

  el.append(eventPartners);
}
