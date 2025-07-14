import { LIBS } from '../../scripts/utils.js';
import { mobileRiderStore } from '../../features/timing-framework/plugins/mobile-rider/plugin.js';

const { createTag, getConfig } = await import(`${LIBS}/utils/utils.js`);

const CONFIG = {
  ANALYTICS: { PROVIDER: 'adobe' },
  SCRIPTS: {
    dev: '//assets.mobilerider.com/p/player-adobe-dev/player.min.js',
    prod: '//assets.mobilerider.com/p/adobe/player.min.js',
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
    BASE_URL: 'https://overlay-admin-dev.mobilerider.com',
  },
};

let scriptPromise = null;

async function loadScript() {
  if (window.mobilerider) return;
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise(async (res) => {
    const env = (await getConfig()).env || 'prod';
    const isProd = env === 'prod';
    const src = isProd ? CONFIG.SCRIPTS.prod : CONFIG.SCRIPTS.dev;
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
    this.init();
  }

  async init() {
    try {
      await loadScript();
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

      await this.loadPlayer(videoid, aslid);
      if (isConcurrent) await this.initDrawer(videos);
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

    let con = this.wrap.querySelector('.mobileRider_container');
    if (!con) {
      con = createTag('div', {
        class: 'mobileRider_container is-hidden',
        id: CONFIG.PLAYER.CONTAINER_ID,
        'data-videoid': vid,
        'data-skinid': skin,
        'data-aslid': asl,
      });
      this.wrap.appendChild(con);
    } else {
      Object.assign(con.dataset, { videoid: vid, skinid: skin, aslid: asl });
    }

    window.__mr_player?.dispose();
    con.querySelector(`#${CONFIG.PLAYER.VIDEO_ID}`)?.remove();

    const video = createTag('video', {
      id: CONFIG.PLAYER.VIDEO_ID,
      class: CONFIG.PLAYER.VIDEO_CLASS,
      controls: true,
    });
    con.appendChild(video);

    if (!video || !window.mobilerider) return;

    window.mobilerider.embed(video.id, vid, skin, {
      ...this.getPlayerOptions(),
      analytics: { provider: CONFIG.ANALYTICS.PROVIDER },
      identifier1: vid,
      identifier2: asl,
      sessionId: vid,
    });

    if (asl) this.initASL();
    if (mobileRiderStore.get(vid)) this.onStreamEnd(vid);

    con.classList.remove('is-hidden');
  }

  onStreamEnd(vid) {
    window.__mr_player?.off('streamend');
    window.__mr_player?.on('streamend', () => {
      this.setStatus(vid, false);
      this.dispose();
    });
  }

  dispose() {
    window.__mr_player?.dispose();
    window.__mr_player = null;
    window.__mr_stream_published = null;
  }

  drawerHeading() {
    const header = createTag('div', { class: 'relatedContent-NowPlaying' });
    header.innerHTML = `
      <p class="relatedContent-NowPlaying-Text">Now Playing</p>
      <span class="relatedContent-NowPlaying-sideText">Select a live session</span>
    `;
    return header;
  }

  async initDrawer(videos) {
    try {
      const { default: createDrawer } = await import('./mobile-rider-drawer.js');

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

      const drawer = createDrawer(this.root, {
        items: videos,
        ariaLabel: 'Videos',
        renderItem,
        onItemClick: (_, v) => this.onDrawerClick(v),
      });

      const itemsList = drawer?.itemsEl;
      if (itemsList?.firstChild) {
        itemsList.insertBefore(this.drawerHeading(), itemsList.firstChild);
      }
    } catch (e) {
      window.lana?.log(`Drawer load failed: ${e.message}`);
    }
  }

  async onDrawerClick(v) {
    try {
      const live = await this.checkLive(v);
      if (!live) return window.lana?.log(`This stream is not currently live: ${v.videoid}`);
      this.injectPlayer(v.videoid, this.cfg.skinid, v.aslid);
    } catch (e) {
      window.lana?.log(`Drawer item click error: ${e.message}`);
    }
  }

  async getMediaStatus(id) {
    try {
      const res = await fetch(`${CONFIG.API.BASE_URL}/api/media-status?ids=${id}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to get media status');
      }
      return await res.json();
    } catch (e) {
      window.lana?.log(`getMediaStatus error: ${e.message}`);
      throw e;
    }
  }

  async checkLive(v) {
    if (!v?.videoid) return false;
    try {
      const { active } = await this.getMediaStatus(v.videoid);
      const isActive = active.includes(v.videoid);
      this.setStatus(v.videoid, isActive);
      return isActive;
    } catch (e) {
      window.lana?.log?.(`checkLive failed: ${e.message}`);
      return false;
    }
  }

  setStatus(id, live) {
    if (id) mobileRiderStore.set(id, live);
  }

  initASL() {
    const con = this.wrap?.querySelector('.mobileRider_container');
    if (!con) return;

    let attempts = 0;
    const check = () => {
      const btn = con.querySelector(`#${CONFIG.ASL.BUTTON_ID}`);
      if (btn) return this.setupASL(btn, con);
      if (++attempts < CONFIG.ASL.MAX_CHECKS) setTimeout(check, CONFIG.ASL.CHECK_INTERVAL);
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
      [...this.el.querySelectorAll(':scope > div > div:first-child')].map(div => [
        div.textContent.trim().toLowerCase().replace(/ /g, '-'),
        div.nextElementSibling?.textContent?.trim() || ''
      ])
    );

    if (meta.concurrentenabled === 'true') {
      meta.concurrentenabled = true;
      meta.concurrentVideos = this.parseConcurrent(meta);
    }

    return meta;
  }

  parseConcurrent(meta) {
    const keys = Object.keys(meta)
      .filter(k => k.startsWith('concurrentvideoid'))
      .map(k => k.replace('concurrentvideoid', ''));

    const uniq = [...new Set(keys)].sort((a, b) => Number(a) - Number(b));

    return uniq.map(i => ({
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
    new MobileRider(el);
  } catch (e) {
    window.lana?.log(`Mobile Rider init failed: ${e.message}`);
  }
}
