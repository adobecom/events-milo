/* eslint-disable no-underscore-dangle */
import { LIBS } from '../../scripts/utils.js';

const { createTag, getConfig } = await import(`${LIBS}/utils/utils.js`);

// Constants
const AUTOPLAY_PLAYLIST_KEY = 'shouldAutoPlayPlaylist';
const PLAYLIST_VIDEOS_KEY = 'playlistVideos';
const PLAYLIST_PLAY_ALL_ID = 'playlist-play-all';
const MPC_STATUS = 'mpcStatus';
const RESTART_THRESHOLD = 5;
const PROGRESS_SAVE_INTERVAL = 5;
const VIDEO_ORIGIN = 'https://video.tv.adobe.com';
const VIDEO_PLAYLIST_ID_URL_KEY = 'videoPlaylistId';
const TOAST_CONTAINER_ID = 'playlist-toasts-container';
const PLAYLIST_SKIP_TO_ID = 'playlist-skip-to';


const EVENT_STATES = {
    LOAD: 'load',
    PAUSE: 'pause',
    TICK: 'tick',
    COMPLETE: 'complete',
};

const analytics = {
    PLAYLIST: 'Playlist',
    TOGGLE_OFF: 'Play all_Off',
    TOGGLE_ON: 'Play all_On',
    VIDEO_SELECT: 'Video Select',
    FAVORITE: 'Favorite',
    UNFAVORITE: 'Unfavorite',
    CLOSE_FAVORITE_NOTIFICATION: 'Close Favorite Notification',
    VIEW_SCHEDULE: 'View Schedule',
    CLOSE_REGISTRATION_NOTIFICATION: 'Close Registration Notification',
    REGISTER: 'Register',
};

const CONFIG = {
  STORAGE: {
    CURRENT_VIDEO_KEY: 'videoPlaylist_currentVideo',
    PROGRESS_KEY: 'videoPlaylist_progress',
    AUTOPLAY_KEY: 'videoPlaylist_autoplay',
  },
  API: {
    MOCK_ENDPOINT: '/api/sessions',
    FAVORITES_ENDPOINT: '/api/favorites',
  },
  PLAYER: {
    PROGRESS_SAVE_INTERVAL: 5,
    RESTART_THRESHOLD: 5,
  },
  ANALYTICS: {
    PLAYLIST: 'Playlist',
    TOGGLE_OFF: 'Play all_Off',
    TOGGLE_ON: 'Play all_On',
    VIDEO_SELECT: 'Video Select',
    FAVORITE: 'Favorite',
    UNFAVORITE: 'Unfavorite',
    VIEW_SCHEDULE: 'View Schedule',
  },
};

// Mock API for testing
const mockAPI = {
  async getSessions(playlistId = null, entityIds = null) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const mockSessions = [
      {
        id: "1tmt6y1",
        search: {
          mpcVideoId: '3449120',
          videoId: 'yt_001',
          videoService: 'mpc',
          sessionId: '1726853839238001M8Un',
          thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg',
          videoDuration: '00:51:53',
          sessionCode: 'S744',
        },
        contentArea: {
          title: 'Unlocking Modern Marketing\'s Potential with Integrated Operations and AI',
          description: 'Discover Choreo, a transformative framework powered by AI and Adobe technology, that empowers marketing teams to design, build, and optimize the way they work.',
        },
        overlayLink: 'https://business.adobe.com/summit/2025/sessions/unlocking-modern-marketings-potential-s744.html',
        styles: {
          backgroundImage: 'https://business.adobe.com/content/dam/dx/us/en/summit/2025/sessions/Session-3_1200x675.jpg',
        },
      },
      {
        id: "2tmt6y2",
        search: {
          mpcVideoId: '3442587',
          videoId: 'yt_002',
          videoService: 'mpc',
          sessionId: '1726853839238001M8Un2',
          thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg',
          videoDuration: '00:21:24',
          sessionCode: 'S745',
        },
        contentArea: {
          title: 'Pitch Perfect: Winning the Marketing Budget Conversation',
          description: 'Marketing Budget, Secure funding and resources for your marketing initiatives with proven strategies and compelling presentations.',
        },
        overlayLink: 'https://business.adobe.com/summit/2025/sessions/pitch-perfect-marketing-budget-s745.html',
        styles: {
          backgroundImage: 'https://business.adobe.com/content/dam/dx/us/en/summit/2025/sessions/Session-4_1200x675.jpg',
        },
      },
      {
        id: "3tmt6y3",
        search: {
          mpcVideoId: '3442588',
          videoId: 'yt_003',
          videoService: 'mpc',
          sessionId: '1726853839238001M8Un3',
          thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg',
          videoDuration: '00:52:34',
          sessionCode: 'S746',
        },
        contentArea: {
          title: 'The Future of Adobe Workfront',
          description: 'Discover how Adobe Workfront\'s innovative features are transforming project management and team collaboration.',
        },
        overlayLink: 'https://business.adobe.com/summit/2025/sessions/future-adobe-workfront-s746.html',
        styles: {
          backgroundImage: 'https://business.adobe.com/content/dam/dx/us/en/summit/2025/sessions/Session-5_1200x675.jpg',
        },
      },
      {
        id: "4tmt6y4",
        search: {
          mpcVideoId: '3442589',
          videoId: 'yt_004',
          videoService: 'mpc',
          sessionId: '1726853839238001M8Un4',
          thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg',
          videoDuration: '00:39:36',
          sessionCode: 'S747',
        },
        contentArea: {
          title: 'Maximize Martech Investments with a Co-led IT and Marketing COE',
          description: 'Learn best practices on bridging IT and marketing collaboration to maximize your technology investments.',
        },
        overlayLink: 'https://business.adobe.com/summit/2025/sessions/maximize-martech-investments-s747.html',
        styles: {
          backgroundImage: 'https://business.adobe.com/content/dam/dx/us/en/summit/2025/sessions/Session-6_1200x675.jpg',
        },
      },
      {
        id: "5tmt6y5",
        search: {
          mpcVideoId: '3442590',
          videoId: 'yt_005',
          videoService: 'mpc',
          sessionId: '1726853839238001M8Un5',
          thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg',
          videoDuration: '00:39:35',
          sessionCode: 'S748',
        },
        contentArea: {
          title: 'Boost Experimentation with Auto-Created Tests the Home Depot Way',
          description: 'Learn how to establish a system for automated testing that drives continuous improvement and better results.',
        },
        overlayLink: 'https://business.adobe.com/summit/2025/sessions/boost-experimentation-home-depot-s748.html',
        styles: {
          backgroundImage: 'https://business.adobe.com/content/dam/dx/us/en/summit/2025/sessions/Session-7_1200x675.jpg',
        },
      },
      {
        id: "6tmt6y6",
        search: {
          mpcVideoId: '3442591',
          videoId: 'yt_006',
          videoService: 'mpc',
          sessionId: '1726853839238001M8Un6',
          thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg',
          videoDuration: '00:42:18',
          sessionCode: 'S749',
        },
        contentArea: {
          title: 'How Workfront Is Bringing Teams Together',
          description: 'Explore the collaborative features that make Workfront the ultimate platform for cross-functional team success.',
        },
        overlayLink: 'https://business.adobe.com/summit/2025/sessions/workfront-bringing-teams-together-s749.html',
        styles: {
          backgroundImage: 'https://business.adobe.com/content/dam/dx/us/en/summit/2025/sessions/Session-8_1200x675.jpg',
        },
      },
      {
        id: "7tmt6y7",
        search: {
          mpcVideoId: '3442592',
          videoId: 'yt_007',
          videoService: 'mpc',
          sessionId: '1726853839238001M8Un7',
          thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg',
          videoDuration: '00:35:42',
          sessionCode: 'S750',
        },
        contentArea: {
          title: 'Customer Experience Transformation in the Digital Age',
          description: 'Discover strategies for creating seamless, personalized customer experiences that drive loyalty and growth.',
        },
        overlayLink: 'https://business.adobe.com/summit/2025/sessions/customer-experience-transformation-s750.html',
        styles: {
          backgroundImage: 'https://business.adobe.com/content/dam/dx/us/en/summit/2025/sessions/Session-9_1200x675.jpg',
        },
      },
      {
        id: "8tmt6y8",
        search: {
          mpcVideoId: '3449119',
          videoId: 'yt_008',
          videoService: 'mpc',
          sessionId: '1726853839238001M8Un8',
          thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg',
          videoDuration: '00:48:15',
          sessionCode: 'S751',
        },
        contentArea: {
          title: 'Data-Driven Marketing: From Insights to Action',
          description: 'Learn how to leverage data analytics to make informed marketing decisions and drive measurable results.',
        },
        overlayLink: 'https://business.adobe.com/summit/2025/sessions/data-driven-marketing-insights-action-s751.html',
        styles: {
          backgroundImage: 'https://business.adobe.com/content/dam/dx/us/en/summit/2025/sessions/Session-10_1200x675.jpg',
        },
      },
    ];

    return { cards: mockSessions };
  },

  async getFavorites() {
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
      sessionInterests: [
        { sessionID: 'sess_001' },
        { sessionID: 'sess_003' },
      ],
    };
  },

  async toggleFavorite(sessionId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  },
};

// Storage helpers
function getLocalStorageVideos() {
  try {
    return JSON.parse(localStorage.getItem(PLAYLIST_VIDEOS_KEY)) || {};
  } catch (error) {
    console.error('Error parsing the videos from the local storage:', error);
    return {};
  }
}

function saveLocalStorageVideos(videos) {
  try {
    localStorage.setItem(PLAYLIST_VIDEOS_KEY, JSON.stringify(videos));
  } catch (error) {
    console.error('Error saving the videos to the local storage:', error);
  }
}

function saveCurrentVideoProgress(id, currentTime, length) {
  const localStorageVideos = getLocalStorageVideos();
  const currentSessionData = localStorageVideos[id];
  // Update the current session data in the local storage
  if (currentSessionData) {
    localStorageVideos[id] = {
      ...currentSessionData,
      secondsWatched: currentTime,
    };
    saveLocalStorageVideos(localStorageVideos);
  } else if (length) { // If the length is available, save the video progress in the local storage
    localStorageVideos[id] = {
      secondsWatched: currentTime,
      length,
    };
    saveLocalStorageVideos(localStorageVideos);
  } else { // If the length isn't available, fetch it, and save the progress to localStorage
    const url = new URL(`${VIDEO_ORIGIN}/v/${id}?format=json-ld`);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const duration = data && data.jsonLinkedData && data.jsonLinkedData.duration;
        const seconds = convertIsoDurationToSeconds(duration);
        localStorageVideos[id] = {
          secondsWatched: currentTime,
          length: seconds,
        };
        saveLocalStorageVideos(localStorageVideos);
      });
  }
}

function getLocalStorageShouldAutoPlay() {
  try {
    return JSON.parse(localStorage.getItem(AUTOPLAY_PLAYLIST_KEY)) ?? true;
  } catch (error) {
    console.error('Error parsing the autoplay flag from the local storage:', error);
    return true;
  }
}

function saveShouldAutoPlayToLocalStorage(shouldAutoPlayPlaylist) {
  try {
    localStorage.setItem(AUTOPLAY_PLAYLIST_KEY, JSON.stringify(shouldAutoPlayPlaylist));
  } catch (error) {
    console.error('Error saving the autoplay flag to the local storage:', error);
  }
}

function getCurrentPlaylistId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('playlistId');
}

function parseBoolean(value) {
  return value.toLowerCase() === 'true';
}

// Time Conversion Operations
/**
 * Converts an ISO 8601 duration string to seconds.
 *
 * @param {string} isoDuration - The ISO 8601 duration string to convert.
 * @returns {number} The duration in seconds.
 * @throws {Error} If the input is not a valid ISO 8601 duration format.
 */
function convertIsoDurationToSeconds(isoDuration) {
  // Define regex patterns for each time component
  const pattern = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;

  // Match the pattern with the ISO 8601 duration string
  const match = isoDuration.match(pattern);
  if (!match) {
    throw new Error('Invalid ISO 8601 duration format');
  }

  // Extract the time components, defaulting to 0 if not present
  const years = parseInt(match[1] || 0, 10);
  const months = parseInt(match[2] || 0, 10);
  const days = parseInt(match[3] || 0, 10);
  const hours = parseInt(match[4] || 0, 10);
  const minutes = parseInt(match[5] || 0, 10);
  const seconds = parseInt(match[6] || 0, 10);

  // Convert each component to seconds
  const totalSeconds = (
    years * 365 * 24 * 3600 // assuming 365 days in a year
    + months * 30 * 24 * 3600 // assuming 30 days in a month
    + days * 24 * 3600
    + hours * 3600
    + minutes * 60
    + seconds
  );

  return totalSeconds;
}

// Utility functions
function findVideoIdFromIframeSrc(iframeSrc) {
  // Match either:
  // 1. v/{digits}? for mpc video format
  // 2. youtube.com/embed/{videoId} for YouTube videos
  const patterns = {
    mpc: /v\/(\d+)\?/, // Match the internal video ID from the URL
    youtube: /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/, // Match YouTube video ID
  };
  // Try matching mpc video format first
  const mpcMatch = iframeSrc.match(patterns.mpc);
  if (mpcMatch) return mpcMatch[1];
  // Try matching YouTube format
  const youtubeMatch = iframeSrc.match(patterns.youtube);
  return youtubeMatch ? youtubeMatch[1] : null;
}

function startVideoFromSecond(videoContainer, seconds) {
  if (videoContainer) {
    const iframe = videoContainer.querySelector('iframe');
    iframe?.contentWindow?.postMessage(
      { type: 'mpcAction', action: 'play', currentTime: seconds },
      'https://video.tv.adobe.com',
    );
  }
}

function filterCards(cards) {
  if (!Array.isArray(cards)) {
    console.error('Invalid input: cards must be an array.');
    return [];
  }

  let currentDate;
  try {
    currentDate = window?.northstar?.servertime?.currentTime?.getInstance()?.getTime();
    if (!currentDate) throw new Error('Current date is not available.');
  } catch (error) {
    console.error('Error accessing current date:', error);
    return cards;
  }

  return cards.filter((card) => {
    if (isNaN(Date.parse(card.endDate))) {
      return false; // Skip this card
    }
    // Since we now support youtube videos, videoId will be the new way to identify a video.
    // We will accept both mpcVideoId(old way) and videoId(new way)
    const hasMpcVideoId = card.search && card.search.mpcVideoId;
    const hasVideoId = card.search && card.search.videoId;
    if (!hasMpcVideoId && !hasVideoId) {
      return false; // Skip this card
    }
    const endDate = new Date(card.endDate);
    return endDate.getTime() < currentDate;
  });
}

function sortCards(cards, sort) {
  if (!sort) return cards;
  if (cards.length === 0) return cards;
  if (sort.byTime && parseBoolean(sort.byTime)) {
    const sortedCards = [...cards].sort((a, b) => {
      const aTime = new Date(a.startDate);
      const bTime = new Date(b.startDate);
      return aTime - bTime;
    });
    return sortedCards;
  }
  return cards;
}

class VideoPlaylist {
  constructor(el) {
    this.el = el;
    this.cfg = null;
    this.root = null;
    this.sessionsWrapper = null;
    this.videoContainer = null;
    this.cards = [];
    this.currentPlaylistId = null;
    this.init();
  }

  async init() {
    try {
      this.cfg = this.parseCfg();
      this.currentPlaylistId = getCurrentPlaylistId();
      
      // Create main container
      this.root = this.createMainContainer();
      this.el.appendChild(this.root);
      
      // Load and display sessions
      await this.loadSessions();
      
      // Setup video player
      this.setupVideoPlayer();
      
    } catch (e) {
      console.error('VideoPlaylist Init error:', e);
    }
  }

  parseCfg() {
    // Parse configuration from Helix-generated HTML structure using mobile-rider pattern
    // The structure is: <div><div>configKey</div><div>configValue</div></div>
    const meta = Object.fromEntries(
      [...this.el.querySelectorAll(':scope > div > div:first-child')].map((div) => [
        div.textContent.trim().toLowerCase().replace(/ /g, '-'),
        div.nextElementSibling?.textContent?.trim() || '',
      ]),
    );

    // Map the parsed keys to our config properties
    const config = {
      playlistId: meta['playlist-id'] || null,
      playlistTitle: meta['playlist-title'] || 'Video Playlist',
      topicEyebrow: meta['topic-eyebrow'] || '',
      autoplayText: meta['autoplay-text'] || 'Play All',
      skipPlaylistText: meta['skip-playlist'] || 'Skip playlist',
      minimumSessions: parseInt(meta['minimum-session']) || 4,
      sort: meta['sort'] || 'default',
      sortByTime: meta['sort-by-time'] === 'true',
      isTagBased: meta['is-tagbased'] !== 'false', // Default to true
      socialSharing: meta['social-sharing'] !== 'false', // Default to true
      favoritesEnabled: meta['favorites-enabled'] !== 'false', // Default to true
      favoritesTooltipText: meta['tooltip-text'] || 'Add to favorites',
      favoritesNotificationText: meta['favorites-notification-text'] || 'Session added to favorites',
      favoritesButtonText: meta['favorites-button-text'] || 'View Schedule',
      favoritesButtonLink: meta['favorites-button-link'] || '/schedule',
      endpoint: meta['endpoint'] || '/api/sessions',
      theme: meta['theme'] || 'light',
    };

    // Parse videoPlaylists JSON if present
    if (meta['video-playlists']) {
      try {
        config.videoPlaylists = JSON.parse(meta['video-playlists']);
      } catch (e) {
        console.warn('Failed to parse videoPlaylists JSON:', meta['video-playlists']);
        config.videoPlaylists = [];
      }
    } else {
      config.videoPlaylists = [];
    }

    // Debug logging to help troubleshoot
    console.log('Parsed config from Helix HTML:', config);
    console.log('Raw meta object:', meta);

    return config;
  }

  createMainContainer() {
    const container = createTag('div', { class: 'video-playlist-container' });
    
    // Apply theme class based on configuration
    if (this.cfg.theme === 'dark') {
      // Dark theme is default, no additional class needed
    } else if (this.cfg.theme === 'light') {
      container.classList.add('consonant--light');
    }
    
    container.style.display = 'none'; // Hidden until sessions are loaded
    return container;
  }

  async loadSessions() {
    try {
      let response;
      
      if (this.cfg.isTagBased) {
        // Tag-based playlist (dynamic)
        response = await mockAPI.getSessions();
      } else {
        // AEM-based playlist (manual)
        response = await mockAPI.getSessions(this.cfg.playlistId);
      }

      this.cards = response.cards;
      const filteredCards = filterCards(this.cards);
      const sortedCards = sortCards(filteredCards, this.cfg.sort);

      if (sortedCards.length < this.cfg.minimumSessions) {
        console.warn('Not enough sessions to display playlist');
        return;
      }

      this.displayPlaylist(sortedCards);
      
    } catch (e) {
      console.error('Failed to load sessions:', e);
    }
  }

  displayPlaylist(cards) {
    this.root.style.display = 'block';
    
    // Create header
    const header = this.createHeader();
    this.root.appendChild(header);
    
    // Create sessions
    this.sessionsWrapper = this.createSessionsWrapper(cards);
    this.root.appendChild(this.sessionsWrapper);
    
    // Footer functionality removed as per requirements
    
    // Setup favorites if enabled
    if (this.cfg.favoritesEnabled) {
      this.setupFavorites();
    }
  }

  createHeader() {
    const header = createTag('div', { class: 'video-playlist-container__header' });
    
    const isAutoPlayChecked = getLocalStorageShouldAutoPlay();
    
    header.innerHTML = `
      <div class="video-playlist-container__header__upper">
        <div class="video-playlist-container__header__upper__skipLink">
          <a href="#${PLAYLIST_SKIP_TO_ID}" class="video-playlist-container__header__upper__skipLink__link button">
            ${this.cfg.skipPlaylistText || 'Skip playlist'}
          </a>
        </div>
        <div class="video-playlist-container__header__toggle">
        <div class="consonant-switch consonant-switch--sizeM">
          <input 
            type="checkbox" 
            class="consonant-switch-input" 
            id="${PLAYLIST_PLAY_ALL_ID}" 
            daa-ll="${isAutoPlayChecked ? analytics.TOGGLE_OFF : analytics.TOGGLE_ON}" 
            ${isAutoPlayChecked ? 'checked' : ''} 
          />
          <span class="consonant-switch-switch"></span>
          <label class="consonant-switch-label" for="${PLAYLIST_PLAY_ALL_ID}">
            ${(this.cfg.autoplayText || 'Play All').toUpperCase()}
          </label>
        </div>
        </div>
      </div>

      <div class="video-playlist-container__header__content">
        <div class="video-playlist-container__header__content__left">
          <p class="video-playlist-container__header__content__left__topic">${this.cfg.topicEyebrow || ''}</p>
          <h3 class="video-playlist-container__header__content__left__title">${this.cfg.playlistTitle || 'Video Playlist'}</h3>
        </div>
        <div class="video-playlist-container__header__content__right">
          ${this.cfg.socialSharing ? this.createSocialSharingButton() : ''}
        </div>
      </div>
    `;

    // Setup autoplay checkbox
    this.setupAutoplayCheckbox(header);
    
    // Setup social sharing if enabled
    if (this.cfg.socialSharing) {
      this.setupSocialSharing(header);
    }
    
    return header;
  }

  createSocialSharingButton() {
    return `
      <div class="video-playlist-container__social-share-wrapper">
        <button class="video-playlist-container__social-share" daa-ll="Social_Share">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M12 6c.8 0 1.5.7 1.5 1.5S12.8 9 12 9s-1.5-.7-1.5-1.5S11.2 6 12 6zM4 6c.8 0 1.5.7 1.5 1.5S4.8 9 4 9s-1.5-.7-1.5-1.5S3.2 6 4 6zM8 6c.8 0 1.5.7 1.5 1.5S8.8 9 8 9s-1.5-.7-1.5-1.5S7.2 6 8 6z"/>
          </svg>
        </button>
        <div>
          <ul class="video-playlist-container__social-share-menu">
            <li>
              <a class="video-playlist-container__social-share-menu__item social-share-link" data-platform="facebook" daa-ll="Facebook_Share Playlist" aria-label="Share Playlist on Facebook" href="#" target="_blank">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 2.5C14.9774 1.84415 14.7067 1.22133 14.2427 0.757298C13.7787 0.29327 13.1558 0.0226174 12.5 0L2.5 0C1.84415 0.0226174 1.22133 0.29327 0.757298 0.757298C0.29327 1.22133 0.0226174 1.84415 0 2.5L0 12.5C0.0226174 13.1558 0.29327 13.7787 0.757298 14.2427C1.22133 14.7067 1.84415 14.9774 2.5 15H7.5V9.33333H5.66667V6.83333H7.5V5.85917C7.46729 5.0672 7.7415 4.29316 8.26546 3.6984C8.78943 3.10364 9.52273 2.73405 10.3125 2.66667H12.3333V5.16667H10.3125C10.0917 5.16667 9.83333 5.435 9.83333 5.83333V6.83333H12.3333V9.33333H9.83333V15H12.5C13.1558 14.9774 13.7787 14.7067 14.2427 14.2427C14.7067 13.7787 14.9774 13.1558 15 12.5V2.5Z" fill="black"></path>
                </svg>
                <span class="spectrum-Menu-itemLabel">Share Playlist on Facebook</span>
              </a>
            </li>
            <li>
              <a class="video-playlist-container__social-share-menu__item social-share-link" data-platform="twitter" daa-ll="Twitter_Share Playlist" aria-label="Share Playlist on X" href="#" target="_blank">
                <svg width="15" height="15" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="gray"></path>
                </svg>
                <span class="spectrum-Menu-itemLabel">Share Playlist on X</span>
              </a>
            </li>
            <li>
              <a class="video-playlist-container__social-share-menu__item social-share-link" data-platform="linkedin" daa-ll="LinkedIn_Share Playlist" aria-label="Share Playlist on LinkedIn" href="#" target="_blank">
                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.35803 14.9983H1.25053V4.98415H4.35803V14.9983ZM2.80136 3.61832C2.44359 3.61996 2.09335 3.51548 1.79495 3.3181C1.49654 3.12071 1.26336 2.83928 1.12488 2.50938C0.986411 2.17948 0.948862 1.81593 1.01699 1.46469C1.08511 1.11346 1.25585 0.790304 1.50761 0.536094C1.75937 0.281884 2.08086 0.10803 2.43142 0.0365126C2.78198 -0.0350043 3.14588 -0.000972847 3.4771 0.134304C3.80832 0.269582 4.092 0.50003 4.29226 0.796514C4.49252 1.093 4.60038 1.4422 4.6022 1.79998C4.60287 2.27942 4.41392 2.73966 4.07655 3.08031C3.73918 3.42096 3.28078 3.61436 2.80136 3.61832ZM16.0005 14.9983H12.8939V10.1233C12.8939 8.96165 12.8705 7.47165 11.2772 7.47165C9.66053 7.47165 9.4122 8.73415 9.4122 10.04V14.9983H6.30637V4.98415H9.28886V6.34998H9.33386C9.63207 5.83935 10.0633 5.41921 10.5815 5.13435C11.0996 4.84949 11.6854 4.7106 12.2764 4.73248C15.4222 4.73332 16.0005 6.80582 16.0005 9.49831V14.9983Z" fill="black"></path>
                </svg>
                <span class="spectrum-Menu-itemLabel">Share Playlist on LinkedIn</span>
              </a>
            </li>
            <li>
              <a class="video-playlist-container__social-share-menu__item social-share-link" data-platform="link" daa-ll="Link_Share Playlist" aria-label="Share with link" href="#" target="_blank">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5976 0.67421C10.165 0.792718 9.7546 0.981031 9.38262 1.23172C9.23095 1.33588 8.43679 2.09673 7.61929 2.91423L6.13011 4.40839H6.69761C7.21674 4.39759 7.73367 4.47914 8.22427 4.64923L8.52678 4.74838L9.50512 3.77505C10.6868 2.60255 10.7859 2.54171 11.4951 2.54171C11.7445 2.51126 11.9973 2.55901 12.2184 2.67838C12.5529 2.85629 12.8237 3.13383 12.9934 3.47254C13.1068 3.68729 13.153 3.9312 13.1259 4.17254C13.1259 4.91504 13.1351 4.90089 11.1926 6.85755C10.2801 7.77422 9.42929 8.59671 9.29679 8.69087C8.98114 8.90526 8.60146 9.00486 8.22122 8.97301C7.84098 8.94116 7.48319 8.77979 7.20761 8.51588C7.15379 8.44707 7.0848 8.39164 7.00601 8.35391C6.92723 8.31618 6.8408 8.29719 6.75345 8.29839C6.42012 8.27006 6.31845 8.3267 5.78012 8.87004L5.33594 9.3192L5.51093 9.56004C5.8782 10.0146 6.34844 10.3752 6.88272 10.612C7.417 10.8488 7.99998 10.9549 8.58344 10.9217C9.26266 10.8834 9.91686 10.6521 10.4693 10.2551C10.8284 9.99505 14.2601 6.55338 14.4693 6.24171C14.7152 5.87067 14.8942 5.45946 14.9984 5.0267C15.1414 4.37234 15.1153 3.69235 14.9226 3.05087C14.7459 2.511 14.4439 2.02061 14.0414 1.61972C13.639 1.21883 13.1473 0.918832 12.6068 0.744223C11.9523 0.560287 11.2633 0.536267 10.5976 0.67421Z" fill="black"></path>
                  <path d="M6.15423 5.27963C5.70839 5.36722 5.28028 5.5286 4.88757 5.75713C4.10995 6.36787 3.38516 7.04304 2.7209 7.77546C1.70923 8.77546 0.796734 9.72297 0.693401 9.8788C0.417757 10.2795 0.219878 10.7284 0.110067 11.2021C-0.00751559 11.8325 0.0232978 12.4816 0.200067 13.098C0.374617 13.6386 0.674596 14.1302 1.07549 14.5327C1.47639 14.9352 1.96683 15.2371 2.50673 15.4138C3.14823 15.6064 3.8282 15.6325 4.48257 15.4896C4.94785 15.3767 5.38735 15.1762 5.77757 14.8988C5.9384 14.7805 6.7234 14.0288 7.52757 13.2205L8.99257 11.7505H8.42507C7.90593 11.7612 7.38901 11.6797 6.8984 11.5096L6.5959 11.4105L5.6259 12.378C4.43507 13.5546 4.3309 13.6213 3.6309 13.6213C3.39964 13.6419 3.16695 13.6029 2.95507 13.508C2.60866 13.3333 2.32462 13.0559 2.14173 12.7138C2.01821 12.4941 1.96855 12.2405 2.00007 11.9905C2.00007 11.2338 1.9859 11.258 3.9284 9.30546C4.84507 8.3888 5.7009 7.5663 5.8284 7.47213C6.14405 7.25774 6.52371 7.15816 6.90395 7.19001C7.28419 7.22186 7.64198 7.38323 7.91757 7.64714C7.97138 7.71594 8.04038 7.77138 8.11916 7.80911C8.19795 7.84684 8.28439 7.86584 8.37173 7.86464C8.70507 7.89297 8.80673 7.8363 9.34507 7.28797L9.78923 6.8388L9.5959 6.57881C9.13876 6.0323 8.53775 5.62469 7.8609 5.40214C7.30857 5.2329 6.72507 5.19101 6.15423 5.27963Z" fill="black"></path>
                </svg>
                <span class="spectrum-Menu-itemLabel">Share with link</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    `;
  }

  setupAutoplayCheckbox(header) {
    const checkbox = header.querySelector(`#${PLAYLIST_PLAY_ALL_ID}`);
    if (checkbox) {
      checkbox.addEventListener('change', (event) => {
        saveShouldAutoPlayToLocalStorage(event.target.checked);
        const daaLL = event.target.checked
          ? analytics.TOGGLE_OFF
          : analytics.TOGGLE_ON;
        event.target.setAttribute('daa-ll', daaLL);
      });
    }
  }

  setupSocialSharing(header) {
    const shareButton = header.querySelector('.video-playlist-container__social-share');
    const shareMenu = header.querySelector('.video-playlist-container__social-share-menu');
    
    if (shareButton && shareMenu) {
      // Toggle menu on button click
      shareButton.addEventListener('click', (e) => {
        e.stopPropagation();
        shareMenu.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
          shareMenu.classList.remove('active');
        }
      });

      // Handle share menu item clicks
      const shareItems = shareMenu.querySelectorAll('.video-playlist-container__social-share-menu__item');
      shareItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const platform = item.dataset.platform;
          this.handleShare(platform, item);
          shareMenu.classList.remove('active');
        });
      });
    }
  }

  handleShare(platform, anchorElement) {
    const playlistUrl = window.location.href;
    const playlistTitle = this.cfg.playlistTitle || 'Video Playlist';
    const shareText = `Check out this playlist: ${playlistTitle}`;

    switch (platform) {
      case 'facebook':
        anchorElement.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(playlistUrl)}`;
        break;
      case 'twitter':
        anchorElement.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(playlistUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        anchorElement.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(playlistUrl)}`;
        break;
      case 'link':
        this.copyToClipboard(playlistUrl);
        return;
    }
  }

  shareToFacebook(url, text) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    this.openShareWindow(shareUrl, 'Facebook');
  }

  shareToTwitter(url, text) {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    this.openShareWindow(shareUrl, 'Twitter');
  }

  shareToLinkedIn(url, text) {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    this.openShareWindow(shareUrl, 'LinkedIn');
  }

  copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        this.showNotification('Link copied to clipboard!');
      }).catch(() => {
        this.fallbackCopyToClipboard(text);
      });
    } else {
      this.fallbackCopyToClipboard(text);
    }
  }

  fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showNotification('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      this.showNotification('Failed to copy link');
    }
    
    document.body.removeChild(textArea);
  }

  openShareWindow(url, platform) {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      url,
      `${platform}Share`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  }

  showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'video-playlist-container__share-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  createSessionsWrapper(cards) {
    const sessions = createTag('div', { class: 'video-playlist-container__sessions' });
    const sessionsWrapper = createTag('div', { class: 'video-playlist-container__sessions__wrapper' });

    const sessionsHTML = cards.map((card, index) => {
      const {
        thumbnailUrl,
        videoDuration,
        mpcVideoId,
        videoId,
      } = card.search;
      
      const videoIdToUse = mpcVideoId || videoId;
      
      return `
        <div daa-lh="${card.contentArea.title}" class="video-playlist-container__sessions__wrapper__session" data-video-id="${videoIdToUse}">
          <a daa-ll="${analytics.VIDEO_SELECT}" href="${card.overlayLink}" class="video-playlist-container__sessions__wrapper__session__link">
            <div class="video-playlist-container__sessions__wrapper__session__thumbnail">
              <img src="${thumbnailUrl}" alt="${card.contentArea.title}" />
              <div class="video-playlist-container__sessions__wrapper__session__thumbnail__play-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 18 18" width="40">
                  <rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" />
                  <path fill="#e5e5e5" d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm4.2685,8.43L7.255,12.93A.50009.50009,0,0,1,7,13H6.5a.5.5,0,0,1-.5-.5v-7A.5.5,0,0,1,6.5,5H7a.50009.50009,0,0,1,.255.07l6.0135,3.5a.5.5,0,0,1,0,.86Z" />
                </svg>
              </div>
              <div class="video-playlist-container__sessions__wrapper__session__thumbnail__duration">
                <p class="video-playlist-container__sessions__wrapper__session__thumbnail__duration__text">${videoDuration}</p>
              </div>
              <div class="video-playlist-container__sessions__wrapper__session__thumbnail__progress">
                <div class="video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar"></div>
              </div>
            </div>
            <div class="video-playlist-container__sessions__wrapper__session__info">
              <h4 class="video-playlist-container__sessions__wrapper__session__info__title">
                ${card.contentArea.title}
              </h4>
              <p class="video-playlist-container__sessions__wrapper__session__info__description">
                ${card.contentArea.description}
              </p>
              ${this.cfg.favoritesEnabled ? `
                <span class="consonant-tooltip consonant-tooltip--left consonant-tooltip--info">
                  <span class="consonant-tooltip-label">${this.cfg.favoritesTooltipText || 'Add to favorites'}</span>
                  <span class="consonant-tooltip-tip"></span>
                </span>
              ` : ''}
            </div>
          </a>
        </div>
      `;
    }).join('');

    sessionsWrapper.innerHTML = sessionsHTML;
    sessions.appendChild(sessionsWrapper);

    // Adding a toast container for notifications
    const toastsContainer = createTag('div', { id: TOAST_CONTAINER_ID });
    sessions.appendChild(toastsContainer);

    // Set initial progress bars
    this.setInitialProgressBars(sessionsWrapper);
    
    return sessions;
  }

  setInitialProgressBars(sessionsWrapper) {
    const localStorageVideos = getLocalStorageVideos();
    if (localStorageVideos) {
      const sessionElements = sessionsWrapper.querySelectorAll(
        '.video-playlist-container__sessions__wrapper__session',
      );
      sessionElements.forEach((sessionElement) => {
        const sessionVideoId = sessionElement.getAttribute('data-video-id');
        const sessionData = localStorageVideos[sessionVideoId];
        if (sessionData) {
          const progressBar = sessionElement.querySelector(
            '.video-playlist-container__sessions__wrapper__session__thumbnail__progress__bar',
          );
          const progress = (sessionData.secondsWatched / sessionData.length) * 100;
          progressBar.style.width = `${progress}%`;
        }
      });
    }
  }

  // createFooter method removed as related playlists functionality is no longer needed

  async setupFavorites() {
    try {
      const favoritesResponse = await mockAPI.getFavorites();
      const favorites = favoritesResponse.sessionInterests;
      
      const allSessions = this.sessionsWrapper.querySelectorAll(
        '.video-playlist-container__sessions__wrapper__session',
      );

      allSessions.forEach((session) => {
        const sessionVideoId = session.getAttribute('data-video-id');
        const card = this.cards.find((c) => 
          (c.search.mpcVideoId === sessionVideoId || c.search.videoId === sessionVideoId)
        );
        
        if (card) {
          const isFavorite = favorites.some(
            (favorite) => favorite.sessionID === card.search.sessionId,
          );
          
          const favoriteButton = this.createFavoriteButton(session, card, isFavorite);
          session.appendChild(favoriteButton);
        }
      });
    } catch (e) {
      console.error('Failed to setup favorites:', e);
    }
  }

  createFavoriteButton(session, card, isFavorite) {
    const favoriteButton = createTag('button', {
      class: 'video-playlist-container__sessions__wrapper__session__favorite',
      'daa-ll': isFavorite ? analytics.UNFAVORITE : analytics.FAVORITE,
      'aria-label': `Favorite session ${card.contentArea.title}`,
    });

    const heartClass = isFavorite ? 'filled' : 'unfilled';
    favoriteButton.innerHTML = `
      <svg class="heart ${heartClass}" xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14">
        <path d="M10.5895 1.82617C10.0133 1.85995 9.45382 2.03175 8.95885 2.32693C8.46389 2.62211 8.04809 3.0319 7.74691 3.52137C7.44573 3.0319 7.02993 2.62211 6.53496 2.32693C6.04 2.03175 5.48056 1.85995 4.90436 1.82617C3.99978 1.82617 3.13226 2.18337 2.49262 2.8192C1.85299 3.45502 1.49365 4.31738 1.49365 5.21657C1.49365 8.45423 7.74691 12.563 7.74691 12.563C7.74691 12.563 14.0002 8.49774 14.0002 5.21657C14.0002 4.31738 13.6408 3.45502 13.0012 2.8192C12.3616 2.18337 11.494 1.82617 10.5895 1.82617Z" stroke-width="2"/>
      </svg>
    `;

    favoriteButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.toggleFavorite(favoriteButton, card);
    });

    return favoriteButton;
  }

  async toggleFavorite(favoriteButton, card) {
    try {
      await mockAPI.toggleFavorite(card.search.sessionId);
      
      const favoriteSVG = favoriteButton.querySelector('svg');
      const isFavorite = favoriteSVG.classList.contains('filled');
      
      favoriteSVG.classList.toggle('filled', !isFavorite);
      favoriteSVG.classList.toggle('unfilled', isFavorite);
      favoriteButton.setAttribute(
        'daa-ll',
        isFavorite ? analytics.FAVORITE : analytics.UNFAVORITE,
      );

      // Show notification
      if (!isFavorite) {
        this.showNotification();
      }
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
    }
  }

  showNotification() {
    const notification = createTag('div', {
      class: 'video-playlist-container__notification',
    });
    
    notification.innerHTML = `
      <div class="video-playlist-container__notification__content">
        <p>${this.cfg.favoritesNotificationText}</p>
        <button class="video-playlist-container__notification__button">
          ${this.cfg.favoritesButtonText}
        </button>
        <button class="video-playlist-container__notification__close">×</button>
      </div>
    `;

    this.root.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);

    // Close button
    const closeBtn = notification.querySelector('.video-playlist-container__notification__close');
    closeBtn.addEventListener('click', () => notification.remove());

    // Action button
    const actionBtn = notification.querySelector('.video-playlist-container__notification__button');
    actionBtn.addEventListener('click', () => {
      if (this.cfg.favoritesButtonLink) {
        window.location.href = this.cfg.favoritesButtonLink;
      }
    });
  }

  setupVideoPlayer() {
    // Find video container (this would be created by another component)
    this.videoContainer = document.querySelector('.milo-video');
    console.log('Looking for .milo-video:', this.videoContainer);
    
    if (this.videoContainer) {
      console.log('Video container found, setting up listeners');
      this.setupPlayerListeners();
    } else {
      console.log('Video container not found, watching for it to be added');
      // Watch for video container to be added
      this.watchForVideoContainer();
    }
  }

  watchForVideoContainer() {
    console.log('Setting up MutationObserver to watch for .milo-video');
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const videoContainer = document.querySelector('.milo-video');
          console.log('Mutation detected, checking for .milo-video:', videoContainer);
          if (videoContainer) {
            console.log('Video container found via observer, setting up listeners');
            observer.disconnect();
            this.videoContainer = videoContainer;
            this.setupPlayerListeners();
            break;
          }
        }
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  setupPlayerListeners() {
    // Highlight current session
    this.highlightCurrentSession();
    
    // Remove existing listener if it exists
    if (this.boundHandlePlayerMessage) {
      window.removeEventListener('message', this.boundHandlePlayerMessage);
    }
    
    // Create bound function reference
    this.boundHandlePlayerMessage = this.handlePlayerMessage.bind(this);
    
    // Setup message listener for MPC player
    window.addEventListener('message', this.boundHandlePlayerMessage);
    
    // Setup YouTube player if needed
    this.setupYouTubePlayer();
  }

  highlightCurrentSession() {
    if (!this.videoContainer || !this.sessionsWrapper) return;
    
    const videoId = this.findVideoId();
    if (videoId) {
      const sessionElement = this.sessionsWrapper.querySelector(
        `[data-video-id="${videoId}"]`,
      );
      if (sessionElement) {
        // Remove previous highlights
        this.sessionsWrapper.querySelectorAll('.highlighted').forEach(el => {
          el.classList.remove('highlighted');
        });
        
        sessionElement.classList.add('highlighted');
        sessionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  findVideoId() {
    if (!this.videoContainer) return null;
    
    const iframe = this.videoContainer.querySelector('iframe');
    if (!iframe) return null;
    
    const iframeSrc = iframe.getAttribute('src');
    return findVideoIdFromIframeSrc(iframeSrc);
  }

  handlePlayerMessage(event) {
    console.log('Listening for the Event');
    // Handle MPC player messages
    if (event.origin !== VIDEO_ORIGIN) return;
    if (event.data.type !== MPC_STATUS) return;

    const { data } = event;
    const { state } = data;
    switch (state) {
      case EVENT_STATES.LOAD:
        this.handleLoadState(data);
        break;
      case EVENT_STATES.PAUSE:
        this.handlePauseState(data);
        break;
      case EVENT_STATES.TICK:
        this.handleTickState(data);
        break;
      case EVENT_STATES.COMPLETE:
        this.handleCompleteState(data.id);
        break;
    }
  }

  handleLoadState(data) {
    const { id, length } = data;
    this.highlightCurrentSession();

    // Restore progress
    const localStorageVideos = getLocalStorageVideos();
    const currentSessionData = localStorageVideos[id];
    if (currentSessionData) {
      const { secondsWatched } = currentSessionData;
      const startAt = secondsWatched > length - RESTART_THRESHOLD ? 0 : secondsWatched;
      startVideoFromSecond(this.videoContainer, startAt);
    } else {
      startVideoFromSecond(this.videoContainer, 0);
    }
  }
  

  handlePauseState(data) {
    const { id, currentTime } = data;
    saveCurrentVideoProgress(id, currentTime);
  }

  handleTickState(data) {
    const { id, currentTime } = data;
    if (currentTime % PROGRESS_SAVE_INTERVAL === 0) {
      saveCurrentVideoProgress(id, currentTime);
    }
  }

  handleCompleteState(videoId) {
    const shouldPlayAll = getLocalStorageShouldAutoPlay();
    
    if (shouldPlayAll) {
      const currentSessionIndex = this.cards.findIndex(
        (card) => (card.search.mpcVideoId === videoId || card.search.videoId === videoId),
      );

      if (currentSessionIndex !== -1 && currentSessionIndex < this.cards.length - 1) {
        const nextSession = this.cards[currentSessionIndex + 1];
        let nextSessionURL;
        try {
          nextSessionURL = new URL(nextSession.overlayLink);
        } catch (error) {
          console.error('Invalid URL', error);
          return;
        }

        if (this.currentPlaylistId) {
          nextSessionURL.searchParams.append(
            VIDEO_PLAYLIST_ID_URL_KEY,
            this.currentPlaylistId,
          );
        }

        // Take user to the next session
        window.location.href = nextSessionURL.href;
      }
    }
  }

  setupYouTubePlayer() {
    // Load YouTube API if needed
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Setup YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      // YouTube player setup would go here
      console.log('YouTube API ready');
    };
  }

  static dispose() {
    // Cleanup method
    const playlists = document.querySelectorAll('.video-playlist-container');
    playlists.forEach(playlist => {
      if (playlist.parentNode) {
        playlist.parentNode.removeChild(playlist);
      }
    });
  }
}

export default function init(el) {
  return new VideoPlaylist(el);
}


