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

function createCard(event) {
  const card = document.createElement('div');
  card.classList.add('event-card');

  const cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');
  const img = document.createElement('img');
  img.src = event.image;
  img.alt = event.title;

  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  const title = document.createElement('h3');
  title.classList.add('card-title');
  title.textContent = event.title;

  const description = document.createElement('p');
  description.classList.add('card-description');
  description.textContent = event.description;

  const details = document.createElement('div');
  details.classList.add('card-details');
  details.innerHTML = `<span>${event.date}</span>`;

  const viewEvent = document.createElement('a');
  viewEvent.classList.add('consonant-BtnInfobit');
  viewEvent.href = '#';

  const buttonText = document.createElement('span');
  buttonText.textContent = 'View Event';
  viewEvent.appendChild(buttonText);

  cardHeader.appendChild(img);
  cardContent.appendChild(title);
  cardContent.appendChild(description);
  cardContent.appendChild(details);
  cardContent.appendChild(viewEvent);
  card.appendChild(cardHeader);
  card.appendChild(cardContent);

  return card;
}

function displayCards(events, container) {
  events.forEach((event) => {
    const card = createCard(event);
    container.appendChild(card);
  });
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
    const h2 = el.querySelector('h2');
    agendaItemsCol.prepend(h2);

    venueImageCol.append(createOptimizedPicture(imgUrl, venueImage.altText || '', false));
    container.append(venueImageCol);
  }

  const localeString = getConfig().locale?.ietf || 'en-US';

  agendaArray.forEach((a) => {
    const agendaItemWrapper = createTag('div', { class: 'agenda-item-wrapper' }, '', { parent: agendaItemsCol });
    createTag('span', { class: 'agenda-time' }, convertToLocaleTimeFormat(a.startTime, localeString), { parent: agendaItemWrapper });
    createTag('span', { class: 'agenda-desciption' }, a.description, { parent: agendaItemWrapper });
  });

  const events = [
    {
      title: 'Event 1',
      description: 'This is a detailed description for event 1 that explains what the event is about.',
      image: 'https://via.placeholder.com/300x150.png?text=Event+1',
      date: 'Fri, Aug 09 | 02:00 AM - 04:30 AM GMT+5:30'
    },
    {
      title: 'Event 2',
      description: 'This is a detailed description for event 2 that explains what the event is about.',
      image: 'https://via.placeholder.com/300x150.png?text=Event+2',
      date: 'Sat, Aug 10 | 03:00 AM - 05:30 AM GMT+5:30'
    },
    {
      title: 'Event 3',
      description: 'This is a detailed description for event 3 that explains what the event is about.',
      image: 'https://via.placeholder.com/300x150.png?text=Event+3',
      date: 'Sun, Aug 11 | 01:00 AM - 03:30 AM GMT+5:30'
    },
    {
      title: 'Event 4',
      description: 'This is a detailed description for event 4 that explains what the event is about.',
      image: 'https://via.placeholder.com/300x150.png?text=Event+4',
      date: 'Mon, Aug 12 | 04:00 AM - 06:30 AM GMT+5:30'
    },
  ];
  const tag = createTag('div', { class: 'dialog' });
  tag.append(createTag('div', { class: 'dialog-header' }, 'Find Similar Events'));
  const container2 = createTag('div', { class: 'carousel', id: 'card-container' });
  tag.append(container2);
  // Call the function to display cards
  displayCards(events, container2);
  el.append(tag);
}
