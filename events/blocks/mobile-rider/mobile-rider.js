import { LIBS } from '../../scripts/utils.js';

const { createTag, getConfig } = await import(`${LIBS}/utils/utils.js`);

const CONFIG = {
  ANALYTICS: { PROVIDER: 'adobe' },
  SCRIPTS: {
    DEV_URL: '//assets.mobilerider.com/p/player-adobe-dev/player.min.js',
    PROD_URL: '//assets.mobilerider.com/p/adobe/player.min.js',
  },
  PLAYER: {
    DEFAULT_OPTIONS: { autoplay: true, controls: true, muted: true },
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
  API: {
    PROD_URL: 'https://overlay-admin.mobilerider.com',
    DEV_URL: 'https://overlay-admin-dev.mobilerider.com',
  },
};

let scriptPromise = null;

async function loadScript() {
  if (window.mobilerider) return undefined;
  if (scriptPromise) return scriptPromise;

  const promise = new Promise((res) => {
    getConfig().then((config) => {
      const env = config.env || 'prod';
      const isProd = env === 'prod';
      const src = isProd ? CONFIG.SCRIPTS.PROD_URL : CONFIG.SCRIPTS.DEV_URL;
      const s = createTag('script', { src });
      s.onload = res;
      document.head.appendChild(s);
    });
  });

  scriptPromise = promise;
  return promise;
}

class MobileRider {
  constructor(el) {
    this.el = el;
    this.cfg = null;
    this.wrap = null;
    this.root = null;
    this.store = null;
    this.mainID = null;
    this.init();
  }

  async init() {
    try {
      const scriptPromiseResult = loadScript();
      // TODO: Implement store functionality when plugin is available
      const storePromise = null;

      await scriptPromiseResult;
      if (storePromise) await storePromise;
      this.cfg = this.parseCfg();
      const { container, wrapper } = this.createDOM();
      this.root = container;
      this.wrap = wrapper;

      const isConcurrent = this.cfg.concurrentenabled;
      const videos = isConcurrent ? this.cfg.concurrentVideos : [this.cfg];

      const { videoid, aslid } = videos[0];
      if (!videoid) {
        window.lana?.log('Missing video-id in config.');
        return;
      }

      // Set mainID for concurrent streams
      if (isConcurrent && this.store) {
        this.mainID = videos[0].videoid;
      }

      await this.loadPlayer(videoid, aslid);
      if (isConcurrent && videos.length > 1) await this.initDrawer(videos);
    } catch (e) {
      window.lana?.log(`MobileRider Init error: ${e.message}`);
    }
  }

  async loadPlayer(vid, asl) {
    try {
      const skin = this.cfg.skinid;
      await this.injectPlayer(vid, skin, asl);
    } catch (e) {
      window.lana?.log(`Failed to initialize the player: ${e.message}`);
    }
  }

  extractPlayerOverrides() {
    const overrides = {};
    if (this.cfg.autoplay !== undefined) {
      overrides.autoplay = this.cfg.autoplay === 'true';
    }
    if (this.cfg.controls !== undefined) {
      overrides.controls = this.cfg.controls === 'true';
    }
    if (this.cfg.muted !== undefined) {
      overrides.muted = this.cfg.muted === 'true';
    }
    return overrides;
  }

  getPlayerOptions() {
    return { ...CONFIG.PLAYER.DEFAULT_OPTIONS, ...this.extractPlayerOverrides() };
  }

  injectPlayer(vid, skin, asl = null) {
    const container = createTag('div', {
      class: 'mobile-rider-container',
      'data-videoid': vid,
      'data-skinid': skin,
      'data-aslid': asl,
    });

    const video = createTag('video', {
      id: CONFIG.PLAYER.VIDEO_ID,
      class: CONFIG.PLAYER.VIDEO_CLASS,
    });

    container.append(video);
    this.wrap.append(container);

    const options = this.getPlayerOptions();
    window.mobilerider.embed(container, options);

    // Handle stream end for concurrent streams
    if (this.mainID && this.store) {
      const mainExists = this.store.get(this.mainID);
      const vidExists = this.store.get(vid);
      const shouldCallOnStreamEnd = mainExists || vidExists;
      if (shouldCallOnStreamEnd) {
        this.onStreamEnd(vid);
      }
    }
  }

  onStreamEnd(vid) {
    // eslint-disable-next-line no-underscore-dangle
    window.__mr_player?.off('streamend');
    // eslint-disable-next-line no-underscore-dangle
    window.__mr_player?.on('streamend', () => {
      this.store?.set(vid, false);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {
    // eslint-disable-next-line no-underscore-dangle
    window.__mr_player?.dispose();
    // eslint-disable-next-line no-underscore-dangle
    window.__mr_player = null;
    // eslint-disable-next-line no-underscore-dangle
    window.__mr_stream_published = null;
  }

  // eslint-disable-next-line class-methods-use-this
  loadDrawerCSS() {
    const link = createTag('link', {
      rel: 'stylesheet',
      href: '/events/blocks/mobile-rider/drawer.css',
    });
    document.head.append(link);
  }

  // eslint-disable-next-line class-methods-use-this
  drawerHeading() {
    const header = createTag('div', { class: 'now-playing-header' });
    header.innerHTML = `
      <h3>Now Playing</h3>
      <p>Select a live session</p>
    `;
    return header;
  }

  async initDrawer(videos) {
    try {
      this.loadDrawerCSS();
      const drawerRoot = createTag('div', { class: 'drawer-root' });
      this.root.append(drawerRoot);

      const renderItem = (v) => {
        const item = createTag('div', { class: 'drawer-item' });
        item.innerHTML = `
          <div class="item-thumbnail">
            <img src="${v.thumbnail || ''}" alt="${v.title || ''}" />
          </div>
          <div class="item-content">
            <h4>${v.title || ''}</h4>
            <p>${v.description || ''}</p>
          </div>
        `;
        return item;
      };

      const { initDrawers } = await import('./drawer.js');
      initDrawers(drawerRoot, {
        items: videos,
        renderItem,
        onItemClick: this.onDrawerClick.bind(this),
        ariaLabel: 'Live Streams',
      });
    } catch (e) {
      window.lana?.log(`Drawer init failed: ${e.message}`);
    }
  }

  async onDrawerClick(v) {
    try {
      const isLive = await this.checkLive(v);
      if (!isLive) {
        window.lana?.log(`This stream is not currently live: ${v.videoid}`);
      }
      await this.injectPlayer(v.videoid, v.skinid, v.aslid);
    } catch (e) {
      window.lana?.log(`Drawer item click error: ${e.message}`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getMediaStatus(id) {
    const env = (await getConfig()).env || 'prod';
    const isLowerEnv = env !== 'prod';
    const baseUrl = isLowerEnv ? CONFIG.API.DEV_URL : CONFIG.API.PROD_URL;
    const res = await fetch(`${baseUrl}/api/media-status?ids=${id}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to get media status');
    }
    return res.json();
  }

  async checkLive(v) {
    if (!v.videoid) return false;
    try {
      // Use mainID if available, otherwise use the video's videoid
      const idToCheck = this.mainID || v.videoid;
      const status = await this.getMediaStatus(idToCheck);
      const isLive = status.active?.includes(v.videoid) || false;
      this.setStatus(v.videoid, isLive);
      return isLive;
    } catch (e) {
      window.lana?.log(`Check live failed: ${e.message}`);
      return false;
    }
  }

  setStatus(id, live) {
    if (!this.store || !id) return;

    let key = null;
    if (this.mainID && this.store.get(this.mainID) !== undefined) {
      key = this.mainID;
    } else if (this.store.get(id) !== undefined) {
      key = id;
    }

    if (key && this.store.get(key) !== live) {
      this.store.set(key, live);
    }
  }

  initASL() {
    const container = this.wrap?.querySelector('.asl-container');
    if (!container) return;

    const button = container.querySelector(`#${CONFIG.ASL.BUTTON_ID}`);
    if (button) {
      this.setupASL(button, container);
    }
  }

  setupASL(btn, con) {
    const check = () => {
      if (con.classList.contains(CONFIG.ASL.TOGGLE_CLASS)) {
        this.initASL();
      }
    };

    let checkCount = 0;
    const interval = setInterval(() => {
      checkCount += 1;
      check();
      if (checkCount >= CONFIG.ASL.MAX_CHECKS) {
        clearInterval(interval);
      }
    }, CONFIG.ASL.CHECK_INTERVAL);

    btn.addEventListener('click', () => {
      if (!con.classList.contains(CONFIG.ASL.TOGGLE_CLASS)) {
        con.classList.add(CONFIG.ASL.TOGGLE_CLASS);
        this.initASL();
      }
    });
  }

  createDOM() {
    const container = createTag('div', { class: 'mobile-rider-player' });
    const wrapper = createTag('div', { class: 'video-wrapper' });
    container.append(wrapper);
    this.el.append(container);
    return { container, wrapper };
  }

  parseCfg() {
    const meta = Object.fromEntries(
      [...this.el.querySelectorAll(':scope > div > div:first-child')].map((div) => [
        div.textContent.trim().toLowerCase().replace(/ /g, '-'),
        div.nextElementSibling?.textContent?.trim() || '',
      ]),
    );

    const cfg = {
      videoid: meta['video-id'],
      skinid: meta['skin-id'],
      autoplay: meta.autoplay,
      controls: meta.controls,
      muted: meta.muted,
      aslid: meta['asl-id'],
      concurrentenabled: meta.concurrentenabled === 'true',
    };

    if (cfg.concurrentenabled) {
      cfg.concurrentVideos = this.parseConcurrent(meta);
    }

    return cfg;
  }

  // eslint-disable-next-line class-methods-use-this
  parseConcurrent(meta) {
    const videos = [];
    const videoIds = Object.keys(meta).filter((key) => key.startsWith('concurrentvideoid'));

    videoIds.forEach((key, index) => {
      const videoId = meta[key];
      const titleKey = `concurrenttitle${index + 1}`;
      const title = meta[titleKey] || '';

      videos.push({
        videoid: videoId,
        title,
        skinid: meta['skin-id'],
      });
    });

    return videos;
  }
}

export default function init(el) {
  return new MobileRider(el);
}
