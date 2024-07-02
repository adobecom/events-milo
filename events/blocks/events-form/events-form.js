import { LIBS } from '../../scripts/scripts.js';
import { getMetadata } from '../../utils/utils.js';
import { getProfile } from '../../utils/profile.js';
import HtmlSanitizer from '../../deps/html-sanitizer.js';
import { createAttendee, deleteAttendee } from '../../utils/esp-controller.js';
import BlockMediator from '../../deps/block-mediator.min.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);
const { closeModal } = await import(`${LIBS}/blocks/modal/modal.js`);
const { default: sanitizeComment } = await import(`${LIBS}/utils/sanitizeComment.js`);

const RULE_OPERATORS = {
  equal: '=',
  notEqual: '!=',
  lessThan: '<',
  lessThanOrEqual: '<=',
  greaterThan: '>',
  greaterThanOrEqual: '>=',
  includes: 'inc',
  excludes: 'exc',
};

function snakeToCamel(str) {
  return str
    .split('_')
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
}

function createSelect({ field, placeholder, options, defval, required }) {
  const select = createTag('select', { id: field });
  if (placeholder) select.append(createTag('option', { selected: '', disabled: '' }, placeholder));
  options.split(',').forEach((o) => {
    const text = o.trim();
    const option = createTag('option', { value: text }, text);
    select.append(option);
    if (defval === text) select.value = text;
  });
  if (required === 'x') select.setAttribute('required', 'required');
  return select;
}

function constructPayload(form) {
  const exceptions = (el) => el.tagName !== 'BUTTON' && el.id !== 'terms-and-conditions';
  const payload = {};
  [...form.elements].filter(exceptions).forEach((fe) => {
    if (fe.type.match(/(?:checkbox|radio)/)) {
      if (fe.checked) {
        payload[fe.name] = payload[fe.name] ? `${fe.value}, ${payload[fe.name]}` : fe.value;
      } else {
        payload[fe.name] = payload[fe.name] || '';
      }
      return;
    }
    payload[fe.id] = fe.value;
  });
  return payload;
}

async function submitForm(form, espData) {
  const payload = constructPayload(form);
  payload.timestamp = new Date().toJSON();
  Object.keys(payload).forEach((key) => {
    if (!key) return false;
    const field = form.querySelector(`[data-field-id=${key}]`);
    if (!payload[key] && field.querySelector('.group-container.required')) {
      const el = form.querySelector(`input[name="${key}"]`);
      el.setCustomValidity('A selection is required');
      el.reportValidity();
      const cb = () => {
        el.setCustomValidity('');
        el.reportValidity();
        field.removeEventListener('input', cb);
      };
      field.addEventListener('input', cb);
      return false;
    }
    payload[key] = sanitizeComment(payload[key]);
    return true;
  });

  const response = await createAttendee(espData.eventId, payload);

  return response || false;
}

function clearForm(form) {
  [...form.elements].forEach((fe) => {
    if (fe.type.match(/(?:checkbox|radio)/)) {
      fe.checked = false;
    } else {
      fe.value = '';
    }
  });
}

function createButton({ type, label }, successMsg, rsvpData) {
  const button = createTag('button', { class: 'button' }, label);
  if (type === 'submit') {
    button.addEventListener('click', async (event) => {
      const form = button.closest('form');
      if (form.checkValidity()) {
        event.preventDefault();
        button.setAttribute('disabled', true);
        const submissionResp = await submitForm(form, rsvpData);
        button.removeAttribute('disabled');
        if (!submissionResp) {
          // FIXME: return a false positive to test rsvp UI flow
          BlockMediator.set('rsvpData', { attendeeId: 'foobar' });
          return;
        }

        rsvpData.attendeeId = submissionResp.attendeeId;
        rsvpData.resp = submissionResp;
        BlockMediator.set('rsvpData', rsvpData);

        clearForm(form);
        const block = button.closest('.events-form');
        const hero = block.querySelector('.event-form-hero');
        form.classList.add('hidden');
        hero.classList.add('hidden');
        successMsg.classList.remove('hidden');
      }
    });
  }
  if (type === 'clear') {
    button.classList.add('outline');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const form = button.closest('form');
      clearForm(form);
    });
  }
  return button;
}

function createHeading({ label }, el) {
  return createTag(el, {}, label);
}

function createInput({ type, field, placeholder, required, defval }) {
  const input = createTag('input', { type, id: field, placeholder, value: defval });
  if (required === 'x') input.setAttribute('required', 'required');
  return input;
}

function createTextArea({ field, placeholder, required, defval }) {
  const input = createTag('textarea', { id: field, placeholder, value: defval });
  if (required === 'x') input.setAttribute('required', 'required');
  return input;
}

function createlabel({ field, label, required }) {
  return createTag('label', { for: field, class: required ? 'required' : '' }, label);
}

function createCheckItem(item, type, id, def) {
  const itemKebab = item.toLowerCase().replaceAll(' ', '-');
  const defList = def.split(',').map((defItem) => defItem.trim());
  const pseudoEl = createTag('span', { class: `check-item-button ${type}-button` });
  const label = createTag('label', { class: `check-item-label ${type}-label`, for: `${id}-${itemKebab}` }, item);
  const input = createTag(
    'input',
    { type, name: id, value: item, class: `check-item-input ${type}-input`, id: `${id}-${itemKebab}` },
  );
  if (item && defList.includes(item)) input.setAttribute('checked', '');
  return createTag('div', { class: `check-item-wrap ${type}-input-wrap` }, [input, pseudoEl, label]);
}

function createCheckGroup({ options, field, defval, required }, type) {
  const optionsMap = options.split(',').map((item) => createCheckItem(item.trim(), type, field, defval));
  return createTag(
    'div',
    { class: `group-container ${type}-group-container${required === 'x' ? ' required' : ''}` },
    optionsMap,
  );
}

function createDivider() {
  return '';
}

function processNumRule(tf, operator, a, b) {
  /* c8 ignore next 3 */
  if (!tf.dataset.type.match(/(?:number|date)/)) {
    throw new Error(`Comparison field must be of type number or date for ${operator} rules`);
  }
  const { type } = tf.dataset;
  const a2 = type === 'number' ? parseInt(a, 10) : Date.parse(a);
  const b2 = type === 'number' ? parseInt(b, 10) : Date.parse(b);
  return [a2, b2];
}

function processRule(tf, operator, payloadKey, value, comparisonFunction) {
  if (payloadKey === '') return true;
  try {
    const [a, b] = processNumRule(tf, operator, payloadKey, value);
    return comparisonFunction(a, b);
    /* c8 ignore next 5 */
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`Invalid rule, ${e}`);
    return false;
  }
}

function applyRules(form, rules) {
  const payload = constructPayload(form);
  rules.forEach((field) => {
    const { type, condition: { key, operator, value } } = field.rule;
    const fw = form.querySelector(`[data-field-id=${field.fieldId}]`);
    const tf = form.querySelector(`[data-field-id=${key}]`);
    let force = false;
    switch (operator) {
      case RULE_OPERATORS.equal:
        force = (payload[key] === value);
        break;
      case RULE_OPERATORS.notEqual:
        force = (payload[key] !== value);
        break;
      case RULE_OPERATORS.includes:
        force = (payload[key].split(',').map((s) => s.trim()).includes(value));
        break;
      case RULE_OPERATORS.excludes:
        force = (!payload[key].split(',').map((s) => s.trim()).includes(value));
        break;
      case RULE_OPERATORS.lessThan:
        force = processRule(tf, operator, payload[key], value, (a, b) => a < b);
        break;
      case RULE_OPERATORS.lessThanOrEqual:
        force = processRule(tf, operator, payload[key], value, (a, b) => a <= b);
        break;
      case RULE_OPERATORS.greaterThan:
        force = processRule(tf, operator, payload[key], value, (a, b) => a > b);
        break;
      case RULE_OPERATORS.greaterThanOrEqual:
        force = processRule(tf, operator, payload[key], value, (a, b) => a >= b);
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn(`Unsupported operator ${operator}`);
        return false;
    }
    fw.classList.toggle(type, force);
    return false;
  });
}

function lowercaseKeys(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase() === 'default' ? 'defval' : key.toLowerCase()] = obj[key];
    return acc;
  }, {});
}

function addTerms(form, terms) {
  const none = (arr, callback) => !arr.some(callback);
  const submitWrapper = form.querySelector('.events-form-submit-wrapper');
  const submit = submitWrapper.querySelector('button');
  const termsWrapper = createTag('div', { class: 'field-wrapper events-form-full-width terms-and-conditions-wrapper' });
  const termsTexts = terms.querySelectorAll('p');
  const lis = terms.querySelectorAll('li');
  const checkboxes = [];

  termsTexts.forEach((t) => {
    termsWrapper.append(t);
  });

  lis.forEach((li, i) => {
    const checkboxWrapper = createTag('div', { class: 'checkbox-wrapper' });
    const checkbox = createTag('input', { id: 'terms-and-conditions', type: 'checkbox', class: 'checkbox', 'data-field-id': `terms-and-condition-check-${i + 1}` });
    const label = createTag('label', { class: 'checkbox-label', for: 'terms-and-conditions' }, HtmlSanitizer.SanitizeHtml(li.innerHTML));

    checkboxWrapper.append(checkbox, label);
    termsWrapper.append(checkboxWrapper);
    checkboxes.push(checkbox);
  });

  terms.remove();

  submitWrapper.before(termsWrapper);

  checkboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      submit.disabled = none(Array.from(checkboxes), (c) => c.checked);
    });
  });

  submit.disabled = none(Array.from(checkboxes), (c) => c.checked);
}

function decorateSuccessMsg(form, successMsg, rsvpData) {
  const ctas = successMsg.querySelectorAll('a');

  ctas.forEach((cta, i) => {
    if (i === 0) {
      cta.classList.add('con-button', 'outline');
    } else if (i === 1) {
      cta.classList.add('con-button', 'black');
    }

    cta.addEventListener('click', async (e) => {
      e.preventDefault();

      if (i === 0) {
        const resp = await deleteAttendee(rsvpData.eventId);
        rsvpData.resp = resp;
        BlockMediator.set('rsvpData', rsvpData);
      }

      const modal = form.closest('.dialog-modal');
      closeModal(modal);
    });
  });

  successMsg.classList.add('hidden');
}

async function createForm(formURL, successMsg, formData, terms) {
  let rsvpFieldsData;

  try {
    rsvpFieldsData = JSON.parse(getMetadata('rsvp-form-fields'));
  } catch (error) {
    window.lana?.log('Failed to parse partners metadata:', error);
  }

  const rsvpData = { eventId: getMetadata('event-id') || '', attendeeId: '' };
  BlockMediator.set('rsvpData', rsvpData);

  const { pathname } = new URL(formURL);
  let json = formData;
  /* c8 ignore next 4 */
  if (!formData) {
    const resp = await fetch(pathname, { headers: { authorization: 'token milo-events-ecc' } });
    json = await resp.json();
  }

  if (rsvpFieldsData) {
    const { required, visible } = rsvpFieldsData;
    json.data = json.data
      .map((obj) => {
        const lowkey = lowercaseKeys(obj);
        if (required.includes(lowkey.field)) lowkey.required = 'x';
        return lowkey;
      })
      .filter((f) => visible.includes(f.field) || ['clear', 'submit'].includes(f.field));
  } else {
    json.data = json.data
      .map((obj) => {
        const lowkey = lowercaseKeys(obj);
        return lowkey;
      })
      .filter((f) => ['clear', 'submit'].includes(f.field));
  }

  const form = createTag('form');
  const rules = [];
  const [action] = pathname.split('.json');
  form.dataset.action = action;

  const typeToElement = {
    select: { fn: createSelect, params: [], label: true, classes: [] },
    heading: { fn: createHeading, params: ['h3'], label: false, classes: [] },
    legal: { fn: createHeading, params: ['p'], label: false, classes: [] },
    checkbox: { fn: createCheckGroup, params: ['checkbox'], label: true, classes: ['field-group-wrapper'] },
    'checkbox-group': { fn: createCheckGroup, params: ['checkbox'], label: true, classes: ['field-group-wrapper'] },
    'radio-group': { fn: createCheckGroup, params: ['radio'], label: true, classes: ['field-group-wrapper'] },
    'text-area': { fn: createTextArea, params: [], label: true, classes: [] },
    submit: { fn: createButton, params: [successMsg, rsvpData], label: false, classes: ['field-button-wrapper'] },
    clear: { fn: createButton, params: [successMsg, rsvpData], label: false, classes: ['field-button-wrapper'] },
    divider: { fn: createDivider, params: [], label: false, classes: ['divider'] },
    default: { fn: createInput, params: [], label: true, classes: [] },
  };

  json.data.forEach((fd) => {
    fd.type = fd.type || 'text';
    const style = fd.extra ? ` events-form-${fd.extra}` : '';
    const fieldWrapper = createTag(
      'div',
      { class: `field-wrapper events-form-${fd.type}-wrapper${style}`, 'data-field-id': fd.field, 'data-type': fd.type },
    );

    const elParams = typeToElement[fd.type] || typeToElement.default;
    if (elParams.label) fieldWrapper.append(createlabel(fd));
    fieldWrapper.append(elParams.fn(fd, ...elParams.params));
    fieldWrapper.classList.add(...elParams.classes);

    if (fd.rules?.length) {
      try {
        rules.push({ fieldId: fd.field, rule: JSON.parse(fd.rules) });
        /* c8 ignore next 4 */
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Invalid Rule ${fd.rules}: ${e}`);
      }
    }
    form.append(fieldWrapper);
  });

  addTerms(form, terms);
  decorateSuccessMsg(form, successMsg, rsvpData);

  form.addEventListener('input', () => applyRules(form, rules));
  applyRules(form, rules);

  return form;
}

function personalizeForm(form, resp) {
  if (!resp || !form) return;

  Object.entries(resp).forEach(([key, value]) => {
    const matchedInput = form.querySelector(`#${snakeToCamel(key)}`);
    if (matchedInput) {
      matchedInput.value = value;
      matchedInput.disabled = true;
    }
  });
}

function decorateHero(heroEl) {
  heroEl.classList.add('event-form-hero');
}

async function updateDynamicContent(bp) {
  const { block, eventHero } = bp;
  let profile;

  try {
    profile = await getProfile();
  } catch (e) {
    eventHero.querySelectorAll('p')?.forEach((p) => p.remove());
  }

  eventHero.classList.remove('loading');
  personalizeForm(block, profile);
}

async function buildEventform(bp, formData) {
  if (!bp.formContainer || !bp.form) return;
  bp.formContainer.classList.add('form-container');
  bp.successMsg.classList.add('form-success-msg');
  const constructedForm = await createForm(
    bp.form.href,
    bp.successMsg,
    formData,
    bp.terms,
  );
  if (constructedForm) bp.form.replaceWith(constructedForm);
}

export default async function decorate(block, formData = null) {
  block.style.opacity = 0;
  const bp = {
    block,
    eventHero: block.querySelector(':scope > div:nth-of-type(1)'),
    formContainer: block.querySelector(':scope > div:nth-of-type(2)'),
    form: block.querySelector(':scope > div:nth-of-type(2) a[href$=".json"]'),
    terms: block.querySelector(':scope > div:nth-of-type(3)'),
    successMsg: block.querySelector(':scope > div:last-of-type > div'),
  };

  decorateHero(bp.eventHero);
  buildEventform(bp, formData)
    .then(() => { updateDynamicContent(bp); })
    .finally(() => {
      block.style.opacity = 1;
    });
}
