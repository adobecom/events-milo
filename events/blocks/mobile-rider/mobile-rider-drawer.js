import { createTag } from '../../scripts/utils.js';

const CONFIG = {
  DRAWER: {
    DEFAULT_TITLE: 'Related Videos',
    CLASSES: {
      CONTAINER: 'mobile-rider-drawer',
      CONTENT: 'drawer-content',
      ITEMS: 'drawer-items',
      ITEM: 'drawer-item',
      THUMBNAIL: 'drawer-item-thumbnail',
      CONTENT_WRAPPER: 'drawer-item-content',
      TITLE: 'drawer-item-title',
      DESCRIPTION: 'drawer-item-description',
      CURRENT: 'current',
    },
    ATTRIBUTES: {
      ROLE: 'button',
      TABINDEX: '0',
    },
    STYLES: {
      CONTAINER: 'width: 100%; box-sizing: border-box;',
    },
  },
};

class MobileRiderDrawer {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.drawerElement = null;

    const drawerenabled = this.config.drawerenabled !== false;
    if (!drawerenabled) return;

    this.#init();
  }

  #init() {
    this.#createDrawerStructure();
    this.#populateDrawer();
    this.#insertDrawerIntoDOM();
  }

  #createDrawerStructure() {
    const { drawerposition, drawertitle: configTitle } = this.config;
    const drawertitle = configTitle || CONFIG.DRAWER.DEFAULT_TITLE;

    const drawerClasses = [CONFIG.DRAWER.CLASSES.CONTAINER];
    if (drawerposition) {
      drawerClasses.push(drawerposition);
    }

    const drawer = createTag('div', {
      class: drawerClasses.join(' '),
      'aria-label': drawertitle,
      style: CONFIG.DRAWER.STYLES.CONTAINER,
    });

    const content = createTag('div', { class: CONFIG.DRAWER.CLASSES.CONTENT });
    const itemsList = createTag('div', { class: CONFIG.DRAWER.CLASSES.ITEMS });

    content.appendChild(itemsList);
    drawer.appendChild(content);

    this.drawerElement = drawer;
  }

  #populateDrawer() {
    const itemsList = this.drawerElement.querySelector(`.${CONFIG.DRAWER.CLASSES.ITEMS}`);
    if (!itemsList) return;

    (this.config.videos || []).forEach((video, index) => {
      const item = this.#createDrawerItem(video, itemsList);
      if (index === 0) {
        item.classList.add(CONFIG.DRAWER.CLASSES.CURRENT);
      }
      itemsList.appendChild(item);
    });
  }

  #createDrawerItem(video, itemsList) {
    const {
      videoid, title, description, thumbnail,
    } = video;
    const item = createTag('div', {
      class: CONFIG.DRAWER.CLASSES.ITEM,
      role: CONFIG.DRAWER.ATTRIBUTES.ROLE,
      tabindex: CONFIG.DRAWER.ATTRIBUTES.TABINDEX,
      'data-videoid': videoid,
    });

    if (thumbnail) {
      const thumbnailWrapper = createTag('div', { class: CONFIG.DRAWER.CLASSES.THUMBNAIL });
      thumbnailWrapper.appendChild(createTag('img', { src: thumbnail, alt: title || 'video thumbnail' }));
      item.appendChild(thumbnailWrapper);
    }

    const contentWrapper = createTag('div', { class: CONFIG.DRAWER.CLASSES.CONTENT_WRAPPER });
    if (title) {
      contentWrapper.appendChild(createTag('div', { class: CONFIG.DRAWER.CLASSES.TITLE }, title));
    }
    if (description) {
      contentWrapper.appendChild(createTag('div', { class: CONFIG.DRAWER.CLASSES.DESCRIPTION }, description));
    }
    item.appendChild(contentWrapper);

    const clickHandler = () => this.#handleItemClick(item, video, itemsList);
    item.addEventListener('click', clickHandler);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clickHandler();
      }
    });

    return item;
  }

  #handleItemClick(clickedItem, video, itemsList) {
    this.#updateDrawerSelection(clickedItem, itemsList);
    if (window.injectPlayer) {
      const wrapper = this.container.querySelector('.video-wrapper');
      window.injectPlayer(
        wrapper,
        video.videoid,
        this.config.skinid,
        video.aslid,
        video.sessionid,
      );
    } else {
      console.warn('window.injectPlayer is not available to the drawer.');
    }
  }

  #updateDrawerSelection(selectedItem, itemsList) {
    Array.from(itemsList.children).forEach((child) => {
      child.classList.remove(CONFIG.DRAWER.CLASSES.CURRENT);
    });
    selectedItem.classList.add(CONFIG.DRAWER.CLASSES.CURRENT);
  }

  #insertDrawerIntoDOM() {
    const drawerposition = this.config.drawerposition || 'bottom';
    if (drawerposition === 'top') {
      this.container.prepend(this.drawerElement);
    } else {
      this.container.appendChild(this.drawerElement);
    }
  }
}

export default function initDrawer(container, config) {
  if (!container || !config) return null;
  const drawer = new MobileRiderDrawer(container, config);
  return drawer.drawerElement;
}
