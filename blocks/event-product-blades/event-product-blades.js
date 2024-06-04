export default async function init(el) {
  const mediaBlocks = el.querySelectorAll('.media');

  mediaBlocks.forEach((blade, i) => {
    if (i % 2 === 0) blade.classList.add('reverse');
  });
}
