import { LIBS } from '../scripts/utils.js';

const { createTag, MILO_EVENTS, loadStyle, getConfig } = await import(`${LIBS}/utils/utils.js`);

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

export const ARROW_NEXT_IMG = `<img class="next-icon" alt="Next icon" src="${base}/blocks/carousel/img/arrow.svg" height="10" width="16">`;
export const ARROW_PREVIOUS_IMG = `<img class="previous-icon" alt="Previous icon" src="${base}/blocks/carousel/img/arrow.svg" height="10" width="16">`;

export const KEY_CODES = {
  SPACE: 'Space',
  END: 'End',
  HOME: 'Home',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
};

export function decorateNextPreviousBtns() {
  const previousBtn = createTag(
    'button',
    {
      class: 'carousel-button carousel-previous',
      'aria-label': 'Previous',
      'data-toggle': 'previous',
    },
    ARROW_PREVIOUS_IMG,
  );

  const nextBtn = createTag(
    'button',
    {
      class: 'carousel-button carousel-next',
      'aria-label': 'Next',
      'data-toggle': 'next',
    },
    ARROW_NEXT_IMG,
  );
  return [previousBtn, nextBtn];
}

export function decorateSlideIndicators(slides) {
  const indicatorDots = [];

  for (let i = 0; i < slides.length; i += 1) {
    const li = createTag('li', {
      class: 'carousel-indicator',
      role: 'tab',
      tabindex: -1,
      'data-index': i,
      'aria-selected': false,
      'aria-labelledby': `Viewing Slide ${i + 1}`,
    });

    // Set inital active state
    if (i === 0) {
      li.classList.add('active');
      li.setAttribute('tabindex', 0);
    }
    indicatorDots.push(li);
  }
  return indicatorDots;
}

export function handleNext(nextElement, elements) {
  if (nextElement.nextElementSibling) {
    return nextElement.nextElementSibling;
  }
  return elements[0];
}

export function handlePrevious(previousElment, elements) {
  if (previousElment.previousElementSibling) {
    return previousElment.previousElementSibling;
  }
  return elements[elements.length - 1];
}

export function jumpToDirection(activeSlideIndex, jumpToIndex, slideContainer) {
  if (activeSlideIndex < jumpToIndex) {
    slideContainer.classList.remove('is-reversing');
  } else {
    slideContainer.classList.add('is-reversing');
  }
}

export function moveSlides(event, carouselElements, jumpToIndex) {
  const {
    slideContainer,
    slides,
    nextPreviousBtns,
    slideIndicators,
    controlsContainer,
    direction,
  } = carouselElements;

  let referenceSlide = slideContainer.querySelector('.reference-slide');
  let activeSlide = slideContainer.querySelector('.active');
  let activeSlideIndicator = controlsContainer.querySelector('.active');
  const activeSlideIndex = activeSlideIndicator.dataset.index;

  // Track reference slide - last slide initially
  if (!referenceSlide) {
    referenceSlide = slides[slides.length - 1];
    referenceSlide.classList.add('reference-slide');
    referenceSlide.style.order = '1';
  }

  // Remove class/attributes after being tracked
  referenceSlide.classList.remove('reference-slide');
  referenceSlide.style.order = null;
  activeSlide.classList.remove('active');
  activeSlide.querySelectorAll('a').forEach((focusableElement) => { focusableElement.setAttribute('tabindex', -1); });
  activeSlideIndicator.classList.remove('active');
  activeSlideIndicator.setAttribute('tabindex', -1);

  /*
   * If indicator dot buttons are clicked update:
   * reference slide, active indicator dot, and active slide
  */
  if (jumpToIndex >= 0) {
    if (jumpToIndex === 0) {
      referenceSlide = slides[slides.length - 1];
    } else if (jumpToIndex === slides.length - 1) {
      referenceSlide = slides[slides.length - 2];
    } else {
      referenceSlide = slides[jumpToIndex - 1];
    }
    referenceSlide.classList.add('reference-slide');
    referenceSlide.style.order = '1';
    activeSlideIndicator = slideIndicators[jumpToIndex];
    activeSlide = slides[jumpToIndex];
    jumpToDirection(activeSlideIndex, jumpToIndex, slideContainer);
  }

  // Next arrow button, swipe, keyboard navigation
  if ((event.currentTarget).dataset.toggle === 'next'
    || event.key === KEY_CODES.ARROW_RIGHT
    || (direction === 'left' && event.type === 'touchend')) {
    nextPreviousBtns[1].focus();
    referenceSlide = handleNext(referenceSlide, slides);
    activeSlideIndicator = handleNext(activeSlideIndicator, slideIndicators);
    activeSlide = handleNext(activeSlide, slides);
    slideContainer?.classList.remove('is-reversing');
  }

  // Previous arrow button, swipe, keyboard navigation
  if ((event.currentTarget).dataset.toggle === 'previous'
    || event.key === KEY_CODES.ARROW_LEFT
    || (direction === 'right' && event.type === 'touchend')) {
    nextPreviousBtns[0].focus();
    referenceSlide = handlePrevious(referenceSlide, slides);
    activeSlideIndicator = handlePrevious(activeSlideIndicator, slideIndicators);
    activeSlide = handlePrevious(activeSlide, slides);
    slideContainer.classList.add('is-reversing');
  }

  // Update reference slide attributes
  referenceSlide.classList.add('reference-slide');
  referenceSlide.style.order = '1';

  // Update active slide and indicator dot attributes
  activeSlide.classList.add('active');
  const indexOfActive = [...activeSlide.parentElement.children]
    .findIndex((ele) => activeSlide.isSameNode(ele));
  const IndexOfShowClass = [...carouselElements.el.classList].findIndex((ele) => ele.includes('show-'));
  const tempSlides = [...slides.slice(indexOfActive), ...slides.slice(0, indexOfActive)];
  if (IndexOfShowClass >= 0) {
    const show = parseInt(carouselElements.el.classList[IndexOfShowClass].split('-')[1], 10);
    tempSlides.forEach((slide, index) => {
      let tabIndex = -1;
      if (index < show) {
        tabIndex = 0;
      }
      slide.querySelectorAll('a').forEach((focusableElement) => { focusableElement.setAttribute('tabindex', tabIndex); });
    });
  } else {
    activeSlide.querySelectorAll('a').forEach((focusableElement) => { focusableElement.setAttribute('tabindex', 0); });
  }
  activeSlideIndicator.classList.add('active');
  activeSlideIndicator.setAttribute('tabindex', 0);

  // Loop over all slide siblings to update their order
  for (let i = 2; i <= slides.length; i += 1) {
    referenceSlide = handleNext(referenceSlide, slides);
    referenceSlide.style.order = i;
  }

  /*
   * Activates slide animation.
   * Delay time matches animation time for next/previous controls.
   * JumpToInidex uses a shorter delay that better supports
   * non-linear slide navigation.
  */
  const slideDelay = jumpToIndex >= 0 ? 10 : 50;
  slideContainer.classList.remove('is-ready');
  return setTimeout(() => slideContainer.classList.add('is-ready'), slideDelay);
}

export function getSwipeDistance(start, end) {
  if (end === 0) {
    const updateStart = 0;
    return Math.abs(updateStart - end);
  }
  return Math.abs(start - end);
}

export function getSwipeDirection(swipe, swipeDistance) {
  const { xDistance } = swipeDistance;

  if (xDistance !== swipe.xStart && xDistance > swipe.xMin) {
    return (swipe.xEnd > swipe.xStart) ? 'right' : 'left';
  }
  return undefined;
}

/**
  * Mobile swipe/touch direction detection
  */
export function mobileSwipeDetect(carouselElements) {
  const { el } = carouselElements;
  const swipe = { xMin: 50 };
  /* c8 ignore start */
  el.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    swipe.xStart = touch.screenX;
  }, { passive: true });

  el.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    swipe.xEnd = touch.screenX;
  }, { passive: true });

  el.addEventListener('touchend', (event) => {
    const swipeDistance = {};
    swipeDistance.xDistance = getSwipeDistance(swipe.xStart, swipe.xEnd);
    carouselElements.direction = getSwipeDirection(swipe, swipeDistance);

    // reset end swipe values
    swipe.xStart = 0;
    swipe.xEnd = 0;

    if (swipeDistance.xDistance > swipe.xMin) {
      moveSlides(event, carouselElements);
    }
  });
  /* c8 ignore end */
}

function handleChangingSlides(carouselElements) {
  const { el, nextPreviousBtns, slideIndicators } = carouselElements;

  // Handle Next/Previous Buttons
  [...nextPreviousBtns].forEach((btn) => {
    btn.addEventListener('click', (event) => {
      moveSlides(event, carouselElements);
    });
  });

  // Handle keyboard navigation
  el.addEventListener('keydown', (event) => {
    if (event.key === KEY_CODES.ARROW_RIGHT
      || event.key === KEY_CODES.ARROW_LEFT) { moveSlides(event, carouselElements); }
  });

  // Handle slide indictors
  [...slideIndicators].forEach((li) => {
    li.addEventListener('click', (event) => {
      const jumpToIndex = Number(li.dataset.index);
      moveSlides(event, carouselElements, jumpToIndex);
    });
  });

  // Swipe Events
  mobileSwipeDetect(carouselElements);
}

export default function buildMiloCarousel(el, slides) {
  return new Promise((resolve) => {
    loadStyle(`${getConfig().codeRoot || '/events'}/features/milo-carousel.css`, () => {
      const parentArea = el.closest('.fragment') || document;
      el.classList.add('carousel-plugin');

      const fragment = new DocumentFragment();
      const nextPreviousBtns = decorateNextPreviousBtns();
      const slideIndicators = decorateSlideIndicators(slides);
      const controlsContainer = createTag('div', { class: 'carousel-controls' });

      fragment.append(...slides);
      const slideWrapper = createTag('div', { class: 'carousel-wrapper' });
      const slideContainer = createTag('div', { class: 'carousel-slides' }, fragment);
      const carouselElements = {
        el,
        nextPreviousBtns,
        slideContainer,
        slides,
        slideIndicators,
        controlsContainer,
        direction: undefined,
      };

      slideWrapper.append(slideContainer);

      el.textContent = '';
      el.append(slideWrapper);

      const dotsUl = createTag('ul', {
        class: 'carousel-indicators',
        role: 'tablist',
        tabindex: 0,
      });
      dotsUl.append(...slideIndicators);
      controlsContainer.append(dotsUl);

      el.append(...nextPreviousBtns, controlsContainer);

      function handleDeferredImages() {
        const images = el.querySelectorAll('img[loading="lazy"]');
        images.forEach((img) => {
          img.removeAttribute('loading');
        });
        parentArea.removeEventListener(MILO_EVENTS.DEFERRED, handleDeferredImages, true);
      }
      parentArea.addEventListener(MILO_EVENTS.DEFERRED, handleDeferredImages, true);

      slides[0].classList.add('active');
      const IndexOfShowClass = [...el.classList].findIndex((ele) => ele.includes('show-'));
      let NoOfVisibleSlides = 1;
      if (IndexOfShowClass >= 0) {
        NoOfVisibleSlides = parseInt(el.classList[IndexOfShowClass].split('-')[1], 10);
      }
      slides.slice(NoOfVisibleSlides).forEach((slide) => slide.querySelectorAll('a').forEach((focusableElement) => { focusableElement.setAttribute('tabindex', -1); }));
      handleChangingSlides(carouselElements);
      resolve();
    });
  });
}
