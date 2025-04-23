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
  const errorSpan = inputElement.nextSibling;
  errorSpan.classList.add('show');
  errorSpan.innerHTML = error;
}

function decorateThankYouView(thanksView) {
  const bp = {
    thanksView,
    thankyouTitle: thanksView.querySelector(':scope > div:nth-of-type(2) h2'),
    thankyouDescription: thanksView.querySelector(':scope > div:nth-of-type(2) > p'),
  };

  bp.thankyouTitle.classList.add('thankyou-title');
  bp.thankyouDescription.classList.add('thankyou-description');
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

async function handleSubmit(event, bp) {
  event.preventDefault();

  const inputElement = bp.block.querySelector(':scope > form > div > div:nth-of-type(2) > input');

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
    event.target.disabled = true;

    const payload = {
      email,
      sname: bp.sname.textContent.slice(2, -2),
      consent_notice: bp.consentNotice.textContent,
      current_url: window.location.href,
    };
    const resp = await subscribe(payload);

    if (!resp.successful) {
      event.target.disabled = false;
      window.lana?.log(`Error while subscribing email :\n${JSON.stringify(resp.reason, null, 2)}`);
      console.error(resp.reason);
      decorateError('Something went wrong', inputElement);
      return;
    }

    // hide form view
    const formView = bp.block.querySelector(':scope > form');

    formView.classList.add('hide');

    // show thankyou view
    const thankyouView = bp.block.querySelector(':scope > div:nth-of-type(1)');
    thankyouView.classList.remove('hide');
    decorateThankYouView(thankyouView);
  } catch (err) {
    event.target.disabled = false;
    window.lana?.log(`Exception in email subscription :\n "${err}"`);
    console.error(err);
    decorateError('Internal error', inputElement);
  }
}

function decorateButton(bp) {
  const button = createTag('button', { class: 'subscription-submit' }, bp.submitP.textContent);
  button.addEventListener('click', (event) => {
    handleSubmit(event, bp);
  });

  createTag('div', { class: 'subscription-submit-container' }, button, { parent: bp.submitP.parentElement });

  bp.submitP.remove();
}

function addElementToForm(form, inputP, labelP) {
  const profile = BlockMediator.get('imsProfile');
  if (profile === undefined) {
    BlockMediator.subscribe('imsProfile', (data) => {
      if (data && data.email) {
        const subscriptionInput = form.querySelector('.subscription-input');
        if (subscriptionInput) {
          subscriptionInput.value = data.email;
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
    ...(profile && !profile.noProfile && !profile.account_type === 'guest' && profile.email !== undefined && { value: profile.email }),
    required: 'true',
    class: 'subscription-input',
  };

  createTag('label', labelAttr, labelText, { parent: form });

  createTag('input', inputAttr, undefined, { parent: form });

  createTag('span', { class: 'error-message' }, '', { parent: form });

  inputP.remove();

  labelP.remove();
}

function addForm(bp) {
  const parent = bp.formDiv.parentElement;
  const form = createTag('form', { id: 'subscription-form' }, bp.formDiv);
  parent.insertBefore(form, parent.firstChild);

  const main = form.querySelector('div:nth-of-type(2)');
  main.classList.add('subscription-textbox-container');
  addElementToForm(main, bp.inputP, bp.labelP);
  decorateButton(bp);
}

function decorateFormView(block) {
  const blockElem = {
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
  };

  blockElem.formDiv.classList.add('subscription-form');
  blockElem.modalTitle.classList.add('subscription-title');
  blockElem.modalDescription.classList.add('subscription-description');
  blockElem.consentNotice.classList.add('subscription-consent-notice');
  blockElem.thankyouView.classList.add('hide');
  blockElem.sname.classList.add('hide');

  addForm(blockElem);
}

export default function init(el) {
  // decide which view to load depending on the modal url
  const modalUrl = window.location.href.split('#')[1];

  if (modalUrl === 'thankyou') {
    // call a function to show thank you message.
    decorateThankYouView(el);
  } else {
    // call a function to init event mailing list form.
    decorateFormView(el);
  }
}
