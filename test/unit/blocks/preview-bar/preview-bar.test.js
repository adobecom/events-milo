import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import init, { getEventStatus, getPreviewTarget, getCloseBtn } from '../../../../events/blocks/preview-bar/preview-bar.js';

const head = await readFile({ path: './mocks/head.html' });
const body = await readFile({ path: './mocks/default.html' });

describe('Preview Bar Module', () => {
  describe('init', () => {
    beforeEach(() => {
      document.location.search = '';
      document.body.innerHTML = body;
      document.head.innerHTML = head;
    });

    it('should render a preview bar given the correct USP', () => {
      document.location.search = '?previewMode=true';
      const el = document.querySelector('.preview-bar');
      init(el);

      expect(el).to.not.be.null;
    });

    it('helper functions work as intended', () => {
      document.location.search = '?previewMode=true';
      const el = document.querySelector('.preview-bar');
      init(el);

      const closeBtn = getCloseBtn(el);

      expect(getEventStatus()).to.equal('<span class="event-status"><img class="icon icon-dot-purple" src="/events/icons/dot-purple.svg" alt="dot-purple">Published</span>');
      expect(getPreviewTarget()).to.equal('Event details');
      expect(closeBtn).to.not.be.null;

      closeBtn.click();
      expect(el.innerHTML.trim()).to.equal('');
    });
  });
});
