export default async function init(el) {
  const targetBlock = el.nextElementSibling;

  if (!targetBlock) {
    el.remove();
    return;
  }

  const daaConfig = {
    'daa-lh': '',
    links: [],
  };

  const rows = el.querySelectorAll(':scope > div');
  rows.forEach((row, index) => {
    if (index === 0) {
      const lh = row.textContent.trim();

      if (lh) daaConfig['daa-lh'] = lh;
    } else {
      const cols = row.querySelectorAll(':scope > div');

      if (cols.length === 2) {
        const [key, value] = cols;
        if (key.querySelector('a')) {
          daaConfig.links.push({
            value: value.textContent,
            href: key.querySelector('a').href,
          });
        }
      }
    }
  });

  if (daaConfig['daa-lh']) targetBlock.setAttribute('daa-lh', daaConfig['daa-lh']);

  daaConfig.links.forEach((link) => {
    const targetBlockLinks = targetBlock.querySelectorAll('a');
    targetBlockLinks.forEach((targetLink) => {
      if (targetLink.href !== link.href) return;
      targetLink.setAttribute('daa-ll', link.value);
    });
  });

  el.remove();
}
