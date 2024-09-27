import buildMiloCarousel from '../../features/milo-carousel.js';
import { LIBS } from '../../scripts/utils.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);
const { decorateButtons } = await import(`${LIBS}/utils/decorate.js`);

export function isReversed(card) {
  const twoImgsStart = !!card.children[0]?.querySelector('img') && !!card.children[1]?.querySelector('img');
  return twoImgsStart;
}

export default async function init(el) {
  decorateButtons(el);
  const rows = el.querySelectorAll(':scope > div');
  el.classList.add(`show-${rows.length}`, 'container');
  let cards = [];

  rows.forEach((r) => {
    const rowCards = r.querySelectorAll(':scope > div');
    r.classList.add('bento-cards-wrapper');
    if (rowCards.length > 1) r.classList.add(`multi-card-${rowCards.length}`);

    cards = [...cards, ...Array.from(rowCards)];
  });

  cards.forEach((card) => {
    card.classList.add('bento-card');
    const content = createTag('div', { class: 'bento-card-content' });

    let icon;
    let bgImg;

    if (isReversed(card)) {
      card.classList.add('reversed');
      bgImg = card.querySelector(':scope > p:first-of-type:has(picture)');
      icon = card.querySelector(':scope > p:nth-of-type(2):has(picture)');
      card.append(content);
    } else {
      icon = card.querySelector(':scope > p:first-of-type:has(picture)');
      bgImg = card.querySelector(':scope > p:last-of-type:has(picture)');
      card.prepend(content);
    }

    if (icon) icon.classList.add('bento-mnemonics');
    if (bgImg) bgImg.classList.add('bento-background');

    card.querySelectorAll(':scope > p, :scope > h3').forEach((e) => {
      if (e !== bgImg) content.append(e);
    });
  });

  const desktopMQL = window.matchMedia('(min-width: 900px)');

  if (!desktopMQL.matches || rows.length >= 5) {
    buildMiloCarousel(el, Array.from(rows));
  }

  if (rows.length < 5) {
    const staticEl = el.cloneNode(true);
    desktopMQL.onchange = (e) => {
      if (e.matches) {
        el.innerHTML = staticEl.innerHTML;
      } else {
        buildMiloCarousel(el, Array.from(rows));
      }
    };
  }
}
