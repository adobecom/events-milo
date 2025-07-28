import { LIBS } from '../../scripts/utils.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

export default async function init(el) {
  const rows = Array.from(el.children);
  const idName = `#${rows[0].textContent.trim().toLowerCase()}`;

  el.innerHTML = '';
  createTag('div', { id: idName, class: 'marketo-form-ui' }, '', { parent: el });
}
