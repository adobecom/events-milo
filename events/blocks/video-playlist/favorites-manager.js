import { LIBS } from '../../scripts/utils.js';
import { ANALYTICS } from './constants.js';
import { initAPI, ENDPOINTS } from './api.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

const qs = (selector, root = document) => root.querySelector(selector);

export class FavoritesManager {
  constructor({ config, getCards, getSessionsWrapper, showToast }) {
    this.config = config;
    this.getCards = getCards;
    this.getSessionsWrapper = getSessionsWrapper;
    this.showToast = showToast;
    this.cleanupFns = [];
  }

  async setup() {
    // User registration check is already done before loading this module
    try {
      const favorites = await initAPI(ENDPOINTS.GET_FAVORITES);
      if (!favorites?.sessionInterests) return;

      const favoriteIds = new Set(
        favorites.sessionInterests.map((item) => item.sessionID),
      );
      this.injectFavoriteButtons(favoriteIds);
    } catch (err) {
      console.error('Favorites setup failed:', err);
    }
  }

  cleanup() {
    this.cleanupFns.forEach((fn) => {
      try {
        fn();
      } catch (error) {
        console.debug('FavoritesManager cleanup error:', error);
      }
    });
    this.cleanupFns = [];
  }

  injectFavoriteButtons(favoriteIds) {
    const cards = this.getCards?.() ?? [];
    const sessionsWrapper = this.getSessionsWrapper?.();
    if (!sessionsWrapper) return;

    const byVideoId = new Map(
      cards.map((card) => [
        card.search.mpcVideoId || card.search.videoId,
        card,
      ]),
    );

    sessionsWrapper
      .querySelectorAll('.video-playlist-container__sessions__wrapper__session')
      .forEach((sessionEl, index) => {
        const videoId = sessionEl.getAttribute('data-video-id');
        const card = byVideoId.get(videoId) || cards[index];
        if (!card) return;

        const button = this.createFavoriteButton(
          card,
          favoriteIds.has(card.search.sessionId),
        );
        sessionEl.appendChild(button);
      });
  }

  createFavoriteButton(card, isFavorite) {
    const button = createTag('button', {
      class: 'video-playlist-container__sessions__wrapper__session__favorite',
      'daa-ll': isFavorite ? ANALYTICS.UNFAVORITE : ANALYTICS.FAVORITE,
      'aria-label': `${this.config.favoritesTooltipText} ${card.contentArea.title}`,
      'data-tooltip': this.config.favoritesTooltipText,
    });

    button.innerHTML = `<svg class="heart ${
      isFavorite ? 'filled' : 'unfilled'
    }" xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14"><path d="M10.5895 1.82617C10.0133 1.85995 9.45382 2.03175 8.95885 2.32693C8.46389 2.62211 8.04809 3.0319 7.74691 3.52137C7.44573 3.0319 7.02993 2.62211 6.53496 2.32693C6.04 2.03175 5.48056 1.85995 4.90436 1.82617C3.99978 1.82617 3.13226 2.18337 2.49262 2.8192C1.85299 3.45502 1.49365 4.31738 1.49365 5.21657C1.49365 8.45423 7.74691 12.563 7.74691 12.563C7.74691 12.563 14.0002 8.49774 14.0002 5.21657C14.0002 4.31738 13.6408 3.45502 13.0012 2.8192C12.3616 2.18337 11.494 1.82617 10.5895 1.82617Z" stroke-width="2"/></svg>`;

    const onClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.toggleFavorite(button, card);
    };

    button.addEventListener('click', onClick);
    this.cleanupFns.push(() => button.removeEventListener('click', onClick));

    return button;
  }

  async toggleFavorite(button, card) {
    try {
      button.disabled = true;
      const sessionTimeId = card.search.sessionTimeId || card.search.sessionId;
      const sessionId = card.search.sessionId;
      const response = await initAPI(
        ENDPOINTS.TOGGLE_FAVORITES,
        sessionTimeId,
        sessionId,
      );
      if (!response) throw new Error('toggle failed');

      this.updateButtonState(button, card);
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    } finally {
      button.disabled = false;
    }
  }

  updateButtonState(button, card) {
    const svg = qs('svg', button);
    const isFilled = svg.classList.toggle('filled');
    svg.classList.toggle('unfilled', !isFilled);
    button.setAttribute(
      'daa-ll',
      isFilled ? ANALYTICS.FAVORITE : ANALYTICS.UNFAVORITE,
    );
    button.setAttribute('data-tooltip', this.config.favoritesTooltipText);
    button.setAttribute(
      'aria-label',
      `${this.config.favoritesTooltipText} ${card.contentArea.title}`,
    );

    if (!isFilled) return;

    this.showToast?.(this.config.favoritesNotificationText, 'positive', {
      text: this.config.favoritesButtonText,
      link: this.config.favoritesButtonLink,
      daaLL: ANALYTICS.VIEW_SCHEDULE,
    });
  }
}


