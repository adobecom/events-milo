import { LIBS } from '../../scripts/utils.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

export default async function init(el) {
  const h2 = el.querySelector('h2');
  let url = h2?.textContent;
  url += '&mkto_trk=abcs';
  h2.remove();
  createTag('iframe', { src: url, frameborder: '0', allowfullscreen: 'true', class: 'fullwidth' }, '', { parent: el });
}
