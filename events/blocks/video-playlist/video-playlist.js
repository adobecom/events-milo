/* VideoPlaylist.js */

/* eslint-disable no-underscore-dangle */
import { LIBS } from '../../scripts/utils.js';
// Utility imports (assuming a structure where these are accessible)
import {
    getLocalStorageVideos,
    saveLocalStorageVideos,
    saveCurrentVideoProgress,
    getLocalStorageShouldAutoPlay,
    saveShouldAutoPlayToLocalStorage,
    getCurrentPlaylistId,
    findVideoIdFromIframeSrc,
    startVideoFromSecond
} from './utils.js'; // Assuming utils.js is in the same directory

import {
    PLAYLIST_PLAY_ALL_ID,
    MPC_STATUS,
    RESTART_THRESHOLD,
    PROGRESS_SAVE_INTERVAL,
    VIDEO_ORIGIN,
    VIDEO_PLAYLIST_ID_URL_KEY,
    TOAST_CONTAINER_ID,
    EVENT_STATES,
    ANALYTICS,
    MOCK_API,
    PLAYLIST_SKIP_TO_ID,
} from './constants.js'; // Assuming constants.js is in the same directory

const { createTag } = await import(`${LIBS}/utils/utils.js`); // Utility to create DOM elements

export default function init(el) {
    return new VideoPlaylist(el);
}

class VideoPlaylist {
    constructor(el) {
        this.el = el;
        this.cfg = {};
        this.root = null;
        this.sessionsWrapper = null;
        this.videoContainer = null;
        this.cards = [];
        this.currentPlaylistId = null;
        this.youtubePlayer = null;
        this.progressInterval = null;
        this.boundHandlePlayerMessage = this._handlePlayerMessage.bind(this);
        this.eventsFired = false;
        this.init();
    }

    async init() {
        try {
            this.cfg = this._parseCfg();
            this.currentPlaylistId = getCurrentPlaylistId();

            this.root = this._createMainContainer();
            this.el.appendChild(this.root);

            await this._loadAndDisplaySessions();

            this._setupVideoPlayer();

        } catch (e) {
            console.error('VideoPlaylist Initialization Error:', e);
        }
    }

    /**
     * Parses configuration from the Helix-generated DOM structure.
     * @returns {object} The configuration object.
     */
    _parseCfg() {
        const meta = Object.fromEntries(
            [...this.el.querySelectorAll(':scope > div > div:first-child')].map((div) => [
                div.textContent.trim().toLowerCase().replace(/ /g, '-'),
                div.nextElementSibling?.textContent?.trim() || '',
            ]),
        );

        return {
            playlistId: meta['playlist-id'] || null,
            playlistTitle: meta['playlist-title'] || 'Video Playlist',
            topicEyebrow: meta['topic-eyebrow'] || '',
            autoplayText: meta['autoplay-text'] || 'Play All',
            skipPlaylistText: meta['skip-playlist'] || 'Skip playlist',
            minimumSessions: parseInt(meta['minimum-session'], 10) || 4,
            sort: meta['sort'] || 'default',
            sortByTime: meta['sort-by-time'] === 'true',
            isTagBased: meta['is-tagbased'] !== 'false',
            socialSharing: meta['social-sharing'] !== 'false',
            favoritesEnabled: meta['favorites-enabled'] !== 'false',
            favoritesTooltipText: meta['tooltip-text'] || 'Add to favorites',
            favoritesNotificationText: meta['favorites-notification-text'] || 'Session added to favorites',
            favoritesButtonText: meta['favorites-button-text'] || 'View Schedule',
            favoritesButtonLink: meta['favorites-button-link'] || '/schedule',
            theme: meta['theme'] || 'light',
        };
    }

    _createMainContainer() {
        const container = createTag('div', { class: 'video-playlist-container' });
        if (this.cfg.theme === 'light') {
            container.classList.add('consonant--light');
        }
        container.style.display = 'none';
        return container;
    }

    async _loadAndDisplaySessions() {
        try {
            const response = this.cfg.isTagBased
                ? await MOCK_API.getSessions()
                : await MOCK_API.getSessions(this.cfg.playlistId);

            this.cards = response.cards;
            const filteredCards = this._filterCards(this.cards);
            const sortedCards = this._sortCards(filteredCards, this.cfg.sort);

            if (sortedCards.length < this.cfg.minimumSessions) {
                console.warn('Not enough sessions to display playlist. Minimum required:', this.cfg.minimumSessions);
                return;
            }

            this._displayPlaylist(sortedCards);

        } catch (e) {
            console.error('Failed to load sessions:', e);
        }
    }

    /* VideoPlaylist.js */

// ... (other methods)

    /**
     * Filters cards to show only sessions whose end date is in the past (archived content).
     * If the server date API fails, it returns all cards as a fallback.
     * @param {Array} cards - The array of session cards.
     * @returns {Array} The filtered array.
     */
    _filterCards(cards) {
      if (!Array.isArray(cards)) {
          console.error('Invalid input: cards must be an array.');
          return [];
      }
      
      let currentDate;
      try {
          // Attempt to get the server-side current time
          currentDate = window?.northstar?.servertime?.currentTime?.getInstance()?.getTime();
          if (!currentDate) {
              throw new Error('Server current date is not available.');
          }
      } catch (error) {
          // FALLBACK: If server time fails, return all cards (as per old implementation logic)
          console.error('Error accessing current date for filtering. Returning all cards:', error);
          return cards;
      }

      return cards.filter((card) => {
          const hasMpcVideoId = card.search?.mpcVideoId;
          const hasVideoId = card.search?.videoId;
          
          // 1. Must have a video ID
          if (!hasMpcVideoId && !hasVideoId) {
              return false;
          }
          
          // 2. Must have a valid end date
          if (!card.endDate || isNaN(Date.parse(card.endDate))) {
              return false;
          }

          // 3. The card's end date must be in the past to be included (archived)
          const endDate = new Date(card.endDate).getTime();
          return endDate < currentDate;
      });
  }

    /**
     * Sorts cards, primarily by `startDate` if configured.
     * @param {Array} cards - The array of session cards.
     * @param {string} sort - The sort type.
     * @returns {Array} The sorted array.
     */
    _sortCards(cards, sort) {
        if (!sort || cards.length === 0) return cards;

        if (this.cfg.sortByTime) {
            return [...cards].sort((a, b) => {
                const aTime = new Date(a.startDate).getTime();
                const bTime = new Date(b.startDate).getTime();
                return aTime - bTime;
            });
        }
        return cards;
    }

    _displayPlaylist(cards) {
        this.root.style.display = '';

        this.root.appendChild(this._createHeader());

        this.sessionsWrapper = this._createSessionsWrapper(cards);
        this.root.appendChild(this.sessionsWrapper);

        const toastsContainer = createTag('div', { id: TOAST_CONTAINER_ID });
        this.root.appendChild(toastsContainer);

        if (this.cfg.favoritesEnabled) {
            this._setupFavorites();
        }
    }

    /* --- Header and Sharing --- */

    _createHeader() {
        const header = createTag('div', { class: 'video-playlist-container__header' });
        const isAutoPlayChecked = getLocalStorageShouldAutoPlay();

        header.innerHTML = `
            <div class="video-playlist-container__header__upper">
                <div class="video-playlist-container__header__upper__skipLink">
                    <a href="#${PLAYLIST_SKIP_TO_ID}" class="video-playlist-container__header__upper__skipLink__link button">
                        ${this.cfg.skipPlaylistText}
                    </a>
                </div>
                <div class="video-playlist-container__header__toggle">
                    <div class="consonant-switch consonant-switch--sizeM">
                        <input
                            type="checkbox"
                            class="consonant-switch-input"
                            id="${PLAYLIST_PLAY_ALL_ID}"
                            daa-ll="${isAutoPlayChecked ? ANALYTICS.TOGGLE_OFF : ANALYTICS.TOGGLE_ON}"
                            ${isAutoPlayChecked ? 'checked' : ''}
                        />
                        <span class="consonant-switch-switch"></span>
                        <label class="consonant-switch-label" for="${PLAYLIST_PLAY_ALL_ID}">
                            ${(this.cfg.autoplayText).toUpperCase()}
                        </label>
                    </div>
                </div>
            </div>
            <div class="video-playlist-container__header__content">
                <div class="video-playlist-container__header__content__left">
                    <p class="video-playlist-container__header__content__left__topic">${this.cfg.topicEyebrow}</p>
                    <h3 class="video-playlist-container__header__content__left__title">${this.cfg.playlistTitle}</h3>
                </div>
                <div class="video-playlist-container__header__content__right">
                    ${this.cfg.socialSharing ? this._createSocialSharingButton() : ''}
                </div>
            </div>
        `;

        this._setupAutoplayCheckbox(header);
        if (this.cfg.socialSharing) {
            this._setupSocialSharing(header);
        }

        return header;
    }

    _createSocialSharingButton() {
        const socialConfig = this._parseSocialConfig();
        if (!Object.values(socialConfig).some(p => p.enabled)) return '';
        const menuItems = this._generateSocialMenuItems(socialConfig);

        return `
            <div class="video-playlist-container__social-share-wrapper">
                <button class="video-playlist-container__social-share" daa-ll="Social_Share">...</button>
                <div>
                    <ul class="video-playlist-container__social-share-menu">${menuItems}</ul>
                </div>
            </div>
        `; // SVG path removed for brevity in refactor
    }

    _parseSocialConfig() {
        // Implementation remains the same: check data attribute, fallback to default
        const socialDataAttr = this.el.getAttribute('data-socials');
        if (socialDataAttr) {
            try {
                return JSON.parse(socialDataAttr);
            } catch (e) {
                console.warn('Failed to parse social config:', e);
            }
        }
        return {
            facebook: { enabled: true, altText: "Share Playlist on Facebook" },
            twitter: { enabled: true, altText: "Share Playlist on X" },
            linkedin: { enabled: true, altText: "Share Playlist on LinkedIn" },
            copy: { enabled: true, altText: "Share with link", toasterText: "Link copied to clipboard" }
        };
    }

    _generateSocialMenuItems(socialConfig) {
        // Implementation remains the same, using embedded SVGs and analytics
        // ... (Return string of <li><a>...</a></li> elements)
        return `
            <li><a class="social-share-link" data-platform="facebook" daa-ll="Facebook_Share Playlist" aria-label="Share Playlist on Facebook" href="#" target="_blank">...</a></li>
            <li><a class="social-share-link" data-platform="twitter" daa-ll="Twitter_Share Playlist" aria-label="Share Playlist on X" href="#" target="_blank">...</a></li>
            <li><a class="social-share-link" data-platform="linkedin" daa-ll="LinkedIn_Share Playlist" aria-label="Share Playlist on LinkedIn" href="#" target="_blank">...</a></li>
            <li><a class="social-share-link" data-platform="copy" daa-ll="Link_Share Playlist" aria-label="Share with link" href="#">...</a></li>
        `;
    }

    _setupAutoplayCheckbox(header) {
        const checkbox = header.querySelector(`#${PLAYLIST_PLAY_ALL_ID}`);
        if (checkbox) {
            checkbox.addEventListener('change', (event) => {
                saveShouldAutoPlayToLocalStorage(event.target.checked);
                event.target.setAttribute('daa-ll', event.target.checked ? ANALYTICS.TOGGLE_OFF : ANALYTICS.TOGGLE_ON);
            });
        }
    }

    _setupSocialSharing(header) {
        const shareButton = header.querySelector('.video-playlist-container__social-share');
        const shareMenuWrapper = header.querySelector('.video-playlist-container__social-share-wrapper > div');
        const shareMenu = header.querySelector('.video-playlist-container__social-share-menu');

        if (shareButton && shareMenuWrapper && shareMenu) {
            shareButton.addEventListener('click', (e) => {
                e.stopPropagation();
                shareMenuWrapper.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!header.contains(e.target)) {
                    shareMenuWrapper.classList.remove('active');
                }
            });

            shareMenu.querySelectorAll('.social-share-link').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this._handleShare(item.dataset.platform, item);
                    shareMenuWrapper.classList.remove('active');
                });
            });
        }
    }

    _handleShare(platform, anchorElement) {
        const playlistUrl = window.location.href;
        const socialConfig = this._parseSocialConfig();
        const platformConfig = socialConfig[platform];

        if (!platformConfig || !platformConfig.enabled) return;

        switch (platform) {
            case 'facebook':
                anchorElement.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(playlistUrl)}`;
                break;
            case 'twitter':
                const twitterText = platformConfig.twitterCustomText || platformConfig.extraText || '';
                const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(playlistUrl)}`;
                anchorElement.href = twitterText ? `${twitterUrl}&text=${encodeURIComponent(twitterText)}` : twitterUrl;
                break;
            case 'linkedin':
                anchorElement.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(playlistUrl)}`;
                break;
            case 'copy':
                this._copyToClipboard(playlistUrl, platformConfig.toasterText);
                return;
            default:
                this._openShareWindow(anchorElement.href, platform);
        }

        if (platform !== 'copy') {
             // For social platforms, allow the default link action (window.open is handled by the browser if href is set)
             // If this should open in a popup, use _openShareWindow explicitly.
             // Given the original implementation sets the href, we assume a standard anchor click behavior which may open a new window/tab.
        }
    }

    _copyToClipboard(text, notificationText = 'Link copied to clipboard!') {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                this._showNotification(notificationText);
            }).catch(() => {
                this._fallbackCopyToClipboard(text, notificationText);
            });
        } else {
            this._fallbackCopyToClipboard(text, notificationText);
        }
    }

    _fallbackCopyToClipboard(text, notificationText) {
        const textArea = createTag('textarea', { value: text });
        textArea.style.position = 'fixed'; // Keep off-screen
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            this._showNotification(notificationText);
        } catch (err) {
            console.error('Failed to copy text:', err);
            this._showNotification('Failed to copy link');
        }
        document.body.removeChild(textArea);
    }

    _openShareWindow(url, platform) {
        window.open(url, `${platform}Share`, 'width=600,height=400,scrollbars=yes,resizable=yes');
    }

    _showNotification(message) {
        const notification = createTag('div', { class: 'video-playlist-container__share-notification' });
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    /* --- Sessions List --- */

    _createSessionsWrapper(cards) {
        const sessions = createTag('div', { class: 'video-playlist-container__sessions' });
        const sessionsWrapper = createTag('div', { class: 'video-playlist-container__sessions__wrapper' });

        const sessionsHTML = cards.map((card) => {
            const videoId = card.search.mpcVideoId || card.search.videoId;
            const linkText = card.contentArea.title;

            return `
                <div daa-lh="${linkText}" class="video-playlist-container__sessions__wrapper__session" data-video-id="${videoId}">
                    <a daa-ll="${ANALYTICS.VIDEO_SELECT}" href="${card.overlayLink}" class="video-playlist-container__sessions__wrapper__session__link">
                        <div class="video-playlist-container__sessions__wrapper__session__thumbnail">
                            <img src="${card.search.thumbnailUrl}" alt="${linkText}" />
                            <div class="video-playlist-container__sessions__wrapper__session__thumbnail__play-icon">...</div>
                            <div class="video-playlist-container__sessions__wrapper__session__thumbnail__duration">
                                <p>${card.search.videoDuration}</p>
                            </div>
                            <div class="video-playlist-container__sessions__wrapper__session__thumbnail__progress">
                                <div class="video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar"></div>
                            </div>
                        </div>
                        <div class="video-playlist-container__sessions__wrapper__session__info">
                            <h4>${linkText}</h4>
                            <p>${card.contentArea.description}</p>
                        </div>
                    </a>
                </div>
            `;
        }).join('');

        sessionsWrapper.innerHTML = sessionsHTML;
        sessions.appendChild(sessionsWrapper);
        this._setInitialProgressBars(sessionsWrapper);

        return sessions;
    }

    _setInitialProgressBars(sessionsWrapper) {
        const localStorageVideos = getLocalStorageVideos();
        sessionsWrapper.querySelectorAll('.video-playlist-container__sessions__wrapper__session').forEach((sessionElement) => {
            const sessionVideoId = sessionElement.getAttribute('data-video-id');
            const sessionData = localStorageVideos[sessionVideoId];
            if (sessionData && sessionData.length) {
                const progressBar = sessionElement.querySelector(
                    '.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar',
                );
                const progress = (sessionData.secondsWatched / sessionData.length) * 100;
                if (progressBar) {
                    progressBar.style.width = `${Math.min(100, progress)}%`;
                }
            }
        });
    }

    /* --- Favorites --- */

    async _setupFavorites() {
        try {
            const isRegistered = await MOCK_API.isUserRegistered();
            if (!isRegistered) return;

            const favoritesResponse = await MOCK_API.getFavorites();
            const favoriteSessionIds = new Set(favoritesResponse.sessionInterests.map(f => f.sessionID));

            this.sessionsWrapper.querySelectorAll('.video-playlist-container__sessions__wrapper__session').forEach((session) => {
                const sessionVideoId = session.getAttribute('data-video-id');
                const card = this.cards.find((c) => (c.search.mpcVideoId === sessionVideoId || c.search.videoId === sessionVideoId));

                if (card) {
                    const isFavorite = favoriteSessionIds.has(card.search.sessionId);
                    const favoriteButton = this._createFavoriteButton(card, isFavorite);
                    session.appendChild(favoriteButton);
                }
            });
        } catch (e) {
            console.error('Failed to setup favorites:', e);
        }
    }

    _createFavoriteButton(card, isFavorite) {
        const heartClass = isFavorite ? 'filled' : 'unfilled';
        const buttonText = isFavorite ? 'Remove from favorites' : this.cfg.favoritesTooltipText;

        const favoriteButton = createTag('button', {
            class: 'video-playlist-container__sessions__wrapper__session__favorite',
            'daa-ll': isFavorite ? ANALYTICS.UNFAVORITE : ANALYTICS.FAVORITE,
            'aria-label': `${buttonText} ${card.contentArea.title}`,
            'data-tooltip': this.cfg.favoritesTooltipText, // Used for CSS tooltip
        });

        favoriteButton.innerHTML = `<svg class="heart ${heartClass}" width="15" height="14" viewBox="0 0 15 14">...</svg>`; // SVG path removed for brevity

        favoriteButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this._toggleFavorite(favoriteButton, card);
        });

        return favoriteButton;
    }

    async _toggleFavorite(favoriteButton, card) {
        try {
            favoriteButton.disabled = true;
            favoriteButton.classList.add('loading');

            const response = await MOCK_API.toggleFavorite(card.search.sessionId);

            if (!response.success) throw new Error('API toggle failed.');

            const favoriteSVG = favoriteButton.querySelector('svg');
            const isFavorite = favoriteSVG.classList.contains('filled');

            favoriteSVG.classList.toggle('filled', !isFavorite);
            favoriteSVG.classList.toggle('unfilled', isFavorite);

            const newDaaLL = isFavorite ? ANALYTICS.FAVORITE : ANALYTICS.UNFAVORITE;
            favoriteButton.setAttribute('daa-ll', newDaaLL);

            const newState = !isFavorite ? 'Remove from favorites' : 'Add to favorites';
            favoriteButton.setAttribute('aria-label', `${newState} ${card.contentArea.title}`);

            if (!isFavorite) {
                this._showFavoriteNotification();
            }

        } catch (e) {
            console.error('Failed to toggle favorite:', e);
            this._showErrorNotification('Failed to update favorites. Please try again.');
        } finally {
            favoriteButton.disabled = false;
            favoriteButton.classList.remove('loading');
        }
    }

    _showErrorNotification(message) {
        const notification = createTag('div', { class: 'video-playlist-container__notification video-playlist-container__notification--error', });
        notification.innerHTML = `<p>${message}</p><button class="video-playlist-container__notification__close">×</button>`;
        this.root.appendChild(notification);

        setTimeout(() => notification.remove(), 5000);
        notification.querySelector('.video-playlist-container__notification__close').addEventListener('click', () => notification.remove());
    }

    _showFavoriteNotification() {
        let toastsContainer = document.getElementById(TOAST_CONTAINER_ID);
        if (!toastsContainer) {
            toastsContainer = createTag('div', { id: TOAST_CONTAINER_ID });
            this.root.appendChild(toastsContainer);
        }

        const notification = createTag('div', {
            class: 'video-playlist-container__toast video-playlist-container__toast--positive',
            role: 'alert',
            'aria-live': 'assertive',
        });

        notification.innerHTML = `
            <div class="video-playlist-container__toast-body">
                <div class="video-playlist-container__toast-content">${this.cfg.favoritesNotificationText}</div>
                <button class="video-playlist-container__toast-button" daa-ll="${ANALYTICS.VIEW_SCHEDULE}">
                    <span>${this.cfg.favoritesButtonText}</span>
                </button>
            </div>
            <div class="video-playlist-container__toast-buttons">
                <button aria-label="close" class="video-playlist-container__toast-close" daa-ll="${ANALYTICS.CLOSE_FAVORITE_NOTIFICATION}">...</button>
            </div>
        `; // SVG paths removed for brevity

        toastsContainer.appendChild(notification);
        setTimeout(() => notification.remove(), 5000); // Auto-remove after 5s

        notification.querySelector('.video-playlist-container__toast-close').addEventListener('click', () => notification.remove());
        notification.querySelector('.video-playlist-container__toast-button').addEventListener('click', () => {
            if (this.cfg.favoritesButtonLink) window.location.href = this.cfg.favoritesButtonLink;
        });
    }

    /* --- Video Player Integration --- */

    _setupVideoPlayer() {
        this.videoContainer = document.querySelector('.milo-video');

        if (this.videoContainer) {
            this._setupPlayerListeners();
        } else {
            this._watchForVideoContainer();
        }
    }

    _watchForVideoContainer() {
        const observer = new MutationObserver((mutationsList, obs) => {
            const videoContainer = document.querySelector('.milo-video');
            if (videoContainer) {
                obs.disconnect();
                this.videoContainer = videoContainer;
                this._setupPlayerListeners();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    _setupPlayerListeners() {
        this._highlightCurrentSession();
        window.removeEventListener('message', this.boundHandlePlayerMessage);
        window.addEventListener('message', this.boundHandlePlayerMessage);
        this._setupYouTubePlayer();
    }

    _highlightCurrentSession() {
        if (!this.videoContainer || !this.sessionsWrapper) return;

        const videoId = this._findVideoId();
        if (videoId) {
            this.sessionsWrapper.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
            const sessionElement = this.sessionsWrapper.querySelector(`[data-video-id="${videoId}"]`);

            if (sessionElement) {
                sessionElement.classList.add('highlighted');
                sessionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    _findVideoId() {
        if (!this.videoContainer) return null;

        const liteYoutube = this.videoContainer.querySelector('lite-youtube');
        if (liteYoutube) return liteYoutube.getAttribute('videoid');

        const iframe = this.videoContainer.querySelector('iframe');
        return iframe ? findVideoIdFromIframeSrc(iframe.getAttribute('src')) : null;
    }

    _handlePlayerMessage(event) {
        if (event.origin !== VIDEO_ORIGIN || event.data.type !== MPC_STATUS) return;

        const { data } = event;
        switch (data.state) {
            case EVENT_STATES.LOAD:
                this._handleMpcLoad(data);
                break;
            case EVENT_STATES.PAUSE:
                saveCurrentVideoProgress(data.id, data.currentTime);
                break;
            case EVENT_STATES.TICK:
                if (data.currentTime % PROGRESS_SAVE_INTERVAL === 0) {
                    saveCurrentVideoProgress(data.id, data.currentTime, data.length);
                }
                break;
            case EVENT_STATES.COMPLETE:
                this._handleVideoComplete(data.id);
                break;
        }
    }

    _handleMpcLoad(data) {
        const { id, length } = data;
        this._highlightCurrentSession();

        const currentSessionData = getLocalStorageVideos()[id];
        let startAt = 0;

        if (currentSessionData && currentSessionData.secondsWatched) {
            // Restart if near end, otherwise continue
            startAt = currentSessionData.secondsWatched > length - RESTART_THRESHOLD ? 0 : currentSessionData.secondsWatched;
        }
        startVideoFromSecond(this.videoContainer, startAt);
    }

    _handleVideoComplete(videoId) {
        // Stop any progress tracking interval
        if (this.progressInterval) clearInterval(this.progressInterval);

        // Update localStorage as completed
        const localStorageVideos = getLocalStorageVideos();
        if (localStorageVideos[videoId]) {
            localStorageVideos[videoId].completed = true;
            // Ensure secondsWatched is duration if known
            if (localStorageVideos[videoId].length) {
                localStorageVideos[videoId].secondsWatched = localStorageVideos[videoId].length;
            }
            saveLocalStorageVideos(localStorageVideos);
        }

        const shouldPlayAll = getLocalStorageShouldAutoPlay();

        if (shouldPlayAll) {
            const currentSessionIndex = this.cards.findIndex(
                (card) => (card.search.mpcVideoId === videoId || card.search.videoId === videoId),
            );

            if (currentSessionIndex !== -1 && currentSessionIndex < this.cards.length - 1) {
                const nextSession = this.cards[currentSessionIndex + 1];
                const nextSessionURL = new URL(nextSession.overlayLink, window.location.origin);
                if (this.currentPlaylistId) {
                    nextSessionURL.searchParams.set(VIDEO_PLAYLIST_ID_URL_KEY, this.currentPlaylistId);
                }
                window.location.href = nextSessionURL.href;
            }
        }
    }

    /* --- YouTube Integration --- */

    _setupYouTubePlayer() {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => this._initializeYouTubePlayer();
    }

    _initializeYouTubePlayer() {
        if (!this.videoContainer) return;

        const liteYoutube = this.videoContainer.querySelector('lite-youtube');
        const iframe = this.videoContainer.querySelector('iframe');
        const videoId = liteYoutube
            ? liteYoutube.getAttribute('videoid')
            : (iframe ? findVideoIdFromIframeSrc(iframe.src) : null);

        if (!videoId || !this._isYouTubeVideo(liteYoutube ? videoId : iframe?.src)) return;

        if (liteYoutube) {
            // Lite-youtube requires modification of the generated iframe
            this._setupLiteYouTubePlayer(liteYoutube, videoId);
        } else if (iframe && iframe.src.includes('enablejsapi=1')) {
            // Already an API-enabled iframe
            this._setupYouTubeProgressTracking(iframe, videoId);
        }
    }

    _isYouTubeVideo(srcOrId) {
        return srcOrId && (srcOrId.includes('youtube.com') || srcOrId.includes('youtube-nocookie.com') || srcOrId.length === 11); // ID length check for lite-youtube
    }

    _setupLiteYouTubePlayer(liteYoutube, videoId) {
        const clickHandler = () => {
            const checkForIframe = setInterval(() => {
                const iframe = this.videoContainer.querySelector('iframe');
                if (iframe && iframe.src.includes('youtube-nocookie.com/embed/')) {
                    clearInterval(checkForIframe);
                    liteYoutube.removeEventListener('click', clickHandler);
                    this._addEnableJsApiToIframe(iframe, videoId);
                }
            }, 100);
        };
        liteYoutube.addEventListener('click', clickHandler);
    }

    _addEnableJsApiToIframe(iframe, videoId) {
        try {
            const url = new URL(iframe.src);
            url.searchParams.set('enablejsapi', '1');
            url.searchParams.set('origin', window.location.origin);

            const currentSessionData = getLocalStorageVideos()[videoId];
            if (currentSessionData && currentSessionData.secondsWatched > RESTART_THRESHOLD) {
                url.searchParams.set('start', Math.floor(currentSessionData.secondsWatched));
            }

            iframe.src = url.toString();
            iframe.addEventListener('load', () => this._setupYouTubeProgressTracking(iframe, videoId));
        } catch (error) {
            console.error('Error modifying YouTube iframe src:', error);
        }
    }

    _setupYouTubeProgressTracking(iframe, videoId) {
        if (window.YT && window.YT.Player) {
            this._createYouTubePlayerInstance(iframe, videoId);
        } else {
            const checkAPI = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    clearInterval(checkAPI);
                    this._createYouTubePlayerInstance(iframe, videoId);
                }
            }, 100);
        }
    }

    _createYouTubePlayerInstance(iframe, videoId) {
        try {
            let playerId = iframe.getAttribute('id');
            if (!playerId) {
                playerId = `player-${videoId}-${Date.now()}`;
                iframe.setAttribute('id', playerId);
            }

            this.youtubePlayer = new window.YT.Player(playerId, {
                events: {
                    onReady: (e) => this._handleYouTubePlayerReady(e, videoId),
                    onStateChange: (e) => this._handleYouTubePlayerStateChange(e, videoId)
                }
            });
        } catch (error) {
            console.error('Error creating YT.Player:', error);
        }
    }

    _handleYouTubePlayerReady(event, videoId) {
        this.eventsFired = true;
        this._startYouTubeProgressTracking(event.target, videoId);
    }

    _startYouTubeProgressTracking(player, videoId) {
        if (this.progressInterval) clearInterval(this.progressInterval);

        this.progressInterval = setInterval(() => {
            this._recordYouTubePlayerProgress(player, videoId);
        }, 1000); // Check progress every second
    }

    _handleYouTubePlayerStateChange(event, videoId) {
        this.eventsFired = true;

        if (event.data === window.YT.PlayerState.PLAYING) {
            this._startYouTubeProgressTracking(event.target, videoId);
        } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.BUFFERING) {
            if (this.progressInterval) clearInterval(this.progressInterval);
            this._recordYouTubePlayerProgress(event.target, videoId);
        } else if (event.data === window.YT.PlayerState.ENDED) {
            if (this.progressInterval) clearInterval(this.progressInterval);
            this._handleVideoComplete(videoId);
        }
    }

    async _recordYouTubePlayerProgress(player, videoId) {
        try {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();

            if (currentTime && duration) {
                // Save to local storage
                await saveCurrentVideoProgress(videoId, currentTime, duration);
                // Update DOM progress bar
                this._updateProgressBarForVideo(videoId, currentTime, duration);
            }
        } catch (error) {
            console.error('Error recording YouTube progress:', error);
        }
    }

    _updateProgressBarForVideo(videoId, currentTime, duration) {
        const sessionElement = document.querySelector(`[data-video-id="${videoId}"]`);

        if (sessionElement) {
            const progressBar = sessionElement.querySelector(
                '.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar'
            );

            if (progressBar) {
                const progress = (currentTime / duration) * 100;
                progressBar.style.width = `${Math.min(100, progress)}%`;
                progressBar.style.backgroundColor = '#1473e6'; // Ensure color is set
                progressBar.style.display = 'block';
            }
        }
    }

    /* --- Cleanup --- */

    static dispose() {
        document.querySelectorAll('.video-playlist-container').forEach(playlist => playlist.remove());
    }

    cleanup() {
        if (this.progressInterval) clearInterval(this.progressInterval);
        if (this.youtubePlayer && typeof this.youtubePlayer.destroy === 'function') {
            this.youtubePlayer.destroy();
        }
        window.removeEventListener('message', this.boundHandlePlayerMessage);
    }
}