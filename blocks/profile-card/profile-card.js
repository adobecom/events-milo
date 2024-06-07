import { getLibs, checkProfileCard } from '../../scripts/utils.js';
import buildMiloCarousel from '../../features/milo-carousel.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

function decorateImage(cardContainer, imgSrc, variant, position = 'left', altText) {
  const imgElement = createTag('img', {
    src: imgSrc,
    alt: altText,
    class: 'card-image',
  });

  const imgContainer = createTag('div', { class: 'card-image-container' });
  imgContainer.append(imgElement);

  if (variant === '1') {
    if (position === 'left') {
      cardContainer.classList.add('card-1up-left');
      cardContainer.insertBefore(imgContainer, cardContainer.firstChild);
    } else if (position === 'right') {
      cardContainer.classList.add('card-1up-right');
      cardContainer.appendChild(imgContainer);
    }
  } else {
    cardContainer.append(imgContainer);
  }
}

export async function getSVGsfromFile(path, selectors) {
  if (!path) return null;
  const resp = await fetch(path);
  if (!resp.ok) return null;

  const text = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'image/svg+xml');

  if (!selectors) {
    const svg = doc.querySelector('svg');
    if (svg) return [{ svg }];
    return null;
  }

  if (!(selectors instanceof Array)) {
    // eslint-disable-next-line no-param-reassign
    selectors = [selectors];
  }

  return selectors.map((selector) => {
    const symbol = doc.querySelector(`#${selector}`);
    if (!symbol) return null;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    while (symbol.firstChild) svg.appendChild(symbol.firstChild);
    [...symbol.attributes].forEach((attr) => svg.attributes.setNamedItem(attr.cloneNode()));
    svg.classList.add('icon');
    svg.classList.add(`icon-${selector}`);
    svg.removeAttribute('id');
    return { svg, name: selector };
  });
}

async function decorateSocialIcons(cardContainer, socialLinks) {
  const SUPPORTED_SOCIAL = ['instagram', 'facebook', 'twitter', 'youtube'];
  const svgPath = '/icons/social-icons.svg';
  const socialList = createTag('ul', { class: 'card-social-icons' });

  const svgEls = await getSVGsfromFile(svgPath, SUPPORTED_SOCIAL);
  if (!svgEls || svgEls.length === 0) return;

  socialLinks.forEach((link) => {
    const platform = SUPPORTED_SOCIAL.find((p) => link.toLowerCase().includes(p));
    const svg = svgEls.find((el) => el.name === platform);
    if (!platform || !svg) return;
    const icon = svg.svg;
    const li = createTag('li', { class: 'card-social-icon' });
    icon.classList.add('card-social-icon');
    icon.setAttribute('alt', `${platform} logo`);
    icon.setAttribute('height', 20);
    icon.setAttribute('width', 20);

    const a = createTag('a', {
      href: link,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': platform
    });
    a.textContent = '';
    a.append(icon);
    li.append(a);
    socialList.append(li);
  });

  if (socialList.children.length > 0) {
    cardContainer.append(socialList);
  } else {
    console.warn('No valid social icons found for:', socialLinks);
  }
}

function decorateContent(cardContainer, data) {
  const contentContainer = createTag('div', { class: 'card-content' });

  const textContainer = createTag('div', { class: 'card-text-container' });
  const title = createTag('p', { class: 'card-title' }, data.title);
  const name = createTag('h2', { class: 'card-name' }, `${data.firstName} ${data.lastName}`);
  const description = createTag('p', { class: 'card-desc' }, data.bio);

  textContainer.append(title, name, description);
  contentContainer.append(textContainer);

  decorateSocialIcons(contentContainer, data.socialLinks || []);

  cardContainer.append(contentContainer);
}

function decorate1up(data, cardsWrapper, position = 'left') {
  const cardContainer = createTag('div', { class: 'card-container card-1up' });

  decorateImage(cardContainer, data.speakerImage, '1', position, data.altText);
  decorateContent(cardContainer, data);

  cardsWrapper.append(cardContainer);
}

async function decorate3up(data, cardsWrapper) {
  data.forEach((speaker) => {
    const cardContainer = createTag('div', { class: 'card-container' });

    decorateImage(cardContainer, speaker.speakerImage);
    decorateContent(cardContainer, speaker);

    cardsWrapper.append(cardContainer);
  });
}

async function decorateDouble(data, cardsWrapper) {
  data.forEach((speaker) => {
    const cardContainer = createTag('div', { class: 'card-container card-double' });

    decorateImage(cardContainer, speaker.speakerImage, 'double');
    decorateContent(cardContainer, speaker);

    cardsWrapper.append(cardContainer);
  });
}

async function decorateCards(data, cardsWrapper, dataFull, firstSpeaker) {
  if (data.length === 1) {
    const position = (dataFull.length === 2 && firstSpeaker !== data[0].speakerType) ? 'right' : 'left';
    decorate1up(data[0], cardsWrapper, position);
    cardsWrapper.classList.add('c1up');
  } else if (data.length === 2) {
    await decorateDouble(data, cardsWrapper);
    cardsWrapper.classList.add('cdouble');
  } else if (data.length <= 3) {
    await decorate3up(data, cardsWrapper);
    cardsWrapper.classList.add('c3up');
  } else {
    await decorate3up(data, cardsWrapper);
    cardsWrapper.classList.add('carousel-plugin', 'show-3');

    // buildMiloCarousel(cardsWrapper, Array.from(cardsWrapper.querySelectorAll('.card-container')));
  }
}

export default async function init(el) {
  try {
    const response = await fetch('/blocks/profile-card/speakers/speakers.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const firstSpeaker = checkProfileCard();
    const rows = [...el.querySelectorAll(':scope > div')];
    const cols = rows[0].querySelectorAll(':scope > div');
    const speakertype = cols[1].textContent.toLowerCase().trim();
    const data = await response.json();

    const filteredData = data.filter((speaker) => speaker.speakerType === speakertype);

    el.innerHTML = '';

    const cardsWrapper = createTag('div', { class: 'cards-wrapper' });
    el.append(cardsWrapper);

    await decorateCards(filteredData, cardsWrapper, data, firstSpeaker);
  } catch (error) {
    console.error('Error fetching or parsing JSON:', error);
  }
}