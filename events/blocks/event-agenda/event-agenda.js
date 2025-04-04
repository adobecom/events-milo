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
  const agendaItemsCol = createTag('div', { class: 'agenda-items' }, '', { parent: container });

  const agendaMeta = getMetadata('agenda');
  let venueImage;

  try {
    venueImage = JSON.parse(getMetadata('photos')).find((p) => p.imageKind === 'venue-image');
  } catch (error) {
    window.lana?.log(`Failed to parse venue image metadata:\n${JSON.stringify(error, null, 2)}`);
  }

  if (!agendaMeta) {
    el.remove();
    return;
  }

  let agendaArray;

  try {
    agendaArray = JSON.parse(agendaMeta);
  } catch (error) {
    window.lana?.log(`Failed to parse agenda metadata:\n${JSON.stringify(error, null, 2)}`);
    el.remove();
    return;
  }

  if (agendaArray.length <= 0) {
    el.remove();
    return;
  }

  const h2 = el.querySelector('h2');
  agendaItemsCol.prepend(h2);

  if (venueImage) {
    let spUrlObj;
    let imgUrl = venueImage.imageUrl;

    if (venueImage.sharepointUrl?.startsWith('https://')) {
      try {
        spUrlObj = new URL(venueImage.sharepointUrl);
        imgUrl = spUrlObj.pathname;
      } catch (e) {
        window.lana?.log(`Error while parsing SharePoint URL:\n${JSON.stringify(e, null, 2)}`);
      }
    } else {
      imgUrl = venueImage.sharepointUrl || venueImage.imageUrl;
    }

    el.classList.add('blade');
    agendaItemsCol.classList.add('agenda-items-with-image');

    const venueImageCol = createTag('div', { class: 'venue-img-col' });
    venueImageCol.append(createOptimizedPicture(imgUrl, venueImage.altText || '', false));
    container.append(venueImageCol);
  } else if (agendaArray.length > 6) {
    container.classList.add('more-than-six');
  }

  const localeString = getConfig().locale?.ietf || 'en-US';

  const agendaItemContainer = createTag('div', { class: 'agenda-item-container' }, '', { parent: agendaItemsCol });
  const column1 = createTag('div', { class: 'column' }, '', { parent: agendaItemContainer });

  // Default to column1 if there is a venue image or agenda items are less than 6
  let column2 = column1;
  if (!venueImage && agendaArray.length > 6) {
    column2 = createTag('div', { class: 'column' }, '', { parent: agendaItemContainer });
  }

  const splitIndex = Math.ceil(agendaArray.length / 2);
  agendaArray.forEach((agenda, index) => {
    const agendaListItem = createTag('div', { class: 'agenda-list-item' }, '', { parent: (index >= splitIndex ? column2 : column1) });
    createTag('span', { class: 'agenda-time' }, convertToLocaleTimeFormat(agenda.startTime, localeString), { parent: agendaListItem });

    const agendaTitleDetailContainer = createTag('div', { class: 'agenda-title-detail-container' }, '', { parent: agendaListItem });
    const agendaTitleDetails = createTag('div', { class: 'agenda-title-detail' }, '', { parent: agendaTitleDetailContainer });
    if (agenda.title) {
      createTag('div', { class: 'agenda-title' }, agenda.title, { parent: agendaTitleDetails });
    }

    if (agenda.description) {
      createTag('div', { class: 'agenda-details' }, agenda.description, { parent: agendaTitleDetails });
    }
  });
}
