import { CheckResourceLocation } from '../../../rs/360-KCI-804/images/mktoTestFormConfig.js';

export default async function init(el) {
  const rows = Array.from(el.children);
  const resourceLocation = `#${rows[0].textContent.trim().toLowerCase()}`;
  const resourceWatch = 'main .section .chrono-box';

  el.innerHTML = '';
  await CheckResourceLocation(el, resourceWatch, resourceLocation);
}