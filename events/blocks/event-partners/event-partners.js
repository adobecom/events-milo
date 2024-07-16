import { getSponsor } from '../../scripts/esp-controller.js';
import { LIBS } from '../../scripts/scripts.js';

const { createTag, getMetadata } = await import(`${LIBS}/utils/utils.js`);

export default function init(el) {
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
    if (!partner.name) {
      // FIXME: temp solution for non-hydrated partners
      const { seriesId } = JSON.parse(getMetadata('series'));
      getSponsor(seriesId, partner.sponsorId).then((pd) => {
        if (pd.image) {
          createTag('img', { src: `${pd.image.sharepointUrl || pd.image.imageUrl}`, alt: pd.image.altText }, '', { parent: logoWrapper });
        }

        if (pd.link) {
          const aTag = createTag('a', { href: pd.link, target: '_blank', title: pd.name }, '', { parent: eventPartners });
          eventPartners.append(aTag);
          aTag.append(logoWrapper);
        } else {
          eventPartners.append(logoWrapper);
        }
      });
    } else {
      if (partner.image) {
        createTag('img', { src: `${partner.image.sharepointUrl || partner.image.imageUrl}`, alt: partner.image.altText }, '', { parent: logoWrapper });
      }

      if (partner.link) {
        const aTag = createTag('a', { href: partner.link, target: '_blank', title: partner.name }, '', { parent: eventPartners });
        eventPartners.append(aTag);
        aTag.append(logoWrapper);
      } else {
        eventPartners.append(logoWrapper);
      }
    }
  });

  el.append(eventPartners);
}
