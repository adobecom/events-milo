import { LIBS, getMetadata } from '../../scripts/utils.js';
import HtmlSanitizer from '../../scripts/deps/html-sanitizer.js';
import { deleteAttendeeFromEvent, getAndCreateAndAddAttendee } from '../../scripts/esp-controller.js';
import BlockMediator from '../../scripts/deps/block-mediator.min.js';
import { miloReplaceKey } from '../../scripts/content-update.js';
import decorateArea from '../../scripts/scripts.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);
const { closeModal, sendAnalytics } = await import(`${LIBS}/blocks/modal/modal.js`);
const { default: sanitizeComment } = await import(`${LIBS}/utils/sanitizeComment.js`);
const { decorateDefaultLinkAnalytics } = await import(`${LIBS}/martech/attributes.js`);

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
  if (placeholder) select.append(createTag('option', { selected: '', disabled: '', value: '' }, placeholder));
  options.split(';').forEach((o) => {
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

    if (fe.value) payload[fe.id] = fe.value;
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

  // filter out empty keys
  const cleanPayload = Object.keys(payload).reduce((acc, key) => {
    if (payload[key]) acc[key] = payload[key];
    return acc;
  }, {});

  return getAndCreateAndAddAttendee(getMetadata('event-id'), cleanPayload);
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
  const errorKeyMap = { 400: 'event-full-error-msg' };

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

let eventsPromise = null; // To cache the Promise

async function fetchRelevantEvents() {
  let defaultEvents = [
    {
      title: 'Event 1',
      description: 'This is a detailed description for event 1 that explains what the event is about.',
      image: 'https://via.placeholder.com/300x150.png?text=Event+1',
      date: 'Fri, Aug 09 | 02:00 AM - 04:30 AM GMT+5:30',
    },
    {
      title: 'Event 2',
      description: 'This is a detailed description for event 2 that explains what the event is about.',
      image: 'https://via.placeholder.com/300x150.png?text=Event+2',
      date: 'Sat, Aug 10 | 03:00 AM - 05:30 AM GMT+5:30',
    },
    {
      title: 'Event 3',
      description: 'This is a detailed description for event 3 that explains what the event is about.',
      image: 'https://via.placeholder.com/300x150.png?text=Event+3',
      date: 'Sun, Aug 11 | 01:00 AM - 03:30 AM GMT+5:30',
    },
    {
      title: 'Event 4',
      description: 'This is a detailed description for event 4 that explains what the event is about.',
      image: 'https://via.placeholder.com/300x150.png?text=Event+4',
      date: 'Mon, Aug 12 | 04:00 AM - 06:30 AM GMT+5:30',
    },
  ];

  // If eventsPromise is already set, return the existing Promise
  if (eventsPromise) {
    return eventsPromise;
  }

  // Cache the Promise for the fetch request
  eventsPromise = new Promise(async (resolve, reject) => {
    try {
      const attendee = BlockMediator.get('attendee') ?? {};
      const response = await fetch('http://localhost:3001/recommend-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: `${attendee.firstName} ${attendee.lastName}`,
          jobTitle: attendee.jobTitle,
          companyName: attendee.companyName,
          eventName: getMetadata('event-title'),
        }),
      });

      if (!response.ok) {
        console.error(`Error fetching events: ${response.statusText}`);
        resolve(defaultEvents); // Resolve with default events on error
        return;
      }

      const fetchedEvents = await response.json();
      resolve(fetchedEvents || defaultEvents); // Resolve with fetched events or fallback to default

    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to default events after 3 seconds delay in case of error
      setTimeout(() => {
        resolve(defaultEvents);
      }, 3000);
    }
  });

  // Return the cached promise (whether resolved or pending)
  return eventsPromise;
}


function createCard(event) {
  const card = createTag('div', { class: 'event-card' });
  const cardHeader = createTag('div', { class: 'card-header' });

  const defaultImage = 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGV2ZW50fGVufDB8fDB8fHww';
  const imgSrc = event.image ? event.image : defaultImage;
  const img = createTag('img', { src: imgSrc, alt: event.title });

  const cardContent = createTag('div', { class: 'card-content' });
  const title = createTag('h3', { class: 'card-title' }, event.title);
  const description = createTag('p', { class: 'card-description' }, event.description);
  const details = createTag('div', { class: 'card-details' });
  const dateSpan = createTag('span', {}, event.date);
  const viewEvent = createTag('a', { class: 'consonant-BtnInfobit', href: '#' });
  const buttonText = createTag('span', {}, 'View Event');
  const venue = createTag('div', { class: 'card-venue' }, event.venue);

  viewEvent.append(buttonText);
  details.append(dateSpan, viewEvent);
  cardHeader.append(img);
  cardContent.append(title, description, details, venue);
  card.append(cardHeader, cardContent);

  return card;
}

function displayCards(events, container) {
  events.forEach((event) => {
    const card = createCard(event);
    container.appendChild(card);
  });
}

async function decorateEventsRecommendations(screen) {
  if (!screen || screen.querySelector('section.recommended-events')) return;

  const tag = createTag('section', { class: 'recommended-events loading' });
  const header = createTag('div', { class: 'section-header' }, 'Other interesting events for you');
  const carouselContainer = createTag('div', { class: 'carousel', id: 'card-container' });
  const loadingOverlay = createTag('sp-theme', { color: 'light', scale: 'medium', class: 'loading-overlay' }, '', { parent: carouselContainer });
  createTag('sp-progress-circle', { size: 'l', indeterminate: true }, '', { parent: loadingOverlay });

  tag.append(header, carouselContainer);

  screen.append(tag);

  await Promise.all([
    import(`${LIBS}/deps/lit-all.min.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/theme.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/progress-circle.js`),
  ]);

  const events = await fetchRelevantEvents();

  tag.classList.remove('loading');

  displayCards(events, carouselContainer);
}

async function decorateEventsRecommendationsOnAllScreens(bp) {
  const list = [bp.rsvpSuccessScreen, bp.waitlistSuccessScreen];
  return Promise.all(list.map(async (screen) => {
    await decorateEventsRecommendations(screen);
  }));
}

function createButton({ type, label }, bp) {
  const button = createTag('button', { class: 'button' }, label);
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

        BlockMediator.set('rsvpData', respJson.data);

        if (respJson.ok) {
          eventFormSendAnalytics(bp, 'Form Submit');
        } else {
          let { status } = respJson;

          // FIXME: temporary fix for ESL 500 on ESP 400
          if (!status || status === 500) {
            if (respJson.error?.message === 'Request to ESP failed: Event is full') {
              status = 400;
            }
          }
          buildErrorMsg(bp.form, status);
        }

        await decorateEventsRecommendationsOnAllScreens(bp);
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
  const defList = def.split(';').map((defItem) => defItem.trim());
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
        force = (payload[key].split(';').map((s) => s.trim()).includes(value));
        break;
      case RULE_OPERATORS.excludes:
        force = (!payload[key].split(';').map((s) => s.trim()).includes(value));
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

async function decorateSuccessScreen(screen) {
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
            const resp = await deleteAttendeeFromEvent(getMetadata('event-id'));
            if (!resp.ok) return;

            const { data } = resp;

            cta.classList.remove('loading');
            if (data?.espProvider?.status !== 204) {
              buildErrorMsg(screen);
              return;
            }

            if (data?.espProvider?.attendeeDeleted) BlockMediator.set('rsvpData', null);

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

  // const tag = createTag('div', { class: 'dialog' });
  // tag.append(createTag('div', { class: 'dialog-header' }, 'Find Similar Events'));
  // const container2 = createTag('div', { class: 'carousel', id: 'card-container' });
  // tag.append(container2);

  screen.classList.add('hidden');
}

async function createForm(bp, formData) {
  const { form, terms } = bp;
  let rsvpFieldsData;

  try {
    rsvpFieldsData = JSON.parse(getMetadata('rsvp-form-fields'));
  } catch (error) {
    window.lana?.log('Failed to parse partners metadata:', error);
  }

  const { pathname } = new URL(form.href);
  let json = formData;
  /* c8 ignore next 4 */
  if (!formData) {
    const resp = await fetch(pathname);
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

  const formEl = createTag('form');
  const rules = [];
  const [action] = pathname.split('.json');
  formEl.dataset.action = action;

  const typeToElement = {
    select: { fn: createSelect, params: [], label: true, classes: [] },
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

  json.data.forEach((fd) => {
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

  formEl.addEventListener('input', () => applyRules(formEl, rules));
  applyRules(formEl, rules);

  return {
    formEl,
    sanitizeList,
  };
}

function personalizeForm(form, data) {
  if (!data || !form) return;

  Object.entries(data).forEach(([key, value]) => {
    const matchedInput = form.querySelector(`#${snakeToCamel(key)}`);
    if (matchedInput && value && !matchedInput.value) {
      matchedInput.value = value;
      matchedInput.disabled = true;
    }
  });
}

function decorateHero(heroEl) {
  heroEl.classList.add('event-form-hero');
}

async function buildEventform(bp, formData) {
  if (!bp.formContainer || !bp.form) return;
  bp.formContainer.classList.add('form-container');
  const { formEl, sanitizeList } = await createForm(bp, formData);

  const list = [bp.rsvpSuccessScreen, bp.waitlistSuccessScreen];
  await Promise.all(list.map(async (screen) => {
    await decorateSuccessScreen(screen);
  }));

  if (formEl) {
    bp.form.replaceWith(formEl);
    bp.form = formEl;
    bp.sanitizeList = sanitizeList;
  }
}

function initFormBasedOnRSVPData(bp) {
  const validRegistrationStatus = ['registered', 'waitlisted'];
  const { block } = bp;
  const profile = BlockMediator.get('imsProfile');
  const rsvpData = BlockMediator.get('rsvpData');

  if (validRegistrationStatus.includes(rsvpData?.registrationStatus)) {
    decorateEventsRecommendationsOnAllScreens(bp);
    showSuccessMsgFirstScreen(bp);
    eventFormSendAnalytics(bp, 'Confirmation Modal View');
  } else {
    personalizeForm(block, profile);
  }

  BlockMediator.subscribe('rsvpData', ({ newValue }) => {
    if (validRegistrationStatus.includes(newValue?.registrationStatus)) {
      decorateEventsRecommendationsOnAllScreens(bp);
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

  if (profile && !profile.noProfile) {
    eventHero.classList.remove('loading');
    decorateHero(bp.eventHero);
    buildEventform(bp, formData).then(() => {
      initFormBasedOnRSVPData(bp);
    }).finally(() => {
      decorateDefaultLinkAnalytics(block);
      block.classList.remove('loading');
    });
  } else if (!profile) {
    BlockMediator.subscribe('imsProfile', ({ newValue }) => {
      if (newValue && !newValue.noProfile) {
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
  const miloLibs = LIBS;
  await Promise.all([
    import(`${miloLibs}/deps/lit-all.min.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
    import(`${miloLibs}/features/spectrum-web-components/dist/toast.js`),
  ]);
  const toastArea = createTag('sp-theme', { color: 'light', scale: 'medium', class: 'toast-area' });
  document.body.append(toastArea);
  return toastArea;
}

async function futureProofing(block) {
  const authoredWaitlistSuccessScreen = block.querySelector(':scope > div:nth-of-type(5)');

  if (!authoredWaitlistSuccessScreen) {
    const resp = await fetch('/events/fragments/drafts/draft-rsvp-form').then((res) => res.text());
    const parser = new DOMParser();
    const doc = parser.parseFromString(resp, 'text/html');

    const eventsForm = doc.querySelector('.events-form');
    if (eventsForm) {
      decorateArea(eventsForm);
      block.innerHTML = eventsForm.innerHTML;
    }
  }
}

export default async function decorate(block, formData = null) {
  block.classList.add('loading');
  const toastArea = await decorateToastArea();

  // TODO: remove after authoring updates
  await futureProofing(block);

  const bp = {
    block,
    toastArea,
    eventHero: block.querySelector(':scope > div:nth-of-type(1)'),
    formContainer: block.querySelector(':scope > div:nth-of-type(2)'),
    form: block.querySelector(':scope > div:nth-of-type(2) a[href$=".json"]'),
    terms: block.querySelector(':scope > div:nth-of-type(3)'),
    rsvpSuccessScreen: block.querySelector(':scope > div:nth-of-type(4)'),
    waitlistSuccessScreen: block.querySelector(':scope > div:nth-of-type(5)'),
  };

  if (!bp.waitlistSuccessScreen) {
    const { rsvpSuccessScreen, waitlistSuccessScreen } = await futureProofing(block);

    if (rsvpSuccessScreen) bp.rsvpSuccessScreen = rsvpSuccessScreen;
    if (waitlistSuccessScreen) bp.waitlistSuccessScreen = waitlistSuccessScreen;
  }

  await onProfile(bp, formData);
}
