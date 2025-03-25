import { createTag } from '../../scripts/utils.js';

function validateInput(input) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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

async function subscribe(email) {
  // If you have an API key, you can use it here.
  return { email };
  /* const response = await fetch('https://www.adobe.com/api2/subscribe_v1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return response.json();
  */
}

async function handleSubmit(event, bp) {
  event.preventDefault();

  const inputElement = bp.block.querySelector(':scope > form > div > div:nth-of-type(2) > input');

  // Validate the input
  const email = inputElement.value;
  if (email.length === 0) {
    console.log('Email is a required Field');
    decorateError('Required Field', inputElement);
    return;
  } if (!validateInput(email)) {
    console.log('Input email must be a valid Email address');
    decorateError('Must be a valid Email address', inputElement);
    return;
  }

  try {
    // Disable the multiple clicks.
    event.target.disabled = true;

    await subscribe(email);

    // hide form view
    const formView = bp.block.querySelector(':scope > form');

    formView.classList.add('hide');

    // show thankyou view
    const thankyouView = bp.block.querySelector(':scope > div:nth-of-type(1)');
    thankyouView.classList.remove('hide');
    decorateThankYouView(thankyouView);
  } catch (err) {
    event.target.disabled = false;
    console.error(err);
    decorateError('Error subscribing', inputElement);
  }
}

function decorateButton(bp) {
  const button = createTag('button', { class: 'mailinglist-submit' });
  button.innerHTML = bp.submitP.innerHTML;
  button.addEventListener('click', (event) => {
    handleSubmit(event, bp);
  });
  const div = createTag('div', { class: 'mailinglist-submit-container' });
  bp.submitP.parentElement.appendChild(div);
  div.appendChild(button);
  bp.submitP.remove();
}

function addElementtoForm(form, inputP, labelP) {
  const placeholder = inputP.innerHTML;
  const labelText = labelP.innerHTML;
  const labelAttr = {
    for: 'email',
    textContent: labelText,
    class: 'mailinglist-label',
  };

  const inputAttr = {
    type: 'email',
    name: 'email',
    placeholder,
    required: 'true',
    class: 'mailinglist-input',
  };

  const label = createTag('label', labelAttr);
  label.innerHTML = labelText;
  form.appendChild(label);

  const input = createTag('input', inputAttr);
  form.appendChild(input);

  const errorSpan = createTag('span', { class: 'error-message' });
  errorSpan.innerHTML = 'Please enter a valid email address';
  form.appendChild(errorSpan);

  inputP.remove();
  labelP.remove();
}
function addForm(bp) {
  const { formDiv } = bp;
  const parent = formDiv.parentElement;
  const formAttr = { id: 'mailinglist-form' };
  const form = createTag('form', formAttr);
  form.appendChild(formDiv);
  parent.insertBefore(form, parent.firstChild);

  const main = form.querySelector('div:nth-of-type(2)');
  main.classList.add('mailinglist-textBox');
  addElementtoForm(main, bp.inputP, bp.labelP);
  decorateButton(bp);
}

function decorateFormView(block) {
  const blockElem = {
    block,
    formDiv: block.querySelector(':scope > div:nth-of-type(1)'),
    modalTitle: block.querySelector(':scope > div:nth-of-type(1) > div > h2'),
    modalDescription: block.querySelector(':scope > div:nth-of-type(1) > div > p'),
    labelP: block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(2) > p:nth-of-type(1)'),
    inputP: block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(2) > p:nth-of-type(2)'),
    consentNotice: block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(3) > p'),
    submitP: block.querySelector(':scope > div:nth-of-type(1) > div:nth-of-type(3) > p:nth-of-type(2)'),
    thankyouView: block.querySelector(':scope > div:nth-of-type(2)'),
  };

  blockElem.formDiv.classList.add('mailinglist-form');
  blockElem.modalTitle.classList.add('mailinglist-title');
  blockElem.modalDescription.classList.add('mailinglist-description');
  blockElem.consentNotice.classList.add('mailinglist-consent-notice');
  blockElem.thankyouView.classList.add('hide');

  addForm(blockElem);
}

export default function init(el) {
  // decide which view to load depending on the modal url
  const modalUrl = window.location.href.split('#')[1];

  if (modalUrl === 'subscribe') {
    // call a function to init event mailing list form.
    decorateFormView(el);
  } else if (modalUrl === 'thankyou') {
    // call a function to show thank you message.
    decorateThankYouView(el);
  } else {
    console.error('Invalid modal url');
  }
}
