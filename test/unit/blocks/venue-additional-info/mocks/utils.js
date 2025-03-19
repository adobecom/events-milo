// Mock showdown library
window.showdown = {
  Converter: class {
    makeHtml(text) {
      this.text = text;
      return `<p>${text}</p>`;
    }
  },
};

// Mock loadScript to resolve immediately
export const loadScript = () => Promise.resolve();

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
