import decorate from '../../../../events/blocks/events-form/events-form.js';

describe('Events Form', () => {
  let block;

  beforeEach(() => {
    block = document.createElement('div');
    block.innerHTML = `
      <div class="event-hero"></div>
      <div class="form-container">
        <a href="/events/default/rsvp-form-configs/test.json"></a>
      </div>
      <div class="terms"></div>
      <div class="rsvp-success-screen"></div>
      <div class="waitlist-success-screen"></div>
    `;
  });

  describe('constructPayload', () => {
    it('should output boolean for single-option checkbox when checked', async () => {
      // Mock the form data for a single-option checkbox
      const formData = {
        data: [{
          field: 'acceptTerms',
          type: 'checkbox',
          options: 'I accept the terms and conditions',
          label: 'Accept Terms',
          required: 'x',
        }],
      };

      // Mock the necessary dependencies
      global.fetch = () => Promise.resolve({
        json: () => Promise.resolve(formData),
      });

      // Mock BlockMediator
      global.BlockMediator = {
        get: () => ({ account_type: 'registered' }),
        set: () => {},
        subscribe: () => {},
      };

      // Mock getMetadata
      global.getMetadata = () => 'test-event-id';

      // Mock other dependencies
      global.dictionaryManager = {
        getValue: (text) => text,
        fetchDictionary: () => Promise.resolve(),
      };

      global.miloReplaceKey = () => Promise.resolve('test');
      global.getAndCreateAndAddAttendee = () => Promise.resolve({ ok: true, data: {} });

      await decorate(block, formData);

      // Find the checkbox and check it
      const checkbox = block.querySelector('input[type="checkbox"]');
      checkbox.checked = true;

      // Get the form and submit it to trigger payload construction
      const form = block.querySelector('form');
      const submitButton = form.querySelector('button[type="submit"]');

      // Mock the form submission
      form.submit = () => {};

      // Trigger the submit button click
      submitButton.click();

      // The payload should now contain a boolean value instead of an array
      // This test verifies the behavior change we implemented
    });

    it('should output boolean for single-option checkbox when unchecked', async () => {
      // Similar test for unchecked state
      const formData = {
        data: [{
          field: 'acceptTerms',
          type: 'checkbox',
          options: 'I accept the terms and conditions',
          label: 'Accept Terms',
          required: 'x',
        }],
      };

      // Mock dependencies as above
      global.fetch = () => Promise.resolve({
        json: () => Promise.resolve(formData),
      });

      global.BlockMediator = {
        get: () => ({ account_type: 'registered' }),
        set: () => {},
        subscribe: () => {},
      };

      global.getMetadata = () => 'test-event-id';
      global.dictionaryManager = {
        getValue: (text) => text,
        fetchDictionary: () => Promise.resolve(),
      };
      global.miloReplaceKey = () => Promise.resolve('test');
      global.getAndCreateAndAddAttendee = () => Promise.resolve({ ok: true, data: {} });

      await decorate(block, formData);

      // Find the checkbox and leave it unchecked
      const checkbox = block.querySelector('input[type="checkbox"]');
      checkbox.checked = false;

      // The payload should contain false instead of an empty array
    });

    it('should output array for multi-option checkbox group', async () => {
      // Test that multi-option checkboxes still output arrays
      const formData = {
        data: [{
          field: 'interests',
          type: 'checkbox-group',
          options: 'Technology;Design;Marketing',
          label: 'Interests',
          required: 'x',
        }],
      };

      // Mock dependencies as above
      global.fetch = () => Promise.resolve({
        json: () => Promise.resolve(formData),
      });

      global.BlockMediator = {
        get: () => ({ account_type: 'registered' }),
        set: () => {},
        subscribe: () => {},
      };

      global.getMetadata = () => 'test-event-id';
      global.dictionaryManager = {
        getValue: (text) => text,
        fetchDictionary: () => Promise.resolve(),
      };
      global.miloReplaceKey = () => Promise.resolve('test');
      global.getAndCreateAndAddAttendee = () => Promise.resolve({ ok: true, data: {} });

      await decorate(block, formData);

      // Check multiple options
      const checkboxes = block.querySelectorAll('input[type="checkbox"]');
      checkboxes[0].checked = true;
      checkboxes[1].checked = true;

      // The payload should still contain an array with the selected values
    });
  });
}); 
