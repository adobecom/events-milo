import { createTag } from '../../scripts/utils.js';

class Drawer {
  constructor(container, config = {}) {
    if (!container) throw new Error('Drawer requires a container element.');

    this.container = container;
    this.config = { showheader: true, ...config };
    this.videos = this.config.videos || [];
    this.itemsList = null;
    this.onVideoClick = this.config.onVideoClick || this.defaultVideoClickHandler;

    this.render();
  }

  render() {
    const drawer = this.createDrawer();
    this.container.append(drawer);
  }

  createDrawer() {
    const drawer = createTag('div', {
      class: 'mobile-rider-drawer',
      'aria-label': this.config.drawertitle || 'Videos',
      style: 'width: 100%; box-sizing: border-box;',
    });

    const content = createTag('div', { class: 'drawer-content' });
    this.itemsList = createTag('div', { class: 'drawer-items' });

    if (this.config.showheader) this.itemsList.appendChild(this.createHeader());
    this.videos.forEach((video, index) => {
      const item = this.createVideoItem(video);
      if (index === 0) item.classList.add('current');
      this.itemsList.appendChild(item);
    });

    content.appendChild(this.itemsList);
    drawer.appendChild(content);
    return drawer;
  }

  createHeader() {
    const header = createTag('div', { class: 'relatedContent-NowPlaying' });
    header.innerHTML = `
      <p class="relatedContent-NowPlaying-Text">Now Playing</p>
      <span class="relatedContent-NowPlaying-sideText">Select a live session</span>
    `;
    return header;
  }

  createVideoItem(video) {
    const item = createTag('div', {
      class: 'drawer-item',
      role: 'button',
      tabindex: '0',
      'data-videoid': video.videoid,
    });

    if (video.thumbnail) {
      const thumbnail = createTag('div', { class: 'drawer-item-thumbnail' });
      thumbnail.appendChild(createTag('img', {
        src: video.thumbnail,
        alt: video.title || 'video thumbnail',
      }));
      item.appendChild(thumbnail);
    }

    const content = createTag('div', { class: 'drawer-item-content' });
    if (video.title) content.appendChild(createTag('div', { class: 'drawer-item-title' }, video.title));
    if (video.description) content.appendChild(createTag('div', { class: 'drawer-item-description' }, video.description));
    item.appendChild(content);

    this.addItemEventListeners(item, video);
    return item;
  }

  addItemEventListeners(item, video) {
    const handler = () => this.handleVideoClick(item, video);
    item.addEventListener('click', handler);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  }

  async handleVideoClick(item, video) {
    this.setActiveItem(item);
    try {
      await this.onVideoClick(item, video);
    } catch (err) {
      console.error('Video click handler failed:', err);
    }
  }

  setActiveItem(target) {
    this.itemsList.querySelectorAll('.drawer-item.current')
      .forEach(el => el.classList.remove('current'));
    target.classList.add('current');
  }

  setActiveVideo(videoId) {
    const target = this.itemsList?.querySelector(`[data-videoid="${videoId}"]`);
    if (target) this.setActiveItem(target);
  }

  defaultVideoClickHandler() {
    console.warn('No onVideoClick handler provided.');
  }
}

export default function initDrawer(container, config) {
  try {
    return new Drawer(container, config);
  } catch (err) {
    console.error('Drawer initialization failed:', err);
    return null;
  }
}
