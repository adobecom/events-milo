/* VideoPlaylist.js */
// eslint-disable-next-line no-underscore-dangle
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
  CHIMERA_COLLECTION_DEFAULT_PARAMS,
  TAG_COLLECTION_URL,
  FEATURED_COLLECTION_URL,
  ENTITY_LOOKUP_URL,
} from './constants.js';
import { FavoritesManager } from './favorites-manager.js';
import { PlayerManager } from './player-manager.js';
import { createSocialShareMarkup, wireSocialShare } from './social.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

export default function init(el) {
  return new VideoPlaylist(el);
}

/* helpers */
const getMeta = (root) =>
  Object.fromEntries(
    [...root.querySelectorAll(':scope > div > div:first-child')].map((div) => {
      const key = div.textContent?.trim() || '';
      return [key, div.nextElementSibling?.textContent?.trim() ?? ''];
    }),
  );

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
  sortByTime: false,
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

// Coerce value to appropriate type based on default value
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

const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value)
    .split(/[,\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const extractCardsFromResponse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.cards)) return data.cards;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.results)) return data.results;
  return [];
};

const prepareCards = (rawCards) => {
  if (!Array.isArray(rawCards)) return [];
  return rawCards
    .map((card) => {
      const search = {
        ...card?.search,
        thumbnailUrl:
          card?.search?.thumbnailUrl ||
          card?.styles?.backgroundImage ||
          card?.thumbnail?.url ||
          card?.cardData?.thumbnail?.url ||
          '',
        videoDuration:
          card?.search?.videoDuration ||
          card?.cardData?.details ||
          '',
        videoId:
          card?.search?.videoId ||
          card?.cardData?.videoId ||
          '',
        mpcVideoId:
          card?.search?.mpcVideoId ||
          card?.cardData?.mpcVideoId ||
          '',
        sessionId:
          card?.search?.sessionId ||
          card?.cardData?.sessionId ||
          '',
        sessionTimeId:
          card?.search?.sessionTimeId ||
          card?.cardData?.sessionTimeId ||
          '',
      };

      const contentArea = {
        ...card?.contentArea,
        title:
          card?.contentArea?.title ||
          card?.title ||
          card?.cardData?.headline ||
          '',
        description:
          card?.contentArea?.description ||
          card?.description ||
          card?.cardData?.description ||
          '',
      };

      const overlayLink =
        card?.overlayLink ||
        card?.ctaLink ||
        card?.contentArea?.url ||
        card?.cardData?.cta?.primaryCta?.url ||
        card?.cardData?.cta?.secondaryCta?.url ||
        card?.url ||
        '';

      return {
        ...card,
        search,
        contentArea,
        overlayLink,
      };
    })
    .filter((card) => card?.search?.thumbnailUrl);
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { accept: 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

const buildCollectionUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl);
  const mergedParams = { ...CHIMERA_COLLECTION_DEFAULT_PARAMS, ...params };
  Object.entries(mergedParams).forEach(([key, value]) => {
    if (value != null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, item));
      } else {
        url.searchParams.append(key, value);
      }
    }
  });
  return url;
};

const normalizeSessionUri = (value) => {
  if (!value) return null;
  try {
    if (/^https?:\/\//i.test(value)) return value;
    if (typeof window !== 'undefined') {
      return new URL(value, window.location.origin).href;
    }
    return value;
  } catch (error) {
    console.warn('Failed to normalize session path:', value, error);
    return null;
  }
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

  /* lifecycle */
  async init() {
    try {
      this.cfg = this.parseCfg();
      this.root = this.createRoot();
      this.el.appendChild(this.root);
      await this.loadAndRender();
      this.initPlayerManager();
    } catch (err) {
      console.error('VideoPlaylist init error:', err);
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
      // Only set if key exists in DEFAULT_CFG (ignore unknown keys)
      if (key in DEFAULT_CFG) {
        config[key] = coerceValue(key, value, DEFAULT_CFG);
      }
    });

    return config;
  }

  createRoot() {
    const container = createTag('div', { class: 'video-playlist-container' });
    if (this.cfg.theme) container.classList.add(`consonant--${this.cfg.theme}`);
    container.style.display = 'none';
    return container;
  }

  /* data */
  async fetchCards() {
    const execute = this.cfg.isTagbased
      ? this.fetchTagBasedCards.bind(this)
      : this.fetchAuthorAuthoredCards.bind(this);

    try {
      const cards = await execute();
      if (cards.length) return cards;
    } catch (error) {
      console.error('VideoPlaylist data fetch failed, using fallback.', error);
      window.lana?.log?.(`VideoPlaylist fetchCards fallback: ${error.message}`);
    }

    return this.fetchFallbackCards();
  }

  async fetchTagBasedCards() {
    const tags = parseList(this.cfg.tags);
    if (!tags.length) throw new Error('Tag-based playlist requires at least one tag.');

    const url = buildCollectionUrl(TAG_COLLECTION_URL);

    const complexQueryValue = tags.join(',');
    url.searchParams.append('complexQuery', complexQueryValue);

    const data = await fetchJson(url.toString());
    const cards = prepareCards(extractCardsFromResponse(data));
    if (!cards.length) throw new Error('No cards returned from tag-based collection.');
    return cards;
  }

  async fetchAuthorAuthoredCards() {
    const sessionPaths = parseList(this.cfg.sessionPath)
      .map(normalizeSessionUri)
      .filter(Boolean);

    if (!sessionPaths.length) {
      throw new Error('Author-authored playlist requires at least one sessionPath.');
    }

    const entityIds = await this.lookupEntityIds(sessionPaths);
    if (!entityIds.length) throw new Error('Failed to resolve entityIds for session paths.');

    const data = await this.fetchCardsByEntityIds(entityIds);
    const cards = prepareCards(extractCardsFromResponse(data));
    if (!cards.length) throw new Error('No cards returned for provided entityIds.');
    return cards;
  }

  async fetchFallbackCards() {
    try {
      if (this.cfg.isTagbased) {
        const { cards = [] } = await MOCK_API.getSessions();
        return prepareCards(cards);
      }

      const playlist = await MOCK_API.getUserAuthoredPlaylist(this.cfg);
      this.cfg.playlistTitle = playlist.playlistTitle || this.cfg.playlistTitle;
      this.cfg.topicEyebrow = playlist.topicEyebrow || this.cfg.topicEyebrow;

      const entityIds = (playlist.sessions || [])
        .map((session) => session.entityId)
        .filter(Boolean);

      const { cards = [] } = await MOCK_API.getChimeraFeaturedCards(entityIds);
      return prepareCards(cards);
    } catch (error) {
      console.error('VideoPlaylist fallback data load failed.', error);
      return [];
    }
  }

  async lookupEntityIds(sessionUris) {
    const url = new URL(ENTITY_LOOKUP_URL);
    url.searchParams.set('env', 'prod');
    url.searchParams.set('container', 'live');
    sessionUris.forEach((uri) => url.searchParams.append('uri', uri));

    const data = await fetchJson(url.toString());
    const items = Array.isArray(data) ? data : [];

    return items
      .map((item) => {
        if (item?.entityId) return item.entityId;
        const arbitrary = createArbitraryMap(item?.arbitrary);
        return arbitrary.entityId || arbitrary.referenceIds || null;
      })
      .filter(Boolean)
      .map((value) => {
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) return value[0];
        return null;
      })
      .filter(Boolean);
  }

  async fetchCardsByEntityIds(entityIds) {
    const url = buildCollectionUrl(FEATURED_COLLECTION_URL, {
      featuredCards: entityIds.join(','),
    });

    return fetchJson(url.toString());
  }

  sortCards(cards) {
    if (this.cfg.sort === 'default' && !this.cfg.sortByTime) return cards;
    const sorted = [...cards];
    if (this.cfg.sortByTime) {
      sorted.sort((a, b) =>
        a.search.videoDuration.localeCompare(b.search.videoDuration),
      );
    }
    if (this.cfg.sort === 'ascending') {
      sorted.sort((a, b) =>
        a.contentArea.title.localeCompare(b.contentArea.title),
      );
    }
    if (this.cfg.sort === 'descending') {
      sorted.sort((a, b) =>
        b.contentArea.title.localeCompare(a.contentArea.title),
      );
    }
    return sorted;
  }

  /* render */
  async loadAndRender() {
    try {
      const raw = await this.fetchCards();
      this.cards = this.sortCards(raw);
      if (this.cards.length < this.cfg.minimumSessions) {
        console.warn('Not enough sessions:', this.cfg.minimumSessions);
        return;
      }
      await this.render(this.cards);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  }

  async render(cards) {
    this.root.style.display = '';
    this.root.appendChild(this.renderHeader());
    this.root.appendChild(this.renderSessions(cards));

    if (this.cfg.favoritesEnabled) {
      this.favoritesManager?.cleanup();
      this.favoritesManager = new FavoritesManager({
        config: this.cfg,
        getCards: () => this.cards,
        getSessionsWrapper: () => this.sessionsWrapper,
        showToast: (...args) => this.toast(...args),
      });
      await this.favoritesManager.setup();
    }

    this.root.appendChild(
      createTag('div', { id: PLAYLIST_SKIP_TO_ID, style: 'height:1px;' }),
    );
  }

  renderHeader() {
    const header = createTag('div', {
      class: 'video-playlist-container__header',
    });
    const checked = getLocalStorageShouldAutoPlay();
    header.innerHTML = `
      <div class="video-playlist-container__header__upper">
        <div class="video-playlist-container__header__upper__skipLink">
          <a href="#${PLAYLIST_SKIP_TO_ID}" class="video-playlist-container__header__upper__skipLink__link button">${this.cfg.skipPlaylistText}</a>
        </div>
        <div class="video-playlist-container__header__toggle">
          <div class="consonant-switch consonant-switch--sizeM">
            <input type="checkbox" class="consonant-switch-input" id="${PLAYLIST_PLAY_ALL_ID}" daa-ll="${
      checked ? ANALYTICS.TOGGLE_OFF : ANALYTICS.TOGGLE_ON
    }" ${checked ? 'checked' : ''}/>
            <span class="consonant-switch-switch"></span>
            <label class="consonant-switch-label" for="${PLAYLIST_PLAY_ALL_ID}">${this.cfg.autoplayText.toUpperCase()}</label>
          </div>
        </div>
      </div>
      <div class="video-playlist-container__header__content">
        <div class="video-playlist-container__header__content__left">
          <p class="video-playlist-container__header__content__left__topic">${this.cfg.topicEyebrow}</p>
          <h3 class="video-playlist-container__header__content__left__title">${this.cfg.playlistTitle}</h3>
        </div>
        <div class="video-playlist-container__header__content__right">
          ${createSocialShareMarkup(this.cfg)}
        </div>
      </div>`;

    const checkbox = header.querySelector(`#${PLAYLIST_PLAY_ALL_ID}`);
    checkbox?.addEventListener('change', (event) => {
      saveShouldAutoPlayToLocalStorage(event.target.checked);
      event.target.setAttribute(
        'daa-ll',
        event.target.checked ? ANALYTICS.TOGGLE_ON : ANALYTICS.TOGGLE_OFF,
      );
    });

    if (this.cfg.socialSharing) {
      const disposer = wireSocialShare(header, {
        onCopy: () => {
          this.copy(window.location.href);
          this.toast(this.cfg.copyNotificationText, 'info');
        },
      });
      if (disposer) this.disposers.push(disposer);
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
    this.sessionsWrapper.innerHTML = cards
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
    outer.appendChild(this.sessionsWrapper);
    this.initProgressBars(this.sessionsWrapper);
    return outer;
  }

  initProgressBars(wrapper) {
    const videos = getLocalStorageVideos();
    [...wrapper.querySelectorAll('.video-playlist-container__sessions__wrapper__session')].forEach(
      (session) => {
        const videoId = session.getAttribute('data-video-id');
        const data = videos[videoId];
        if (data?.length && data.secondsWatched > 0) {
          const bar = session.querySelector(
            '.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar',
          );
          if (bar) {
            bar.style.width = `${Math.min(
              100,
              (data.secondsWatched / data.length) * 100,
            )}%`;
            bar.style.backgroundColor = '#1473e6';
            bar.style.display = 'block';
          }
        }
      },
    );
  }

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
    const container = this.sessionsWrapper.querySelector(`[data-video-id="${videoId}"]`);
    const bar = (container || document).querySelector(
      '.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar',
    );
    if (!bar) return;
    const percentage = Math.min(100, (current / length) * 100);
    bar.style.width = `${percentage}%`;
    bar.style.backgroundColor = '#1473e6';
    bar.style.display = 'block';
  }

  /* UX bits */
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

  toast(message, type = 'default', button = null) {
    let container = document.getElementById(TOAST_CONTAINER_ID);
    if (!container) {
      container = createTag('div', { id: TOAST_CONTAINER_ID });
      this.root.appendChild(container);
    }
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
    const icon =
      type === 'positive'
        ? '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18" class="video-playlist-container__toast-icon"><path d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm5.333,4.54L8.009,13.6705a.603.603,0,0,1-.4375.2305H7.535a.6.6,0,0,1-.4245-.1755L3.218,9.829a.6.6,0,0,1-.00147-.84853L3.218,8.979l.663-.6625A.6.6,0,0,1,4.72953,8.315L4.731,8.3165,7.4,10.991l5.257-6.7545a.6.6,0,0,1,.8419-.10586L13.5,4.1315l.7275.5685A.6.6,0,0,1,14.333,5.54Z"></path></svg>'
        : type === 'info'
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" class="video-playlist-container__toast-icon"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 4v4M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
        : '';
    toast.innerHTML = `
      ${icon}
      <div class="video-playlist-container__toast-body">
        <div class="video-playlist-container__toast-content">${message}</div>
        ${
          button
            ? `<button class="video-playlist-container__toast-button" daa-ll="${button.daaLL}"><span class="video-playlist-container__toast-button-label">${button.text}</span></button>`
            : ''
        }
      </div>
      <div class="video-playlist-container__toast-buttons">
        <button aria-label="close" class="video-playlist-container__toast-close" label="Close" daa-ll="${ANALYTICS.CLOSE_FAVORITE_NOTIFICATION}">
          <svg class="video-playlist-container__toast-close-icon" viewBox="0 0 8 8"><path d="m5.238 4 2.456-2.457A.875.875 0 1 0 6.456.306L4 2.763 1.543.306A.875.875 0 0 0 .306 1.544L2.763 4 .306 6.457a.875.875 0 1 0 1.238 1.237L4 5.237l2.456 2.457a.875.875 0 1 0 1.238-1.237z"></path></svg>
        </button>
      </div>`;
    container.appendChild(toast);
    const closeButton = toast.querySelector('.video-playlist-container__toast-close');
    closeButton.addEventListener('click', () => toast.remove());
    if (button) {
      toast.querySelector('.video-playlist-container__toast-button')?.addEventListener(
        'click',
        () => {
          if (button.link) window.location.href = button.link;
        },
      );
    }
  }
}
