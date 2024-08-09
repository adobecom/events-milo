import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import init, { isOdd } from '../../../../events/blocks/event-partners/event-partners.js';
import { setMetadata } from '../../../../events/scripts/utils.js';

const body = await readFile({ path: './mocks/default.html' });

describe('Sponsors Module', () => {
  describe('isOdd', () => {
    it('should return true for odd numbers', () => {
      expect(isOdd(1)).to.be.true;
      expect(isOdd(3)).to.be.true;
      expect(isOdd(5)).to.be.true;
    });

    it('should return false for even numbers', () => {
      expect(isOdd(2)).to.be.false;
      expect(isOdd(4)).to.be.false;
      expect(isOdd(6)).to.be.false;
    });
  });

  describe('init', () => {
    beforeEach(() => {
      document.body.innerHTML = body;
      document.head.innerHTML = '';
    });

    it('should remove element if metadata "show-sponsors" is not "true"', () => {
      setMetadata('show-sponsors', 'false');

      const el = document.querySelector('.event-partners');
      init(el);

      expect(el.parentNode).to.be.null;
    });

    it('should remove element if sponsors metadata is invalid', () => {
      setMetadata('show-sponsors', 'true');
      setMetadata('sponsors', 'invalid JSON');

      const el = document.querySelector('.event-partners');
      init(el);

      expect(el.parentNode).to.be.null;
    });

    it('should create event partners container and append logos and links', () => {
      setMetadata('show-sponsors', 'true');
      setMetadata('sponsors', JSON.stringify([
        {
          name: 'Partner 1',
          image: { imageUrl: 'https://example.com/image1.jpg', altText: 'Partner 1' },
          link: 'https://example.com/partner1',
        },
        {
          name: 'Partner 2',
          image: { imageUrl: 'https://example.com/image2.jpg', altText: 'Partner 2' },
          link: 'https://example.com/partner2',
        },
      ]));

      const el = document.querySelector('.event-partners');
      init(el);

      const container = el.querySelector('.event-partners-container');
      expect(container).to.not.be.null;
      const logos = container.querySelectorAll('.logo img');
      expect(logos).to.have.lengthOf(2);
      expect(logos[0].src).to.equal('https://example.com/image1.jpg');
      expect(logos[0].alt).to.equal('Partner 1');
      expect(logos[1].src).to.equal('https://example.com/image2.jpg');
      expect(logos[1].alt).to.equal('Partner 2');

      const links = container.querySelectorAll('a');
      expect(links).to.have.lengthOf(2);
      expect(links[0].href).to.equal('https://example.com/partner1');
      expect(links[0].title).to.equal('Partner 1');
      expect(links[1].href).to.equal('https://example.com/partner2');
      expect(links[1].title).to.equal('Partner 2');
    });

    it('should add "single" class if there is only one partner', () => {
      setMetadata('show-sponsors', 'true');
      setMetadata('sponsors', JSON.stringify([
        {
          name: 'Partner 1',
          image: { imageUrl: 'https://example.com/image1.jpg', altText: 'Partner 1' },
          link: 'https://example.com/partner1',
        },
      ]));

      const el = document.querySelector('.event-partners');
      init(el);

      expect(el.classList.contains('single')).to.be.true;
    });

    it('should add "odd" class if there are an odd number of partners', () => {
      setMetadata('show-sponsors', 'true');
      setMetadata('sponsors', JSON.stringify([
        {
          name: 'Partner 1',
          image: { imageUrl: 'http://example.com/image1.jpg', altText: 'Partner 1' },
          link: 'http://example.com/partner1',
        },
        {
          name: 'Partner 2',
          image: { imageUrl: 'http://example.com/image2.jpg', altText: 'Partner 2' },
          link: 'http://example.com/partner2',
        },
        {
          name: 'Partner 3',
          image: { imageUrl: 'http://example.com/image3.jpg', altText: 'Partner 3' },
          link: 'http://example.com/partner3',
        },
      ]));

      const el = document.querySelector('.event-partners');
      init(el);

      expect(el.classList.contains('odd')).to.be.true;
    });

    it('should remove self if received empty sponsor data', () => {
      setMetadata('show-sponsors', 'true');
      setMetadata('sponsors', JSON.stringify([
      ]));

      const el = document.querySelector('.event-partners');
      init(el);

      expect(document.querySelector('.event-partners')).to.be.null;
    });
  });
});
