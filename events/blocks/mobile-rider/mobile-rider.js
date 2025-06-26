import { LIBS } from '../../scripts/utils.js';
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

let mobileriderScriptPromise = null;

async function loadMobileRiderScript() {
  if (window.mobilerider) return;
  if (mobileriderScriptPromise) return mobileriderScriptPromise;

  mobileriderScriptPromise = new Promise(async (resolve) => {
    const env = (await getConfig()).env || 'prod';
    const script = createTag('script', { src: CONFIG.SCRIPTS[env] || CONFIG.SCRIPTS.prod });
    script.onload = resolve;
    document.head.appendChild(script);
  });

  return mobileriderScriptPromise;
}

class MobileRider {
  constructor(el) {
    this.el = el;
    this.config = null;
    this.wrapper = null;
    this.container = null;

    this.init();
  }

  async init() {
    // Load script first to inject player faster
    await this.loadScript();
    this.config = this.parseConfig();
    const { container, wrapper } = this.createDOM();
    this.container = container;
    this.wrapper = wrapper;

    if (this.config.concurrentenabled) {
      const live = await this.filterLive(this.config.concurrentVideos);
      const defaultVideo = live[0] || this.config.concurrentVideos[0];
      await this.loadPlayer(defaultVideo.videoid, defaultVideo.aslid, defaultVideo.sessionid);
      this.initDrawer(this.config.concurrentVideos);
    } else {
      await this.loadPlayer(this.config.videoid, this.config.aslid, this.config.sessionId);
    }
  }

  async loadScript() {
    await loadMobileRiderScript();
  }

  async loadPlayer(videoId, aslId, sessionId) {
    try {
      this.injectPlayer(videoId, this.config.skinid, aslId, sessionId);
    } catch (err) {
      console.error('Player error', err);
    }
  }

  injectPlayer(videoId, skinId, aslId = null, sessionId = null) {
    if (!this.wrapper) return;

    let container = this.wrapper.querySelector('.mobileRider_container');
    if (!container) {
      this.wrapper.appendChild(container);
      container = createTag('div', {
        class: 'mobileRider_container',
        id: CONFIG.PLAYER.CONTAINER_ID,
        'data-videoid': videoId,
        'data-skinid': skinId,
        'data-aslid': aslId,
        'data-sessionid': sessionId,
      });
    } else {
      Object.assign(container.dataset, { videoid: videoId, skinid: skinId, aslid: aslId, sessionid: sessionId });
    }

    container.querySelector(`#${CONFIG.PLAYER.VIDEO_ID}`)?.remove();

    const video = createTag('video', { id: CONFIG.PLAYER.VIDEO_ID, class: CONFIG.PLAYER.VIDEO_CLASS, controls: true });
    container.appendChild(video);

    if (!video || !window.mobilerider) return;

    window.__mr_player?.dispose();

    window.mobilerider.embed(video.id, videoId, skinId, {
      ...CONFIG.PLAYER.DEFAULT_OPTIONS,
      analytics: { provider: CONFIG.ANALYTICS.PROVIDER },
      identifier1: videoId,
      identifier2: aslId,
      sessionId,
    }); 

    if (sessionId) this.addStreamEnd(sessionId);
  }
  
  addStreamEnd(sessionId) {
    window?.__mr_player?.off('streamend');
    window.__mr_player.on('streamend', () => {
      disposePlayer();
      window.updateMobileRiderSession?.(sessionId, false);
    });
  }

  disposePlayer() {
    window?.__mr_player?.dispose();
    window.__mr_player = null;
    window.__mr_stream_published = null;
  }

  async initDrawer(videos) {
    if (this.container.querySelector('.mobile-rider-drawer')) return;
    
    try {
      const { default: initDrawer } = await import('./mobile-rider-drawer.js');
      
      // Simple configuration with single callback
      const drawerConfig = {
        ...this.config,
        videos,
        showheader: true,
        onVideoClick: (_, video) => this.handleDrawerVideoClick(video),
      };
      
      this.drawer = initDrawer(this.container, drawerConfig);
    } catch (err) {
      console.error('Drawer load failed', err);
    }
  }

  async handleDrawerVideoClick(video) {
    try {
      const isLive = await this.validateVideoStatus(video);
      this.updateSessionStatus(video.sessionid, isLive);
      if (!isLive) {
        alert('This stream is not currently live.');
        return;
      }
      this.injectPlayer(video.videoid, this.config.skinid, video.aslid, video.sessionid);
    } catch (error) {
      console.error('Failed to handle video click:', error);
    }
  }
  
  async validateVideoStatus(video) {
    const { default: Controller } = await import('../../features/timing-framework/plugins/mobile-rider/mobile-rider-controller.js');
    const controller = new Controller();
    const { active = [] } = await controller.getMediaStatus([video.videoid]);
    return active.includes(video.videoid);
  }

  updateSessionStatus(sessionId, isActive) {
    if (sessionId && window.mobileRiderStore) {
      window.mobileRiderStore.set(sessionId, isActive);
    }
  }

  createDOM() {
    let playerBox = this.el.querySelector('.mobile-rider-player');
    if (!playerBox) {
      playerBox = createTag('div', { class: 'mobile-rider-player' });
      this.el.appendChild(playerBox);
    }
    let wrap = playerBox.querySelector('.video-wrapper');
    if (!wrap) {
      wrap = createTag('div', { class: 'video-wrapper' });
      playerBox.appendChild(wrap);
    }
    return { container: playerBox, wrapper: wrap };
  }

  parseConfig() {
    const metadata = Object.fromEntries(
      [...this.el.querySelectorAll(':scope > div > div:first-child')].map(div => [
        div.textContent.trim().toLowerCase().replace(/ /g, '-'),
        div.nextElementSibling?.textContent?.trim() || ''
      ])
    );

    if (metadata.concurrentenabled === 'true') {
      metadata.concurrentVideos = this.parseConcurrent(metadata);
    }

    return metadata;
  }

  parseConcurrent(metadata) {
    const indices = Object.keys(metadata)
      .filter(key => key.startsWith('concurrentvideoid'))
      .map(key => key.replace('concurrentvideoid', ''));

    const uniqueIndices = [...new Set(indices)].sort((a, b) => Number(a) - Number(b));

    return uniqueIndices.map(idx => ({
      videoid: metadata[`concurrentvideoid${idx}`] || '',
      aslid: metadata[`concurrentaslid${idx}`] || '',
      title: metadata[`concurrenttitle${idx}`] || '',
      description: metadata[`concurrentdescription${idx}`] || '',
      thumbnail: metadata[`concurrentthumbnail${idx}`] || '',
      sessionid: metadata[`concurrentsessionid${idx}`] || '',
    }));
  }

  async filterLive(videos = []) {
    if (!videos.length) return [];
    const [first, ...rest] = videos;
    if (first.sessionid) window.updateMobileRiderSession?.(first.sessionid, true);
    if (!rest.length) return [first];
    const ids = rest.map(v => v.videoid).filter(Boolean);
    if (!ids.length) return [first];

    try {
      const controller = new MobileRiderController();
      const { active } = await controller.getMediaStatus(ids);
      const live = rest.filter(v => active.includes(v.videoid));
      live.forEach(v => v.sessionid && window.updateMobileRiderSession?.(v.sessionid, true));
      return [first, ...live];
    } catch (e) {
      window.lana?.log?.(`Live check failed: ${e.message}`);
      return [first];
    }
  }

  initASL() {
    const container = this.wrapper?.querySelector('.mobileRider_container');
    if (!container) {
      console.warn('Mobile Rider container not found for ASL initialization');
      return;
    }

    const maxAttempts = CONFIG.ASL.MAX_CHECKS;
    const interval = CONFIG.ASL.CHECK_INTERVAL;
    const buttonId = CONFIG.ASL.BUTTON_ID;

    let attempts = 0;
    const check = () => {
      const btn = container.querySelector(`#${buttonId}`);
      if (btn) return this.setupASLButtonHandler(btn, container);

      if (++attempts < maxAttempts) {
        setTimeout(check, interval);
      } else {
        console.warn(`ASL button not found after ${maxAttempts} attempts`);
      }
    };

    check();
  }
  
  setupASLButtonHandler(button, container) {
    button.addEventListener('click', () => {
      container.classList.toggle(CONFIG.ASL.TOGGLE_CLASS);
    });
  }
}

export default function init(el) {
  try {
    new MobileRider(el);
  } catch (err) {
    console.error('Mobile Rider init failed', err);
  }
}
