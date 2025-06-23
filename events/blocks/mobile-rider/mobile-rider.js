import { LIBS } from '../../scripts/utils.js';
import { mobileRiderStore } from '../../features/timing-framework/plugins/mobile-rider/plugin.js';
import MobileRiderController from '../../features/timing-framework/plugins/mobile-rider/mobile-rider-controller.js';

const { createTag, getConfig } = await import(`${LIBS}/utils/utils.js`);

const CONFIG = {
  ANALYTICS: { PROVIDER: 'adobe' },
  SCRIPTS: {
    dev: '//assets.mobilerider.com/p/player-adobe-dev/player.min.js',
    prod: '//assets.mobilerider.com/p/adobe/player.min.js',
  },
  PLAYER: {
    DEFAULT_OPTIONS: { autoplay: true, controls: true, muted: false },
    CONTAINER_ID: 'mr-adobe',
    VIDEO_ID: 'idPlayer',
    VIDEO_CLASS: 'mobileRider_viewport',
  },
  ASL: {
    TOGGLE_CLASS: 'isASL',
    BUTTON_ID: 'asl-button',
    CHECK_INTERVAL: 100,
    MAX_CHECKS: 50,
  },
};

class MobileRiderBlock {
  constructor(element) {
    this.element = element;
    this.config = null;
    this.playerInstance = null;
    this.container = null;
    this.wrapper = null;

    // Make injectPlayer globally available for the drawer to use.
    window.injectPlayer = this.#injectPlayer.bind(this);

    this.#init();
  }

  async #init() {
    this.element.setAttribute('data-mobile-rider-block', 'true');
    this.config = this.#extractMetadata();

    const { container, wrapper } = this.#createPlayerStructure();
    this.container = container;
    this.wrapper = wrapper;

    if (this.config.concurrentenabled) {
      const liveVideos = await this.#filterLiveConcurrentVideos(this.config.concurrentVideos);
      if (liveVideos.length > 0) {
        // Load the first live video by default
        const videoToLoad = liveVideos[0];
        await this.#initializePlayer(videoToLoad.videoid, videoToLoad.aslid, videoToLoad.sessionid);

        // Initialize the drawer with all live videos
        await this.#initializeDrawer(liveVideos);
      } else {
        // No live videos, initialize an empty player
        await this.#initializePlayer();
      }
    } else {
      // Standard, non-concurrent initialization
      await this.#initializePlayer(this.config.videoid, this.config.aslid, this.config.sessionId);
      if (this.config.aslid) {
        this.#initializeASL();
      }
    }
  }

  async #initializeDrawer(liveVideos) {
    const drawerElement = this.container.querySelector('.mobile-rider-drawer');
    if (drawerElement) return;

    if (liveVideos.length > 0) {
      try {
        const { default: initDrawer } = await import('./mobile-rider-drawer.js');
        initDrawer(this.container, { ...this.config, videos: liveVideos });
      } catch (e) {
        console.error('Failed to load mobile rider drawer', e);
      }
    }
  }

  async #initializePlayer(videoId, aslId, sessionId) {
    try {
      await this.#loadMobileRiderScript();
      this.#injectPlayer(videoId, this.config.skinid, aslId, sessionId);
    } catch (e) {
      console.error('Failed to initialize Mobile Rider player', e);
    }
  }

  #injectPlayer(videoId, skinId, aslId = null, sessionId = null) {
    if (!this.wrapper) { console.warn('injectPlayer: wrapper is not available'); return undefined; }

    let container = this.wrapper.querySelector('.mobileRider_container');
    if (!container) {
      container = createTag('div', {
        class: 'mobileRider_container', 'data-videoid': videoId, 'data-skinid': skinId, 'data-aslid': aslId, 'data-sessionid': sessionId, id: CONFIG.PLAYER.CONTAINER_ID,
      });
      this.wrapper.appendChild(container);
    } else {
      container.dataset.videoid = videoId; container.dataset.skinid = skinId; container.dataset.aslid = aslId; container.dataset.sessionid = sessionId;
    }

    const oldVideo = container.querySelector(`#${CONFIG.PLAYER.VIDEO_ID}`);
    if (oldVideo) oldVideo.remove();

    const video = createTag('video', { id: CONFIG.PLAYER.VIDEO_ID, controls: true, class: CONFIG.PLAYER.VIDEO_CLASS });
    container.appendChild(video);
    if (!video) { console.warn('injectPlayer: video element is null'); return undefined; }

    if (window.__mr_player) window.__mr_player.dispose();

    const player = window.mobilerider.embed(video.id, videoId, skinId, {
      ...CONFIG.PLAYER.DEFAULT_OPTIONS, analytics: { provider: CONFIG.ANALYTICS.PROVIDER }, identifier1: videoId, identifier2: aslId, sessionId,
    });
    this.playerInstance = player;
    window.__mr_player = player;

    if (sessionId && player) this.#setupStreamEndDetection(player, sessionId);
    return player;
  }

  #initializeASL() {
    if (this.config.aslid && !this.config.concurrentenabled) {
      const aslButton = document.querySelector(`#${CONFIG.ASL.BUTTON_ID}`);
      if (aslButton) {
        const handler = () => {
          const container = document.querySelector(`#${CONFIG.PLAYER.CONTAINER_ID}`);
          if (container) this.#toggleASL(container);
        };
        const aslButtonClickHandler = () => {
          handler();
          this.#handleASLInitialization(aslButton, aslButtonClickHandler);
        };
        this.#handleASLInitialization(aslButton, aslButtonClickHandler);
      }
    }
  }

  #sanitizeTextForClass(text) { return text.trim().toLowerCase().replace(/ /g, '-'); }

  #extractMetadata() {
    const keyDivs = this.element.querySelectorAll(':scope > div > div:first-child');
    const metadata = {};
    keyDivs.forEach((div) => {
      const valueDivText = div.nextElementSibling.textContent;
      const keyValueText = this.#sanitizeTextForClass(div.textContent);
      metadata[keyValueText] = valueDivText;
    });
    const concurrentVideos = this.#extractConcurrentVideos(metadata);
    return {
      videoid: metadata.videoid || '',
      skinid: metadata.skinid || '',
      aslid: metadata.aslid || '',
      autoplay: metadata.autoplay === 'true',
      fluidContainer: metadata.fluidcontainer === 'true',
      renderInPage: metadata.renderinpage === 'true',
      concurrentenabled: metadata.concurrentenabled === 'true',
      concurrentVideos,
      sessionId: metadata.sessionid || '',
    };
  }

  #extractConcurrentVideos(metadata) {
    const concurrentVideos = [];
    Object.keys(metadata).forEach((key) => {
      const match = key.match(/^concurrentvideoid(\d*)$/);
      if (match) {
        const idx = match[1] || '';
        concurrentVideos.push({
          videoid: metadata[`concurrentvideoid${idx}`],
          aslid: metadata[`concurrentaslid${idx}`] || '',
          title: metadata[`concurrenttitle${idx}`] || '',
          description: metadata[`concurrentdescription${idx}`] || '',
          thumbnail: metadata[`concurrentthumbnail${idx}`] || '',
          sessionid: metadata[`concurrentsessionid${idx}`] || '',
        });
      }
    });
    return concurrentVideos;
  }

  #toggleASL(container, toggleClass = CONFIG.ASL.TOGGLE_CLASS) {
    const video = container.querySelector('.mobile-rider-viewport');
    const isASL = container.classList.contains(toggleClass);
    const videoId = isASL ? container.dataset.videoid : container.dataset.aslid;
    if (!video || !window.mobilerider || !videoId) return;
    container.classList.toggle(toggleClass);
    window.mobilerider.embed(video.id, videoId, container.dataset.skinid, {
      ...CONFIG.PLAYER.DEFAULT_OPTIONS,
      muted: true,
      analytics: { provider: CONFIG.ANALYTICS.PROVIDER },
    });
    if (container.dataset.sessionid) {
      mobileRiderStore.set(container.dataset.sessionid, true);
    }
  }

  #handleASLInitialization(aslButton, toggleHandlerCallback) {
    let checkCounter = 0;
    const maxChecks = CONFIG.ASL.MAX_CHECKS;
    function check() {
      if (document.querySelector(`#${CONFIG.PLAYER.CONTAINER_ID}`)) {
        aslButton.addEventListener('click', toggleHandlerCallback);
      } else if (checkCounter < maxChecks) {
        checkCounter += 1;
        setTimeout(check, CONFIG.ASL.CHECK_INTERVAL);
      }
    }
    check();
  }

  #setupStreamEndDetection(player, sessionId) {
    if (!player || !sessionId) return;
    const handleStreamEnd = () => {
      if (window.updateMobileRiderSession) window.updateMobileRiderSession(sessionId, false);
      if (mobileRiderStore?.set) mobileRiderStore.set(sessionId, false);
    };
    if (player.on) {
      player.on('ended', handleStreamEnd);
      player.on('error', handleStreamEnd);
      player.on('streamEnded', handleStreamEnd);
    }
    const videoElement = document.querySelector(`#${CONFIG.PLAYER.VIDEO_ID}`);
    if (videoElement) {
      videoElement.addEventListener('ended', handleStreamEnd);
      videoElement.addEventListener('error', handleStreamEnd);
    }
    const checkInterval = setInterval(() => {
      if (player?.getState && (player.getState() === 'ended' || player.getState() === 'error')) {
        clearInterval(checkInterval);
        handleStreamEnd();
      }
    }, 5000);
    if (player.dispose) {
      const originalDispose = player.dispose;
      player.dispose = function () { clearInterval(checkInterval); return originalDispose.call(this); };
    }
  }

  #loadMobileRiderScript() {
    return new Promise((resolve) => {
      if (window.mobilerider) { resolve(); return; }
      if (window._mobileriderScriptLoading) {
        const check = setInterval(() => {
          if (window.mobilerider) { clearInterval(check); resolve(); }
        }, 50);
        return;
      }
      window._mobileriderScriptLoading = true;
      const env = getConfig().env || 'prod';
      const scriptPath = CONFIG.SCRIPTS[env] || CONFIG.SCRIPTS.prod;
      const script = createTag('script', { src: scriptPath });
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

  #createPlayerStructure() {
    Array.from(this.element.children).forEach((child) => {
      if (!child.classList.contains('mobile-rider')) child.style.display = 'none';
    });
    let container = this.element.querySelector('.mobile-rider-player');
    if (!container) {
      container = createTag('div', { class: 'mobile-rider-player' });
      this.element.appendChild(container);
    }
    let wrapper = container.querySelector('.video-wrapper');
    if (!wrapper) {
      wrapper = createTag('div', { class: 'video-wrapper' });
      container.appendChild(wrapper);
    }
    return { container, wrapper };
  }

  async #filterLiveConcurrentVideos(videos) {
    if (!videos || videos.length === 0) return [];
    const controller = new MobileRiderController();
    const sessionIds = videos.map((v) => v.sessionid).filter(Boolean);
    if (sessionIds.length === 0) return [];
    try {
      const { active } = await controller.getMediaStatus(sessionIds);
      return videos.filter((v) => active.includes(v.sessionid));
    } catch (error) {
      window.lana?.log(`Failed to filter live concurrent videos: ${error.message}`);
      return [];
    }
  }
}

export default function init(element) {
  try {
    new MobileRiderBlock(element);
  } catch (e) {
    console.error('Failed to initialize Mobile Rider Block', e);
  }
}
