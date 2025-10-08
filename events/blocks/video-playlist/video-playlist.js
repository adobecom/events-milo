/* VideoPlaylist.js */
/* eslint-disable no-underscore-dangle */
import { LIBS } from '../../scripts/utils.js';
import {
    getLocalStorageVideos, saveLocalStorageVideos, saveCurrentVideoProgress,
    getLocalStorageShouldAutoPlay, saveShouldAutoPlayToLocalStorage,
    getCurrentPlaylistId, findVideoIdFromIframeSrc, startVideoFromSecond
} from './utils.js';
import {
    PLAYLIST_PLAY_ALL_ID, MPC_STATUS, RESTART_THRESHOLD, PROGRESS_SAVE_INTERVAL,
    VIDEO_ORIGIN, VIDEO_PLAYLIST_ID_URL_KEY, TOAST_CONTAINER_ID, EVENT_STATES,
    ANALYTICS, MOCK_API, PLAYLIST_SKIP_TO_ID, SOCIAL_ICONS
} from './constants.js';

const { createTag } = await import(`${LIBS}/utils/utils.js`);

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

    /* --- Configuration --- */

    _parseCfg() {
        const meta = Object.fromEntries(
            [...this.el.querySelectorAll(':scope > div > div:first-child')].map((div) => [
                div.textContent.trim().toLowerCase().replace(/ /g, '-'),
                div.nextElementSibling?.textContent?.trim() || '',
            ])
        );

        const parseBool = (val, def) => val === undefined || val === '' ? def : val.toLowerCase() === 'true';
        const parseInt = (val, def) => {
            if (!val) return def;
            const num = Number.parseInt(val, 10);
            return Number.isNaN(num) ? def : num;
        };

        return {
            playlistId: meta['playlist-id'] || null,
            playlistTitle: meta['playlist-title'] || 'Video Playlist',
            topicEyebrow: meta['topic-eyebrow'] || '',
            autoplayText: meta['autoplay-text'] || 'Play All',
            skipPlaylistText: meta['skip-playlist-text'] || meta['skip-playlist'] || 'Skip playlist',
            minimumSessions: parseInt(meta['minimum-sessions'] || meta['minimum-session'], 4),
            sort: meta['sort'] || 'default',
            sortByTime: parseBool(meta['sort-by-time'], false),
            isTagBased: parseBool(meta['is-tagbased'], true),
            socialSharing: parseBool(meta['social-sharing'], true),
            favoritesEnabled: parseBool(meta['favorites-enabled'], true),
            favoritesTooltipText: meta['favorites-tooltip-text'] || meta['tooltip-text'] || 'Add to favorites',
            favoritesNotificationText: meta['favorites-notification-text'] || 'Session added to favorites',
            favoritesButtonText: meta['favorites-button-text'] || 'View',
            favoritesButtonLink: meta['favorites-button-link'] || '/schedule',
            theme: meta['theme'] || 'light',
            enableFacebook: parseBool(meta['enable-facebook'], true),
            facebookAltText: meta['facebook-alt-text'] || 'Share Playlist on Facebook',
            enableTwitter: parseBool(meta['enable-twitter'], true),
            twitterCustomText: meta['twitter-custom-text'] || '',
            twitterAltText: meta['twitter-alt-text'] || 'Share Playlist on X',
            enableLinkedIn: parseBool(meta['enable-linkedin'], true),
            linkedInAltText: meta['linked-in-alt-text'] || 'Share Playlist on LinkedIn',
            enableCopyLink: parseBool(meta['enable-copy-link'], true),
            copyLinkAltText: meta['copy-link-alt-text'] || 'Share with link',
            copyNotificationText: meta['copy-notification-text'] || 'Link copied to clipboard!',
        };
    }

    _createMainContainer() {
        const container = createTag('div', { class: 'video-playlist-container' });
        if (this.cfg.theme) container.classList.add(`consonant--${this.cfg.theme}`);
        container.style.display = 'none';
        return container;
    }

    /* --- Session Loading --- */

    async _loadAndDisplaySessions() {
        try {
            const response = this.cfg.isTagBased
                ? await MOCK_API.getSessions()
                : await MOCK_API.getSessions(this.cfg.playlistId);

            this.cards = response.cards.filter(card => card.search.thumbnailUrl);
            const sortedCards = this._sortCards(this.cards, this.cfg.sort);

            if (sortedCards.length < this.cfg.minimumSessions) {
                console.warn('Not enough sessions. Minimum required:', this.cfg.minimumSessions);
                return;
            }

            this._displayPlaylist(sortedCards);
        } catch (e) {
            console.error('Failed to load sessions:', e);
        }
    }

    _sortCards(cards, sortOrder) {
        if (sortOrder === 'default') return cards;

        let sorted = [...cards];
        if (this.cfg.sortByTime) {
            sorted.sort((a, b) => a.search.videoDuration.localeCompare(b.search.videoDuration));
        }
        if (sortOrder === 'ascending') {
            sorted.sort((a, b) => a.contentArea.title.localeCompare(b.contentArea.title));
        } else if (sortOrder === 'descending') {
            sorted.sort((a, b) => b.contentArea.title.localeCompare(a.contentArea.title));
        }
        return sorted;
    }

    _displayPlaylist(cards) {
        this.root.style.display = '';
        this.root.appendChild(this._createHeader());
        const sessionsContainer = this._createSessionsWrapper(cards);
        this.root.appendChild(sessionsContainer);
        if (this.cfg.favoritesEnabled) this._setupFavorites();
        this.root.appendChild(createTag('div', { id: PLAYLIST_SKIP_TO_ID, style: 'height: 1px;' }));
    }

    /* --- Header --- */

    _createHeader() {
        const header = createTag('div', { class: 'video-playlist-container__header' });
        const isChecked = getLocalStorageShouldAutoPlay();

        header.innerHTML = `
            <div class="video-playlist-container__header__upper">
                <div class="video-playlist-container__header__upper__skipLink">
                    <a href="#${PLAYLIST_SKIP_TO_ID}" class="video-playlist-container__header__upper__skipLink__link button">${this.cfg.skipPlaylistText}</a>
                </div>
                <div class="video-playlist-container__header__toggle">
                    <div class="consonant-switch consonant-switch--sizeM">
                        <input type="checkbox" class="consonant-switch-input" id="${PLAYLIST_PLAY_ALL_ID}" 
                            daa-ll="${isChecked ? ANALYTICS.TOGGLE_OFF : ANALYTICS.TOGGLE_ON}" ${isChecked ? 'checked' : ''}/>
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
                    ${this.cfg.socialSharing ? this._createSocialSharingButton() : ''}
                </div>
            </div>
        `;

        this._setupAutoplayCheckbox(header);
        if (this.cfg.socialSharing) this._setupSocialSharing(header);
        return header;
    }

    _setupAutoplayCheckbox(header) {
        const checkbox = header.querySelector(`#${PLAYLIST_PLAY_ALL_ID}`);
        checkbox?.addEventListener('change', (e) => {
            saveShouldAutoPlayToLocalStorage(e.target.checked);
            e.target.setAttribute('daa-ll', e.target.checked ? ANALYTICS.TOGGLE_ON : ANALYTICS.TOGGLE_OFF);
        });
    }

    _createSocialSharingButton() {
        const platforms = {
            facebook: { enabled: this.cfg.enableFacebook, icon: SOCIAL_ICONS.facebook, daaLL: 'Facebook_Share Playlist', text: this.cfg.facebookAltText, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
            twitter: { enabled: this.cfg.enableTwitter, icon: SOCIAL_ICONS.twitter, daaLL: 'Twitter_Share Playlist', text: this.cfg.twitterAltText, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.cfg.twitterCustomText || this.cfg.playlistTitle)}&url=${encodeURIComponent(window.location.href)}` },
            linkedin: { enabled: this.cfg.enableLinkedIn, icon: SOCIAL_ICONS.linkedin, daaLL: 'LinkedIn_Share Playlist', text: this.cfg.linkedInAltText, href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(this.cfg.playlistTitle)}` },
            copy: { enabled: this.cfg.enableCopyLink, icon: SOCIAL_ICONS.copy, daaLL: 'Link_Share Playlist', text: this.cfg.copyLinkAltText, href: '#' },
        };

        const menuItems = Object.entries(platforms)
            .filter(([, p]) => p.enabled)
            .map(([key, p]) => `<li><a class="video-playlist-container__social-share-menu__item" data-platform="${key}" daa-ll="${p.daaLL}" 
                aria-label="${p.text}" href="${p.href}" ${key !== 'copy' ? 'target="_blank"' : ''}>
                <svg width="16" height="16" viewBox="0 0 ${key === 'twitter' ? '1200 1227' : '16 16'}" fill="none" xmlns="http://www.w3.org/2000/svg">${p.icon}</svg>
                <span>${p.text}</span></a></li>`)
            .join('');

        return menuItems ? `
            <div class="video-playlist-container__social-share-wrapper">
                <button class="video-playlist-container__social-share" daa-ll="Social_Share">
                    <svg width="16" height="16" viewBox="0 0 16 16"><path d="M12 6c.8 0 1.5.7 1.5 1.5S12.8 9 12 9s-1.5-.7-1.5-1.5S11.2 6 12 6zM4 6c.8 0 1.5.7 1.5 1.5S4.8 9 4 9s-1.5-.7-1.5-1.5S3.2 6 4 6zM8 6c.8 0 1.5.7 1.5 1.5S8.8 9 8 9s-1.5-.7-1.5-1.5S7.2 6 8 6z"/></svg>
                </button>
                <div class="share-menu-wrapper"><ul class="video-playlist-container__social-share-menu">${menuItems}</ul></div>
            </div>` : '';
    }

    _setupSocialSharing(header) {
        const shareButton = header.querySelector('.video-playlist-container__social-share');
        const menu = header.querySelector('.share-menu-wrapper');
        if (!shareButton || !menu) return;

        shareButton.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
            shareButton.setAttribute('aria-expanded', menu.classList.contains('active'));
        });

        document.addEventListener('click', () => {
            menu.classList.remove('active');
            shareButton.setAttribute('aria-expanded', 'false');
        });

        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', (e) => {
                if (link.dataset.platform === 'copy') {
                    e.preventDefault();
                    this._copyToClipboard(window.location.href);
                    this._showToast(this.cfg.copyNotificationText);
                } else {
                    e.preventDefault();
                    window.open(e.currentTarget.href, 'share-window', 'width=600,height=400,scrollbars=yes');
                }
            });
        });
    }

    _copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).catch(() => this._fallbackCopy(text));
        } else {
            this._fallbackCopy(text);
        }
    }

    _fallbackCopy(text) {
        const textArea = createTag('textarea', { value: text, style: 'position:fixed;left:-999999px;top:-999999px;' });
        document.body.appendChild(textArea);
        textArea.select();
        try { document.execCommand('copy'); } catch (err) { console.error('Copy failed', err); }
        document.body.removeChild(textArea);
    }

    _showToast(message, type = 'default', button = null) {
        let container = document.getElementById(TOAST_CONTAINER_ID);
        if (!container) {
            container = createTag('div', { id: TOAST_CONTAINER_ID });
            this.root.appendChild(container);
        }

        const toast = createTag('div', {
            class: `video-playlist-container__toast ${type === 'positive' ? 'video-playlist-container__toast--positive' : ''}`,
            role: 'alert', 'aria-live': 'assertive', 'aria-atomic': 'true'
        });

        const icon = type === 'positive' ? '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18" class="video-playlist-container__toast-icon"><rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18"></rect><path d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm5.333,4.54L8.009,13.6705a.603.603,0,0,1-.4375.2305H7.535a.6.6,0,0,1-.4245-.1755L3.218,9.829a.6.6,0,0,1-.00147-.84853L3.218,8.979l.663-.6625A.6.6,0,0,1,4.72953,8.315L4.731,8.3165,7.4,10.991l5.257-6.7545a.6.6,0,0,1,.8419-.10586L13.5,4.1315l.7275.5685A.6.6,0,0,1,14.333,5.54Z"></path></svg>' : '';

        toast.innerHTML = `
            ${icon}
            <div class="video-playlist-container__toast-body">
                <div class="video-playlist-container__toast-content">${message}</div>
                ${button ? `<button class="video-playlist-container__toast-button" daa-ll="${button.daaLL}"><span class="video-playlist-container__toast-button-label">${button.text}</span></button>` : ''}
            </div>
            <div class="video-playlist-container__toast-buttons">
                <button aria-label="close" class="video-playlist-container__toast-close" label="Close" daa-ll="${ANALYTICS.CLOSE_FAVORITE_NOTIFICATION}">
                    <svg class="video-playlist-container__toast-close-icon" viewBox="0 0 8 8"><path d="m5.238 4 2.456-2.457A.875.875 0 1 0 6.456.306L4 2.763 1.543.306A.875.875 0 0 0 .306 1.544L2.763 4 .306 6.457a.875.875 0 1 0 1.238 1.237L4 5.237l2.456 2.457a.875.875 0 1 0 1.238-1.237z"></path></svg>
                </button>
            </div>
        `;

        container.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);

        toast.querySelector('.video-playlist-container__toast-close').addEventListener('click', () => toast.remove());
        if (button) {
            toast.querySelector('.video-playlist-container__toast-button')?.addEventListener('click', () => {
                if (button.link) window.location.href = button.link;
            });
        }
    }

    /* --- Sessions --- */

    _createSessionsWrapper(cards) {
        const sessions = createTag('div', { class: 'video-playlist-container__sessions' });
        this.sessionsWrapper = createTag('div', { class: 'video-playlist-container__sessions__wrapper' });

        this.sessionsWrapper.innerHTML = cards.map((card) => {
            const videoId = card.search.mpcVideoId || card.search.videoId;
            return `
                <div daa-lh="${card.contentArea.title}" class="video-playlist-container__sessions__wrapper__session" data-video-id="${videoId}">
                    <a daa-ll="${ANALYTICS.VIDEO_SELECT}" href="${card.overlayLink}" class="video-playlist-container__sessions__wrapper__session__link">
                        <div class="video-playlist-container__sessions__wrapper__session__thumbnail">
                            <img src="${card.search.thumbnailUrl}" alt="${card.contentArea.title}" loading="lazy"/>
                            <div class="video-playlist-container__sessions__wrapper__session__thumbnail__play-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 18 18" width="40">
                                    <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" />
                                    <path fill="#e5e5e5" d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm4.2685,8.43L7.255,12.93A.50009.50009,0,0,1,7,13H6.5a.5.5,0,0,1-.5-.5v-7A.5.5,0,0,1,6.5,5H7a.50009.50009,0,0,1,.255.07l6.0135,3.5a.5.5,0,0,1,0,.86Z" />
                                </svg>
                            </div>
                            <div class="video-playlist-container__sessions__wrapper__session__thumbnail__duration">
                                <p class="video-playlist-container__sessions__wrapper__session__thumbnail__duration__text">${card.search.videoDuration}</p>
                            </div>
                            <div class="video-playlist-container__sessions__wrapper__session__thumbnail__progress">
                                <div class="video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar"></div>
                            </div>
                        </div>
                        <div class="video-playlist-container__sessions__wrapper__session__info">
                            <h4 class="video-playlist-container__sessions__wrapper__session__info__title">${card.contentArea.title}</h4>
                            <p class="video-playlist-container__sessions__wrapper__session__info__description">${card.contentArea.description}</p>
                        </div>
                    </a>
                </div>
            `;
        }).join('');

        sessions.appendChild(this.sessionsWrapper);
        this._setInitialProgressBars(this.sessionsWrapper);
        return sessions;
    }

    _setInitialProgressBars(wrapper) {
        const videos = getLocalStorageVideos();
        wrapper.querySelectorAll('.video-playlist-container__sessions__wrapper__session').forEach((el) => {
            const videoId = el.getAttribute('data-video-id');
            const data = videos[videoId];
            if (data?.length && data.secondsWatched > 0) {
                const bar = el.querySelector('.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar');
                if (bar) {
                    bar.style.width = `${Math.min(100, (data.secondsWatched / data.length) * 100)}%`;
                    bar.style.backgroundColor = '#1473e6';
                    bar.style.display = 'block';
                }
            }
        });
    }

    /* --- Favorites --- */

    async _setupFavorites() {
        try {
            if (!await MOCK_API.isUserRegistered()) return;

            const favs = await MOCK_API.getFavorites();
            const favIds = new Set(favs.sessionInterests.map(f => f.sessionID));

            this.sessionsWrapper.querySelectorAll('.video-playlist-container__sessions__wrapper__session').forEach((session) => {
                const videoId = session.getAttribute('data-video-id');
                const card = this.cards.find((c) => c.search.mpcVideoId === videoId || c.search.videoId === videoId);
                if (card) session.appendChild(this._createFavoriteButton(card, favIds.has(card.search.sessionId)));
            });
        } catch (e) {
            console.error('Failed to setup favorites:', e);
        }
    }

    _createFavoriteButton(card, isFavorite) {
        const tooltip = isFavorite ? 'Remove from favorites' : this.cfg.favoritesTooltipText;
        const btn = createTag('button', {
            class: 'video-playlist-container__sessions__wrapper__session__favorite',
            'daa-ll': isFavorite ? ANALYTICS.UNFAVORITE : ANALYTICS.FAVORITE,
            'aria-label': `${tooltip} ${card.contentArea.title}`,
            'data-tooltip': tooltip,
        });

        btn.innerHTML = `<svg class="heart ${isFavorite ? 'filled' : 'unfilled'}" xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14">
            <path d="M10.5895 1.82617C10.0133 1.85995 9.45382 2.03175 8.95885 2.32693C8.46389 2.62211 8.04809 3.0319 7.74691 3.52137C7.44573 3.0319 7.02993 2.62211 6.53496 2.32693C6.04 2.03175 5.48056 1.85995 4.90436 1.82617C3.99978 1.82617 3.13226 2.18337 2.49262 2.8192C1.85299 3.45502 1.49365 4.31738 1.49365 5.21657C1.49365 8.45423 7.74691 12.563 7.74691 12.563C7.74691 12.563 14.0002 8.49774 14.0002 5.21657C14.0002 4.31738 13.6408 3.45502 13.0012 2.8192C12.3616 2.18337 11.494 1.82617 10.5895 1.82617Z" stroke-width="2"/></svg>`;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this._toggleFavorite(btn, card);
        });

        return btn;
    }

    async _toggleFavorite(btn, card) {
        try {
            btn.disabled = true;
            const response = await MOCK_API.toggleFavorite(card.search.sessionId);
            if (!response.success) throw new Error('API toggle failed.');

            const svg = btn.querySelector('svg');
            const isFav = svg.classList.toggle('filled');
            svg.classList.toggle('unfilled', !isFav);

            btn.setAttribute('daa-ll', isFav ? ANALYTICS.FAVORITE : ANALYTICS.UNFAVORITE);
            const tooltip = isFav ? 'Remove from favorites' : this.cfg.favoritesTooltipText;
            btn.setAttribute('data-tooltip', tooltip);
            btn.setAttribute('aria-label', `${tooltip} ${card.contentArea.title}`);

            if (isFav) {
                this._showToast(this.cfg.favoritesNotificationText, 'positive', {
                    text: this.cfg.favoritesButtonText,
                    link: this.cfg.favoritesButtonLink,
                    daaLL: ANALYTICS.VIEW_SCHEDULE
                });
            }
        } catch (e) {
            console.error('Failed to toggle favorite:', e);
        } finally {
            btn.disabled = false;
        }
    }

    /* --- Video Player --- */

    _setupVideoPlayer() {
        this.videoContainer = document.querySelector('.milo-video');
        if (this.videoContainer) {
            this._setupPlayerListeners();
        } else {
            new MutationObserver((_, obs) => {
                this.videoContainer = document.querySelector('.milo-video');
                if (this.videoContainer) {
                    obs.disconnect();
                    this._setupPlayerListeners();
                }
            }).observe(document.body, { childList: true, subtree: true });
        }
    }

    _setupPlayerListeners() {
        this._highlightCurrentSession();
        window.removeEventListener('message', this.boundHandlePlayerMessage);
        window.addEventListener('message', this.boundHandlePlayerMessage);
        this._setupYouTubePlayer();
    }

    _highlightCurrentSession() {
        if (!this.sessionsWrapper) return;
        const videoId = this._findVideoId();
        this.sessionsWrapper.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
        if (videoId) {
            const el = this.sessionsWrapper.querySelector(`[data-video-id="${videoId}"]`);
            if (el) {
                el.classList.add('highlighted');
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    _findVideoId() {
        if (!this.videoContainer) return null;
        const liteYT = this.videoContainer.querySelector('lite-youtube');
        if (liteYT) return liteYT.getAttribute('videoid');
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
                    this._updateProgressBar(data.id, data.currentTime, data.length);
                }
                break;
            case EVENT_STATES.COMPLETE:
                this._handleVideoComplete(data.id);
                break;
        }
    }

    _handleMpcLoad(data) {
        this._highlightCurrentSession();
        const videos = getLocalStorageVideos();
        const current = videos[data.id];
        const startAt = current?.secondsWatched > data.length - RESTART_THRESHOLD ? 0 : (current?.secondsWatched || 0);
        startVideoFromSecond(this.videoContainer, startAt);
    }

    _handleVideoComplete(videoId) {
        if (this.progressInterval) clearInterval(this.progressInterval);

        const videos = getLocalStorageVideos();
        if (videos[videoId]) {
            videos[videoId].completed = true;
            if (videos[videoId].length) videos[videoId].secondsWatched = videos[videoId].length;
            saveLocalStorageVideos(videos);
            this._updateProgressBar(videoId, videos[videoId].length, videos[videoId].length);
        }

        if (getLocalStorageShouldAutoPlay()) {
            const idx = this.cards.findIndex((c) => c.search.mpcVideoId === videoId || c.search.videoId === videoId);
            if (idx !== -1 && idx < this.cards.length - 1) {
                const nextURL = new URL(this.cards[idx + 1].overlayLink, window.location.origin);
                if (this.currentPlaylistId) nextURL.searchParams.set(VIDEO_PLAYLIST_ID_URL_KEY, this.currentPlaylistId);
                window.location.href = nextURL.href;
            }
        }
    }

    _updateProgressBar(videoId, currentTime, duration) {
        const el = document.querySelector(`[data-video-id="${videoId}"]`);
        const bar = el?.querySelector('.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar');
        if (bar) {
            bar.style.width = `${Math.min(100, (currentTime / duration) * 100)}%`;
            bar.style.backgroundColor = '#1473e6';
            bar.style.display = 'block';
        }
    }

    /* --- YouTube --- */

    _setupYouTubePlayer() {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.getElementsByTagName('script')[0].parentNode.insertBefore(tag, document.getElementsByTagName('script')[0]);
        }
        window.onYouTubeIframeAPIReady = () => this._initializeYouTubePlayer();
    }

    _initializeYouTubePlayer() {
        if (!this.videoContainer) return;

        const liteYT = this.videoContainer.querySelector('lite-youtube');
        const iframe = this.videoContainer.querySelector('iframe');
        const videoId = liteYT?.getAttribute('videoid') || (iframe ? findVideoIdFromIframeSrc(iframe.src) : null);

        if (!videoId || !this._isYouTube(liteYT ? videoId : iframe?.src)) return;

        if (liteYT) {
            liteYT.addEventListener('click', () => {
                const check = setInterval(() => {
                    const newIframe = this.videoContainer.querySelector('iframe');
                    if (newIframe?.src.includes('youtube-nocookie.com/embed/')) {
                        clearInterval(check);
                        this._addYouTubeJsApi(newIframe, videoId);
                    }
                }, 100);
            });
        } else if (iframe?.src.includes('enablejsapi=1')) {
            this._setupYouTubeTracking(iframe, videoId);
        }
    }

    _isYouTube(src) {
        return src && (src.includes('youtube.com') || src.includes('youtube-nocookie.com') || src.length === 11);
    }

    _addYouTubeJsApi(iframe, videoId) {
        try {
            const url = new URL(iframe.src);
            url.searchParams.set('enablejsapi', '1');
            url.searchParams.set('origin', window.location.origin);

            const videos = getLocalStorageVideos();
            if (videos[videoId]?.secondsWatched > RESTART_THRESHOLD) {
                url.searchParams.set('start', Math.floor(videos[videoId].secondsWatched));
            }

            iframe.src = url.toString();
            iframe.addEventListener('load', () => this._setupYouTubeTracking(iframe, videoId));
        } catch (error) {
            console.error('Error modifying YouTube iframe:', error);
        }
    }

    _setupYouTubeTracking(iframe, videoId) {
        const createPlayer = () => {
            try {
                let id = iframe.getAttribute('id');
                if (!id) {
                    id = `player-${videoId}-${Date.now()}`;
                    iframe.setAttribute('id', id);
                }
                this.youtubePlayer = new window.YT.Player(id, {
                    events: {
                        onReady: () => this._startYTTracking(this.youtubePlayer, videoId),
                        onStateChange: (e) => this._handleYTStateChange(e, videoId)
                    }
                });
            } catch (error) {
                console.error('Error creating YT.Player:', error);
            }
        };

        if (window.YT?.Player) {
            createPlayer();
        } else {
            const check = setInterval(() => {
                if (window.YT?.Player) {
                    clearInterval(check);
                    createPlayer();
                }
            }, 100);
        }
    }

    _startYTTracking(player, videoId) {
        if (this.progressInterval) clearInterval(this.progressInterval);
        this.progressInterval = setInterval(() => this._recordYTProgress(player, videoId), 1000);
    }

    _handleYTStateChange(event, videoId) {
        const { PlayerState } = window.YT;
        if (event.data === PlayerState.PLAYING) {
            this._startYTTracking(event.target, videoId);
        } else if (event.data === PlayerState.PAUSED || event.data === PlayerState.BUFFERING) {
            if (this.progressInterval) clearInterval(this.progressInterval);
            this._recordYTProgress(event.target, videoId);
        } else if (event.data === PlayerState.ENDED) {
            if (this.progressInterval) clearInterval(this.progressInterval);
            this._handleVideoComplete(videoId);
        }
    }

    async _recordYTProgress(player, videoId) {
        try {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            if (currentTime && duration && (Math.floor(currentTime) % PROGRESS_SAVE_INTERVAL === 0 || duration - currentTime < 1)) {
                await saveCurrentVideoProgress(videoId, currentTime, duration);
                this._updateProgressBar(videoId, currentTime, duration);
            }
        } catch (error) {
            console.error('Error recording YouTube progress:', error);
        }
    }

    /* --- Cleanup --- */

    cleanup() {
        if (this.progressInterval) clearInterval(this.progressInterval);
        if (this.youtubePlayer?.destroy) this.youtubePlayer.destroy();
        window.removeEventListener('message', this.boundHandlePlayerMessage);
    }
}
