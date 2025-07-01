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

let scriptPromise = null;

async function loadScript() {
  if (window.mobilerider) return;
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise(async (res) => {
    const env = (await getConfig()).env || 'prod';
    const s = createTag('script', { src: CONFIG.SCRIPTS[env] });
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
    this.ctrl = new MobileRiderController();
    this.init();
  }

  async init() {
    try {
      await loadScript();
      this.cfg = this.parseCfg();
      const { container, wrapper } = this.createDOM();
      this.root = container;
      this.wrap = wrapper;

      if (this.cfg.concurrentenabled) {
        const vid = this.cfg.concurrentVideos?.[0];
        if (vid?.videoid) {
          await this.loadPlayer(vid.videoid, vid.aslid, vid.sessionid);
          this.addDrawerHeader();
          this.initDrawer(this.cfg.concurrentVideos);
          await this.updateStatus(this.cfg.concurrentVideos);
        } else console.log('Missing video config.');
      } else {
        if (this.cfg.videoid) {
          await this.loadPlayer(this.cfg.videoid, this.cfg.aslid, this.cfg.sessionid);
        } else console.log('Missing videoid in config.');
      }
    } catch (e) {
      console.error('Init error:', e);
    }
  }

  async loadPlayer(vid, asl, sid) {
    try {
      this.injectPlayer(vid, this.cfg.skinid, asl, sid);
    } catch (e) {
      console.error('Player error', e);
    }
  }

  injectPlayer(vid, skin, asl = null, sid = null) {
    if (!this.wrap) return;
    let con = this.wrap.querySelector('.mobileRider_container');
    if (!con) {
      con = createTag('div', {
        class: 'mobileRider_container is-hidden',
        id: CONFIG.PLAYER.CONTAINER_ID,
        'data-videoid': vid,
        'data-skinid': skin,
        'data-aslid': asl,
        'data-sessionid': sid,
      });
      this.wrap.appendChild(con);
    } else {
      Object.assign(con.dataset, { videoid: vid, skinid: skin, aslid: asl, sessionid: sid });
    }

    window.__mr_player?.dispose();
    con.querySelector(`#${CONFIG.PLAYER.VIDEO_ID}`)?.remove();
    const video = createTag('video', { id: CONFIG.PLAYER.VIDEO_ID, class: CONFIG.PLAYER.VIDEO_CLASS, controls: true });
    con.appendChild(v);

    if (!video || !window.mobilerider) return;

    window.mobilerider.embed(video.id, vid, skin, {
      ...CONFIG.PLAYER.DEFAULT_OPTIONS,
      analytics: { provider: CONFIG.ANALYTICS.PROVIDER },
      identifier1: vid,
      identifier2: asl,
      sessionId: sid,
    });

    if (asl) this.initASL();
    if (sid) this.onStreamEnd(sid);
    con.classList.remove('is-hidden');
  }

  onStreamEnd(sid) {
    window.__mr_player?.off('streamend');
    window.__mr_player?.on('streamend', () => {
      this.dispose();
      window.updateMobileRiderSession?.(sid, false);
    });
  }

  dispose() {
    window.__mr_player?.dispose();
    window.__mr_player = null;
    window.__mr_stream_published = null;
  }

  addDrawerHeader() {
    if (this.root.querySelector('.relatedContent-NowPlaying')) return;
    const header = createTag('div', { class: 'relatedContent-NowPlaying' });
    header.innerHTML = `
      <p class="relatedContent-NowPlaying-Text">Now Playing</p>
      <span class="relatedContent-NowPlaying-sideText">Select a live session</span>
    `;
    this.root.prepend(header);
  }

  async initDrawer(list) {
    if (!list?.length) return;
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

      createDrawer(this.root, {
        items: list,
        ariaLabel: 'Videos',
        renderItem,
        onItemClick: (_, v) => this.onDrawerClick(v),
      });
    } catch (e) {
      console.error('Drawer load failed:', e);
    }
  }

  async onDrawerClick(v) {
    try {
      const live = await this.checkLive(v);
      if (!live) return console.log('This stream is not currently live.');
      this.injectPlayer(v.videoid, this.cfg.skinid, v.aslid, v.sessionid);
    } catch (e) {
      console.error('Drawer click error:', e);
    }
  }

  async checkLive(v) {
    if (!v?.videoid || !v?.sessionid) return false;
    const { active = [] } = await this.ctrl.getMediaStatus([v.videoid]);
    const live = active.includes(v.videoid);
    this.setStatus(v.sessionid, live);
    return live;
  }

  setStatus(sid, live) {
    if (sid && window.mobileRiderStore) window.mobileRiderStore.set(sid, live);
  }

  async updateStatus(videos = []) {
    if (!Array.isArray(videos) || !videos.length) return;
    const valid = videos.filter(v => v?.videoid && v?.sessionid);
    if (!valid.length) return;
    const ids = valid.map(v => v.videoid);
    try {
      const { active = [] } = await this.ctrl.getMediaStatus(ids);
      valid.forEach(v => {
        const live = active.includes(v.videoid);
        this.setStatus(v.sessionid, live);
      });
    } catch (e) {
      window.lana?.log?.(`Live check failed: ${e.message}`);
    }
  }

  initASL() {
    const c = this.wrap?.querySelector('.mobileRider_container');
    if (!c) return;
    let tries = 0;
    const max = CONFIG.ASL.MAX_CHECKS;
    const int = CONFIG.ASL.CHECK_INTERVAL;
    const id = CONFIG.ASL.BUTTON_ID;
    const poll = () => {
      const b = c.querySelector(`#${id}`);
      if (b) return this.setupASL(b, c);
      if (++tries < max) setTimeout(poll, int);
    };
    poll();
  }

  setupASL(btn, c) {
    btn.addEventListener('click', () => {
      if (!c.classList.contains(CONFIG.ASL.TOGGLE_CLASS)) {
        c.classList.add(CONFIG.ASL.TOGGLE_CLASS);
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

    if (meta.concurrentenabled === 'true') meta.concurrentVideos = this.parseConcurrent(meta);
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
      sessionid: meta[`concurrentsessionid${i}`] || '',
    }));
  }
}

export default function init(el) {
  try {
    new MobileRider(el);
  } catch (e) {
    console.error('Mobile Rider init failed', e);
  }
}
