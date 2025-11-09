/* VideoPlaylist.js */
// eslint-disable-next-line no-underscore-dangle
import { LIBS } from '../../scripts/utils.js';
import {
  getLocalStorageVideos,
  getLocalStorageShouldAutoPlay,
  saveShouldAutoPlayToLocalStorage,
  getCurrentPlaylistId,
} from './utils.js';
import {
  PLAYLIST_PLAY_ALL_ID,
  TOAST_CONTAINER_ID,
  ANALYTICS,
  MOCK_API,
  PLAYLIST_SKIP_TO_ID,
} from './constants.js';
import { FavoritesManager } from './favorites-manager.js';
import { PlayerManager } from './player-manager.js';
import { createSocialShareMarkup, wireSocialShare } from './social.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

export default function init(el) {
  return new VideoPlaylist(el);
}

/* helpers */
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const bool = (value, defaultValue) =>
  value == null || value === ''
    ? defaultValue
    : String(value).toLowerCase() === 'true';
const int = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};
const toKebab = (value) => value?.trim().toLowerCase().replace(/ /g, '-') || '';
const getMeta = (root) =>
  Object.fromEntries(
    [...root.querySelectorAll(':scope > div > div:first-child')].map((div) => [
      toKebab(div.textContent),
      div.nextElementSibling?.textContent?.trim() || '',
    ]),
  );

class VideoPlaylist {
  constructor(el) {
    this.el = el;
    this.cfg = {};
    this.root = null;
    this.sessionsWrapper = null;
    this.cards = [];
    this.currentPlaylistId = null;
    this.disposers = [];
    this.favoritesManager = null;
    this.playerManager = null;
    this.init();
  }

  /* lifecycle */
  async init() {
    try {
      this.cfg = this._parseCfg();
      this.currentPlaylistId = getCurrentPlaylistId();
      this.root = this._createRoot();
      this.el.appendChild(this.root);
      await this._loadAndRender();
      this._initPlayerManager();
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
  _parseCfg() {
    const meta = getMeta(this.el);
    return {
      playlistId: meta['playlist-id'] || null,
      playlistTitle: meta['playlist-title'] || 'Video Playlist',
      topicEyebrow: meta['topic-eyebrow'] || '',
      autoplayText: meta['autoplay-text'] || 'Play All',
      skipPlaylistText:
        meta['skip-playlist-text'] || meta['skip-playlist'] || 'Skip playlist',
      minimumSessions: int(
        meta['minimum-sessions'] || meta['minimum-session'],
        4,
      ),
      sort: meta.sort || 'default',
      sortByTime: bool(meta['sort-by-time'], false),
      isTagBased: bool(meta['is-tagbased'], true),
      socialSharing: bool(meta['social-sharing'], true),
      favoritesEnabled: bool(meta['favorites-enabled'], true),
      favoritesTooltipText:
        meta['favorites-tooltip-text'] ||
        meta['tooltip-text'] ||
        'Add to favorites',
      favoritesNotificationText:
        meta['favorites-notification-text'] || 'Session added to favorites',
      favoritesButtonText: meta['favorites-button-text'] || 'View',
      favoritesButtonLink: meta['favorites-button-link'] || '/schedule',
      theme: meta.theme || 'light',
      enableFacebook: bool(meta['enable-facebook'], true),
      facebookAltText: meta['facebook-alt-text'] || 'Share Playlist on Facebook',
      enableTwitter: bool(meta['enable-twitter'], true),
      twitterCustomText: meta['twitter-custom-text'] || '',
      twitterAltText: meta['twitter-alt-text'] || 'Share Playlist on X',
      enableLinkedIn: bool(meta['enable-linkedin'], true),
      linkedInAltText:
        meta['linked-in-alt-text'] || 'Share Playlist on LinkedIn',
      enableCopyLink: bool(meta['enable-copy-link'], true),
      copyLinkAltText: meta['copy-link-alt-text'] || 'Share with link',
      copyNotificationText:
        meta['copy-notification-text'] || 'Link copied to clipboard!',
      sessionPaths: meta.sessionpath || '',
    };
  }

  _createRoot() {
    const container = createTag('div', { class: 'video-playlist-container' });
    if (this.cfg.theme) container.classList.add(`consonant--${this.cfg.theme}`);
    container.style.display = 'none';
    return container;
  }

  /* data */
  async _fetchCards() {
    if (this.cfg.isTagBased) {
      const { cards = [] } = await MOCK_API.getSessions();
      return cards.filter((card) => card.search.thumbnailUrl);
    }

    const playlist = await MOCK_API.getUserAuthoredPlaylist(this.cfg);
    this.cfg.playlistTitle = playlist.playlistTitle || this.cfg.playlistTitle;
    this.cfg.topicEyebrow = playlist.topicEyebrow || this.cfg.topicEyebrow;
    const ids = playlist.sessions.map((session) => session.entityId);
    const { cards = [] } = await MOCK_API.getChimeraFeaturedCards(ids);
    return cards.filter((card) => card.search.thumbnailUrl);
  }

  _sortCards(cards) {
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
  async _loadAndRender() {
    try {
      const raw = await this._fetchCards();
      this.cards = this._sortCards(raw);
      if (this.cards.length < this.cfg.minimumSessions) {
        console.warn('Not enough sessions:', this.cfg.minimumSessions);
        return;
      }
      await this._render(this.cards);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  }

  async _render(cards) {
    this.root.style.display = '';
    this.root.appendChild(this._renderHeader());
    this.root.appendChild(this._renderSessions(cards));

    if (this.cfg.favoritesEnabled) {
      this.favoritesManager?.cleanup();
      this.favoritesManager = new FavoritesManager({
        config: this.cfg,
        getCards: () => this.cards,
        getSessionsWrapper: () => this.sessionsWrapper,
        showToast: (...args) => this._toast(...args),
      });
      await this.favoritesManager.setup();
    }

    this.root.appendChild(
      createTag('div', { id: PLAYLIST_SKIP_TO_ID, style: 'height:1px;' }),
    );
  }

  _renderHeader() {
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

    const checkbox = qs(`#${PLAYLIST_PLAY_ALL_ID}`, header);
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
          this._copy(window.location.href);
          this._toast(this.cfg.copyNotificationText, 'info');
        },
      });
      if (disposer) this.disposers.push(disposer);
    }

    return header;
  }

  _renderSessions(cards) {
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
    this._initProgressBars(this.sessionsWrapper);
    return outer;
  }

  _initProgressBars(wrapper) {
    const videos = getLocalStorageVideos();
    qsa('.video-playlist-container__sessions__wrapper__session', wrapper).forEach(
      (session) => {
        const videoId = session.getAttribute('data-video-id');
        const data = videos[videoId];
        if (data?.length && data.secondsWatched > 0) {
          const bar = qs(
            '.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar',
            session,
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

  _initPlayerManager() {
    this.playerManager?.cleanup();
    this.playerManager = new PlayerManager({
      highlightSession: (videoId) => this._highlightSession(videoId),
      updateProgressBar: (videoId, current, length) =>
        this._updateProgress(videoId, current, length),
      getCards: () => this.cards,
      getCurrentPlaylistId: () => this.currentPlaylistId,
      navigateTo: (href) => {
        window.location.href = href;
      },
    });
    this.playerManager.bootstrap();
  }

  _highlightSession(videoId) {
    if (!this.sessionsWrapper) return;
    qsa('.highlighted', this.sessionsWrapper).forEach((element) =>
      element.classList.remove('highlighted'),
    );
    if (!videoId) return;
    const target = qs(`[data-video-id="${videoId}"]`, this.sessionsWrapper);
    if (target) {
      target.classList.add('highlighted');
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  _updateProgress(videoId, current, length) {
    const container = qs(`[data-video-id="${videoId}"]`, this.sessionsWrapper);
    const bar = qs(
      '.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar',
      container || document,
    );
    if (!bar) return;
    const percentage = Math.min(100, (current / length) * 100);
    bar.style.width = `${percentage}%`;
    bar.style.backgroundColor = '#1473e6';
    bar.style.display = 'block';
  }

  /* UX bits */
  _copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .catch(() => this._legacyCopy(text));
      return;
    }
    this._legacyCopy(text);
  }

  _legacyCopy(text) {
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

  _toast(message, type = 'default', button = null) {
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
    const closeButton = qs('.video-playlist-container__toast-close', toast);
    closeButton.addEventListener('click', () => toast.remove());
    if (button) {
      qs('.video-playlist-container__toast-button', toast)?.addEventListener(
        'click',
        () => {
          if (button.link) window.location.href = button.link;
        },
      );
    }
  }
}
