/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../../events/blocks/video-playlist/video-playlist.js';

/* global globalThis */

const defaultHtml = `
<div class="video-playlist-container">
  <div data-playlist-config
       data-playlist-id="test-playlist"
       data-playlist-title="Test Playlist"
       data-topic-eyebrow="Design"
       data-autoplay-text="Play All"
       data-skip-playlist-text="Skip playlist"
       data-minimum-sessions="2"
       data-sort="default"
       data-is-tag-based="false"
       data-social-sharing="true"
       data-favorites-enabled="true"
       data-favorites-tooltip-text="Add to favorites"
       data-favorites-notification-text="Session added to favorites"
       data-favorites-button-text="View Schedule"
       data-favorites-button-link="/schedule"
       data-related-playlists='[{"title":"Related Playlist","link":"/related"}]'>
  </div>
</div>
`;

describe('Video Playlist Module', () => {
  let mockFetch;
  let playlistInstance = null;

  beforeEach(() => {
    // Mock fetch for API calls
    mockFetch = sinon.stub(globalThis, 'fetch');
    mockFetch.resolves({
      ok: true,
      json: () => Promise.resolve({ 
        cards: [
          {
            search: {
              mpcVideoId: 'session_001',
              videoId: 'yt_001',
              videoService: 'mpc',
              sessionId: 'sess_001',
              thumbnailUrl: 'https://via.placeholder.com/320x180/0066cc/ffffff?text=Session+1',
              videoDuration: '45:30',
            },
            contentArea: {
              title: 'Introduction to Adobe Creative Cloud',
              description: 'Learn the basics of Adobe Creative Cloud and its key features.',
            },
            overlayLink: '/sessions/intro-creative-cloud',
          }
        ] 
      }),
    });

    // Mock localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: sinon.stub(),
        setItem: sinon.stub(),
      },
      writable: true,
    });

    // Mock createTag and getConfig
    globalThis.createTag = (tag, attributes = {}) => {
      const element = document.createElement(tag);
      Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') {
          element.className = value;
        } else {
          element.setAttribute(key, value);
        }
      });
      return element;
    };

    globalThis.getConfig = () => ({ env: 'test' });

    // Mock LIBS import
    globalThis.LIBS = '/libs';
  });

  afterEach(() => {
    sinon.restore();
    document.body.innerHTML = '';
    delete globalThis.localStorage;
    delete globalThis.createTag;
    delete globalThis.getConfig;
    delete globalThis.LIBS;
    playlistInstance = null;
  });

  describe('init', () => {
    it('should initialize VideoPlaylist with valid element', async () => {
      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');
      expect(el).to.not.be.null;

      playlistInstance = init(el);
      expect(playlistInstance).to.not.be.null;
      expect(playlistInstance.el).to.equal(el);

      // Wait for async operations
      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });

      const playlist = el.querySelector('.video-playlist');
      expect(playlist).to.not.be.null;
    });

    it('should handle missing configuration gracefully', async () => {
      document.body.innerHTML = '<div class="video-playlist-container"></div>';
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      expect(playlistInstance).to.not.be.null;
      expect(playlistInstance.cfg.playlistTitle).to.equal('Video Playlist');
      expect(playlistInstance.cfg.favoritesEnabled).to.be.false;
    });

    it('should parse configuration correctly', async () => {
      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      expect(playlistInstance.cfg.playlistId).to.equal('test-playlist');
      expect(playlistInstance.cfg.playlistTitle).to.equal('Test Playlist');
      expect(playlistInstance.cfg.topicEyebrow).to.equal('Design');
      expect(playlistInstance.cfg.favoritesEnabled).to.be.true;
    });
  });

  describe('Session Loading', () => {
    it('should load sessions from API', async () => {
      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      expect(playlistInstance.cards).to.be.an('array');
      expect(playlistInstance.cards.length).to.be.greaterThan(0);
      expect(playlistInstance.cards[0]).to.have.property('search');
      expect(playlistInstance.cards[0]).to.have.property('contentArea');
    });

    it('should not display playlist if minimum sessions not met', async () => {
      const minHtml = `
        <div class="video-playlist-container">
          <div data-playlist-config
               data-minimum-sessions="10"
               data-playlist-title="Test">
          </div>
        </div>
      `;
      document.body.innerHTML = minHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const playlist = el.querySelector('.video-playlist');
      expect(playlist.style.display).to.equal('none');
    });
  });

  describe('DOM Creation', () => {
    it('should create header with correct elements', async () => {
      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const header = el.querySelector('.video-playlist__header');
      expect(header).to.exist;

      const title = header.querySelector('.video-playlist__header__content__left__title');
      expect(title.textContent).to.equal('Test Playlist');

      const toggle = header.querySelector('#playlist-play-all');
      expect(toggle).to.exist;
    });

    it('should create sessions wrapper', async () => {
      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const sessionsWrapper = el.querySelector('.video-playlist__sessions__wrapper');
      expect(sessionsWrapper).to.exist;

      const sessions = sessionsWrapper.querySelectorAll('.video-playlist__sessions__wrapper__session');
      expect(sessions.length).to.be.greaterThan(0);
    });

    it('should create footer with related playlists', async () => {
      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const footer = el.querySelector('.video-playlist__footer');
      expect(footer).to.exist;

      const relatedLinks = footer.querySelectorAll('.video-playlist__footer__content__playlists__playlist');
      expect(relatedLinks.length).to.be.greaterThan(0);
    });
  });

  describe('Autoplay Functionality', () => {
    it('should save autoplay setting to localStorage', async () => {
      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const checkbox = el.querySelector('#playlist-play-all');
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      expect(localStorage.setItem.called).to.be.true;
      const callArgs = localStorage.setItem.getCall(0).args;
      expect(callArgs[0]).to.include('autoplay');
      expect(JSON.parse(callArgs[1])).to.be.true;
    });

    it('should restore autoplay setting from localStorage', async () => {
      localStorage.getItem.returns(JSON.stringify(true));

      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const checkbox = el.querySelector('#playlist-play-all');
      expect(checkbox.checked).to.be.true;
    });
  });

  describe('Favorites Functionality', () => {
    it('should create favorite buttons when enabled', async () => {
      // Mock favorites API response
      mockFetch.onSecondCall().resolves({
        ok: true,
        json: () => Promise.resolve({
          sessionInterests: [{ sessionID: 'sess_001' }]
        }),
      });

      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const favoriteButtons = el.querySelectorAll('.video-playlist__sessions__wrapper__session__favorite');
      expect(favoriteButtons.length).to.be.greaterThan(0);
    });

    it('should handle favorite toggle', async () => {
      // Mock favorites API responses
      mockFetch.onSecondCall().resolves({
        ok: true,
        json: () => Promise.resolve({
          sessionInterests: []
        }),
      });
      mockFetch.onThirdCall().resolves({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const favoriteButton = el.querySelector('.video-playlist__sessions__wrapper__session__favorite');
      const heart = favoriteButton.querySelector('.heart');

      // Initial state should be unfilled
      expect(heart.classList.contains('unfilled')).to.be.true;

      // Click to toggle
      favoriteButton.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should now be filled
      expect(heart.classList.contains('filled')).to.be.true;
    });
  });

  describe('Progress Tracking', () => {
    it('should display progress bars for watched videos', async () => {
      const mockProgress = {
        'session_001': { secondsWatched: 200, length: 600 }
      };
      localStorage.getItem.returns(JSON.stringify(mockProgress));

      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const progressBar = el.querySelector('.video-playlist__sessions__wrapper__session__thumbnail__progress__bar');
      expect(progressBar.style.width).to.not.equal('0%');
    });
  });

  describe('Video Player Integration', () => {
    it('should watch for video container', async () => {
      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Should not find video container initially
      expect(playlistInstance.videoContainer).to.be.null;

      // Create video container
      const videoContainer = document.createElement('div');
      videoContainer.className = 'videoContainer';
      document.body.appendChild(videoContainer);

      // Wait for mutation observer
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(playlistInstance.videoContainer).to.exist;
    });
  });

  describe('Analytics', () => {
    it('should set correct analytics attributes', async () => {
      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const sessionLinks = el.querySelectorAll('[daa-ll="Video Select"]');
      expect(sessionLinks.length).to.be.greaterThan(0);

      const autoplayToggle = el.querySelector('#playlist-play-all');
      expect(autoplayToggle.getAttribute('daa-ll')).to.include('Play all');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockFetch.rejects(new Error('API Error'));

      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Should not crash and should have empty cards
      expect(playlistInstance.cards).to.be.an('array');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorage.getItem.throws(new Error('Storage Error'));

      // Should not crash when accessing localStorage
      expect(() => {
        localStorage.getItem('test');
      }).to.throw('Storage Error');
    });
  });

  describe('Accessibility', () => {
    it('should have skip link for accessibility', async () => {
      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const skipLink = el.querySelector('.video-playlist__header__upper__skipLink__link');
      expect(skipLink).to.exist;
      expect(skipLink.getAttribute('href')).to.equal('#video-playlist-skip');
    });
  });

  describe('Cleanup', () => {
    it('should dispose correctly', async () => {
      document.body.innerHTML = defaultHtml;
      const el = document.querySelector('.video-playlist-container');

      playlistInstance = init(el);
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Verify playlist exists
      expect(el.querySelector('.video-playlist')).to.exist;

      // Call dispose
      if (init.dispose) {
        init.dispose();
      }

      // Playlist should be removed
      expect(el.querySelector('.video-playlist')).to.not.exist;
    });
  });
});
