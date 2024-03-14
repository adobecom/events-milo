import { getMetadata } from '../../utils/utils.js';

// data -> dom gills
async function autoUpdatePage(main) {
  if (!main) {
    window.lana?.log('page server block cannot find it\'s parent main');
    return;
  }

  const json = await fetch('/t3/event/default/metadata.json').then((resp) => {
    if (resp.ok) {
      return resp.json();
    }

    window.lana?.log('Error while attempting to fetch /t3/event/default/metadata.json');
    return null;
  });

  if (json) {
    const pageData = json.data.find((d) => d.url === window.location.pathname);
    const allElements = main.querySelectorAll('*');
    const bracketRegex = /\[\[(.*?)\]\]/g;
    allElements.forEach((element) => {
      if (element.childNodes.length) {
        element.childNodes.forEach((child) => {
          if (child.nodeType === 3) {
            const originalText = child.nodeValue;
            const replacedText = originalText.replace(bracketRegex, (_match, p1) => pageData[p1] || '');
            if (replacedText !== originalText) child.nodeValue = replacedText;
          }
        });
      }
    });
  }

  // handle link replacement
  main.querySelectorAll('a[href*="#"]').forEach((a) => {
    try {
      let url = new URL(a.href);
      if (getMetadata(url.hash.replace('#', ''))) {
        a.href = getMetadata(url.hash.replace('#', ''));
        url = new URL(a.href);
      }
    } catch (e) {
      window.lana?.log(`Error while attempting to replace link ${a.href}: ${e}`);
    }
  });
}

export default async function init(el) {
  await autoUpdatePage(el.closest('main'));
}
