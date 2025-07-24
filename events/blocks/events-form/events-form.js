import { LIBS, getMetadata, getSusiOptions } from '../../scripts/utils.js';
import { deleteAttendeeFromEvent, getAndCreateAndAddAttendee, getAttendee, getEvent } from '../../scripts/esp-controller.js';
import BlockMediator from '../../scripts/deps/block-mediator.min.js';
import autoUpdateContent, { miloReplaceKey, signIn } from '../../scripts/content-update.js';
import { dictionaryManager } from '../../scripts/dictionary-manager.js';

const { createTag, getConfig } = await import(`${LIBS}/utils/utils.js`);
const { closeModal, sendAnalytics } = await import(`${LIBS}/blocks/modal/modal.js`);
const { default: sanitizeComment } = await import(`${LIBS}/utils/sanitizeComment.js`);
const { decorateDefaultLinkAnalytics } = await import(`${LIBS}/martech/attributes.js`);
const { default: loadFragment } = await import(`${LIBS}/blocks/fragment/fragment.js`);

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

function createSelect(fd) {
  const {
    field, placeholder, options, defval, required, type,
  } = fd;

  const select = createTag('select', { id: field });
  if (placeholder) select.append(createTag('option', { class: 'placeholder-option', selected: '', disabled: '', value: '' }, dictionaryManager.getValue(placeholder)));
  options.split(';').forEach(async (o) => {
    const text = o.trim();
    const optionText = dictionaryManager.getValue(text);
    const option = createTag('option', { value: text }, optionText);
    select.append(option);
    if (defval === text) select.value = text;
  });

  if (required === 'x') select.setAttribute('required', 'required');

  if (type === 'multi-select') {
    select.classList.add('hidden');
    select.setAttribute('multiple', '');
    select.setAttribute('name', field);

    const placeholderOption = select.querySelector('option.placeholder-option');
    if (placeholderOption) placeholderOption.selected = false;

    const selectWrapper = createTag('div', { class: 'multi-select-wrapper' });
    const customSelect = createTag('div', { class: 'custom-select' });
    const selectedOptions = createTag('span', { class: 'selected-options' }, placeholder || '-', { parent: customSelect });
    const customDropdown = createTag('div', { class: 'custom-dropdown hidden' }, '', { parent: customSelect });

    const selectedValues = new Set();

    const updateSelectUI = () => {
      if (selectedValues.size === 0) {
        selectedOptions.textContent = placeholder || '-';
      } else {
        const valuesArr = Array.from(selectedValues);
        selectedOptions.textContent = valuesArr.join(', ');
      }

      Array.from(select.options).forEach((opt) => {
        opt.selected = selectedValues.has(opt.value);
      });

      const customSelectBoxes = customDropdown.querySelectorAll('input[type="checkbox"]');
      customSelectBoxes.forEach((cb) => {
        cb.checked = selectedValues.has(cb.value);
      });
    };

    options.split(';').forEach((o) => {
      const text = o.trim();
      const label = createTag('label', {}, dictionaryManager.getValue(text), { parent: customDropdown });
      createTag('input', { type: 'checkbox', value: text, class: 'no-submit' }, '', { parent: label });
    });

    customSelect.addEventListener('click', () => {
      customDropdown.classList.toggle('hidden');
    });

    customDropdown.addEventListener('change', (e) => {
      const input = e.target;
      const { value } = input;

      if (input.checked) {
        selectedValues.add(value);
      } else {
        selectedValues.delete(value);
      }

      updateSelectUI();
    });

    select.addEventListener('change', () => {
      selectedValues.clear();
      Array.from(select.selectedOptions).forEach((opt) => {
        if (opt.disabled) return;
        selectedValues.add(opt.value);
      });

      updateSelectUI();
    });

    selectWrapper.append(select, customSelect, customDropdown);

    return selectWrapper;
  }

  return select;
}

function constructPayload(form) {
  const exceptions = (el) => el.tagName !== 'BUTTON';
  const payload = {};
  [...form.elements].filter(exceptions).forEach((fe) => {
    if (fe.classList.contains('no-submit')) return;

    if (fe.type.match(/(?:checkbox|radio)/)) {
      if (fe.checked) {
        const valueList = fe.value.split('+').map((v) => v.trim());

        if (valueList.length > 1) {
          valueList.forEach((v) => {
            payload[fe.name] = payload[fe.name] ? [...payload[fe.name], v] : [v];
          });
        } else {
          payload[fe.name] = payload[fe.name] ? [...payload[fe.name], fe.value] : [fe.value];
        }
      } else {
        payload[fe.name] = payload[fe.name] || [];
      }
      return;
    }

    if (fe.type === 'select-multiple') {
      const selectedValues = Array.from(fe.selectedOptions)
        .filter((opt) => opt.value)
        .map((opt) => opt.value);
      payload[fe.id] = selectedValues;
      return;
    }

    if (fe.value) payload[fe.id] = fe.value;
  });

  // Post-process checkbox groups to convert single-option groups to booleans
  Object.keys(payload).forEach((key) => {
    const fieldWrapper = form.querySelector(`[data-field-id="${key}"]`);
    if (fieldWrapper && (fieldWrapper.dataset.type === 'checkbox' || fieldWrapper.dataset.type === 'checkbox-group')) {
      const checkboxes = fieldWrapper.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length === 1) {
        // Single option checkbox - convert to boolean
        payload[key] = payload[key] && payload[key].length > 0;
      }
    }
  });

  return payload;
}

async function submitForm(bp) {
  const { form, sanitizeList } = bp;
  const payload = constructPayload(form);
  const isValid = Object.keys(payload).reduce((valid, key) => {
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

    if (sanitizeList.includes(key)) {
      payload[key] = sanitizeComment(payload[key]);
    }

    return valid;
  }, true);

  if (!isValid) return false;

  return getAndCreateAndAddAttendee(getMetadata('event-id'), payload);
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

async function buildErrorMsg(parent, status) {
  const eventObj = await getEvent(getMetadata('event-id'));

  if (!eventObj.ok) return;
  const eventInfo = eventObj.data;
  const errorKeyMap = { 400: eventInfo?.allowWaitlisting === 'true' ? 'event-full-error-msg' : 'event-full-no-waitlist-error-msg' };

  const existingErrors = parent.querySelectorAll('.error');
  if (existingErrors.length) {
    existingErrors.forEach((err) => err.remove());
  }

  const errorMsg = await miloReplaceKey(LIBS, errorKeyMap[status] || 'rsvp-error-msg');
  const error = createTag('p', { class: 'error' }, errorMsg);
  parent.append(error);
  setTimeout(() => {
    error.remove();
  }, 3000);
}

function showSuccessMsgFirstScreen(bp) {
  const rsvpData = BlockMediator.get('rsvpData');

  if (!rsvpData) return;

  clearForm(bp.form);
  bp.form.classList.add('hidden');
  bp.eventHero.classList.add('hidden');

  const { registrationStatus } = rsvpData;

  if (registrationStatus === 'waitlisted') {
    bp.waitlistSuccessScreen?.classList.remove('hidden');
    bp.waitlistSuccessScreen?.querySelector('.first-screen')?.classList.remove('hidden');
  }

  if (registrationStatus === 'registered') {
    bp.rsvpSuccessScreen?.classList.remove('hidden');
    bp.rsvpSuccessScreen?.querySelector('.first-screen')?.classList.remove('hidden');
  }
}

function eventFormSendAnalytics(bp, view) {
  const modal = bp.block.closest('.dialog-modal');
  if (!modal) return;
  const title = getMetadata('event-title');
  const name = title ? ` | ${title}` : '';
  const modalId = modal.id ? ` | ${modal.id}` : '';
  const event = new Event(`${view}${name}${modalId}`);
  sendAnalytics(event);
}

function createButton({ type, label }, bp) {
  const button = createTag('button', { class: 'button' }, dictionaryManager.getValue(label));
  if (type === 'submit') {
    button.addEventListener('click', async (event) => {
      if (bp.form.checkValidity()) {
        event.preventDefault();
        button.setAttribute('disabled', true);
        button.classList.add('submitting');
        const respJson = await submitForm(bp);
        button.removeAttribute('disabled');
        button.classList.remove('submitting');
        if (!respJson) return;

        if (respJson.ok) {
          BlockMediator.set('rsvpData', respJson.data);
          eventFormSendAnalytics(bp, 'Form Submit');
        } else {
          const { status } = respJson;

          if (status === 400 && respJson.error?.message === 'Request to ESP failed: Event is full') {
            BlockMediator.set('rsvpData', null);
            const eventResp = await getEvent(getMetadata('event-id'));
            if (eventResp.ok) {
              const { isFull, allowWaitlisting, attendeeCount, attendeeLimit } = eventResp.data;
              const eventFull = isFull
              || (!allowWaitlisting && +attendeeCount >= +attendeeLimit);

              if (eventFull) {
                if (allowWaitlisting) {
                  button.textContent = await miloReplaceKey(LIBS, 'waitlist-cta-text');
                  button.disabled = false;
                } else {
                  button.textContent = await miloReplaceKey(LIBS, 'event-full-cta-text');
                  button.disabled = true;
                }
              }
            }
          }

          buildErrorMsg(bp.form, status);
        }
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
  return createTag(el, {}, dictionaryManager.getValue(label));
}

function createInput({ type, field, placeholder, required, defval }) {
  const placeholderText = placeholder ? dictionaryManager.getValue(placeholder) : '';
  const input = createTag('input', { type, id: field, placeholder: placeholderText, value: defval });
  if (required === 'x') input.setAttribute('required', 'required');
  return input;
}

function createTextArea({ field, placeholder, required, defval }) {
  const placeholderText = placeholder ? dictionaryManager.getValue(placeholder) : '';
  const input = createTag('textarea', { id: field, placeholder: placeholderText, value: defval });
  if (required === 'x') input.setAttribute('required', 'required');
  return input;
}

function createlabel({ field, label, required }) {
  return createTag('label', { for: field, class: required ? 'required' : '' }, dictionaryManager.getValue(label));
}

function createCheckItem(item, type, id, def) {
  const itemKebab = item.toLowerCase().replaceAll(' ', '-');
  const defList = def.split(';').map((defItem) => defItem.trim());
  const pseudoEl = createTag('span', { class: `check-item-button ${type}-button` });
  const [customLabel, customVal] = item.split('::');
  const label = createTag('label', { class: `check-item-label ${type}-label`, for: `${id}-${itemKebab}` }, dictionaryManager.getValue(customLabel) || item);
  const input = createTag(
    'input',
    { type, name: id, value: customVal || item, class: `check-item-input ${type}-input`, id: `${id}-${itemKebab}` },
  );
  if (item && defList.includes(item)) input.setAttribute('checked', '');
  return createTag('div', { class: `check-item-wrap ${type}-input-wrap` }, [input, pseudoEl, label]);
}

function createCheckGroup({ options, field, defval, required }, type) {
  const optionsMap = options.split(';').map((item) => createCheckItem(item.trim(), type, field, defval));
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
        // Handle both boolean and array values
        if (typeof payload[key] === 'boolean') {
          force = payload[key] === true;
        } else if (Array.isArray(payload[key])) {
          force = payload[key].includes(value);
        } else if (typeof payload[key] === 'string') {
          force = payload[key].split(';').map((s) => s.trim()).includes(value);
        }
        break;
      case RULE_OPERATORS.excludes:
        // Handle both boolean and array values
        if (typeof payload[key] === 'boolean') {
          force = payload[key] === false;
        } else if (Array.isArray(payload[key])) {
          force = !payload[key].includes(value);
        } else if (typeof payload[key] === 'string') {
          force = (!payload[key].split(';').map((s) => s.trim()).includes(value));
        }
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

async function loadConsent(form, consentData) {
  const { path, countryCode } = consentData;
  const submitWrapper = form.querySelector('.events-form-submit-wrapper');
  const submit = submitWrapper.querySelector('button');
  const termsWrapper = form.querySelector('.terms-and-conditions-wrapper');

  submit.disabled = true;
  termsWrapper.innerHTML = '';
  termsWrapper.classList.add('transparent');

  const termsFragLink = createTag('a', { href: path, target: '_blank' }, path, { parent: termsWrapper });

  await loadFragment(termsFragLink);

  termsWrapper.classList.remove('transparent');
  const uls = termsWrapper.querySelectorAll('ul');

  const defval = '';
  const required = '';
  const type = 'checkbox';

  uls.forEach((ul) => {
    const pseudoCheckboxes = ul.querySelectorAll('li');
    if (countryCode === 'CN') {
      // FIXME: This is a temporary solution to handle the China case
      Array.from(pseudoCheckboxes).forEach((o) => {
        const valKebab = o.textContent.trim().replaceAll(' ', '-');
        const checkWrap = createTag('div', { class: 'check-item-wrap checkbox-input-wrap' });

        const checkbox = createTag('input', { id: valKebab, type: 'checkbox', class: 'submit-blocker no-submit check-item-input checkbox-input', value: valKebab });
        const checkboxButton = createTag('span', { class: 'check-item-button checkbox-button' });
        const label = createTag('label', { class: 'check-item-label checkbox-label', for: valKebab }, o.innerHTML);

        checkWrap.append(checkbox, checkboxButton, label);
        termsWrapper.append(checkWrap);
      });

      const allCheckboxes = termsWrapper.querySelectorAll('.submit-blocker');

      allCheckboxes.forEach((cb) => {
        cb.addEventListener('change', () => {
          const checkedCheckboxes = Array.from(allCheckboxes).filter((c) => c.checked);
          submit.disabled = checkedCheckboxes.length !== allCheckboxes.length;
        });
      });

      ul.remove();
    } else {
      const options = Array.from(pseudoCheckboxes).map((li) => li.textContent.trim()).join(';');

      if (!options) {
        submit.disabled = false;
        return;
      }

      const field = 'contactMethods';
      termsWrapper.append(createCheckGroup({ options, field, defval, required }, type));

      ul.remove();
    }
  });

  submitWrapper.before(termsWrapper);

  if (countryCode === 'CN') {
    const allCheckboxes = termsWrapper.querySelectorAll('.submit-blocker');
    const checkedCheckboxes = Array.from(allCheckboxes).filter((c) => c.checked);
    submit.disabled = checkedCheckboxes.length !== allCheckboxes.length;

    return;
  }

  submit.disabled = false;
}

function decorateSuccessScreen(screen) {
  if (!screen) return;

  screen.classList.add('form-success-msg');
  const subScreens = screen.querySelectorAll('div');

  const [firstScreen, secondScreen] = subScreens;

  subScreens.forEach((ss, i) => {
    ss.classList.add('hidden');
    const hgroup = createTag('hgroup');
    const eyeBrowText = ss.querySelector('p:first-child');
    const headings = ss.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headings.forEach((h) => {
      hgroup.append(h);
    });

    if (eyeBrowText) {
      eyeBrowText.classList.add('eyebrow');
      hgroup.prepend(eyeBrowText);
    }

    ss.prepend(hgroup);

    if (i === 0) {
      ss.classList.add('first-screen');
      const firstScreenCtas = ss.querySelectorAll('a');

      firstScreenCtas.forEach((cta) => {
        const ctaUrl = new URL(cta.href);
        if (ctaUrl.hash.startsWith('#cancel')) {
          cta.parentElement.classList.add('post-rsvp-button-wrapper');
          cta.classList.add('con-button', 'outline', 'button-l', 'cancel-button');
        } else if (ctaUrl.hash.startsWith('#ok')) {
          cta.classList.add('con-button', 'black', 'button-l', 'ok-button');
        }

        cta.addEventListener('click', async (e) => {
          e.preventDefault();

          cta.classList.add('loading');

          if (cta.classList.contains('cancel-button')) {
            const profile = BlockMediator.get('imsProfile');
            const rsvpData = BlockMediator.get('rsvpData');

            const rsvpResp = profile.account_type === 'guest'
              ? await deleteAttendeeFromEvent(getMetadata('event-id'), rsvpData.attendeeId)
              : await deleteAttendeeFromEvent(getMetadata('event-id'));

            cta.classList.remove('loading');

            if (!rsvpResp.ok) {
              buildErrorMsg(screen, rsvpResp.status);
              return;
            }

            const { data } = rsvpResp;
            const result = data?.espProvider || data;

            if (!result) {
              buildErrorMsg(screen, 500);
              return;
            }

            const espStatus = result.status;

            if ((espStatus && espStatus !== 204)) {
              buildErrorMsg(screen, espStatus);
              return;
            }

            BlockMediator.set('rsvpData', null);

            firstScreen.classList.add('hidden');
            secondScreen.classList.remove('hidden');
            cta.classList.remove('loading');
          }

          if (cta.classList.contains('ok-button')) {
            const modal = screen.closest('.dialog-modal');
            if (modal) closeModal(modal);
          }
        });
      });
    }

    if (i === 1) {
      ss.classList.add('second-screen');
      const secondScreenCtas = ss.querySelectorAll('a');

      secondScreenCtas.forEach((cta) => {
        const ctaUrl = new URL(cta.href);
        if (ctaUrl.hash.startsWith('#ok')) {
          cta.classList.add('con-button', 'black', 'button-l');
          cta.addEventListener('click', async (e) => {
            e.preventDefault();
            const modal = screen.closest('.dialog-modal');
            if (modal) closeModal(modal);
          });
        }
      });
    }
  });

  screen.classList.add('hidden');
}

async function addConsentSuite(form) {
  const countryText = await miloReplaceKey(LIBS, 'country');
  const fieldWrapper = createTag('div', { class: 'field-wrapper events-form-select-wrapper', 'data-field-id': 'country', 'data-type': 'select' });
  const label = createTag('label', { for: 'consentStringId', class: 'required' }, countryText);
  const countrySelect = createTag('select', { id: 'consentStringId', required: 'required' });
  const termsWrapper = createTag('div', {
    class: 'field-wrapper events-form-full-width terms-and-conditions-wrapper transparent',
    'data-field-id': 'contactMethods',
    'data-type': 'checkbox-group',
  });

  fieldWrapper.append(label, countrySelect);

  const consentStringsIndex = await fetch('/events/fragments/consents/consent-query-index.json').then((r) => r.json());

  if (consentStringsIndex) {
    const { data } = consentStringsIndex;
    const defaultOption = createTag('option', { selected: '', disabled: '', value: '' }, countryText);
    countrySelect.append(defaultOption);

    data.forEach((c) => {
      const option = createTag('option', { value: c.consentId, 'data-country-code': c.countryCode }, c.countryName);
      countrySelect.append(option);
    });

    countrySelect.addEventListener('change', async (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const consentData = data.find((c) => c.countryCode === selectedOption.dataset.countryCode);

      if (consentData) {
        await loadConsent(form, consentData);
      }
    });
  }

  const submitWrapper = form.querySelector('.events-form-submit-wrapper');
  const eventTermsWrapper = form.querySelector('.event-terms-wrapper');

  if (eventTermsWrapper) {
    eventTermsWrapper.before(fieldWrapper);
    submitWrapper.before(termsWrapper);
  } else {
    submitWrapper.before(fieldWrapper, termsWrapper);
  }
}

function addTerms(form, terms) {
  if (!terms || terms.textContent === '') return;
  const submitWrapper = form.querySelector('.events-form-submit-wrapper');
  const termsWrapper = createTag('div', { class: 'field-wrapper events-form-full-width event-terms-wrapper' });
  const termsTexts = terms.querySelectorAll('p');
  const lis = terms.querySelectorAll('li');

  termsTexts.forEach((t, i) => {
    termsWrapper.append(t);

    if (i === 1) {
      t.remove();
    }
  });

  lis.forEach((li) => {
    li.remove();
  });

  terms.remove();

  submitWrapper.before(termsWrapper);
}

async function createForm(bp, formData) {
  const { form, terms } = bp;

  let rsvpFieldsData;

  try {
    rsvpFieldsData = JSON.parse(getMetadata('rsvp-form-fields'));
  } catch (error) {
    window.lana?.log(`Failed to parse partners metadata:\n${JSON.stringify(error, null, 2)}`);
  }

  const { pathname } = new URL(form.href);
  let json = formData;
  /* c8 ignore next 4 */
  if (!formData) {
    const resp = await fetch(pathname);
    json = await resp.json();
  }

  const config = getConfig();
  await dictionaryManager.fetchDictionary({
    config,
    sheet: 'rsvp-fields',
  });

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

  const formEl = createTag('form');
  const rules = [];
  const [action] = pathname.split('.json');
  formEl.dataset.action = action;

  const typeToElement = {
    'multi-select': { fn: createSelect, params: [], label: true, classes: [] },
    select: { fn: createSelect, params: ['something'], label: true, classes: [] },
    heading: { fn: createHeading, params: ['h3'], label: false, classes: [] },
    legal: { fn: createHeading, params: ['p'], label: false, classes: [] },
    checkbox: { fn: createCheckGroup, params: ['checkbox'], label: true, classes: ['field-group-wrapper'] },
    'checkbox-group': { fn: createCheckGroup, params: ['checkbox'], label: true, classes: ['field-group-wrapper'] },
    'radio-group': { fn: createCheckGroup, params: ['radio'], label: true, classes: ['field-group-wrapper'] },
    'text-area': { fn: createTextArea, params: [], label: true, classes: [] },
    submit: { fn: createButton, params: [bp], label: false, classes: ['field-button-wrapper'] },
    clear: { fn: createButton, params: [bp], label: false, classes: ['field-button-wrapper'] },
    divider: { fn: createDivider, params: [], label: false, classes: ['divider'] },
    default: { fn: createInput, params: [], label: true, classes: [] },
  };

  const sanitizeList = [];

  json.data.forEach(async (fd) => {
    fd.type = fd.type || 'text';
    if (fd.type === 'text') sanitizeList.push(fd.field);
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
    formEl.append(fieldWrapper);
  });

  addTerms(formEl, terms);

  const profile = BlockMediator.get('imsProfile');
  if (getMetadata('allow-guest-registration') === 'true' && profile.account_type === 'guest') await addConsentSuite(formEl);

  formEl.addEventListener('input', () => applyRules(formEl, rules));
  applyRules(formEl, rules);

  // close all custom-dropdown on click outside
  formEl.addEventListener('click', (e) => {
    const multiSelects = formEl.querySelectorAll('.multi-select-wrapper');

    if (multiSelects.length === 0) return;

    multiSelects.forEach((ms) => {
      const customDropdown = ms.querySelector('.custom-dropdown');
      const customSelect = ms.querySelector('.custom-select');

      if (!customDropdown.classList.contains('hidden') && !customSelect.contains(e.target) && !customDropdown.contains(e.target)) {
        customDropdown.classList.add('hidden');
      }
    });
  });

  autoUpdateContent(formEl, { getConfig, miloLibs: LIBS });

  return {
    formEl,
    sanitizeList,
  };
}

function personalizeForm(form, data) {
  if (!data || !form) return;

  Object.entries(data).forEach(([key, value]) => {
    Object.entries(value).forEach(([k, v]) => {
      const matchedInput = form.querySelector(`#${snakeToCamel(k)}`);
      if (matchedInput && v && !matchedInput.v) {
        if (Array.isArray(v)) {
          v.forEach((val) => {
            const option = matchedInput.querySelector(`option[value="${val}"]`);
            if (option) option.selected = true;
          });
        } else {
          matchedInput.value = v;
          if (key === 'profile') matchedInput.disabled = true;
        }
        matchedInput.dispatchEvent(new Event('change'));
      }
    });
  });
}

function decorateHero(heroEl) {
  heroEl.classList.add('event-form-hero');
}

async function buildEventform(bp, formData) {
  if (!bp.formContainer || !bp.form) return;
  bp.formContainer.classList.add('form-container');
  const { formEl, sanitizeList } = await createForm(bp, formData);

  [bp.rsvpSuccessScreen, bp.waitlistSuccessScreen].forEach((screen) => {
    decorateSuccessScreen(screen);
  });

  if (formEl) {
    bp.form.replaceWith(formEl);
    bp.form = formEl;
    bp.sanitizeList = sanitizeList;
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

async function initFormBasedOnRSVPData(bp) {
  const validRegistrationStatus = ['registered', 'waitlisted'];
  const { block } = bp;
  const profile = BlockMediator.get('imsProfile');
  const rsvpData = BlockMediator.get('rsvpData');

  if (validRegistrationStatus.includes(rsvpData?.registrationStatus)) {
    showSuccessMsgFirstScreen(bp);
    eventFormSendAnalytics(bp, 'Confirmation Modal View');
  } else if (profile.account_type !== 'guest') {
    let existingAttendeeData = {};
    const attendeeResp = await getAttendee();
    if (attendeeResp.ok) existingAttendeeData = attendeeResp.data;
    personalizeForm(block, { profile, existingAttendeeData });
  } else {
    const countryInput = block.querySelector('select#consentStringId');
    if (!countryInput) return;

    const options = Array.from(countryInput.options);
    const internationalCookie = getCookie('international_cookie');

    if (internationalCookie) {
      const option = options.find((o) => {
        const countryCode = o.dataset.countryCode?.toLowerCase();

        if (!countryCode) return false;

        return countryCode === internationalCookie.toLowerCase();
      });
      if (option) {
        option.selected = true;
        countryInput.value = option.value;
        countryInput.dispatchEvent(new Event('change'));
      }
    } else {
      const countryInNavigator = window.navigator.language.toLowerCase().split('-')[1];
      const option = options.find(async (o) => {
        const countryCode = o.dataset.countryCode?.toLowerCase();

        if (!countryCode) return false;

        return countryCode === countryInNavigator;
      });
      if (option) {
        option.selected = true;
        countryInput.value = option.value;
        countryInput.dispatchEvent(new Event('change'));
      }
    }
  }

  BlockMediator.subscribe('rsvpData', ({ newValue }) => {
    if (validRegistrationStatus.includes(newValue?.registrationStatus)) {
      showSuccessMsgFirstScreen(bp);
      eventFormSendAnalytics(bp, 'Confirmation Modal View');
    }
  });

  if (bp.block.querySelector('.form-success-msg.hidden')) {
    eventFormSendAnalytics(bp, 'Form View');
  }
}

async function onProfile(bp, formData) {
  const { block, eventHero } = bp;
  const profile = BlockMediator.get('imsProfile');
  const allowGuestReg = getMetadata('allow-guest-registration') === 'true';
  if (profile) {
    if ((profile.noProfile || profile.account_type === 'guest')
      && /#rsvp-form.*/.test(window.location.hash)
      && !allowGuestReg) {
      // TODO: also check for guestCheckout enablement for future iterations
      signIn(getSusiOptions(getConfig()));
    } else {
      eventHero.classList.remove('loading');
      decorateHero(bp.eventHero);
      buildEventform(bp, formData).then(() => {
        initFormBasedOnRSVPData(bp);
      }).finally(() => {
        decorateDefaultLinkAnalytics(block);
        block.classList.remove('loading');
      });
    }
  } else {
    BlockMediator.subscribe('imsProfile', ({ newValue }) => {
      if ((newValue?.noProfile || newValue?.account_type === 'guest')
        && /#rsvp-form.*/.test(window.location.hash)
        && !allowGuestReg) {
        // TODO: also check for guestCheckout enablement for future iterations
        signIn(getSusiOptions(getConfig()));
      } else {
        eventHero.classList.remove('loading');
        decorateHero(bp.eventHero);
        buildEventform(bp, formData).then(() => {
          initFormBasedOnRSVPData(bp);
        }).finally(() => {
          decorateDefaultLinkAnalytics(block);
          block.classList.remove('loading');
        });
      }
    });
  }
}

async function decorateToastArea() {
  await Promise.all([
    import(`${LIBS}/deps/lit-all.min.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/theme.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/toast.js`),
  ]);
  const toastArea = createTag('sp-theme', { color: 'light', scale: 'medium', class: 'toast-area' });
  document.body.append(toastArea);
  return toastArea;
}

function getFormLink(block, bp) {
  const legacyLink = block.querySelector(':scope > div:nth-of-type(2) a[href$=".json"]');

  const cloudType = getMetadata('cloud-type');
  const form = createTag('a', { href: `/events/default/rsvp-form-configs/${cloudType.toLowerCase()}.json` });

  if (legacyLink) {
    legacyLink.href = form.href;
    return legacyLink;
  }

  bp.formContainer.append(form);
  return form;
}

export default async function decorate(block, formData = null) {
  block.classList.add('loading');
  const toastArea = await decorateToastArea();

  const bp = {
    block,
    toastArea,
    eventHero: block.querySelector(':scope > div:nth-of-type(1)'),
    formContainer: block.querySelector(':scope > div:nth-of-type(2)'),
    terms: block.querySelector(':scope > div:nth-of-type(3)'),
    rsvpSuccessScreen: block.querySelector(':scope > div:nth-of-type(4)'),
    waitlistSuccessScreen: block.querySelector(':scope > div:nth-of-type(5)'),
  };

  bp.form = getFormLink(block, bp);

  await onProfile(bp, formData);
}
