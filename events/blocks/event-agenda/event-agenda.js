import { LIBS } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/utils.js';

const { createTag, getMetadata, getConfig } = await import(`${LIBS}/utils/utils.js`);

function convertToLocaleTimeFormat(time, locale) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  const formatter = new Intl.DateTimeFormat(locale, options);

  return formatter.format(date);
}

export default async function init(el) {
  if (getMetadata('show-agenda-post-event') !== 'true' && document.body.classList.contains('timing-post-event')) {
    el.remove();
    return;
  }

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
    venueImageCol.append(createOptimizedPicture(venueImage.imageUrl, venueImage.altText || 'Venue Image', false));
    container.append(venueImageCol);
  }

  const localeString = getConfig().locale?.ietf || 'en-US';

  agendaArray.forEach((a) => {
    const agendaItemWrapper = createTag('div', { class: 'agenda-item-wrapper' }, '', { parent: agendaItemsCol });
    createTag('span', { class: 'agenda-time' }, convertToLocaleTimeFormat(a.startTime, localeString), { parent: agendaItemWrapper });
    createTag('span', { class: 'agenda-desciption' }, a.description, { parent: agendaItemWrapper });
  });
}
