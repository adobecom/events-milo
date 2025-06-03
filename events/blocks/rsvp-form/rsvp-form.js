import { LIBS } from '../../scripts/utils.js';
import { getAndCreateAndAddAttendee } from '../../scripts/esp-controller.js';
import BlockMediator from '../../scripts/deps/block-mediator.min.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);
const { sendAnalytics } = await import(`${LIBS}/blocks/modal/modal.js`);

// Helper functions
function showSuccessMessage(container) {
  const successMessage = createTag('div', { class: 'success-message' });
  successMessage.innerHTML = `
    <h2>Thank you for your RSVP!</h2>
    <p>We look forward to seeing you at the event.</p>
  `;
  container.innerHTML = '';
  container.append(successMessage);
}

function showErrorMessage(container) {
  const errorMessage = createTag('div', { class: 'error-message' });
  errorMessage.textContent = 'An error occurred. Please try again.';
  container.prepend(errorMessage);
  setTimeout(() => errorMessage.remove(), 3000);
}

function eventFormSendAnalytics(view) {
  const modal = document.querySelector('.dialog-modal');
  if (!modal) return;
  const title = document.querySelector('meta[name="event-title"]')?.content;
  const name = title ? ` | ${title}` : '';
  const modalId = modal.id ? ` | ${modal.id}` : '';
  const event = new Event(`${view}${name}${modalId}`);
  sendAnalytics(event);
}

export default async function init(el) {
  // Import Spectrum Web Components
  await Promise.all([
    import(`${LIBS}/deps/lit-all.min.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/theme.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/toast.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/button.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/dialog.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/underlay.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/progress-circle.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/textfield.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/picker.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/field-label.js`),
  ]);

  // Create theme wrapper
  const theme = createTag('sp-theme', { color: 'light', scale: 'medium' });

  // Create form container
  const formContainer = createTag('div', { class: 'rsvp-form-container' });
  const form = createTag('form', { class: 'rsvp-form' });

  // Create form fields based on mock-fields.json
  const fields = [
    { type: 'text', name: 'firstName', label: 'First Name', required: true },
    { type: 'text', name: 'lastName', label: 'Last Name', required: true },
    { type: 'text', name: 'email', label: 'Email', required: true },
    { type: 'text', name: 'businessPhone', label: 'Business Phone', required: true },
    { type: 'text', name: 'organizationName', label: 'Organization Name', required: true },
    { type: 'select', name: 'country', label: 'Country / Region', required: true },
    { type: 'text', name: 'zipCode', label: 'Zip / Postal Code', required: true },
    { type: 'select', name: 'employees', label: 'Employees in Organization', required: true },
    { type: 'select', name: 'industry', label: 'Industry', required: true },
    { type: 'select', name: 'functionalArea', label: 'Functional area/department', required: true },
    { type: 'text', name: 'title', label: 'Title', required: true },
    { type: 'select', name: 'jobRole', label: 'Job Role', required: true },
    { type: 'select', name: 'primaryProduct', label: 'Primary Product of Interest', multiple: true },
    { type: 'text', name: 'invitedBy', label: 'Invited by' },
    { type: 'text', name: 'specialRequirements', label: 'Special requirements' },
  ];

  // Create form fields
  fields.forEach((field) => {
    const fieldWrapper = createTag('div', { class: 'field-wrapper' });
    const label = createTag('sp-field-label', { for: field.name, required: field.required }, field.label);

    let input;
    if (field.type === 'text') {
      input = createTag('sp-textfield', {
        id: field.name,
        name: field.name,
        required: field.required,
        placeholder: field.label,
      });
    } else if (field.type === 'select') {
      input = createTag('sp-picker', {
        id: field.name,
        name: field.name,
        required: field.required,
        multiple: field.multiple,
      });

      // Add options based on field name
      if (field.name === 'employees') {
        const options = [
          { label: '1-9', value: '1_9' },
          { label: '10-99', value: '10_99' },
          { label: '100-499', value: '100_499' },
          { label: '500-999', value: '500_999' },
          { label: '1000-4999', value: '1000_4999' },
          { label: '5000+', value: '5000_plus' },
        ];
        options.forEach((opt) => {
          const option = createTag('sp-menu-item', { value: opt.value }, opt.label);
          input.append(option);
        });
      }
      // Add other select options as needed
    }

    fieldWrapper.append(label, input);
    form.append(fieldWrapper);
  });

  // Add submit button
  const submitWrapper = createTag('div', { class: 'submit-wrapper' });
  const submitButton = createTag('sp-button', {
    type: 'submit',
    variant: 'primary',
    class: 'submit-button',
  }, 'Submit');
  submitWrapper.append(submitButton);
  form.append(submitWrapper);

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.classList.add('submitting');

    const formData = new FormData(form);
    const payload = {};
    formData.forEach((value, key) => {
      payload[key] = value;
    });

    try {
      const eventId = document.querySelector('meta[name="event-id"]')?.content;
      const response = await getAndCreateAndAddAttendee(eventId, payload);
      if (response.ok) {
        BlockMediator.set('rsvpData', response.data);
        showSuccessMessage(formContainer);
        eventFormSendAnalytics('Form Submit');
      } else {
        showErrorMessage(formContainer);
      }
    } catch (error) {
      showErrorMessage(formContainer);
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove('submitting');
    }
  });

  formContainer.append(form);
  theme.append(formContainer);
  el.append(theme);
}
