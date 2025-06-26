import { createTag } from '../../scripts/utils.js';

const CONFIG = {
  TITLE: 'Related Videos',
  CLASSES: {
    CONTAINER: 'mobile-rider-drawer',
    CONTENT: 'drawer-content',
    ITEMS: 'drawer-items',
    ITEM: 'drawer-item',
    THUMB: 'drawer-item-thumbnail',
    TEXT: 'drawer-item-content',
    TITLE: 'drawer-item-title',
    DESC: 'drawer-item-description',
    CURRENT: 'current',
  },
  ATTR: {
    ROLE: 'button',
    TABINDEX: '0',
  },
  STYLE: 'width: 100%; box-sizing: border-box;',
};

class Drawer {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.videos = config.videos || [];

    if (config.drawerenabled === false) return;
    this.render();
  }

  render() {
    const drawer = createTag('div', {
      class: this.getDrawerClass(),
      'aria-label': this.config.drawertitle || CONFIG.TITLE,
      style: CONFIG.STYLE,
    });

    const content = createTag('div', { class: CONFIG.CLASSES.CONTENT });
    this.itemsList = createTag('div', { class: CONFIG.CLASSES.ITEMS });

    this.appendNowPlayingHeader();
    this.videos.forEach((video, i) => {
      const item = this.createItem(video);
      if (i === 0) item.classList.add(CONFIG.CLASSES.CURRENT);
      this.itemsList.appendChild(item);
    });

    content.appendChild(this.itemsList);
    drawer.appendChild(content);
    this.insertIntoDOM(drawer);
  }

  getDrawerClass() {
    const classes = [CONFIG.CLASSES.CONTAINER];
    if (this.config.drawerposition) classes.push(this.config.drawerposition);
    return classes.join(' ');
  }

  appendNowPlayingHeader() {
    const header = document.createElement('div');
    header.className = 'relatedContent-NowPlaying';
    header.innerHTML = `
      <p class="relatedContent-NowPlaying-Text">Now Playing</p>
      <span class="relatedContent-NowPlaying-sideText">Select a live session</span>
    `;
    this.itemsList.appendChild(header);
  }

  createItem(video) {
    const item = createTag('div', {
      class: CONFIG.CLASSES.ITEM,
      role: CONFIG.ATTR.ROLE,
      tabindex: CONFIG.ATTR.TABINDEX,
      'data-videoid': video.videoid,
    });

    if (video.thumbnail) {
      const thumb = createTag('div', { class: CONFIG.CLASSES.THUMB });
      thumb.appendChild(createTag('img', {
        src: video.thumbnail,
        alt: video.title || 'video thumbnail',
      }));
      item.appendChild(thumb);
    }

    const content = createTag('div', { class: CONFIG.CLASSES.TEXT });
    if (video.title) {
      content.appendChild(createTag('div', { class: CONFIG.CLASSES.TITLE }, video.title));
    }
    if (video.description) {
      content.appendChild(createTag('div', { class: CONFIG.CLASSES.DESC }, video.description));
    }
    item.appendChild(content);

    const handler = () => this.handleClick(item, video);
    item.addEventListener('click', handler);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });

    return item;
  }

  async handleClick(item, video) {
    this.setActiveItem(item);

    if (!window.injectPlayer) {
      console.warn('injectPlayer not found');
      return;
    }

    try {
      const { default: Controller } = await import('../../features/timing-framework/plugins/mobile-rider/mobile-rider-controller.js');
      const ctrl = new Controller();
      const { active = [] } = await ctrl.getMediaStatus([video.videoid]);

      if (active.includes(video.videoid)) {
        window.injectPlayer(video.videoid, this.config.skinid, video.aslid, video.sessionid);
        if (video.sessionid && window.mobileRiderStore) {
          window.mobileRiderStore.set(video.sessionid, true);
        }
      } else {
        if (video.sessionid && window.mobileRiderStore) {
          window.mobileRiderStore.set(video.sessionid, false);
        }
        alert('This stream is not currently live.');
      }
    } catch (e) {
      console.error('Failed to validate video status', e);
    }
  }

  setActiveItem(activeItem) {
    Array.from(this.itemsList.children).forEach((item) => {
      item.classList.remove(CONFIG.CLASSES.CURRENT);
    });
    activeItem.classList.add(CONFIG.CLASSES.CURRENT);
  }

  insertIntoDOM(drawer) {
    const pos = this.config.drawerposition || 'bottom';
    if (pos === 'top') {
      this.container.prepend(drawer);
    } else {
      this.container.appendChild(drawer);
    }
  }
}

export default function initDrawer(container, config) {
  if (!container || !config) return null;
  const drawer = new Drawer(container, config);
  return drawer.itemsList;
}
