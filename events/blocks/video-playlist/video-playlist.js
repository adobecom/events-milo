import { LIBS } from '../../scripts/utils.js';
import {
  getLocalStorageVideos,
  getLocalStorageShouldAutoPlay,
  saveShouldAutoPlayToLocalStorage,
} from './utils.js';
import {
  PLAYLIST_PLAY_ALL_ID,
  TOAST_CONTAINER_ID,
  ANALYTICS,
  MOCK_API,
  PLAYLIST_SKIP_TO_ID,
} from './constants.js';
import { PlayerManager } from './player-manager.js';

// Assume 'createTag' is now available globally or imported from LIBS
const { createTag } = await import(`${LIBS}/utils/utils.js`);

/* --- Global Constants and Selectors --- */
const SELECTORS = {
  HEADER_CHECKBOX: `#${PLAYLIST_PLAY_ALL_ID}`,
  SESSION_CARD: '.video-playlist-container__sessions__wrapper__session',
  PROGRESS_BAR: '.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar',
};

const DEFAULT_CFG = {
  playlistId: null,
  playlistTitle: 'Video Playlist',
  autoplayText: 'Play All',
  topicEyebrow: '',
  skipPlaylistText: 'Skip playlist',
  minimumSessions: 4,
  isTagbased: true,
  tags: '',
  sort: 'default',
  socialSharing: true,
  favoritesEnabled: true,
  favoritesTooltipText: 'Add to favorites',
  favoritesNotificationText: 'Session added to favorites',
  favoritesButtonText: 'View',
  favoritesButtonLink: '/schedule',
  theme: 'light',
  videoUrl: '',
  enableFacebook: false,
  facebookAltText: 'Share Playlist on Facebook',
  enableTwitter: false,
  twitterCustomText: '',
  twitterAltText: 'Share Playlist on X',
  enableLinkedIn: false,
  linkedInAltText: 'Share Playlist on LinkedIn',
  enableCopyLink: false,
  copyLinkAltText: 'Share with link',
  copyNotificationText: 'Link copied to clipboard!',
  sessionPath: '',
};


const getMeta = (root) =>
  Object.fromEntries(
    [...root.querySelectorAll(':scope > div > div:first-child')].map((div) => {
      const key = div.textContent?.trim();
      const value = div.nextElementSibling?.textContent?.trim() ?? '';
      return [key, value];
    }).filter(([key]) => key),
  );


const coerceValue = (key, value, defaults) => {
  const defaultValue = defaults[key];
  if (typeof defaultValue === 'boolean') {
    if (value == null || value === '') return defaultValue;
    return String(value).toLowerCase() === 'true';
  }
  if (typeof defaultValue === 'number') {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }
  return value;
};

const prepareCards = (cards = []) => cards.filter((card) => card.search?.thumbnailUrl);


const renderHeaderMarkup = (cfg, socialMarkup, checked) => {
  return `
    <div class="video-playlist-container__header__upper">
      <div class="video-playlist-container__header__upper__skipLink">
        <a href="#${PLAYLIST_SKIP_TO_ID}" class="video-playlist-container__header__upper__skipLink__link button">${cfg.skipPlaylistText}</a>
      </div>
      <div class="video-playlist-container__header__toggle">
        <div class="consonant-switch consonant-switch--sizeM">
          <input type="checkbox" class="consonant-switch-input" id="${PLAYLIST_PLAY_ALL_ID}" daa-ll="${
            checked ? ANALYTICS.TOGGLE_OFF : ANALYTICS.TOGGLE_ON
          }" ${checked ? 'checked' : ''}/>
          <span class="consonant-switch-switch"></span>
          <label class="consonant-switch-label" for="${PLAYLIST_PLAY_ALL_ID}">${cfg.autoplayText.toUpperCase()}</label>
        </div>
      </div>
    </div>
    <div class="video-playlist-container__header__content">
      <div class="video-playlist-container__header__content__left">
        <p class="video-playlist-container__header__content__left__topic">${cfg.topicEyebrow}</p>
        <h3 class="video-playlist-container__header__content__left__title">${cfg.playlistTitle}</h3>
      </div>
      <div class="video-playlist-container__header__content__right">
        ${socialMarkup}
      </div>
    </div>`;
};


const renderSessionsMarkup = (cards) => {
  return cards
    .map((card) => {
      const videoId = card.search.mpcVideoId || card.search.videoId;
      return `
        <div daa-lh="${card.contentArea.title}" class="video-playlist-container__sessions__wrapper__session" data-video-id="${videoId}">
          <a daa-ll="${ANALYTICS.VIDEO_SELECT}" href="${card.overlayLink}" class="video-playlist-container__sessions__wrapper__session__link">
            <div class="video-playlist-container__sessions__wrapper__session__thumbnail">
              <img src="${card.search.thumbnailUrl}" alt="${card.contentArea.title}" loading="lazy"/>
              <div class="video-playlist-container__sessions__wrapper__session__thumbnail__play-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 18 18" width="40"><rect opacity="0" width="18" height="18"/><path fill="#e5e5e5" d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm4.2685,8.43L7.255,12.93A.50009.50009,0,0,1,7,13H6.5a.5.5,0,0,1-.5-.5v-7A.5.5,0,0,1,6.5,5H7a.50009.50009,0,0,1,.255.07l6.0135,3.5a.5.5,0,0,1,0,.86Z"/></svg>
              </div>
              <div class="video-playlist-container__sessions__wrapper__session__thumbnail__duration"><p class="video-playlist-container__sessions__wrapper__session__thumbnail__duration__text">${card.search.videoDuration}</p></div>
              <div class="video-playlist-container__sessions__wrapper__session__thumbnail__progress"><div class="video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar"></div></div>
            </div>
            <div class="video-playlist-container__sessions__wrapper__session__info">
              <h4 class="video-playlist-container__sessions__wrapper__session__info__title">${card.contentArea.title}</h4>
              <p class="video-playlist-container__sessions__wrapper__session__info__description">${card.contentArea.description}</p>
            </div>
          </a>
        </div>`;
    })
    .join('');
};


const getToastIcon = (type) => {
  if (type === 'positive') {
    return '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18" class="video-playlist-container__toast-icon"><path d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm5.333,4.54L8.009,13.6705a.603.603,0,0,1-.4375.2305H7.535a.6.6,0,0,1-.4245-.1755L3.218,9.829a.6.6,0,0,1-.00147-.84853L3.218,8.979l.663-.6625A.6.6,0,0,1,4.72953,8.315L4.731,8.3165,7.4,10.991l5.257-6.7545a.6.6,0,0,1,.8419-.10586L13.5,4.1315l.7275.5685A.6.6,0,0,1,14.333,5.54Z"></path></svg>';
  }
  if (type === 'info') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" class="video-playlist-container__toast-icon"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 4v4M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  }
  return '';
};


class VideoPlaylist {
  constructor(el) {
    this.el = el;
    this.cfg = {};
    this.root = null;
    this.sessionsWrapper = null;
    this.cards = [];
    this.disposers = [];
    this.favoritesManager = null;
    this.playerManager = null;
    this.init();
  }

  
  async init() {
    try {
      this.cfg = this.parseCfg();
      this.root = this.createRoot();
      this.el.appendChild(this.root);
      await this.loadAndRender();
      this.initPlayerManager();
    } catch (err) {
      console.error('VideoPlaylist init error:', err);
      this.root?.style.removeProperty('display'); 
    }
  }

  cleanup() {
    this.playerManager?.cleanup();
    this.favoritesManager?.cleanup();
    this.disposers.forEach((fn) => {
      try {
        fn();
      } catch {
        /* swallow */
      }
    });
    this.disposers.length = 0;
  }

  /* config */
  parseCfg() {
    const meta = getMeta(this.el);
    const config = { ...DEFAULT_CFG };

    Object.entries(meta).forEach(([key, value]) => {
      // Find case-insensitive key in defaults
      const normalizedKey = Object.keys(DEFAULT_CFG).find(k => k.toLowerCase() === key.toLowerCase());
      if (normalizedKey) {
        config[normalizedKey] = coerceValue(normalizedKey, value, DEFAULT_CFG);
      }
    });

    return config;
  }

  createRoot() {
    const container = createTag('div', { class: 'video-playlist-container' });
    if (this.cfg.theme) container.classList.add(`consonant--${this.cfg.theme}`);
    container.style.display = 'none'; // Keep hidden until fully rendered
    return container;
  }

  /* data */
  async fetchCards() {
    if (this.cfg.isTagbased) {
      const { cards = [] } = await MOCK_API.getSessions();
      return prepareCards(cards);
    }

    const playlist = await MOCK_API.getUserAuthoredPlaylist(this.cfg);
    this.cfg.playlistTitle = playlist.playlistTitle || this.cfg.playlistTitle;
    this.cfg.topicEyebrow = playlist.topicEyebrow || this.cfg.topicEyebrow;
    
    const ids = (playlist.sessions || []).map((session) => session.entityId);
    const { cards = [] } = await MOCK_API.getChimeraFeaturedCards(ids);
    return prepareCards(cards);
  }

  sortCards(cards) {
    if (this.cfg.sort === 'default') return cards;
    
    const sorted = [...cards];

    // Convert duration strings (HH:MM:SS or MM:SS) to seconds for proper numeric comparison
    const durationToSeconds = (duration) => {
      if (!duration || typeof duration !== 'string') return 0;
      const parts = duration.split(':').map(Number);
      if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2]; // hours, minutes, seconds
      }
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1]; // minutes, seconds
      }
      return parts[0] || 0; // just seconds
    };

    // Sort by title
    if (this.cfg.sort === 'titleAscending') {
      sorted.sort((a, b) => a.contentArea.title.localeCompare(b.contentArea.title));
    } else if (this.cfg.sort === 'titleDescending') {
      sorted.sort((a, b) => b.contentArea.title.localeCompare(a.contentArea.title));
    }
    // Sort by time (duration)
    else if (this.cfg.sort === 'timeAscending') {
      sorted.sort((a, b) => {
        const aSeconds = durationToSeconds(a.search.videoDuration);
        const bSeconds = durationToSeconds(b.search.videoDuration);
        return aSeconds - bSeconds; // shortest to longest
      });
    } else if (this.cfg.sort === 'timeDescending') {
      sorted.sort((a, b) => {
        const aSeconds = durationToSeconds(a.search.videoDuration);
        const bSeconds = durationToSeconds(b.search.videoDuration);
        return bSeconds - aSeconds; // longest to shortest
      });
    }
    
    return sorted;
  }

  /* render */
  async loadAndRender() {
    try {
      const raw = await this.fetchCards();
      this.cards = this.sortCards(raw);
      if (this.cards.length < this.cfg.minimumSessions) {
        console.warn(`Not enough sessions: ${this.cards.length} of ${this.cfg.minimumSessions} required.`);
        return;
      }
      await this.render(this.cards);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  }

  async render(cards) {
    this.root.style.removeProperty('display'); 
    const header = await this.renderHeader();
    this.root.appendChild(header);
    this.root.appendChild(this.renderSessions(cards));
    
    // 3. Initialize Favorites Manager (only if enabled AND user is registered)
    if (this.cfg.favoritesEnabled) {
      try {
        // Check if user is signed in and registered for the event Currently Mock API is used need to move actual logic once the real API is known.
        const isRegistered = await MOCK_API.isUserRegistered();
        if (!isRegistered) return;
          this.favoritesManager?.cleanup();
          const { FavoritesManager } = await import('./favorites-manager.js');
          this.favoritesManager = new FavoritesManager({
            config: this.cfg,
            getCards: () => this.cards,
            getSessionsWrapper: () => this.sessionsWrapper,
            showToast: (...args) => this.toast(...args),
          });
          await this.favoritesManager.setup();
      } catch (error) {
        console.error('Failed to load favorites manager module:', error);
      }
    }
    this.root.appendChild(
      createTag('div', { id: PLAYLIST_SKIP_TO_ID, style: 'height:1px;' }),
    );
  }

  async renderHeader() {
    const header = createTag('div', {
      class: 'video-playlist-container__header',
    });
    const checked = getLocalStorageShouldAutoPlay();
    
    let socialModule = null;
    let socialMarkup = '';
    if (this.cfg.socialSharing) {
      try {
        socialModule = await import('./social.js');
        socialMarkup = socialModule.createSocialShareMarkup(this.cfg);
      } catch (error) {
        console.error('Failed to load social sharing module:', error);
      }
    }
    
    header.innerHTML = renderHeaderMarkup(this.cfg, socialMarkup, checked);

    // --- Wiring Logic (Separated from Markup) ---
    
    // 1. Autoplay Toggle
    const checkbox = header.querySelector(SELECTORS.HEADER_CHECKBOX);
    if (checkbox) {
      const handler = (event) => {
        saveShouldAutoPlayToLocalStorage(event.target.checked);
        event.target.setAttribute(
          'daa-ll',
          event.target.checked ? ANALYTICS.TOGGLE_ON : ANALYTICS.TOGGLE_OFF,
        );
      };
      checkbox.addEventListener('change', handler);
      this.disposers.push(() => checkbox.removeEventListener('change', handler));
    }

    // 2. Social Sharing Wiring
    if (this.cfg.socialSharing && socialModule) {
      try {
        const disposer = socialModule.wireSocialShare(header, {
          onCopy: () => {
            this.copy(window.location.href);
            this.toast(this.cfg.copyNotificationText, 'info');
          },
        });
        if (disposer) this.disposers.push(disposer);
      } catch (error) {
        console.error('Failed to wire social sharing:', error);
      }
    }

    return header;
  }

  renderSessions(cards) {
    const outer = createTag('div', {
      class: 'video-playlist-container__sessions',
    });
    this.sessionsWrapper = createTag('div', {
      class: 'video-playlist-container__sessions__wrapper',
    });
    
    this.sessionsWrapper.innerHTML = renderSessionsMarkup(cards);
    
    outer.appendChild(this.sessionsWrapper);
    this.initProgressBars(this.sessionsWrapper);
    return outer;
  }

  initProgressBars(wrapper) {
    const videos = getLocalStorageVideos();
    [...wrapper.querySelectorAll(SELECTORS.SESSION_CARD)].forEach(
      (session) => {
        const videoId = session.getAttribute('data-video-id');
        const data = videos[videoId];
        if (data?.length && data.secondsWatched > 0) {
          const bar = session.querySelector(SELECTORS.PROGRESS_BAR);
          if (bar) {
            const percentage = Math.min(
              100,
              (data.secondsWatched / data.length) * 100,
            );
            bar.style.width = `${percentage}%`;
            bar.style.backgroundColor = '#1473e6';
            bar.style.display = 'block';
          }
        }
      },
    );
  }

  highlightSession(videoId) {
    if (!this.sessionsWrapper) return;
    [...this.sessionsWrapper.querySelectorAll('.highlighted')].forEach((element) =>
      element.classList.remove('highlighted'),
    );
    if (!videoId) return;
    const target = this.sessionsWrapper.querySelector(`[data-video-id="${videoId}"]`);
    if (target) {
      target.classList.add('highlighted');
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  updateProgress(videoId, current, length) {
    if (!this.sessionsWrapper) return;
    const container = this.sessionsWrapper.querySelector(`[data-video-id="${videoId}"]`);
    if (!container) return;

    const bar = container.querySelector(SELECTORS.PROGRESS_BAR);
    if (!bar) return;
    
    const percentage = Math.min(100, (current / length) * 100);
    bar.style.width = `${percentage}%`;
    bar.style.backgroundColor = '#1473e6';
    bar.style.display = 'block';
  }

  /**
   * Initializes the PlayerManager, connecting player events to UI update methods.
   */
  initPlayerManager() {
    this.playerManager?.cleanup();
    this.playerManager = new PlayerManager({
      highlightSession: (videoId) => this.highlightSession(videoId),
      updateProgressBar: (videoId, current, length) =>
        this.updateProgress(videoId, current, length),
      getCards: () => this.cards,
      navigateTo: (href) => {
        window.location.href = href;
      },
    });
    this.playerManager.bootstrap();
  }

  /* utility */
  
  getToastContainer() {
    let container = document.getElementById(TOAST_CONTAINER_ID);
    if (!container) {
      container = createTag('div', { id: TOAST_CONTAINER_ID });
      this.root.appendChild(container); 
    }
    return container;
  }

  toast(message, type = 'default', button = null) {
    const container = this.getToastContainer();
    
    const modifier =
      type === 'positive'
        ? 'video-playlist-container__toast--positive'
        : type === 'info'
        ? 'video-playlist-container__toast--info'
        : '';
        
    const toast = createTag('div', {
      class: `video-playlist-container__toast ${modifier}`.trim(),
      role: 'alert',
      'aria-live': 'assertive',
      'aria-atomic': 'true',
    });
    
    const icon = getToastIcon(type); 

    const buttonHtml = button 
      ? `<button class="video-playlist-container__toast-button" daa-ll="${button.daaLL}"><span class="video-playlist-container__toast-button-label">${button.text}</span></button>`
      : '';
      
    toast.innerHTML = `
      ${icon}
      <div class="video-playlist-container__toast-body">
        <div class="video-playlist-container__toast-content">${message}</div>
        ${buttonHtml}
      </div>
      <div class="video-playlist-container__toast-buttons">
        <button aria-label="close" class="video-playlist-container__toast-close" label="Close" daa-ll="${ANALYTICS.CLOSE_FAVORITE_NOTIFICATION}">
          <svg class="video-playlist-container__toast-close-icon" viewBox="0 0 8 8"><path d="m5.238 4 2.456-2.457A.875.875 0 1 0 6.456.306L4 2.763 1.543.306A.875.875 0 0 0 .306 1.544L2.763 4 .306 6.457a.875.875 0 1 0 1.238 1.237L4 5.237l2.456 2.457a.875.875 0 1 0 1.238-1.237z"></path></svg>
        </button>
      </div>`;
      
    container.appendChild(toast);
    
    // Wire up event listeners
    const closeButton = toast.querySelector('.video-playlist-container__toast-close');
    closeButton.addEventListener('click', () => toast.remove());
    
    if (button) {
      const buttonEl = toast.querySelector('.video-playlist-container__toast-button');
      buttonEl?.addEventListener('click', () => {
        if (button.link) window.location.href = button.link;
      });
    }
  }

  copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .catch(() => this.legacyCopy(text));
      return;
    }
    this.legacyCopy(text);
  }

  legacyCopy(text) {
    const textarea = createTag('textarea', {
      value: text,
      style: 'position:fixed;left:-9999px;top:-9999px;',
    });
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textarea);
  }
}

export default function init(el) {
  return new VideoPlaylist(el);
}
