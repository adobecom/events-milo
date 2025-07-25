// import { LIBS } from '../../scripts/utils.js';
import { checkResourceLocation } from '../../../rs/360-KCI-804/images/mktoTestFormConfig.js';

// const { createTag, getMetadata } = await import(`${LIBS}/utils/utils.js`);



export default async function init(el) {
  const resourceLocation = '.chrono-box';
  const resourceWatch = 'main .section .chrono-box';
  await checkResourceLocation(el, resourceWatch, resourceLocation);
}