import { getLibs } from '../../scripts/utils.js';
import { generateToolTip } from '../../utils/utils.js';
import buildCarousel from './carousel.js'; // Adjust the import path as needed

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

function decorateImage(cardContainer, imgSrc, variant, position = 'left') {
  const imgElement = createTag('img', {
    src: imgSrc,
    alt: 'Card Image',
    class: 'card-image'
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

  decorateImage(cardContainer, data.speakerImage, '1', position);
  decorateContent(cardContainer, data);

  cardsWrapper.append(cardContainer);
}

async function decorate3up(data, cardsWrapper) {
  const promises = data.map(async speaker => {
    const cardContainer = createTag('div', { class: 'card-container' });

    decorateImage(cardContainer, speaker.speakerImage);
    decorateContent(cardContainer, speaker);

    cardsWrapper.append(cardContainer);
  });
  await Promise.all(promises);
}

async function decorateDouble(data, cardsWrapper) {
  const promises = data.map(async speaker => {
    const cardContainer = createTag('div', { class: 'card-container card-double' });

    decorateImage(cardContainer, speaker.speakerImage, 'double');
    decorateContent(cardContainer, speaker);

    cardsWrapper.append(cardContainer);
  });
  await Promise.all(promises);
}

function decorateSocialIcons(cardContainer, socialLinks) {
  const iconMapping = {
    instagram: 'instagram.svg',
    facebook: 'facebook.svg',
    twitter: 'twitter.svg',
    youtube: 'youtube.svg'
  };

  const socialIconsContainer = createTag('div', { class: 'card-social-icons' });
  console.log('Social Links:', socialLinks);

  socialLinks.forEach(link => {
    const keyword = Object.keys(iconMapping).find(key => link.toLowerCase().includes(key));
    if (keyword) {
      const icon = createTag('img', {
        src: `/icons/${iconMapping[keyword]}`,
        alt: `${keyword} icon`,
        class: 'social-icon'
      });

      const linkElement = createTag('a', {
        href: link,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
      linkElement.append(icon);
      socialIconsContainer.append(linkElement);
    }
  });

  if (socialIconsContainer.children.length > 0) {
    cardContainer.append(socialIconsContainer);
  } else {
    console.warn('No valid social icons found for:', socialLinks);
  }
}

async function decorateCards(data, cardsWrapper, dataFull) {
  if (data.length === 1) {
    const position = (dataFull.length === 2 && data[0].speakerType === "speaker") ? 'right' : 'left';
    decorate1up(data[0], cardsWrapper, position);
    cardsWrapper.classList.add('c1up');
  } else if (data.length === 2) {
    const host = data.find(speaker => speaker.speakerType === 'host');
    const speaker = data.find(speaker => speaker.speakerType === 'speaker');
    if (host && speaker) {
      decorate1up(host, cardsWrapper, 'left');
      decorate1up(speaker, cardsWrapper, 'right');
    } else {
      await decorateDouble(data, cardsWrapper);
      cardsWrapper.classList.add('cdouble');
    }
  } else if (data.length <= 3) {
    await decorate3up(data, cardsWrapper);
    cardsWrapper.classList.add('c3up');
  } else {
    await decorate3up(data, cardsWrapper);
    cardsWrapper.classList.add('carousel');
    await buildCarousel('.card-container', cardsWrapper, { infinityScrollEnabled: false });
  }
}

export default async function init(el) {
  const miloLibs = getLibs();
  await Promise.all([
    import(`${miloLibs}/deps/lit-all.min.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/textfield.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/checkbox.js`),
  ]);

  try {
    const response = await fetch('/blocks/profile-card/speakers/speakers.json'); // Adjust the path to your local JSON file
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rows = [...el.querySelectorAll(':scope > div')];
    const cols = rows[0].querySelectorAll(':scope > div');
    const speakertype = cols[1].textContent.toLowerCase().trim();
    const data = await response.json();

    const filteredData = data.filter(speaker => speaker.speakerType === speakertype);

    el.classList.add('form-component');
    el.innerHTML = "";
    generateToolTip(el);

    const cardsWrapper = createTag('div', { class: 'cards-wrapper' });
    el.append(cardsWrapper);

    await decorateCards(filteredData, cardsWrapper, data);
  } catch (error) {
    console.error('Error fetching or parsing JSON:', error);
  }
}
