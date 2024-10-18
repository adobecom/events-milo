import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import init, { createSocialIcon } from '../../../../events/blocks/profile-cards/profile-cards.js';

const head = await readFile({ path: './mocks/head.html' });
const body = await readFile({ path: './mocks/default.html' });

describe('Profile Cards Module', () => {
  describe('init', () => {
    beforeEach(() => {
      document.body.innerHTML = body;
      document.head.innerHTML = head;
    });

    it('should render speakers in speakers type block', () => {
      const el = document.querySelector('#speakers-cards');
      init(el);

      const speakerCards = el.querySelectorAll('.card-container');

      expect(el).to.not.be.null;
      expect(speakerCards).to.have.lengthOf(3);
    });

    it('should render judges in judges type block', () => {
      const el = document.querySelector('#judges-cards');
      init(el);

      const judgesCards = el.querySelectorAll('.card-container');
      const carousel = el.querySelector('.carousel-plugin');

      expect(el).to.not.be.null;
      expect(carousel).to.not.be.null;
      expect(judgesCards).to.have.lengthOf(5);
    });

    it('should render host in host type block', () => {
      const el = document.querySelector('#hosts-cards');
      init(el);

      const hostCards = el.querySelectorAll('.card-container');

      expect(el).to.not.be.null;
      expect(hostCards).to.have.lengthOf(1);
      expect(el.classList.contains('single')).to.be.true;
    });

    it('show remove block if no related profile types found', () => {
      const el = document.querySelector('#keynotes-cards');
      init(el);

      const noSpeakers = document.querySelector('#keynotes-cards');

      expect(noSpeakers).to.be.null;
    });
  });

  describe('createSocialIcon', () => {
    it('should return a social icon element', () => {
      const icon = createSocialIcon(document.createElement('svg'), 'facebook');
      const iconAlt = icon.getAttribute('alt');

      expect(icon).to.not.be.null;
      expect(iconAlt).to.equal('facebook logo');
    });
  });
});
