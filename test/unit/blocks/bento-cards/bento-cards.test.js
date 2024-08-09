import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import init from '../../../../events/blocks/bento-cards/bento-cards.js';

const body = await readFile({ path: './mocks/default.html' });
const show2 = await readFile({ path: './mocks/show-2.html' });

describe('Bento Cards Module', () => {
  describe('init', () => {
    beforeEach(() => {
      document.head.innerHTML = '';
    });

    it('should add specific classes to cards and move elements into content container', async () => {
      document.body.innerHTML = body;

      const el = document.querySelector('.bento-cards');
      await init(el);

      const card = el.querySelector('.bento-card');
      expect(card).to.not.be.null;

      const content = card.querySelector('.bento-card-content');
      expect(content).to.not.be.null;

      const icon = card.querySelector('.bento-mnemonics');
      expect(icon).to.not.be.null;
      const bgImg = card.querySelector('.bento-background');
      expect(bgImg).to.not.be.null;
      const textContent = content.querySelector('p');
      expect(textContent.textContent).to.exist;
    });

    it('should add classes to element and its rows based on their number and structure', async () => {
      document.body.innerHTML = show2;

      const el = document.querySelector('.bento-cards');
      await init(el);

      expect(el.classList.contains('show-2')).to.be.true;
      expect(el.classList.contains('container')).to.be.true;

      const rows = el.querySelectorAll(':scope > div');
      expect(rows.length).to.equal(2);

      rows.forEach((r) => {
        expect(r.classList.contains('bento-cards-wrapper')).to.be.true;
      });
    });
  });
});
