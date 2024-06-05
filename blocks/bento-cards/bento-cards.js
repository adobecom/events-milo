import buildMiloCarousel from '../../features/milo-carousel.js';
import { getLibs } from '../../scripts/utils.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);
const { decorateButtons } = await import(`${getLibs()}/utils/decorate.js`);

export default async function init(el) {
  decorateButtons(el);
  const rows = el.querySelectorAll(':scope > div');
  el.classList.add(`show-${rows.length}`);
  let cards = [];

  rows.forEach((r) => {
    const rowCards = r.querySelectorAll(':scope > div');
    r.classList.add('bento-cards-wrapper');
    if (rowCards.length > 1) r.classList.add(`multi-card-${rowCards.length}`);

    cards = [...cards, ...Array.from(rowCards)];
  });

  cards.forEach((card) => {
    card.classList.add('bento-card');

    const topHalf = createTag('div', { class: 'bento-card-top' });

    const icon = card.querySelector(':scope > p:first-of-type');
    const bgImg = card.querySelector(':scope > p:last-of-type:has(picture)');

    if (icon) icon.classList.add('bento-mnemonics');
    if (bgImg) bgImg.classList.add('bento-background');

    card.prepend(topHalf);
    card.querySelectorAll(':scope > p, :scope > h3').forEach((e) => {
      if (e !== bgImg) topHalf.append(e);
    });
  });

  const desktopMQL = window.matchMedia('(min-width: 1440px)');

  if (!desktopMQL.matches) {
    buildMiloCarousel(el, Array.from(rows));
  }

  const staticEl = el.cloneNode(true);
  desktopMQL.onchange = (e) => {
    if (e.matches) {
      el.innerHTML = staticEl.innerHTML;
    } else {
      buildMiloCarousel(el, Array.from(rows));
    }
  };
}
