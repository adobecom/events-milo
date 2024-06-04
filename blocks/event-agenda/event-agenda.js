import { getLibs } from '../../scripts/utils.js';

const { createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`);

export default async function init(el) {
  const container = createTag('div', { class: 'agenda-container' }, '', { parent: el });
  const agendaItemsCol = createTag('div', { class: 'agenda-items-col' }, '', { parent: container });
  const agendaMeta = getMetadata('agenda');

  if (!agendaMeta) return;

  const agendaArray = JSON.parse(agendaMeta);

  agendaArray.forEach((a) => {
    const agendaItemWrapper = createTag('div', { class: 'agenda-item-wrapper' }, '', { parent: agendaItemsCol });
    createTag('span', { class: 'agenda-time' }, a.startTime, { parent: agendaItemWrapper });
    createTag('span', { class: 'agenda-desciption' }, a.description, { parent: agendaItemWrapper });
  });
}
