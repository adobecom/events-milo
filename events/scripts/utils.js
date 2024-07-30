function createTag(tag, attributes, html, options = {}) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
      || html instanceof SVGElement
      || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  options.parent?.append(el);
  return el;
}

export function yieldToMain() {
  return new Promise((r) => {
    setTimeout(r, 0);
  });
}

export function getMetadata(name, doc = document) {
  const attr = name && name.includes('og:') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

export function setMetadata(name, value, doc = document) {
  const attr = name && name.includes('og:') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);

  if (name === 'title') document.title = value;

  if (meta && meta.content !== value) {
    meta.content = value;
  } else {
    const newMeta = doc.createElement('meta');
    newMeta.setAttribute(attr, name);
    newMeta.content = value;
    doc.head.appendChild(newMeta);
  }
}

export function handlize(str) {
  return str.toLowerCase().trim().replaceAll(' ', '-');
}

export function flattenObject(obj, parentKey = '', result = {}) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (key === 'arbitrary' && Array.isArray(value)) {
      value.forEach((item) => {
        const itemKey = `${newKey}.${item.key}`;
        result[itemKey] = item.value;
      });
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && !Array.isArray(item) && key !== 'arbitrary') {
          flattenObject(item, `${newKey}[${index}]`, result);
        } else {
          result[`${newKey}[${index}]`] = item;
        }
      });
    } else {
      result[newKey] = value;
    }
  });

  return result;
}

export function createOptimizedPicture(
  src,
  alt = '',
  relative = true,
  eager = false,
  breakpoints = [{ media: '(min-width: 400px)', width: '2000' }, { width: '750' }],
) {
  let url;

  if (relative) {
    url = new URL(src);
  } else {
    url = new URL(src, window.location.href);
  }

  const picture = document.createElement('picture');
  const { pathname, href } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${relative ? pathname : href}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${relative ? pathname : href}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('src', `${relative ? pathname : href}?width=${br.width}&format=${ext}&optimize=medium`);
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
    }
  });

  return picture;
}

export function addTooltipToHeading(em, heading) {
  const tooltipText = em.textContent.trim();
  const toolTipIcon = createTag('span', { class: 'event-heading-tooltip-icon' }, 'i');
  const toolTipBox = createTag('div', { class: 'event-heading-tooltip-box' }, tooltipText);
  const toolTipWrapper = createTag('div', { class: 'event-heading-tooltip-wrapper' });

  toolTipWrapper.append(toolTipIcon, toolTipBox);
  heading.append(toolTipWrapper);
  em.parentElement?.remove();
}

export function generateToolTip(formComponent) {
  const heading = formComponent.querySelector(':scope > div:first-of-type h2, :scope > div:first-of-type h3');

  if (heading) {
    const em = formComponent.querySelector('p > em');

    if (em) {
      addTooltipToHeading(em, heading);
    }
  }
}

export function getIcon(tag) {
  const img = document.createElement('img');
  img.className = `icon icon-${tag}`;
  img.src = `/events/icons/${tag}.svg`;
  img.alt = tag;

  return img;
}
