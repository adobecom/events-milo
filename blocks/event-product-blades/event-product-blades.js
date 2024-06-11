export default async function init(el) {
  const mediaBlocks = el.querySelectorAll('.media');

  mediaBlocks.forEach((blade, i) => {
    blade.classList.remove('media-reverse-mobile');
    if (Math.abs(i % 2) === 1) blade.classList.add('media-reversed');
  });
}
