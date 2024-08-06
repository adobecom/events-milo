import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import init, { convertToLocaleTimeFormat } from '../../../../events/blocks/event-agenda/event-agenda.js'; // Update with the correct path
import { setMetadata } from '../../../../events/scripts/utils.js';

const body = await readFile({ path: './mocks/default.html' });

describe('Agenda Module', () => {
  describe('convertToLocaleTimeFormat', () => {
    it('should convert time to locale format', () => {
      const time = '13:45:00';
      const locale = 'en-US';
      const formattedTime = convertToLocaleTimeFormat(time, locale);
      expect(formattedTime).to.equal('1:45 PM');
    });
  });

  describe('init', () => {
    beforeEach(() => {
      document.body.innerHTML = body;
      document.head.innerHTML = '';
    });

    it('should create agenda container and items based on metadata', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', description: 'Opening' }]));
      setMetadata('photos', JSON.stringify([{ imageKind: 'venue-image', sharepointUrl: 'https://example.com/image.jpg', imageUrl: 'http://example.com/image.jpg', altText: 'Venue Image' }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items-col');
      expect(itemsCol).to.not.be.null;

      const agendaItem = itemsCol.querySelector('.agenda-item-wrapper');
      expect(agendaItem).to.not.be.null;
      expect(agendaItem.querySelector('.agenda-time').textContent).to.equal('9:00 AM');
      expect(agendaItem.querySelector('.agenda-desciption').textContent).to.equal('Opening');
    });

    it('should use relative sharepoint URL directly', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', description: 'Opening' }]));
      setMetadata('photos', JSON.stringify([{ imageKind: 'venue-image', sharepointUrl: '/example.com/image.jpg', imageUrl: 'http://example.com/image.jpg' }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items-col');
      expect(itemsCol).to.not.be.null;

      const agendaItem = itemsCol.querySelector('.agenda-item-wrapper');
      expect(agendaItem).to.not.be.null;
      expect(agendaItem.querySelector('.agenda-time').textContent).to.equal('9:00 AM');
      expect(agendaItem.querySelector('.agenda-desciption').textContent).to.equal('Opening');
    });

    it('should fallback on imageUrl when given invalid absolute sharepoint URL', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', description: 'Opening' }]));
      setMetadata('photos', JSON.stringify([{ imageKind: 'venue-image', sharepointUrl: 'https://////sdawd3123%O*&$/example.com/image.jpg', imageUrl: 'http://example.com/image.jpg' }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items-col');
      expect(itemsCol).to.not.be.null;

      const agendaItem = itemsCol.querySelector('.agenda-item-wrapper');
      expect(agendaItem).to.not.be.null;
      expect(agendaItem.querySelector('.agenda-time').textContent).to.equal('9:00 AM');
      expect(agendaItem.querySelector('.agenda-desciption').textContent).to.equal('Opening');
    });

    it('should use fallback values when metadata is incomplete', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', description: 'Opening' }]));
      setMetadata('photos', JSON.stringify([{ imageKind: 'venue-image', imageUrl: 'http://example.com/image.jpg' }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items-col');
      expect(itemsCol).to.not.be.null;

      const agendaItem = itemsCol.querySelector('.agenda-item-wrapper');
      expect(agendaItem).to.not.be.null;
      expect(agendaItem.querySelector('.agenda-time').textContent).to.equal('9:00 AM');
      expect(agendaItem.querySelector('.agenda-desciption').textContent).to.equal('Opening');
    });

    it('should handle invalid agenda metadata gracefully', async () => {
      setMetadata('agenda', 'invalid JSON');

      const el = document.querySelector('.event-agenda');
      await init(el);

      expect(el.parentNode).to.be.null;
    });

    it('should handle no agenda metadata gracefully', async () => {
      const el = document.querySelector('.event-agenda');
      await init(el);

      expect(el.parentNode).to.be.null;
    });

    it('should handle empty agenda metadata gracefully', async () => {
      setMetadata('agenda', JSON.stringify([]));
      const el = document.querySelector('.event-agenda');
      await init(el);

      expect(el.parentNode).to.be.null;
    });

    it('should remove element if metadata "show-agenda-post-event" is not "true" and body has class "timing-post-event"', async () => {
      document.body.classList.add('timing-post-event');
      setMetadata('show-agenda-post-event', 'false');

      const el = document.querySelector('.event-agenda');
      await init(el);

      expect(el.parentNode).to.be.null;
    });
  });
});
