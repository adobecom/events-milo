import { expect } from '@esm-bundle/chai';
import init from '../../../../events/blocks/event-product-blades/event-product-blades.js';

describe('Media Blocks Module', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);

    for (let i = 0; i < 5; i += 1) {
      const mediaBlock = document.createElement('div');
      mediaBlock.classList.add('media');
      if (i % 2 === 0) {
        mediaBlock.classList.add('media-reverse-mobile');
      }
      el.appendChild(mediaBlock);
    }
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('init', () => {
    it('should remove "media-reverse-mobile" class from all media blocks', async () => {
      await init(el);

      const mediaBlocks = el.querySelectorAll('.media');
      mediaBlocks.forEach((mediaBlock) => {
        expect(mediaBlock.classList.contains('media-reverse-mobile')).to.be.false;
      });
    });

    it('should add "media-reversed" class to odd-indexed media blocks', async () => {
      await init(el);

      const mediaBlocks = el.querySelectorAll('.media');
      mediaBlocks.forEach((mediaBlock, index) => {
        if (index % 2 === 1) {
          expect(mediaBlock.classList.contains('media-reversed')).to.be.true;
        } else {
          expect(mediaBlock.classList.contains('media-reversed')).to.be.false;
        }
      });
    });

    it('should not add "media-reversed" class to even-indexed media blocks', async () => {
      await init(el);

      const mediaBlocks = el.querySelectorAll('.media');
      mediaBlocks.forEach((mediaBlock, index) => {
        if (index % 2 === 0) {
          expect(mediaBlock.classList.contains('media-reversed')).to.be.false;
        }
      });
    });
  });
});
