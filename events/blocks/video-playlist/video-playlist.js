/* VideoPlaylist.js */

/* eslint-disable no-underscore-dangle */
import { LIBS } from '../../scripts/utils.js';
// Utility imports
import {
    getLocalStorageVideos,
    saveLocalStorageVideos,
    saveCurrentVideoProgress,
    getLocalStorageShouldAutoPlay,
    saveShouldAutoPlayToLocalStorage,
    getCurrentPlaylistId,
    findVideoIdFromIframeSrc,
    startVideoFromSecond
} from './utils.js'; 

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

            // Start setting up the player listeners and YouTube API
            this._setupVideoPlayer(); 

        } catch (e) {
            console.error('VideoPlaylist Initialization Error:', e);
        }
    }

    /**
     * Reads all configuration from the DOM and applies defaults if not provided.
     */
    _parseCfg() {
        // Read all configuration entries from the component's structure
        const meta = Object.fromEntries(
            [...this.el.querySelectorAll(':scope > div > div:first-child')].map((div) => [
                div.textContent.trim().toLowerCase().replace(/ /g, '-'),
                div.nextElementSibling?.textContent?.trim() || '',
            ]),
        );

        const parseBoolean = (val, defaultVal) => {
            if (val === undefined || val === '') return defaultVal;
            return val.toLowerCase() === 'true';
        };

        const parseIntWithFallback = (val, defaultVal) => {
            if (val === undefined || val === '') return defaultVal;
            const parsed = parseInt(val, 10);
            return isNaN(parsed) ? defaultVal : parsed;
        };
        
        return {
            // General Configuration
            playlistId: meta['playlist-id'] || null,
            playlistTitle: meta['playlist-title'] || 'Video Playlist',
            topicEyebrow: meta['topic-eyebrow'] || '',
            autoplayText: meta['autoplay-text'] || 'Play All',
            skipPlaylistText: meta['skip-playlist-text'] || meta['skip-playlist'] || 'Skip playlist', 
            minimumSessions: parseIntWithFallback(meta['minimum-sessions'] || meta['minimum-session'], 4), 
            sort: meta['sort'] || 'default',
            sortByTime: parseBoolean(meta['sort-by-time'], false),
            isTagBased: parseBoolean(meta['is-tagbased'], true),
            socialSharing: parseBoolean(meta['social-sharing'], true),
            favoritesEnabled: parseBoolean(meta['favorites-enabled'], true),
            favoritesTooltipText: meta['favorites-tooltip-text'] || meta['tooltip-text'] || 'Add to favorites',
            favoritesNotificationText: meta['favorites-notification-text'] || 'Session added to favorites',
            favoritesButtonText: meta['favorites-button-text'] || 'View',
            favoritesButtonLink: meta['favorites-button-link'] || '/schedule',
            theme: meta['theme'] || 'light',
            videoUrl: meta['video-url'] || null, 

            // Social Sharing Configuration
            enableFacebook: parseBoolean(meta['enable-facebook'], true),
            facebookAltText: meta['facebook-alt-text'] || "Share Playlist on Facebook",
            enableTwitter: parseBoolean(meta['enable-twitter'], true),
            twitterCustomText: meta['twitter-custom-text'] || "",
            twitterAltText: meta['twitter-alt-text'] || "Share Playlist on X",
            enableLinkedIn: parseBoolean(meta['enable-linkedin'], true),
            linkedInAltText: meta['linked-in-alt-text'] || "Share Playlist on LinkedIn",
            enableCopyLink: parseBoolean(meta['enable-copy-link'], true),
            copyLinkAltText: meta['copy-link-alt-text'] || "Share with link",
            copyNotificationText: meta['copy-notification-text'] || 'Link copied to clipboard!',
        };
    }

    _createMainContainer() {
        const container = createTag('div', { class: 'video-playlist-container' });
        if (this.cfg.theme === 'light') {
            container.classList.add('consonant--light');
        } else if (this.cfg.theme === 'dark') {
            container.classList.add('consonant--dark');
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
    
    _filterCards(cards) {
        return cards.filter(card => card.search.thumbnailUrl);
    }

    _sortCards(cards, sortOrder) {
        if (sortOrder === 'default') {
            // Keep the order from the API
            return cards;
        }
        
        let sorted = [...cards];

        if (this.cfg.sortByTime) {
            sorted.sort((a, b) => {
                const timeA = a.search.videoDuration;
                const timeB = b.search.videoDuration;
                // Simple sort, could be more robust to handle different time formats
                return timeA.localeCompare(timeB); 
            });
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

        const header = this._createHeader();
        this.root.appendChild(header);
        
        this.sessionsWrapper = this._createSessionsWrapper(cards);
        this.root.appendChild(this.sessionsWrapper);

        if (this.cfg.favoritesEnabled) {
            this._setupFavorites();
        }

        // Add a target for the skip link
        const skipTarget = createTag('div', { id: PLAYLIST_SKIP_TO_ID, style: 'height: 1px;' });
        this.root.appendChild(skipTarget);
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

    _setupAutoplayCheckbox(header) {
        const checkbox = header.querySelector(`#${PLAYLIST_PLAY_ALL_ID}`);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                saveShouldAutoPlayToLocalStorage(isChecked);
                e.target.setAttribute('daa-ll', isChecked ? ANALYTICS.TOGGLE_ON : ANALYTICS.TOGGLE_OFF);
            });
        }
    }

    _createSocialSharingButton() {
        const isAnyEnabled = this.cfg.enableFacebook || this.cfg.enableTwitter || this.cfg.enableLinkedIn || this.cfg.enableCopyLink;
        if (!isAnyEnabled) return '';

        const menuItems = this._generateSocialMenuItems();

        return `
            <div class="video-playlist-container__social-share-wrapper">
                <button class="video-playlist-container__social-share" daa-ll="Social_Share">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 8L10 4V7C7 7 4 8 2 11C4 8 7 7 10 7V10L14 6L10 2V5C7 5 4 6 2 9C4 6 7 5 10 5V8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <div class="share-menu-wrapper">
                    <ul class="video-playlist-container__social-share-menu">${menuItems}</ul>
                </div>
            </div>
        `; 
    }

    _generateSocialMenuItems() {
        const platforms = {
            facebook: { icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 2.5C14.9774 1.84415 14.7067 1.22133 14.2427 0.757298C13.7787 0.29327 13.1558 0.0226174 12.5 0L2.5 0C1.84415 0.0226174 1.22133 0.29327 0.757298 0.757298C0.29327 1.22133 0.0226174 1.84415 0 2.5L0 12.5C0.0226174 13.1558 0.29327 13.7787 0.757298 14.2427C1.22133 14.7067 1.84415 14.9774 2.5 15H7.5V9.33333H5.66667V6.83333H7.5V5.85917C7.46729 5.0672 7.7415 4.29316 8.26546 3.6984C8.78943 3.10364 9.52273 2.73405 10.3125 2.66667H12.3333V5.16667H10.3125C10.0917 5.16667 9.83333 5.435 9.83333 5.83333V6.83333H12.3333V9.33333H9.83333V15H12.5C13.1558 14.9774 13.7787 14.7067 14.2427 14.2427C14.7067 13.7787 14.9774 13.1558 15 12.5V2.5Z" fill="currentColor"/></svg>`, daaLL: 'Facebook_Share Playlist', text: 'Facebook', altKey: 'facebookAltText', enableKey: 'enableFacebook', },
            twitter: { icon: `<svg width="15" height="15" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor"/></svg>`, daaLL: 'Twitter_Share Playlist', text: 'Twitter/X', altKey: 'twitterAltText', enableKey: 'enableTwitter', },
            linkedin: { icon: `<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.35803 14.9983H1.25053V4.98415H4.35803V14.9983ZM2.80136 3.61832C2.44359 3.61996 2.09335 3.51548 1.79495 3.3181C1.49654 3.12071 1.26336 2.83928 1.12488 2.50938C0.986411 2.17948 0.948862 1.81593 1.01699 1.46469C1.08511 1.11346 1.25585 0.790304 1.50761 0.536094C1.75937 0.281884 2.08086 0.10803 2.43142 0.0365126C2.78198 -0.0350043 3.14588 -0.000972847 3.4771 0.134304C3.80832 0.269582 4.092 0.50003 4.29226 0.796514C4.49252 1.093 4.60038 1.4422 4.6022 1.79998C4.60287 2.27942 4.41392 2.73966 4.07655 3.08031C3.73918 3.42096 3.28078 3.61436 2.80136 3.61832ZM16.0005 14.9983H12.8939V10.1233C12.8939 8.96165 12.8705 7.47165 11.2772 7.47165C9.66053 7.47165 9.4122 8.73415 9.4122 10.04V14.9983H6.30637V4.98415H9.28886V6.34998H9.33386C9.63207 5.83935 10.0633 5.41921 10.5815 5.13435C11.0996 4.84949 11.6854 4.7106 12.2764 4.73248C15.4222 4.73332 16.0005 6.80582 16.0005 9.49831V14.9983Z" fill="currentColor"/></svg>`, daaLL: 'LinkedIn_Share Playlist', text: 'LinkedIn', altKey: 'linkedInAltText', enableKey: 'enableLinkedIn', },
            copy: { icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5976 0.67421C10.165 0.792718 9.7546 0.981031 9.38262 1.23172C9.23095 1.33588 8.43679 2.09673 7.61929 2.91423L6.13011 4.40839H6.69761C7.21674 4.39759 7.73367 4.47914 8.22427 4.64923L8.52678 4.74838L9.50512 3.77505C10.6868 2.60255 10.7859 2.54171 11.4951 2.54171C11.7445 2.51126 11.9973 2.55901 12.2184 2.67838C12.5529 2.85629 12.8237 3.13383 12.9934 3.47254C13.1068 3.68729 13.153 3.9312 13.1259 4.17254C13.1259 4.91504 13.1351 4.90089 11.1926 6.85755C10.2801 7.77422 9.42929 8.59671 9.29679 8.69087C8.98114 8.90526 8.60146 9.00486 8.22122 8.97301C7.84098 8.94116 7.48319 8.77979 7.20761 8.51588C7.15379 8.44707 7.0848 8.39164 7.00601 8.35391C6.92723 8.31618 6.8408 8.29719 6.75345 8.29839C6.42012 8.27006 6.31845 8.3267 5.78012 8.87004L5.33594 9.3192L5.51093 9.56004C5.8782 10.0146 6.34844 10.3752 6.88272 10.612C7.417 10.8488 7.99998 10.9549 8.58344 10.9217C9.26266 10.8834 9.91686 10.6521 10.4693 10.2551C10.8284 9.99505 14.2601 6.55338 14.4693 6.24171C14.7152 5.87067 14.8942 5.45946 14.9984 5.0267C15.1414 4.37234 15.1153 3.69235 14.9226 3.05087C14.7459 2.511 14.4439 2.02061 14.0414 1.61972C13.639 1.21883 13.1473 0.918832 12.6068 0.744223C11.9523 0.560287 11.2633 0.536267 10.5976 0.67421Z" fill="currentColor"/><path d="M6.15423 5.27963C5.70839 5.36722 5.28028 5.5286 4.88757 5.75713C4.10995 6.36787 3.38516 7.04304 2.7209 7.77546C1.70923 8.77546 0.796734 9.72297 0.693401 9.8788C0.417757 10.2795 0.219878 10.7284 0.110067 11.2021C-0.00751559 11.8325 0.0232978 12.4816 0.200067 13.098C0.374617 13.6386 0.674596 14.1302 1.07549 14.5327C1.47639 14.9352 1.96683 15.2371 2.50673 15.4138C3.14823 15.6064 3.8282 15.6325 4.48257 15.4896C4.94785 15.3767 5.38735 15.1762 5.77757 14.8988C5.9384 14.7805 6.7234 14.0288 7.52757 13.2205L8.99257 11.7505H8.42507C7.90593 11.7612 7.38901 11.6797 6.8984 11.5096L6.5959 11.4105L5.6259 12.378C4.43507 13.5546 4.3309 13.6213 3.6309 13.6213C3.39964 13.6419 3.16695 13.6029 2.95507 13.508C2.60866 13.3333 2.32462 13.0559 2.14173 12.7138C2.01821 12.4941 1.96855 12.2405 2.00007 11.9905C2.00007 11.2338 1.9859 11.258 3.9284 9.30546C4.84507 8.3888 5.7009 7.5663 5.8284 7.47213C6.14405 7.25774 6.52371 7.15816 6.90395 7.19001C7.28419 7.22186 7.64198 7.38323 7.91757 7.64714C7.97138 7.71594 8.04038 7.77138 8.11916 7.80911C8.19795 7.84684 8.28439 7.86584 8.37173 7.86464C8.70507 7.89297 8.80673 7.8363 9.34507 7.28797L9.78923 6.8388L9.5959 6.57881C9.13876 6.0323 8.53775 5.62469 7.8609 5.40214C7.30857 5.2329 6.72507 5.19101 6.15423 5.27963Z" fill="currentColor"/></svg>`, daaLL: 'Link_Share Playlist', text: 'Copy Link', altKey: 'copyLinkAltText', enableKey: 'enableCopyLink', },
        };

        let menuHtml = '';
        Object.keys(platforms).forEach(platformKey => {
            const platformData = platforms[platformKey];
            if (this.cfg[platformData.enableKey]) {
                const text = this.cfg[platformData.altKey] || platformData.text; 
                const target = platformKey === 'copy' ? '' : 'target="_blank"';
                let href = '#';
                if (platformKey === 'facebook') {
                    href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                } else if (platformKey === 'twitter') {
                    const twitterText = encodeURIComponent(this.cfg.twitterCustomText || this.cfg.playlistTitle);
                    href = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(window.location.href)}`;
                } else if (platformKey === 'linkedin') {
                    href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(this.cfg.playlistTitle)}&summary=${encodeURIComponent(this.cfg.topicEyebrow)}&source=${encodeURIComponent(window.location.origin)}`;
                }
                
                menuHtml += `
                    <li><a class="video-playlist-container__social-share-menu__item" data-platform="${platformKey}" daa-ll="${platformData.daaLL}" aria-label="${text}" href="${href}" ${target}>${platformData.icon}<span>${text}</span></a></li>
                `;
            }
        });
        return menuHtml;
    }

    _setupSocialSharing(header) {
        const shareButton = header.querySelector('.video-playlist-container__social-share');
        const menu = header.querySelector('.video-playlist-container__social-share-menu');

        if (!shareButton || !menu) return;

        // Toggle menu visibility
        shareButton.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('open');
            shareButton.setAttribute('aria-expanded', menu.classList.contains('open'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            menu.classList.remove('open');
            shareButton.setAttribute('aria-expanded', 'false');
        });
        
        // Handle share actions
        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', (e) => this._handleShare(e, link.dataset.platform));
        });
    }

    _handleShare(e, platform) {
        if (platform === 'copy') {
            e.preventDefault();
            this._copyToClipboard(window.location.href);
            this._showNotification(this.cfg.copyNotificationText, 'positive');
            return;
        }
        
        // For other platforms (Facebook, Twitter, LinkedIn), use the href
        e.preventDefault();
        this._openShareWindow(e.currentTarget.href);
    }

    _copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).catch(err => {
                console.error('Could not copy text using clipboard API: ', err);
                this._fallbackCopyToClipboard(text);
            });
        } else {
            this._fallbackCopyToClipboard(text);
        }
    }

    _fallbackCopyToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }

    _openShareWindow(url) {
        window.open(url, 'share-window', 'width=600,height=400,scrollbars=yes');
    }

    _showNotification(message, type = 'default') {
        let toastsContainer = document.getElementById(TOAST_CONTAINER_ID);
        if (!toastsContainer) {
            toastsContainer = createTag('div', { id: TOAST_CONTAINER_ID });
            this.root.appendChild(toastsContainer);
        }

        const classType = type === 'positive' ? 'video-playlist-container__toast--positive' : 'video-playlist-container__toast--default';
        const notification = createTag('div', {
            class: `video-playlist-container__toast ${classType}`,
            role: 'alert',
            'aria-live': 'assertive',
            'aria-atomic': 'true',
            'aria-hidden': 'false'
        });

        notification.innerHTML = `<div class="video-playlist-container__toast-content">${message}</div>`;
        
        toastsContainer.appendChild(notification);
        setTimeout(() => notification.remove(), 3000); 
    }

    /* --- Sessions List --- */

    _createSessionsWrapper(cards) {
        const sessions = createTag('div', { class: 'video-playlist-container__sessions' });
        this.sessionsWrapper = createTag('div', { class: 'video-playlist-container__sessions__wrapper' });

        const sessionsHTML = cards.map((card) => {
            const videoId = card.search.mpcVideoId || card.search.videoId;
            const linkText = card.contentArea.title;

            return `
                <div daa-lh="${linkText}" class="video-playlist-container__sessions__wrapper__session" data-video-id="${videoId}">
                    <a daa-ll="${ANALYTICS.VIDEO_SELECT}" href="${card.overlayLink}" class="video-playlist-container__sessions__wrapper__session__link">
                        <div class="video-playlist-container__sessions__wrapper__session__thumbnail">
                            <img src="${card.search.thumbnailUrl}" alt="${linkText}" loading="lazy"/>
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
                            <h4 class="video-playlist-container__sessions__wrapper__session__info__title">
                                ${linkText}
                            </h4>
                            <p class="video-playlist-container__sessions__wrapper__session__info__description">
                                ${card.contentArea.description}
                            </p>
                        </div>
                    </a>
                </div>
            `;
        }).join('');

        this.sessionsWrapper.innerHTML = sessionsHTML;
        sessions.appendChild(this.sessionsWrapper);
        this._setInitialProgressBars(this.sessionsWrapper);

        return sessions;
    }

    _setInitialProgressBars(sessionsWrapper) {
        const localStorageVideos = getLocalStorageVideos();
        sessionsWrapper.querySelectorAll('.video-playlist-container__sessions__wrapper__session').forEach((sessionElement) => {
            const sessionVideoId = sessionElement.getAttribute('data-video-id');
            const sessionData = localStorageVideos[sessionVideoId];
            if (sessionData && sessionData.length && sessionData.secondsWatched > 0) {
                const progressBar = sessionElement.querySelector(
                    '.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar',
                );
                const progress = (sessionData.secondsWatched / sessionData.length) * 100;
                if (progressBar) {
                    progressBar.style.width = `${Math.min(100, progress)}%`;
                    progressBar.style.backgroundColor = '#1473e6';
                    progressBar.style.display = 'block';
                }
            }
        });
    }

    /* --- Favorites Logic --- */

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
        const tooltipText = isFavorite ? 'Remove from favorites' : this.cfg.favoritesTooltipText; 

        const favoriteButton = createTag('button', {
            class: 'video-playlist-container__sessions__wrapper__session__favorite',
            'daa-ll': isFavorite ? ANALYTICS.UNFAVORITE : ANALYTICS.FAVORITE,
            'aria-label': `${tooltipText} ${card.contentArea.title}`,
            'data-tooltip': tooltipText,
        });

        favoriteButton.innerHTML = `
            <svg class="heart ${heartClass}" xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14">
                <path d="M10.5895 1.82617C10.0133 1.85995 9.45382 2.03175 8.95885 2.32693C8.46389 2.62211 8.04809 3.0319 7.74691 3.52137C7.44573 3.0319 7.02993 2.62211 6.53496 2.32693C6.04 2.03175 5.48056 1.85995 4.90436 1.82617C3.99978 1.82617 3.13226 2.18337 2.49262 2.8192C1.85299 3.45502 1.49365 4.31738 1.49365 5.21657C1.49365 8.45423 7.74691 12.563 7.74691 12.563C7.74691 12.563 14.0002 8.49774 14.0002 5.21657C14.0002 4.31738 13.6408 3.45502 13.0012 2.8192C12.3616 2.18337 11.494 1.82617 10.5895 1.82617Z" stroke-width="2"/>
            </svg>
        `;

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
            const isCurrentlyFavorite = favoriteSVG.classList.contains('filled');
            const becomesFavorite = !isCurrentlyFavorite;

            favoriteSVG.classList.toggle('filled', becomesFavorite);
            favoriteSVG.classList.toggle('unfilled', !becomesFavorite);

            const newDaaLL = becomesFavorite ? ANALYTICS.FAVORITE : ANALYTICS.UNFAVORITE;
            favoriteButton.setAttribute('daa-ll', newDaaLL);

            const newTooltipText = becomesFavorite ? 'Remove from favorites' : this.cfg.favoritesTooltipText;
            favoriteButton.setAttribute('data-tooltip', newTooltipText);
            favoriteButton.setAttribute('aria-label', `${newTooltipText} ${card.contentArea.title}`);

            if (becomesFavorite) {
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
        const notification = createTag('div', { 
            class: 'video-playlist-container__notification video-playlist-container__notification--error', 
        });
        
        notification.innerHTML = `
            <div class="video-playlist-container__notification__content">
                <p>${message}</p>
                <button class="video-playlist-container__notification__close">×</button>
            </div>
        `;
        
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
            'aria-atomic': 'true',
            'aria-hidden': 'false'
        });

        notification.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18" class="video-playlist-container__toast-icon" focusable="false" aria-hidden="true">
                <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18"></rect>
                <path d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm5.333,4.54L8.009,13.6705a.603.603,0,0,1-.4375.2305H7.535a.6.6,0,0,1-.4245-.1755L3.218,9.829a.6.6,0,0,1-.00147-.84853L3.218,8.979l.663-.6625A.6.6,0,0,1,4.72953,8.315L4.731,8.3165,7.4,10.991l5.257-6.7545a.6.6,0,0,1,.8419-.10586L13.5,4.1315l.7275.5685A.6.6,0,0,1,14.333,5.54Z"></path>
            </svg>
            <div class="video-playlist-container__toast-body">
                <div class="video-playlist-container__toast-content">${this.cfg.favoritesNotificationText}</div>
                <button class="video-playlist-container__toast-button" daa-ll="${ANALYTICS.VIEW_SCHEDULE}">
                    <span class="video-playlist-container__toast-button-label">${this.cfg.favoritesButtonText}</span>
                </button>
            </div>
            <div class="video-playlist-container__toast-buttons">
                <button aria-label="close" class="video-playlist-container__toast-close" label="Close" daa-ll="${ANALYTICS.CLOSE_FAVORITE_NOTIFICATION}">
                    <svg class="video-playlist-container__toast-close-icon" focusable="false" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
                        <path d="m5.238 4 2.456-2.457A.875.875 0 1 0 6.456.306L4 2.763 1.543.306A.875.875 0 0 0 .306 1.544L2.763 4 .306 6.457a.875.875 0 1 0 1.238 1.237L4 5.237l2.456 2.457a.875.875 0 1 0 1.238-1.237z"></path>
                    </svg>
                </button>
            </div>
        `;

        toastsContainer.appendChild(notification);
        setTimeout(() => notification.remove(), 5000); // Auto-remove after 5s

        notification.querySelector('.video-playlist-container__toast-close').addEventListener('click', () => notification.remove());
        
        const viewButton = notification.querySelector('.video-playlist-container__toast-button');
        viewButton.addEventListener('click', () => {
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
        if (!this.sessionsWrapper) return;

        const videoId = this._findVideoId();
        this.sessionsWrapper.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));

        if (videoId) {
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
            startAt = currentSessionData.secondsWatched > length - RESTART_THRESHOLD ? 0 : currentSessionData.secondsWatched;
        }
        startVideoFromSecond(this.videoContainer, startAt);
    }

    _handleVideoComplete(videoId) {
        if (this.progressInterval) clearInterval(this.progressInterval);

        const localStorageVideos = getLocalStorageVideos();
        if (localStorageVideos[videoId]) {
            localStorageVideos[videoId].completed = true;
            if (localStorageVideos[videoId].length) {
                localStorageVideos[videoId].secondsWatched = localStorageVideos[videoId].length;
            }
            saveLocalStorageVideos(localStorageVideos);
            this._updateProgressBarForVideo(videoId, localStorageVideos[videoId].length, localStorageVideos[videoId].length);
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
            this._setupLiteYouTubePlayer(liteYoutube, videoId);
        } else if (iframe && iframe.src.includes('enablejsapi=1')) {
            this._setupYouTubeProgressTracking(iframe, videoId);
        }
    }

    _isYouTubeVideo(srcOrId) {
        return srcOrId && (srcOrId.includes('youtube.com') || srcOrId.includes('youtube-nocookie.com') || srcOrId.length === 11);
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
        }, 1000);
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
                if (Math.floor(currentTime) % PROGRESS_SAVE_INTERVAL === 0 || duration - currentTime < 1) {
                    await saveCurrentVideoProgress(videoId, currentTime, duration);
                    this._updateProgressBarForVideo(videoId, currentTime, duration);
                }
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
                progressBar.style.backgroundColor = '#1473e6';
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