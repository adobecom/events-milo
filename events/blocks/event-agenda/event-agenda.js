import { LIBS } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../utils/utils.js';

const { createTag, getMetadata } = await import(`${LIBS}/utils/utils.js`);

export default async function init(el) {
  const container = createTag('div', { class: 'agenda-container' }, '', { parent: el });
  const agendaItemsCol = createTag('div', { class: 'agenda-items-col' }, '', { parent: container });

  const agendaMeta = getMetadata('agenda');
  let venueImage;

  try {
    venueImage = JSON.parse(getMetadata('photos')).find((p) => p.imageKind === 'venue-image');
  } catch (error) {
    window.lana?.log('Failed to parse venue image metadata:', error);
  }

  if (!agendaMeta) return;

  let agendaArray;

  try {
    agendaArray = JSON.parse(agendaMeta);
  } catch (error) {
    window.lana?.log('Failed to parse agenda metadata:', error);
    el.remove();
    return;
  }

  if (agendaArray.length <= 0) {
    el.remove();
    return;
  }

  if (venueImage) {
    const venueImageCol = createTag('div', { class: 'venue-img-col' });
    el.classList.add('blade');
    const h2 = el.querySelector('h2');
    agendaItemsCol.prepend(h2);
    venueImageCol.append(createOptimizedPicture(venueImage.imageUrl, venueImage.altText || 'Venue Image'));
    container.append(venueImageCol);
  }

  agendaArray.forEach((a) => {
    const agendaItemWrapper = createTag('div', { class: 'agenda-item-wrapper' }, '', { parent: agendaItemsCol });
    createTag('span', { class: 'agenda-time' }, a.startTime, { parent: agendaItemWrapper });
    createTag('span', { class: 'agenda-desciption' }, a.description, { parent: agendaItemWrapper });
  });
}
