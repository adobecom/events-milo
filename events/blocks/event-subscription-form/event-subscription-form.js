import { createTag, getEventServiceEnv } from '../../scripts/utils.js';
import BlockMediator from '../../scripts/deps/block-mediator.min.js';

const CONFIG = {
  ENDPOINTS: {
    local: { host: 'https://www.stage.adobe.com/api2/subscribe_v1' },
    dev: { host: 'https://www.stage.adobe.com/api2/subscribe_v1' },
    dev02: { host: 'https://www.stage.adobe.com/api2/subscribe_v1' },
    stage: { host: 'https://www.stage.adobe.com/api2/subscribe_v1' },
    stage02: { host: 'https://www.stage.adobe.com/api2/subscribe_v1' },
    prod: { host: 'https://www.adobe.com/api2/subscribe_v1' },
  },
  VALIDATION: {
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    ERROR_MESSAGES: {
      REQUIRED: 'Required Field',
      INVALID_EMAIL: 'Must be a valid Email address',
    },
  },
};

function validateInput(input) {
  const emailPattern = CONFIG.VALIDATION.EMAIL_REGEX;
  return emailPattern.test(input);
}

function decorateError(error, inputElement) {
  inputElement.classList.add('error');
  inputElement.setAttribute('aria-invalid', 'true');
  const errorSpan = inputElement.nextSibling;
  errorSpan.classList.add('show');
  errorSpan.innerHTML = error;
  errorSpan.setAttribute('aria-live', 'assertive');
}

// function flipToFront(bp) {
//   bp.flipper.classList.remove('flipped');
// }

function flipToBack(bp) {
  bp.flipper.classList.add('flipped');
  bp.form.setAttribute('inert', '');
}

/**
 * @description : Subscribes the user to the mailing list
 * @param {*} payload : {email: string, sname:string, consent_notice: string, current_url:string}
 * @response : {"successful": true,"reason": null}
 */
async function subscribe(payload) {
  // If you have an API key, you can use it here.
  const campaignUrl = CONFIG.ENDPOINTS[getEventServiceEnv()].host;
  const response = await fetch(campaignUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}

async function handleSubmit(e, bp) {
  e.preventDefault();

  const inputElement = bp.form.querySelector('div > div:nth-of-type(2) > input');
  const submitButton = e.target.querySelector('button');

  // Validate the input
  const email = inputElement.value;
  if (email.length === 0) {
    decorateError(CONFIG.VALIDATION.ERROR_MESSAGES.REQUIRED, inputElement);
    return;
  } if (!validateInput(email)) {
    decorateError(CONFIG.VALIDATION.ERROR_MESSAGES.INVALID_EMAIL, inputElement);
    return;
  }

  try {
    // Disable the multiple clicks.

    if (submitButton) {
      submitButton.disabled = true;
    }

    const payload = {
      email,
      sname: bp.sname.textContent.slice(2, -2),
      consent_notice: bp.consentNotice.textContent,
      current_url: window.location.href,
    };

    const resp = await subscribe(payload);

    if (!resp.successful) {
      e.target.disabled = false;
      window.lana?.log(`Error while subscribing email :\n${JSON.stringify(resp.reason, null, 2)}`);
      decorateError('Something went wrong', inputElement);
      if (submitButton) {
        submitButton.disabled = false;
      }
      return;
    }

    flipToBack(bp);
  } catch (err) {
    e.target.disabled = false;
    window.lana?.log(`Exception in email subscription :\n "${err}"`);
    decorateError('Internal error', inputElement);
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

function addElementToForm(form, inputP, labelP) {
  const profile = BlockMediator.get('imsProfile');
  if (profile === undefined) {
    BlockMediator.subscribe('imsProfile', ({ newValue }) => {
      if (newValue && newValue.email) {
        const subscriptionInput = form.querySelector('.subscription-input');
        if (subscriptionInput) {
          subscriptionInput.value = newValue.email;
        }
      }
    });
  }

  const placeholder = inputP.textContent;
  const labelText = labelP.textContent;
  const labelAttr = {
    for: 'email',
    textContent: labelText,
    class: 'subscription-label',
  };

  const inputAttr = {
    type: 'email',
    name: 'email',
    placeholder,
    ...(profile && !profile.noProfile && profile.account_type !== 'guest' && profile.email !== undefined && { value: profile.email }),
    required: 'true',
    class: 'subscription-input',
    'aria-required': 'true',
    'aria-invalid': 'false',
    'aria-describedby': 'email-error',
  };

  createTag('label', labelAttr, labelText, { parent: form });
  createTag('input', inputAttr, '', { parent: form });
  createTag('span', { class: 'error-message', id: 'email-error', role: 'alert' }, '', { parent: form });

  inputP.remove();
  labelP.remove();
}

function addForm(bp) {
  const parent = bp.formDiv.parentElement;
  const form = createTag('form', {
    class: 'front-view',
    'aria-label': 'Email subscription form',
    role: 'form',
  }, bp.formDiv);
  bp.formDiv.append(bp.consentNotice);
  const submitContainer = createTag('div', { class: 'subscription-submit-container' }, '', { parent: bp.formDiv });
  createTag('button', {
    class: 'subscription-submit',
    type: 'submit',
    'aria-label': 'Subscribe to email updates',
  }, bp.submitP.textContent, { parent: submitContainer });

  bp.submitP.remove();

  form.addEventListener('submit', (e) => {
    handleSubmit(e, bp);
  });

  parent.prepend(form);

  const main = form.querySelector('div:nth-of-type(2)');
  main.classList.add('subscription-textbox-container');
  addElementToForm(main, bp.inputP, bp.labelP);

  return form;
}

function parseBlockElements(block) {
  const bp = {
    block,
    formDiv: block.querySelector(':scope > div:nth-of-type(1)'),
    modalTitle: block.querySelector(':scope > div:nth-of-type(1) > div > h2'),
    sname: block.querySelector(':scope > div:nth-of-type(1) > div > p:nth-of-type(1)'),
    modalDescription: block.querySelector(':scope > div:nth-of-type(1) > div > p:nth-of-type(2)'),
    labelP: block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(2) > p:nth-of-type(1)'),
    inputP: block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(2) > p:nth-of-type(2)'),
    consentNotice: block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(3) > p'),
    submitP: block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(3) > p:nth-of-type(2)'),
    thankyouView: block.querySelector(':scope > div:nth-of-type(2)'),
    thankyouTitle: block.querySelector(':scope > div:nth-of-type(2) h2'),
    thankyouDescription: block.querySelector(':scope > div:nth-of-type(2) > p'),
  };

  bp.formDiv.classList.add('subscription-form');
  bp.modalTitle.classList.add('subscription-title');
  bp.modalDescription.classList.add('subscription-description');
  bp.consentNotice.classList.add('subscription-consent-notice');
  bp.thankyouView.classList.add('back-view', 'thankyou-view');
  bp.sname.classList.add('hidden');

  // Add ARIA attributes to thank you view
  bp.thankyouView.setAttribute('role', 'alert');
  bp.thankyouView.setAttribute('aria-live', 'polite');
  bp.thankyouView.setAttribute('aria-label', 'Subscription confirmation');

  return bp;
}

export default function init(el) {
  let bp = { flipper: createTag('div', { class: 'flipper' }) };

  bp = { ...bp, ...parseBlockElements(el) };
  bp.form = addForm(bp);

  el.prepend(bp.flipper);
  bp.flipper.append(bp.form, bp.thankyouView);

  // FIXME: This doesn't work unless the frag link is authored with #thankyou. Why did we add this?
  // const urlHash = window.location.hash;

  // if (urlHash === '#thankyou') {
  //   flipToBack(bp);
  // } else {
  //   flipToFront(bp);
  // }
}
