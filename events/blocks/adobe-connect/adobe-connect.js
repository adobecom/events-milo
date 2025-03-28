import { LIBS } from '../../scripts/utils.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

export default async function init(el) {
  const h2 = el.querySelector('h2');
  const url = h2?.textContent;
  h2.remove();
  createTag('iframe', { src: url, frameborder: '0', allowfullscreen: 'true', class: 'fullwidth' }, '', { parent: el });
}
