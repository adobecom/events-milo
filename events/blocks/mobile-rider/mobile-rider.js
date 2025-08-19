/* eslint-disable no-underscore-dangle */
import { LIBS } from '../../scripts/utils.js';

const { createTag, getConfig } = await import(`${LIBS}/utils/utils.js`);

const CONFIG = {
  ANALYTICS: { PROVIDER: 'adobe' },
  SCRIPTS: {
    DEV_URL: '//assets.mobilerider.com/p/player-adobe-integration/player.min.js',
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
    PROD_URL: 'https://overlay-admin-integration.mobilerider.com',
    DEV_URL: 'https://overlay-admin-integration.mobilerider.com',
  },
  STORAGE: {
    CURRENT_VIDEO_KEY: 'mobile-rider-current-video',
  },
};

// --- Storage helpers ---------------------------------------------------------

/**
 * Save the current video state to sessionStorage
 * @param {string} videoId - The video ID that is currently playing
 * @param {string} mainId - The main session ID for concurrent streams
 */
function saveCurrentVideo(videoId, mainId = null) {
  try {
    const data = {
      videoId,
      mainId,
    };
    sessionStorage.setItem(CONFIG.STORAGE.CURRENT_VIDEO_KEY, JSON.stringify(data));
  } catch (e) {
    window.lana?.log(`Failed to save current video state: ${e.message}`);
  }
}

/**
 * Get the saved current video state from sessionStorage
 * @returns {Object|null} The saved video state or null if not found
 */
function getCurrentVideo() {
  try {
    const data = sessionStorage.getItem(CONFIG.STORAGE.CURRENT_VIDEO_KEY);
    
    if (!data) return null;
    
    return JSON.parse(data);
  } catch (e) {
    window.lana?.log(`Failed to get current video state: ${e.message}`);
    return null;
  }
}

/**
 * Clear the saved current video state
 */
function clearCurrentVideo() {
  try {
    sessionStorage.removeItem(CONFIG.STORAGE.CURRENT_VIDEO_KEY);
  } catch (e) {
    window.lana?.log(`Failed to clear current video state: ${e.message}`);
  }
}

// --- LCP helpers -------------------------------------------------------------

/** Preload the poster so it can be the LCP element. Idempotent. */
function preloadPoster(url) {
  if (!url) return;
  const sel = `link[rel="preload"][as="image"][href="${url}"]`;
  if (!document.querySelector(sel)) {
    const l = document.createElement('link');
    l.rel = 'preload';
    l.as = 'image';
    l.href = url;
    document.head.appendChild(l);
  }
}

/** Injects an eagerly loaded poster <img> placeholder. Returns a cleanup fn. */
function showPosterPlaceholder(container, poster, altText = 'Video poster') {
  if (!poster || !container) return () => {};
  // If one already exists, don’t duplicate
  let img = container.querySelector('.mr-poster');
  if (!img) {
    img = createTag('img', {
      src: poster,
      alt: altText,
      class: 'mr-poster',
      fetchpriority: 'high',
      loading: 'eager',
      decoding: 'async',
    });
    // Make sure it sits behind the video but fills the box; CSS-friendly:
    // .mobile-rider-container { position: relative; }
    // .mr-poster { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
    container.appendChild(img);
  }
  return () => img?.remove();
}

// ---------------------------------------------------------------------------

let scriptPromise = null;

async function loadScript() {
  if (window.mobilerider) return null;
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((res) => {
    const env = getConfig().env || 'prod';
    const isProd = env === 'prod';
    const src = isProd ? CONFIG.SCRIPTS.PROD_URL : CONFIG.SCRIPTS.DEV_URL;
    const s = createTag('script', { src });
    s.onload = res;
    document.head.appendChild(s);
  });

  return scriptPromise;
}

class MobileRider {
  constructor(el) {
    this.el = el;
    this.cfg = null;
    this.wrap = null;
    this.root = null;
    this.store = null;
    this.mainID = null;
    this.currentVideoId = null;
    this.drawer = null;
    this.init();
    
    // Save current video state before page unload
    window.addEventListener('beforeunload', () => {
      if (this.currentVideoId && this.cfg?.concurrentenabled) {
        saveCurrentVideo(this.currentVideoId, this.mainID);
      }
    });
  }

  async init() {
    try {
      scriptPromise = loadScript();
      const storePromise = this.el.closest('.chrono-box')
        ? import('../../features/timing-framework/plugins/mobile-rider/plugin.js')
          .then(({ mobileRiderStore }) => {
            this.store = mobileRiderStore;
          })
          .catch((e) => {
            window.lana?.log(`Failed to import mobileRiderStore: ${e.message}`);
          })
        : null;

      await scriptPromise;
      if (storePromise) await storePromise;
      this.cfg = this.parseCfg();
      const { container, wrapper } = this.createDOM();
      this.root = container;
      this.wrap = wrapper;

      const isConcurrent = this.cfg.concurrentenabled;
      const videos = isConcurrent ? this.cfg.concurrentVideos : [this.cfg];

      // Check for saved video state
      const savedVideo = getCurrentVideo();
      let initialVideo = videos[0];
      
      if (savedVideo && isConcurrent) {
        // Find the saved video in the concurrent videos array
        const savedVideoObj = videos.find(v => v.videoid === savedVideo.videoId);
        if (savedVideoObj) {
          initialVideo = savedVideoObj;
          window.lana?.log(`Restoring saved video: ${savedVideo.videoId}`);
        }
      }

      const { videoid, aslid } = initialVideo;
      if (!videoid) {
        window.lana?.log('Missing video-id in config.');
        return;
      }

      // Set mainID for concurrent streams
      if (isConcurrent && this.store) {
        this.mainID = savedVideo?.mainId || videos[0].videoid;
      }

      await this.loadPlayer(videoid, aslid);
      
      // Save the initial video state for concurrent streams
      if (isConcurrent) {
        saveCurrentVideo(videoid, this.mainID);
      }
      
      if (isConcurrent && videos.length > 1) {
        await this.initDrawer(videos);
        // Update drawer active state to match the restored video
        if (savedVideo && this.drawer) {
          this.drawer.setActiveById(videoid);
        }
      }
    } catch (e) {
      window.lana?.log(`MobileRider Init error: ${e.message}`);
    }
  }

  async loadPlayer(vid, asl) {
    try {
      this.injectPlayer(vid, this.cfg.skinid, asl);
    } catch (e) {
      window.lana?.log(`Failed to initialize the player: ${e.message}`);
    }
  }

  extractPlayerOverrides() {
    const overrides = {};
    Object.keys(CONFIG.PLAYER.DEFAULT_OPTIONS).forEach((key) => {
      if (key in this.cfg) {
        const val = this.cfg[key];
        overrides[key] = String(val).toLowerCase() === 'true';
      }
    });
    return overrides;
  }

  getPlayerOptions() {
    return {
      ...CONFIG.PLAYER.DEFAULT_OPTIONS,
      ...this.extractPlayerOverrides(),
    };
  }

  injectPlayer(vid, skin, asl = null) {
    if (!this.wrap) return;

    // Track current video ID
    this.currentVideoId = vid;

    let con = this.wrap.querySelector('.mobile-rider-container');
    if (!con) {
      con = createTag('div', {
        class: 'mobile-rider-container is-hidden',
        id: CONFIG.PLAYER.CONTAINER_ID,
        'data-videoid': vid,
        'data-skinid': skin,
        'data-aslid': asl,
      });
      this.wrap.appendChild(con);
    } else {
      Object.assign(con.dataset, { videoid: vid, skinid: skin, aslid: asl });
    }

    // --- LCP: add poster preload + placeholder before we touch <video> -------
    const poster = this.cfg.poster || this.cfg.thumbnail;
    if (poster) {
      preloadPoster(poster);
    }
    const removePoster = showPosterPlaceholder(con, poster, this.cfg.title || 'Video poster');

    // -------------------------------------------------------------------------

    window.__mr_player?.dispose();
    con.querySelector(`#${CONFIG.PLAYER.VIDEO_ID}`)?.remove();

    const videoAttrs = {
      id: CONFIG.PLAYER.VIDEO_ID,
      class: CONFIG.PLAYER.VIDEO_CLASS,
      controls: true,
      preload: 'metadata',       // LCP-friendly
      playsinline: '',           // iOS: avoid fullscreen jumps
    };
    if (poster) videoAttrs.poster = poster; // Also set poster on <video>
    const video = createTag('video', videoAttrs);
    con.appendChild(video);

    if (!window.mobilerider) return;

    // Remove poster when we have data (or after a short fallback)
    const cleanup = () => removePoster();
    video.addEventListener('loadeddata', cleanup, { once: true });
    // Fallback: in case the player fires custom events or takes longer
    setTimeout(cleanup, 4000);

    window.mobilerider.embed(video.id, vid, skin, {
      ...this.getPlayerOptions(),
      analytics: { provider: CONFIG.ANALYTICS.PROVIDER },
      identifier1: vid,
      identifier2: asl,
      sessionId: vid,
      // If the SDK supports it, this is harmless to pass along:
      poster, // may be ignored by SDK; safe to include
    });

    if (asl) this.initASL();

    // Check store existence first, then check mainID or vid in store
    if (this.store) {
      let key = null;
      if (this.mainID && this.store.get(this.mainID) !== undefined) {
        key = this.mainID;
      } else if (this.store.get(vid) !== undefined) {
        key = vid;
      }
      if (key) this.onStreamEnd(vid);
    }

    con.classList.remove('is-hidden');
  }

  onStreamEnd(vid) {
    window.__mr_player?.off('streamend');
    window.__mr_player?.on('streamend', () => {
      this.setStatus(vid, false);
      // Clear saved state when stream ends
      clearCurrentVideo();
      MobileRider.dispose();
    });
  }

  static dispose() {
    window.__mr_player?.dispose();
    window.__mr_player = null;
    window.__mr_stream_published = null;
    
    // Clear saved video state when disposing
    clearCurrentVideo();
  }

  static loadDrawerCSS() {
    // Check if drawer CSS is already loaded
    if (document.querySelector('link[href*="drawer.css"]')) return;

    // Load drawer CSS dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/events/blocks/mobile-rider/drawer.css';
    document.head.appendChild(link);
  }

  drawerHeading() {
    const title = this.cfg.drawertitle || 'Now Playing';
    const subtitle = this.cfg.drawersubtitle || 'Select a live session';

    const header = createTag('div', { class: 'now-playing-header' });
    header.innerHTML = `
      <p class="now-playing-title">${title}</p>
      <span class="now-playing-subtitle">${subtitle}</span>
    `;
    return header;
  }

  async initDrawer(videos) {
    try {
      // Load drawer CSS dynamically
      MobileRider.loadDrawerCSS();
      const { default: createDrawer } = await import('./drawer.js');

      const renderItem = (v) => {
        const item = createTag('div', {
          class: 'drawer-item',
          'data-id': v.videoid,
          role: 'button',
          tabindex: '0',
        });

        if (v.thumbnail) {
          const thumbImg = createTag('div', { class: 'drawer-item-thumbnail' });
          thumbImg.appendChild(createTag('img', { src: v.thumbnail, alt: v.title || 'video thumbnail' }));
          item.appendChild(thumbImg);
        }

        const vidCon = createTag('div', { class: 'drawer-item-content' });
        if (v.title) vidCon.appendChild(createTag('div', { class: 'drawer-item-title' }, v.title));
        if (v.description) vidCon.appendChild(createTag('div', { class: 'drawer-item-description' }, v.description));
        item.appendChild(vidCon);

        return item;
      };

      this.drawer = createDrawer(this.root, {
        items: videos,
        ariaLabel: 'Videos',
        renderItem,
        onItemClick: (_, v) => this.onDrawerClick(v),
      });

      const itemsList = this.drawer?.itemsEl;
      if (itemsList?.firstChild) {
        itemsList.insertBefore(this.drawerHeading(), itemsList.firstChild);
      }
    } catch (e) {
      window.lana?.log(`Drawer load failed: ${e.message}`);
    }
  }

  async onDrawerClick(v) {
    try {
      if (this.store) {
        const live = await this.checkLive(v);
        if (!live) window.lana?.log(`This stream is not currently live: ${v.videoid}`);
      }
      
      // Save the current video state when user switches videos
      if (this.cfg.concurrentenabled) {
        saveCurrentVideo(v.videoid, this.mainID);
        this.currentVideoId = v.videoid;
      }
      
      this.injectPlayer(v.videoid, this.cfg.skinid, v.aslid);
      
      // Update drawer active state
      if (this.drawer) {
        this.drawer.setActiveById(v.videoid);
      }
    } catch (e) {
      window.lana?.log(`Drawer item click error: ${e.message}`);
    }
  }

  static async getMediaStatus(id) {
    try {
      const env = getConfig().env || 'prod';
      const isLowerEnv = env !== 'prod';
      const baseUrl = isLowerEnv ? CONFIG.API.DEV_URL : CONFIG.API.PROD_URL;
      const res = await fetch(`${baseUrl}/api/media-status?ids=${id}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to get media status');
      }
      return res.json();
    } catch (e) {
      window.lana?.log(`getMediaStatus error: ${e.message}`);
      throw e;
    }
  }

  async checkLive(v) {
    if (!v?.videoid) return false;
    try {
      // Use mainID if available, otherwise use the provided video ID
      const videoIDToCheck = this.mainID || v.videoid;

      const { active } = await MobileRider.getMediaStatus(videoIDToCheck);
      const isActive = active.includes(videoIDToCheck);

      // Only update store if status has actually changed
      this.setStatus(v.videoid, isActive);
      return isActive;
    } catch (e) {
      window.lana?.log?.(`checkLive failed: ${e.message}`);
      return false;
    }
  }

  setStatus(id, live) {
    if (!id || !this.store) return;

    try {
      let storeKey = null;

      if (this.mainID && this.store.get(this.mainID) !== undefined) {
        storeKey = this.mainID;
      } else if (this.store.get(id) !== undefined) {
        storeKey = id;
      }

      if (!storeKey) return;

      const currentStatus = this.store.get(storeKey);
      if (currentStatus !== live) {
        this.store.set(storeKey, live);
        window.lana?.log?.(`Status updated for ${storeKey}: ${live}`);
      }
    } catch (e) {
      window.lana?.log?.(`setStatus error for ${this.mainID || id}: ${e.message}`);
    }
  }

  initASL() {
    const con = this.wrap?.querySelector('.mobile-rider-container');
    if (!con) return;

    let attempts = 0;
    const check = () => {
      const btn = con.querySelector(`#${CONFIG.ASL.BUTTON_ID}`);
      if (btn) {
        this.setupASL(btn, con);
        return;
      }
      attempts += 1;
      if (attempts < CONFIG.ASL.MAX_CHECKS) setTimeout(check, CONFIG.ASL.CHECK_INTERVAL);
    };
    check();
  }

  setupASL(btn, con) {
    btn.addEventListener('click', () => {
      if (!con.classList.contains(CONFIG.ASL.TOGGLE_CLASS)) {
        con.classList.add(CONFIG.ASL.TOGGLE_CLASS);
        this.initASL();
      }
    });
  }

  createDOM() {
    let root = this.el.querySelector('.mobile-rider-player');
    if (!root) {
      root = createTag('div', { class: 'mobile-rider-player' });
      this.el.appendChild(root);
    }

    let wrap = root.querySelector('.video-wrapper');
    if (!wrap) {
      wrap = createTag('div', { class: 'video-wrapper' });
      root.appendChild(wrap);
    }

    return { container: root, wrapper: wrap };
  }

  parseCfg() {
    const meta = Object.fromEntries(
      [...this.el.querySelectorAll(':scope > div > div:first-child')].map((div) => [
        div.textContent.trim().toLowerCase().replace(/ /g, '-'),
        div.nextElementSibling?.textContent?.trim() || '',
      ]),
    );

    if (meta.concurrentenabled === 'true') {
      meta.concurrentenabled = true;
      meta.concurrentVideos = MobileRider.parseConcurrent(meta);
    }

    return meta;
  }

  static parseConcurrent(meta) {
    const keys = Object.keys(meta)
      .filter((k) => k.startsWith('concurrentvideoid'))
      .map((k) => k.replace('concurrentvideoid', ''));

    const uniq = [...new Set(keys)].sort((a, b) => Number(a) - Number(b));

    return uniq.map((i) => ({
      videoid: meta[`concurrentvideoid${i}`] || '',
      aslid: meta[`concurrentaslid${i}`] || '',
      title: meta[`concurrenttitle${i}`] || '',
      description: meta[`concurrentdescription${i}`] || '',
      thumbnail: meta[`concurrentthumbnail${i}`] || '',
    }));
  }
}

export default function init(el) {
  try {
    return new MobileRider(el);
  } catch (e) {
    window.lana?.log(`Mobile Rider init failed: ${e.message}`);
    return null;
  }
}
