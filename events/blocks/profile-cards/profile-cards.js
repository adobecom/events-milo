import { LIBS, MILO_CONFIG } from '../../scripts/scripts.js';
import buildMiloCarousel from '../../features/milo-carousel.js';
import { getMetadata } from '../../scripts/utils.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

function decorateImage(cardContainer, imgSrc, variant, altText, position = 'left') {
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

async function decorateSocialIcons(cardContainer, socialMedia) {
  const SUPPORTED_SOCIAL = ['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'pinterest', 'discord', 'behance'];
  const svgPath = `${MILO_CONFIG.codeRoot}/icons/social-icons.svg`;
  const socialList = createTag('ul', { class: 'card-social-icons' });

  const svgEls = await getSVGsfromFile(svgPath, SUPPORTED_SOCIAL);
  if (!svgEls || svgEls.length === 0) return;

  socialMedia.forEach((account) => {
    const { link } = account;
    const platform = SUPPORTED_SOCIAL.find((p) => link.toLowerCase().includes(p)) || 'social-media';
    const svg = svgEls.find((el) => el.name === platform);

    if (!svg) return;

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
      'aria-label': platform,
    });

    a.textContent = '';
    a.append(icon);
    li.append(a);
    socialList.append(li);
  });

  if (socialList.children.length > 0) {
    cardContainer.append(socialList);
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

  decorateSocialIcons(contentContainer, data.socialMedia || []);

  cardContainer.append(contentContainer);
}

function decorate1up(data, cardsWrapper, position = 'left') {
  const cardContainer = createTag('div', { class: 'card-container card-1up' });

  decorateImage(cardContainer, data.photo?.imageUrl, '1', data.altText, position);
  decorateContent(cardContainer, data);

  cardsWrapper.append(cardContainer);
}

async function decorate3up(data, cardsWrapper) {
  data.forEach((speaker) => {
    const cardContainer = createTag('div', { class: 'card-container' });

    decorateImage(cardContainer, speaker.photo?.imageUrl);
    decorateContent(cardContainer, speaker);

    cardsWrapper.append(cardContainer);
  });
}

function checkFirstProfileCardsBlockType() {
  const profileCards = document.querySelectorAll('div.profile-cards');

  if (profileCards.length > 0) {
    const firstProfileCard = profileCards[0];
    const innerDiv = firstProfileCard.querySelector('div');
    return innerDiv.textContent.trim();
  }
  return null;
}

function decorateDouble(data, cardsWrapper) {
  data.forEach((speaker) => {
    const cardContainer = createTag('div', { class: 'card-container card-double' });

    decorateImage(cardContainer, speaker.photo?.imageUrl, 'double');
    decorateContent(cardContainer, speaker);

    cardsWrapper.append(cardContainer);
  });
}

function decorateCards(el, data) {
  const cardsWrapper = el.querySelector('.cards-wrapper');
  const rows = el.querySelectorAll(':scope > div');
  const configRow = rows[1];
  const speakerType = configRow?.querySelectorAll(':scope > div')?.[1]?.textContent.toLowerCase().trim();
  const filteredData = data.filter((speaker) => speaker.speakerType?.toLowerCase() === speakerType);

  if (filteredData.length === 0) {
    el.remove();
    return;
  }

  const firstProfileCardsType = checkFirstProfileCardsBlockType();

  configRow.remove();

  if (filteredData.length === 1) {
    const position = (data.length === 2 && firstProfileCardsType.toLowerCase() !== filteredData[0].speakerType.toLowerCase()) ? 'right' : 'left';
    decorate1up(filteredData[0], cardsWrapper, position);
    cardsWrapper.classList.add('c1up');
  } else if (filteredData.length === 2) {
    decorateDouble(filteredData, cardsWrapper);
    cardsWrapper.classList.add('cdouble');
  } else if (filteredData.length === 3) {
    decorate3up(filteredData, cardsWrapper);
    cardsWrapper.classList.add('c3up');
  } else {
    decorate3up(filteredData, cardsWrapper);
    cardsWrapper.classList.add('carousel-plugin', 'show-3');
    el.classList.add('with-carousel');

    buildMiloCarousel(cardsWrapper, Array.from(cardsWrapper.querySelectorAll('.card-container')));
  }
}

export default function init(el) {
  let data;

  try {
    data = JSON.parse(getMetadata('speakers'));
  } catch (error) {
    window.lana?.log('Failed to parse speakers metadata:', error);
    return;
  }

  const cardsWrapper = createTag('div', { class: 'cards-wrapper' });
  el.append(cardsWrapper);

  decorateCards(el, data);
}
