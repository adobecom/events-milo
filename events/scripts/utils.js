import { SUSI_OPTIONS } from './constances.js';

export function createTag(tag, attributes, html, options = {}) {
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

export function getIcon(tag) {
  const img = document.createElement('img');
  img.className = `icon icon-${tag}`;
  img.src = `/events/icons/${tag}.svg`;
  img.alt = tag;

  return img;
}

function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

export function getSusiOptions(conf) {
  const { env: { name: envName } } = conf;
  const susiOptions = Object.keys(SUSI_OPTIONS).reduce((opts, key) => {
    opts[key] = SUSI_OPTIONS[key][envName] || SUSI_OPTIONS[key];
    return opts;
  }, {});

  return susiOptions;
}

export function readBlockConfig(block) {
  return [...block.querySelectorAll(':scope>div')].reduce((config, row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const valueEl = cols[1];
        const name = toClassName(cols[0].textContent);
        if (valueEl.querySelector('a')) {
          const aArr = [...valueEl.querySelectorAll('a')];
          if (aArr.length === 1) {
            config[name] = aArr[0].href;
          } else {
            config[name] = aArr.map((a) => a.href);
          }
        } else if (valueEl.querySelector('p')) {
          const pArr = [...valueEl.querySelectorAll('p')];
          if (pArr.length === 1) {
            config[name] = pArr[0].innerHTML;
          } else {
            config[name] = pArr.map((p) => p.innerHTML);
          }
        } else config[name] = row.children[1].innerHTML;
      }
    }

    return config;
  }, {});
}
