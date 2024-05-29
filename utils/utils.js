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

export function handlize(str) {
  return str.toLowerCase().trim().replaceAll(' ', '-');
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
  img.src = `/icons/${tag}.svg`;
  img.alt = tag;

  return img;
}

function sanitizeJsonInput(input) {
  const sanitizedInput = input.replace(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/g, '');
  return sanitizedInput;
}

// Function to escape JSON data for HTML output
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  // eslint-disable-next-line no-useless-escape
  return String(str).replace(/[&<>"'`=\/]/g, (s) => map[s]);
}

// Function to safely parse JSON
function safeJsonParse(jsonString) {
  const sanitizedJsonString = sanitizeJsonInput(jsonString);
  try {
    return JSON.parse(sanitizedJsonString);
  } catch (e) {
    console.error('Invalid JSON input:', e);
    return null;
  }
}
