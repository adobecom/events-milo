import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import init from '../../../../events/blocks/daa-injection/daa-injection.js';

const body = await readFile({ path: './mocks/default.html' });
const noTarget = await readFile({ path: './mocks/no-target.html' });

describe('DAA Injection Module', () => {
  describe('init', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should manipulate the next blocks DAA tags', async () => {
      document.body.innerHTML = body;

      const el = document.querySelector('.daa-injection');
      await init(el);

      expect(document.body.contains(el)).to.be.false;

      const nextBlock = document.querySelector('.icon-block');

      expect(nextBlock).to.exist;
      expect(nextBlock.getAttribute('daa-lh') === 'Product Blade|Adobe Illustrator').to.be.true;

      const nextBlockCta = nextBlock.querySelector('a.cta');
      expect(nextBlockCta).to.exist;
      expect(nextBlockCta.getAttribute('daa-ll') === 'Learn more - Injected').to.be.true;
    });

    it('should fail early if no target block found', async () => {
      document.body.innerHTML = noTarget;
      const el = document.querySelector('.daa-injection');
      const nextBlock = el.nextElementSibling;
      expect(nextBlock).to.not.exist;

      await init(el);

      expect(document.body.contains(el)).to.be.false;
    });
  });
});
