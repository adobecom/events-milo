import { expect } from '@esm-bundle/chai';
import {
  getSwipeDistance,
  getSwipeDirection,
  decorateNextPreviousBtns,
  decorateSlideIndicators,
  handleNext,
  handlePrevious,
  jumpToDirection,
  moveSlides,
  ARROW_NEXT_IMG,
  ARROW_PREVIOUS_IMG,
  KEY_CODES,
} from '../../../events/features/milo-carousel.js';
import { createTag } from '../../../events/scripts/utils.js';

describe('Swipe Functions', () => {
  describe('getSwipeDistance', () => {
    it('should return the correct swipe distance', () => {
      expect(getSwipeDistance(0, 100)).to.equal(100);
      expect(getSwipeDistance(100, 0)).to.equal(0);
      expect(getSwipeDistance(50, 50)).to.equal(0);
    });

    it('should handle end value of 0 correctly', () => {
      expect(getSwipeDistance(100, 0)).to.equal(0);
    });
  });

  describe('getSwipeDirection', () => {
    it('should return "right" if swipe end is greater than start', () => {
      const swipe = { xStart: 0, xEnd: 100, xMin: 50 };
      const swipeDistance = { xDistance: 100 };
      expect(getSwipeDirection(swipe, swipeDistance)).to.equal('right');
    });

    it('should return "left" if swipe end is less than start', () => {
      const swipe = { xStart: 100, xEnd: 0, xMin: 50 };
      const swipeDistance = { xDistance: 99 };
      expect(getSwipeDirection(swipe, swipeDistance)).to.equal('left');
    });

    it('should return undefined if swipe distance is less than minimum', () => {
      const swipe = { xStart: 0, xEnd: 25, xMin: 50 };
      const swipeDistance = { xDistance: 25 };
      expect(getSwipeDirection(swipe, swipeDistance)).to.be.undefined;
    });

    it('should return undefined if swipe start equals swipe end', () => {
      const swipe = { xStart: 50, xEnd: 50, xMin: 50 };
      const swipeDistance = { xDistance: 0 };
      expect(getSwipeDirection(swipe, swipeDistance)).to.be.undefined;
    });
  });
});

describe('Carousel Functions', () => {
  describe('decorateNextPreviousBtns', () => {
    it('should create and return next and previous buttons', () => {
      const [previousBtn, nextBtn] = decorateNextPreviousBtns();
      expect(previousBtn.tagName).to.equal('BUTTON');
      expect(previousBtn.classList.contains('carousel-previous')).to.be.true;
      expect(previousBtn.getAttribute('aria-label')).to.equal('Previous');
      expect(previousBtn.innerHTML).to.equal(ARROW_PREVIOUS_IMG);

      expect(nextBtn.tagName).to.equal('BUTTON');
      expect(nextBtn.classList.contains('carousel-next')).to.be.true;
      expect(nextBtn.getAttribute('aria-label')).to.equal('Next');
      expect(nextBtn.innerHTML).to.equal(ARROW_NEXT_IMG);
    });
  });

  describe('decorateSlideIndicators', () => {
    it('should create and return slide indicators', () => {
      const slides = new Array(3).fill(null);
      const indicators = decorateSlideIndicators(slides);

      expect(indicators.length).to.equal(3);
      indicators.forEach((indicator, index) => {
        expect(indicator.tagName).to.equal('LI');
        expect(indicator.classList.contains('carousel-indicator')).to.be.true;
        expect(indicator.getAttribute('data-index')).to.equal(String(index));
        if (index === 0) {
          expect(indicator.classList.contains('active')).to.be.true;
          expect(indicator.getAttribute('tabindex')).to.equal('0');
        } else {
          expect(indicator.classList.contains('active')).to.be.false;
          expect(indicator.getAttribute('tabindex')).to.equal('-1');
        }
      });
    });
  });

  describe('handleNext', () => {
    it('should return the next element or the first element if at the end', () => {
      const elementsHolder = createTag('div');
      const el1 = createTag('div');
      const el2 = createTag('div');
      const el3 = createTag('div');
      const elements = [el1, el2, el3];
      elements.forEach((el) => elementsHolder.appendChild(el));

      expect(handleNext(el1, elements)).to.equal(el2);
      expect(handleNext(el2, elements)).to.equal(el3);
      expect(handleNext(el3, elements)).to.equal(el1);
    });
  });

  describe('handlePrevious', () => {
    it('should return the previous element or the last element if at the start', () => {
      const elementsHolder = createTag('div');
      const el1 = createTag('div');
      const el2 = createTag('div');
      const el3 = createTag('div');
      const elements = [el1, el2, el3];
      elements.forEach((el) => elementsHolder.appendChild(el));

      expect(handlePrevious(el1, elements)).to.equal(el3);
      expect(handlePrevious(el2, elements)).to.equal(el1);
      expect(handlePrevious(el3, elements)).to.equal(el2);
    });
  });

  describe('jumpToDirection', () => {
    it('should add or remove "is-reversing" class based on slide direction', () => {
      const slideContainer = document.createElement('div');
      jumpToDirection(0, 1, slideContainer);
      expect(slideContainer.classList.contains('is-reversing')).to.be.false;

      jumpToDirection(1, 0, slideContainer);
      expect(slideContainer.classList.contains('is-reversing')).to.be.true;
    });
  });

  describe('moveSlides', () => {
    let carouselElements;

    beforeEach(() => {
      // Setup mock elements for moveSlides
      const slideContainer = document.createElement('div');
      const controlsContainer = document.createElement('div');
      const slides = new Array(3).fill(null).map((_, index) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        slide.innerHTML = `<a href="#">Link ${index}</a>`;
        slideContainer.appendChild(slide);
        return slide;
      });
      const slideIndicators = new Array(3).fill(null).map((_, index) => {
        const li = document.createElement('li');
        li.classList.add('carousel-indicator');
        li.setAttribute('data-index', index);
        controlsContainer.appendChild(li);
        return li;
      });
      const nextPreviousBtns = [document.createElement('button'), document.createElement('button')];

      carouselElements = {
        el: document.createElement('div'),
        slideContainer,
        slides,
        nextPreviousBtns,
        slideIndicators,
        controlsContainer,
      };

      slides[0].classList.add('active');
      slideIndicators[0].classList.add('active');
    });

    it('should handle next button click', () => {
      const event = {
        currentTarget: carouselElements.nextPreviousBtns[1],
        key: null,
        type: 'click',
      };

      moveSlides(event, carouselElements, -1);

      expect(carouselElements.slides[0].style.order).to.equal('2');
      expect(carouselElements.slideIndicators[1].tabIndex).to.equal(-1);
    });

    it('should handle previous button click', () => {
      const event = {
        currentTarget: carouselElements.nextPreviousBtns[0],
        key: null,
        type: 'click',
      };

      moveSlides(event, carouselElements, -1);

      expect(carouselElements.slides[2].style.order).to.equal('1');
      expect(carouselElements.slideIndicators[0].tabIndex).to.equal(0);
    });

    it('should handle right arrow key press', () => {
      const event = {
        currentTarget: carouselElements.el,
        key: KEY_CODES.ARROW_RIGHT,
        type: 'keydown',
      };

      moveSlides(event, carouselElements, -1);

      expect(carouselElements.slides[1].classList.contains('active')).to.be.true;
      expect(carouselElements.slideIndicators[1].classList.contains('active')).to.be.true;
    });

    it('should handle left arrow key press', () => {
      const event = {
        currentTarget: carouselElements.el,
        key: KEY_CODES.ARROW_LEFT,
        type: 'keydown',
      };

      moveSlides(event, carouselElements, -1);

      expect(carouselElements.slides[2].classList.contains('active')).to.be.true;
      expect(carouselElements.slideIndicators[2].classList.contains('active')).to.be.true;
    });

    it('should handle slide indicator click', () => {
      const event = {
        currentTarget: carouselElements.slideIndicators[2],
        key: null,
        type: 'click',
      };

      moveSlides(event, carouselElements, 2);

      expect(carouselElements.slides[2].classList.contains('active')).to.be.true;
      expect(carouselElements.slideIndicators[2].classList.contains('active')).to.be.true;
    });
  });
});
