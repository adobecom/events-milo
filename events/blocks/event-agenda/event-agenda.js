import { LIBS, createOptimizedPicture } from '../../scripts/utils.js';

const { createTag, getMetadata, getConfig } = await import(`${LIBS}/utils/utils.js`);

export function convertToLocaleTimeFormat(time, locale) {
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

  if (!agendaMeta) {
    el.remove();
    return;
  }

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
    let spUrlObj;
    let imgUrl = venueImage.imageUrl;

    if (venueImage.sharepointUrl?.startsWith('https://')) {
      try {
        spUrlObj = new URL(venueImage.sharepointUrl);
        imgUrl = spUrlObj.pathname;
      } catch (e) {
        window.lana?.log('Error while parsing SharePoint URL:', e);
      }
    } else {
      imgUrl = venueImage.sharepointUrl || venueImage.imageUrl;
    }

    const venueImageCol = createTag('div', { class: 'venue-img-col' });
    el.classList.add('blade');

    venueImageCol.append(createOptimizedPicture(imgUrl, venueImage.altText || '', false));
    container.append(venueImageCol);
  }

  const h2 = el.querySelector('h2');
  agendaItemsCol.prepend(h2);

  const localeString = getConfig().locale?.ietf || 'en-US';

  const agendaItemContainer = createTag('div', { class: 'agenda-item-container' }, '', { parent: agendaItemsCol });
  agendaArray.forEach((agenda) => {
    if(agenda.title && agenda.title !== '') {
      const agendaListItem = createTag('div', { class: 'agenda-list-item' }, '', { parent: agendaItemContainer });
      const agaendaTimeTitle = createTag('div', { class: 'agenda-time-title' }, '', { parent: agendaListItem });
      createTag('span', { class: 'agenda-time' }, convertToLocaleTimeFormat(agenda.startTime, localeString), { parent: agaendaTimeTitle });
      createTag('div', { class: 'agenda-separator' }, '', { parent: agaendaTimeTitle });
      createTag('span', { class: 'agenda-title' }, agenda.title, { parent: agaendaTimeTitle });
      createTag('div', { class: 'agenda-details' }, agenda.description, { parent: agendaListItem });
    } else {
      const agendaItemWrapper = createTag('div', { class: 'agenda-item-wrapper' }, '', { parent: agendaItemContainer });
      createTag('span', { class: 'agenda-time' }, convertToLocaleTimeFormat(agenda.startTime, localeString), { parent: agendaItemWrapper });
      createTag('span', { class: 'agenda-desciption' }, agenda.description, { parent: agendaItemWrapper });
    }
  });
}
