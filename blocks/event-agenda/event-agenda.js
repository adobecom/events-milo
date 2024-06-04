import { getLibs } from '../../scripts/utils.js';

const { createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`);

export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [{ media: '(min-width: 400px)', width: '2000' }, { width: '750' }]) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
    }
  });

  return picture;
}

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
