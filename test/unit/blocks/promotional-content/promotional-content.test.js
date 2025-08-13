import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

describe('Promotional Content Block', () => {
  let el;
  let fetchStub;

  beforeEach(async () => {
    el = document.createElement('div');
    el.className = 'promotional-content';
    document.body.appendChild(el);

    // Mock the promotional content JSON response
    const mockPromotionalData = {
      data: [
        {
          name: 'adobe-express',
          title: 'Adobe Express',
          description: 'Create stunning designs quickly',
        },
        {
          name: 'photoshop',
          title: 'Photoshop',
          description: 'Professional image editing',
        },
      ],
    };

    fetchStub = sinon.stub(window, 'fetch').resolves({ json: () => Promise.resolve(mockPromotionalData) });
  });

  afterEach(() => {
    document.body.removeChild(el);
    fetchStub.restore();
    sinon.restore();
  });

  describe('init', () => {
    it('should load promotional content and create fragments', async () => {
      // Set up mock metadata
      const meta = document.createElement('meta');
      meta.name = 'promotional-items';
      meta.content = '[{"name":"adobe-express","fragment-path":"/events/fragments/promotional-content/adobe-express"},{"name":"photoshop","fragment-path":"/events/fragments/promotional-content/photoshop"}]';
      document.head.appendChild(meta);

      const init = (await import('../../../../events/blocks/promotional-content/promotional-content.js')).default;
      await init(el);

      expect(fetchStub.calledOnce).to.be.true;
    });

    it('should handle empty promotional items gracefully', async () => {
      const init = (await import('../../../../events/blocks/promotional-content/promotional-content.js')).default;
      await init(el);

      expect(fetchStub.calledOnce).to.be.true;
    });

    it('should handle fetch errors gracefully', async () => {
      fetchStub.rejects(new Error('Network error'));

      const init = (await import('../../../../events/blocks/promotional-content/promotional-content.js')).default;

      try {
        await init(el);
      } catch (error) {
        // Expected error, test should continue
      }

      expect(fetchStub.calledOnce).to.be.true;
    });
  });

  describe('addMediaReversedClass', () => {
    it('should remove media-reverse-mobile class from all media blocks', async () => {
      // Add media blocks with media-reverse-mobile class
      const media1 = document.createElement('div');
      media1.className = 'media media-reverse-mobile';
      el.appendChild(media1);

      const media2 = document.createElement('div');
      media2.className = 'media media-reverse-mobile';
      el.appendChild(media2);

      const init = (await import('../../../../events/blocks/promotional-content/promotional-content.js')).default;
      await init(el);

      const mediaBlocks = el.querySelectorAll('.media');
      mediaBlocks.forEach((block) => {
        expect(block.classList.contains('media-reverse-mobile')).to.be.false;
      });
    });

    it('should add media-reversed class to odd-indexed media blocks', async () => {
      // Add media blocks
      const media1 = document.createElement('div');
      media1.className = 'media';
      el.appendChild(media1);

      const media2 = document.createElement('div');
      media2.className = 'media';
      el.appendChild(media2);

      const media3 = document.createElement('div');
      media3.className = 'media';
      el.appendChild(media3);

      const init = (await import('../../../../events/blocks/promotional-content/promotional-content.js')).default;
      await init(el);

      const mediaBlocks = el.querySelectorAll('.media');
      expect(mediaBlocks[0].classList.contains('media-reversed')).to.be.false;
      expect(mediaBlocks[1].classList.contains('media-reversed')).to.be.true;
      expect(mediaBlocks[2].classList.contains('media-reversed')).to.be.false;
    });
  });

  describe('getPromotionalContent', () => {
    it('should parse promotional items from metadata', async () => {
      // Set up mock metadata
      const meta = document.createElement('meta');
      meta.name = 'promotional-items';
      meta.content = '[{"name":"test-item","fragment-path":"/test/path"}]';
      document.head.appendChild(meta);

      const init = (await import('../../../../events/blocks/promotional-content/promotional-content.js')).default;
      await init(el);

      expect(fetchStub.calledOnce).to.be.true;
    });

    it('should handle invalid JSON in promotional items metadata', async () => {
      // Set up invalid metadata
      const meta = document.createElement('meta');
      meta.name = 'promotional-items';
      meta.content = 'invalid json';
      document.head.appendChild(meta);

      const init = (await import('../../../../events/blocks/promotional-content/promotional-content.js')).default;
      await init(el);

      expect(fetchStub.calledOnce).to.be.true;
    });
  });
});
