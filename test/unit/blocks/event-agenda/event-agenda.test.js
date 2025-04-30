import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import init, { convertToLocaleTimeFormat } from '../../../../events/blocks/event-agenda/event-agenda.js';
import { setMetadata } from '../../../../events/scripts/utils.js';

const body = await readFile({ path: './mocks/default.html' });

// Mock utility functions
const mockCreateTag = (tag, attributes, html, options = {}) => {
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
};

const mockCreateOptimizedPicture = (src, alt = '') => {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  return img;
};

describe('Agenda Module', () => {
  describe('convertToLocaleTimeFormat', () => {
    let originalIntl;

    beforeEach(() => {
      originalIntl = window.Intl;
    });

    afterEach(() => {
      window.Intl = originalIntl;
    });

    it('should convert time to locale format', () => {
      const time = '13:45:00';
      const locale = 'en-US';
      const formattedTime = convertToLocaleTimeFormat(time, locale);
      expect(formattedTime).to.equal('1:45 PM');
    });

    it('should handle 24-hour format for locales that use it', () => {
      // Mock Intl.DateTimeFormat for German locale
      window.Intl = {
        DateTimeFormat: function DateTimeFormat() {
          return { format: () => '13:45' };
        },
      };

      const time = '13:45:00';
      const locale = 'de-DE';
      const formattedTime = convertToLocaleTimeFormat(time, locale);
      expect(formattedTime).to.equal('13:45');
    });

    it('should handle midnight correctly', () => {
      const time = '00:00:00';
      const locale = 'en-US';
      const formattedTime = convertToLocaleTimeFormat(time, locale);
      expect(formattedTime).to.equal('12:00 AM');
    });

    it('should handle noon correctly', () => {
      const time = '12:00:00';
      const locale = 'en-US';
      const formattedTime = convertToLocaleTimeFormat(time, locale);
      expect(formattedTime).to.equal('12:00 PM');
    });
  });

  describe('init', () => {
    let originalGetConfig;
    let originalLana;
    let originalCreateTag;
    let originalCreateOptimizedPicture;

    beforeEach(() => {
      document.body.innerHTML = body;
      document.head.innerHTML = '';
      originalGetConfig = window.getConfig;
      originalLana = window.lana;
      originalCreateTag = window.createTag;
      originalCreateOptimizedPicture = window.createOptimizedPicture;
      window.getConfig = () => ({ locale: { ietf: 'en-US' } });
      window.lana = { log: () => {} };
      window.createTag = mockCreateTag;
      window.createOptimizedPicture = mockCreateOptimizedPicture;

      // Ensure the event-agenda element exists with the correct structure
      if (!document.querySelector('.event-agenda')) {
        const main = document.querySelector('main');
        const wrapper = document.createElement('div');
        const eventAgenda = document.createElement('div');
        eventAgenda.className = 'event-agenda';
        const innerDiv = document.createElement('div');
        const contentDiv = document.createElement('div');
        const h2 = document.createElement('h2');
        h2.textContent = 'Agenda';
        contentDiv.appendChild(h2);
        innerDiv.appendChild(contentDiv);
        eventAgenda.appendChild(innerDiv);
        wrapper.appendChild(eventAgenda);
        main.appendChild(wrapper);
      }
    });

    afterEach(() => {
      window.getConfig = originalGetConfig;
      window.lana = originalLana;
      window.createTag = originalCreateTag;
      window.createOptimizedPicture = originalCreateOptimizedPicture;
      document.body.classList.remove('timing-post-event');
    });

    it('should handle null element gracefully', async () => {
      await init(null);
      // No error should be thrown
    });

    it('should use default locale when locale configuration is missing', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', title: 'Title', description: 'Opening' }]));
      window.getConfig = () => ({}); // Return empty object to simulate missing locale config

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items');
      expect(itemsCol).to.not.be.null;

      const agendaItem = itemsCol.querySelector('.agenda-list-item');
      expect(agendaItem).to.not.be.null;

      const agendaTime = agendaItem.querySelector('.agenda-time');
      expect(agendaTime).to.not.be.null;
      expect(agendaTime.textContent).to.equal('9:00 AM'); // Should use default 'en-US' locale
    });

    it('should create agenda container and items based on metadata', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', title: 'Title', description: 'Opening' }]));
      setMetadata('photos', JSON.stringify([{ imageKind: 'venue-image', sharepointUrl: 'https://example.com/image.jpg', imageUrl: 'http://example.com/image.jpg', altText: 'Venue Image' }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items');
      expect(itemsCol).to.not.be.null;
      expect(itemsCol.classList.contains('agenda-items-with-image')).to.be.true;

      const agendaItem = itemsCol.querySelector('.agenda-list-item');
      expect(agendaItem).to.not.be.null;

      const agendaTime = agendaItem.querySelector('.agenda-time');
      expect(agendaTime).to.not.be.null;
      expect(agendaTime.textContent).to.equal('9:00 AM');

      const agendaTitleDetail = agendaItem.querySelector('.agenda-title-detail');
      expect(agendaTitleDetail).to.not.be.null;

      const agendaTitle = agendaTitleDetail.querySelector('.agenda-title');
      expect(agendaTitle).to.not.be.null;
      expect(agendaTitle.textContent).to.equal('Title');

      const agendaDetails = agendaTitleDetail.querySelector('.agenda-details');
      expect(agendaDetails).to.not.be.null;
      expect(agendaDetails.textContent).to.equal('Opening');
    });

    it('should use relative sharepoint URL directly', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', title: 'Title', description: 'Opening' }]));
      setMetadata('photos', JSON.stringify([{ imageKind: 'venue-image', sharepointUrl: '/example.com/image.jpg', imageUrl: 'http://example.com/image.jpg' }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items');
      expect(itemsCol).to.not.be.null;
      expect(itemsCol.classList.contains('agenda-items-with-image')).to.be.true;

      const agendaItem = itemsCol.querySelector('.agenda-list-item');
      expect(agendaItem).to.not.be.null;

      const agendaTime = agendaItem.querySelector('.agenda-time');
      expect(agendaTime).to.not.be.null;
      expect(agendaTime.textContent).to.equal('9:00 AM');

      const agendaTitleDetail = agendaItem.querySelector('.agenda-title-detail');
      expect(agendaTitleDetail).to.not.be.null;

      const agendaTitle = agendaTitleDetail.querySelector('.agenda-title');
      expect(agendaTitle).to.not.be.null;
      expect(agendaTitle.textContent).to.equal('Title');

      const agendaDetails = agendaTitleDetail.querySelector('.agenda-details');
      expect(agendaDetails).to.not.be.null;
      expect(agendaDetails.textContent).to.equal('Opening');
    });

    it('should fallback on imageUrl when given invalid absolute sharepoint URL', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', title: 'Title', description: 'Opening' }]));
      setMetadata('photos', JSON.stringify([{ imageKind: 'venue-image', sharepointUrl: 'https://////sdawd3123%O*&$/example.com/image.jpg', imageUrl: 'http://example.com/image.jpg' }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items');
      expect(itemsCol).to.not.be.null;
      expect(itemsCol.classList.contains('agenda-items-with-image')).to.be.true;

      const agendaItem = itemsCol.querySelector('.agenda-list-item');
      expect(agendaItem).to.not.be.null;

      const agendaTime = agendaItem.querySelector('.agenda-time');
      expect(agendaTime).to.not.be.null;
      expect(agendaTime.textContent).to.equal('9:00 AM');

      const agendaTitleDetail = agendaItem.querySelector('.agenda-title-detail');
      expect(agendaTitleDetail).to.not.be.null;

      const agendaTitle = agendaTitleDetail.querySelector('.agenda-title');
      expect(agendaTitle).to.not.be.null;
      expect(agendaTitle.textContent).to.equal('Title');

      const agendaDetails = agendaTitleDetail.querySelector('.agenda-details');
      expect(agendaDetails).to.not.be.null;
      expect(agendaDetails.textContent).to.equal('Opening');
    });

    it('should use fallback values when metadata is incomplete', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', title: 'Title', description: 'Opening' }]));
      setMetadata('photos', JSON.stringify([{ imageKind: 'venue-image', imageUrl: 'http://example.com/image.jpg' }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items');
      expect(itemsCol).to.not.be.null;
      expect(itemsCol.classList.contains('agenda-items-with-image')).to.be.true;

      const agendaItem = itemsCol.querySelector('.agenda-list-item');
      expect(agendaItem).to.not.be.null;

      const agendaTime = agendaItem.querySelector('.agenda-time');
      expect(agendaTime).to.not.be.null;
      expect(agendaTime.textContent).to.equal('9:00 AM');

      const agendaTitleDetail = agendaItem.querySelector('.agenda-title-detail');
      expect(agendaTitleDetail).to.not.be.null;

      const agendaTitle = agendaTitleDetail.querySelector('.agenda-title');
      expect(agendaTitle).to.not.be.null;
      expect(agendaTitle.textContent).to.equal('Title');

      const agendaDetails = agendaTitleDetail.querySelector('.agenda-details');
      expect(agendaDetails).to.not.be.null;
      expect(agendaDetails.textContent).to.equal('Opening');
    });

    it('should not show title when title is empty', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', title: '', description: 'Opening' }]));
      setMetadata('photos', JSON.stringify([{ imageKind: 'venue-image', imageUrl: 'http://example.com/image.jpg' }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items');
      expect(itemsCol).to.not.be.null;
      expect(itemsCol.classList.contains('agenda-items-with-image')).to.be.true;

      const agendaItem = itemsCol.querySelector('.agenda-list-item');
      expect(agendaItem).to.not.be.null;

      const agendaTime = agendaItem.querySelector('.agenda-time');
      expect(agendaTime).to.not.be.null;
      expect(agendaTime.textContent).to.equal('9:00 AM');

      const agendaTitleDetail = agendaItem.querySelector('.agenda-title-detail');
      expect(agendaTitleDetail).to.not.be.null;

      const agendaTitle = agendaTitleDetail.querySelector('.agenda-title');
      expect(agendaTitle).to.be.null;

      const agendaDetails = agendaTitleDetail.querySelector('.agenda-details');
      expect(agendaDetails).to.not.be.null;
      expect(agendaDetails.textContent).to.equal('Opening');
    });

    it('should not show description when description is empty', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', title: 'Title' }]));
      setMetadata('photos', JSON.stringify([{ imageKind: 'venue-image', imageUrl: 'http://example.com/image.jpg' }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items');
      expect(itemsCol).to.not.be.null;
      expect(itemsCol.classList.contains('agenda-items-with-image')).to.be.true;

      const agendaItem = itemsCol.querySelector('.agenda-list-item');
      expect(agendaItem).to.not.be.null;

      const agendaTime = agendaItem.querySelector('.agenda-time');
      expect(agendaTime).to.not.be.null;
      expect(agendaTime.textContent).to.equal('9:00 AM');

      const agendaTitleDetail = agendaItem.querySelector('.agenda-title-detail');
      expect(agendaTitleDetail).to.not.be.null;

      const agendaTitle = agendaTitleDetail.querySelector('.agenda-title');
      expect(agendaTitle).to.not.be.null;
      expect(agendaTitle.textContent).to.equal('Title');

      const agendaDetails = agendaTitleDetail.querySelector('.agenda-details');
      expect(agendaDetails).to.be.null;
    });

    it('should show multiple agenda items', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', title: 'Title', description: 'Opening' }, { startTime: '10:00:00', title: 'Title', description: 'Opening' }]));
      setMetadata('photos', JSON.stringify([{ imageKind: 'venue-image', imageUrl: 'http://example.com/image.jpg' }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = el.querySelector('.agenda-container');
      expect(container).to.not.be.null;

      const itemsCol = container.querySelector('.agenda-items');
      expect(itemsCol).to.not.be.null;
      expect(itemsCol.classList.contains('agenda-items-with-image')).to.be.true;

      const agendaItems = itemsCol.querySelectorAll('.agenda-list-item');
      expect(agendaItems).to.not.be.null;
      expect(agendaItems.length).to.equal(2);
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

    it('should handle more than 6 agenda items without venue image', async () => {
      const testAgendaItems = Array(7).fill().map((_, i) => ({
        startTime: `${i + 9}:00:00`,
        title: `Title ${i + 1}`,
        description: `Description ${i + 1}`,
      }));
      setMetadata('agenda', JSON.stringify(testAgendaItems));
      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = document.querySelector('.agenda-container');
      expect(container).to.not.be.null;
      expect(container.classList.contains('more-than-six')).to.be.true;

      const columns = container.querySelectorAll('.column');
      expect(columns.length).to.equal(2);

      const agendaListItems = container.querySelectorAll('.agenda-list-item');
      expect(agendaListItems.length).to.equal(7);
    });

    it('should handle different locale configurations', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '13:45:00', title: 'Title', description: 'Description' }]));
      window.getConfig = () => ({ locale: { ietf: 'de-DE' } });

      // Mock Intl.DateTimeFormat for German locale
      const originalIntl = window.Intl;
      window.Intl = {
        DateTimeFormat: function DateTimeFormat() {
          return { format: () => '13:45' };
        },
      };

      const el = document.querySelector('.event-agenda');
      await init(el);

      const agendaTime = document.querySelector('.agenda-time');
      expect(agendaTime).to.not.be.null;
      expect(agendaTime.textContent).to.equal('13:45');

      window.Intl = originalIntl;
    });

    it('should handle invalid SharePoint URLs gracefully', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', title: 'Title', description: 'Description' }]));
      setMetadata('photos', JSON.stringify([{
        imageKind: 'venue-image',
        sharepointUrl: 'https://invalid-url.com/image.jpg',
        imageUrl: 'http://example.com/image.jpg',
      }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = document.querySelector('.agenda-container');
      expect(container).to.not.be.null;
      expect(container.querySelector('.agenda-list-item')).to.not.be.null;
    });

    it('should log errors to LANA when metadata parsing fails', async () => {
      setMetadata('agenda', 'invalid JSON');
      setMetadata('photos', 'invalid JSON');

      const loggedErrors = [];
      window.lana = { log: (error) => loggedErrors.push(error) };

      const el = document.querySelector('.event-agenda');
      await init(el);

      expect(loggedErrors.length).to.be.greaterThan(0);
      expect(loggedErrors.some((error) => error.includes('Failed to parse'))).to.be.true;
    });

    it('should handle empty agenda array', async () => {
      setMetadata('agenda', JSON.stringify([]));
      const el = document.querySelector('.event-agenda');
      await init(el);
      expect(el.parentNode).to.be.null;
    });

    it('should handle missing agenda metadata', async () => {
      const el = document.querySelector('.event-agenda');
      await init(el);
      expect(el.parentNode).to.be.null;
    });

    it('should handle post-event timing', async () => {
      document.body.classList.add('timing-post-event');
      setMetadata('show-agenda-post-event', 'false');
      const el = document.querySelector('.event-agenda');
      await init(el);
      expect(el.parentNode).to.be.null;
    });

    it('should handle venue image without sharepointUrl', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', title: 'Title', description: 'Description' }]));
      setMetadata('photos', JSON.stringify([{
        imageKind: 'venue-image',
        imageUrl: 'http://example.com/image.jpg',
      }]));

      const el = document.querySelector('.event-agenda');
      await init(el);

      const container = document.querySelector('.agenda-container');
      expect(container).to.not.be.null;
      expect(container.querySelector('.venue-img-col')).to.not.be.null;
      expect(container.querySelector('img').src).to.include('example.com/image.jpg');
    });

    it('should handle undefined locale config', async () => {
      setMetadata('agenda', JSON.stringify([{ startTime: '09:00:00', title: 'Title', description: 'Description' }]));
      window.getConfig = () => ({});

      const el = document.querySelector('.event-agenda');
      await init(el);

      const timeElement = document.querySelector('.agenda-time');
      expect(timeElement.textContent).to.match(/^\d{1,2}:\d{2}\s*[AP]M$/);
    });
  });
});
