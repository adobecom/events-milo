export default async function init(el) {
  const mediaBlocks = el.querySelectorAll('.media');

  if (Array.from(mediaBlocks).every((b) => b.className.includes('rounded-corners'))) el.classList.add('contained');

  mediaBlocks.forEach((blade, i) => {
    blade.classList.remove('media-reverse-mobile');
    if (Math.abs(i % 2) === 1) blade.classList.add('media-reversed');
  });
}
