import { getLibs } from '../../scripts/utils.js';
import { createOptimizedPicture } from '../../utils/utils.js';

const { createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`);

export default async function init(el) {
  const container = createTag('div', { class: 'agenda-container' }, '', { parent: el });
  const agendaItemsCol = createTag('div', { class: 'agenda-items-col' }, '', { parent: container });
  const venueImageCol = createTag('div', { class: 'venue-img-col' }, '', { parent: container });
  const agendaMeta = getMetadata('agenda');
  const venueImage = getMetadata('venue-image');

  if (!agendaMeta) return;

  const agendaArray = JSON.parse(agendaMeta);

  if (agendaArray.length <= 0) {
    el.remove();
    return;
  }

  if (venueImage) {
    el.classList.add('blade');
    const h2 = el.querySelector('h2');
    agendaItemsCol.prepend(h2);
    venueImageCol.append(createOptimizedPicture(venueImage));
  }

  agendaArray.forEach((a) => {
    const agendaItemWrapper = createTag('div', { class: 'agenda-item-wrapper' }, '', { parent: agendaItemsCol });
    createTag('span', { class: 'agenda-time' }, a.startTime, { parent: agendaItemWrapper });
    createTag('span', { class: 'agenda-desciption' }, a.description, { parent: agendaItemWrapper });
  });
}
