import { createTag } from '../../scripts/utils.js';
import { mobileRiderStore } from '../../features/timing-framework/plugins/mobile-rider/plugin.js';

// Constants
const CONFIG = {
  DRAWER: {
    DEFAULT_POSITION: 'bottom',
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
  PLAYER: {
    ANALYTICS_PROVIDER: 'adobe',
  },
};

/**
 * Creates a toggle button for the drawer
 * @param {HTMLElement} container - Container element
 * @param {Object} config - Configuration object
 * @returns {HTMLElement|null} Toggle button element or null
 */
function createDrawerToggle(container, config) {
  const drawertitle = config.drawertitle || CONFIG.DRAWER.DEFAULT_TITLE;
  if (!drawertitle) return null;

  const button = createTag('button', {
    class: 'drawer-toggle',
    'aria-expanded': 'false',
    'aria-label': drawertitle,
  }, [
    createTag('span', { class: 'drawer-toggle-label' }, drawertitle),
    createTag('span', { class: 'drawer-toggle-icon' }),
  ]);

  button.onclick = () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const drawer = container.querySelector(`.${CONFIG.DRAWER.CLASSES.CONTAINER}`);
    if (drawer) {
      drawer.classList.toggle('drawer-open');
      button.setAttribute('aria-expanded', !isExpanded);
      button.setAttribute('aria-label', isExpanded ? drawertitle : 'Close drawer');
    }
  };

  return button;
}

/**
 * Creates a video thumbnail element
 * @param {Object} video - Video object
 * @param {Function} onClick - Click handler function
 * @returns {HTMLElement} Thumbnail element
 */
function createVideoThumbnail(video, onClick) {
  const item = createTag('div', {
    class: CONFIG.DRAWER.CLASSES.ITEM,
    role: CONFIG.DRAWER.ATTRIBUTES.ROLE,
    tabindex: CONFIG.DRAWER.ATTRIBUTES.TABINDEX,
    'data-vid': video.videoId,
    'data-asl': video.aslId,
    'data-session': video.sessionId,
  }, [
    createTag('div', { class: CONFIG.DRAWER.CLASSES.THUMBNAIL }, 
      video.thumbnail ? [createTag('img', {
        src: video.thumbnail,
        alt: video.title || '',
        loading: 'lazy',
      })] : []
    ),
    createTag('div', { class: CONFIG.DRAWER.CLASSES.CONTENT_WRAPPER }, [
      video.title && createTag('h3', { class: CONFIG.DRAWER.CLASSES.TITLE }, video.title),
      video.description && createTag('p', { class: CONFIG.DRAWER.CLASSES.DESCRIPTION }, video.description),
    ].filter(Boolean)),
  ]);

  if (onClick) {
    item.onclick = () => onClick(video, item);
    item.onkeydown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick(video, item);
      }
    };
  }

  return item;
}

/**
 * Finds the video wrapper element
 * @param {HTMLElement} container - Container element
 * @returns {HTMLElement|null} Video wrapper element
 */
function findVideoWrapper(container) {
  let wrapper = container.querySelector('.video-wrapper');
  if (!wrapper) {
    // Try previous or next sibling
    if (container.previousElementSibling && container.previousElementSibling.classList.contains('video-wrapper')) {
      wrapper = container.previousElementSibling;
    } else if (container.nextElementSibling && container.nextElementSibling.classList.contains('video-wrapper')) {
      wrapper = container.nextElementSibling;
    }
  }
  return wrapper;
}

/**
 * Handles video item click
 * @param {Object} video - Video object
 * @param {HTMLElement} item - Clicked item element
 * @param {HTMLElement} container - Container element
 * @param {Object} config - Configuration object
 * @param {HTMLElement} itemsList - Items list element
 */
function handleVideoItemClick(video, item, container, config, itemsList) {
  const wrapper = findVideoWrapper(container);
  if (!wrapper) {
    console.warn('Drawer: Could not find .video-wrapper sibling for player injection');
    return;
  }

  if (window.injectPlayer) {
    window.injectPlayer(
      wrapper,
      video.videoid,
      config.skinid,
      video.aslid,
      null,
      CONFIG.PLAYER.ANALYTICS_PROVIDER,
    );
  }

  // Update current item styling
  itemsList.querySelectorAll(`.${CONFIG.DRAWER.CLASSES.ITEM}`).forEach(i => i.classList.remove(CONFIG.DRAWER.CLASSES.CURRENT));
  item.classList.add(CONFIG.DRAWER.CLASSES.CURRENT);
}

/**
 * Creates a drawer item element
 * @param {Object} video - Video object
 * @param {HTMLElement} container - Container element
 * @param {Object} config - Configuration object
 * @param {HTMLElement} itemsList - Items list element
 * @returns {HTMLElement} Drawer item element
 */
function createDrawerItem(video, container, config, itemsList) {
  const item = createTag('div', {
    class: CONFIG.DRAWER.CLASSES.ITEM,
    role: CONFIG.DRAWER.ATTRIBUTES.ROLE,
    tabindex: CONFIG.DRAWER.ATTRIBUTES.TABINDEX,
    'data-vid': video.videoid,
    'data-asl': video.aslid,
  });

  // Create thumbnail
  const thumbnail = createTag('div', { class: CONFIG.DRAWER.CLASSES.THUMBNAIL });
  if (video.thumbnail) {
    thumbnail.appendChild(createTag('img', {
      src: video.thumbnail,
      alt: video.title,
    }));
  }
  item.appendChild(thumbnail);

  // Create content
  const contentDiv = createTag('div', { class: CONFIG.DRAWER.CLASSES.CONTENT_WRAPPER });
  contentDiv.appendChild(createTag('div', { class: CONFIG.DRAWER.CLASSES.TITLE }, video.title));
  if (video.description) {
    contentDiv.appendChild(createTag('div', { class: CONFIG.DRAWER.CLASSES.DESCRIPTION }, video.description));
  }
  item.appendChild(contentDiv);

  // Add click handler
  item.onclick = () => handleVideoItemClick(video, item, container, config, itemsList);

  return item;
}

/**
 * Creates the drawer structure
 * @param {Object} config - Configuration object
 * @returns {Object} Drawer elements
 */
function createDrawerStructure(config) {
  const drawerposition = config.drawerposition || CONFIG.DRAWER.DEFAULT_POSITION;
  const drawertitle = config.drawertitle || CONFIG.DRAWER.DEFAULT_TITLE;
  
  const drawer = createTag('div', {
    class: `${CONFIG.DRAWER.CLASSES.CONTAINER} ${drawerposition}`,
    'aria-label': drawertitle,
    style: CONFIG.DRAWER.STYLES.CONTAINER,
  });

  const content = createTag('div', { class: CONFIG.DRAWER.CLASSES.CONTENT });
  const itemsList = createTag('div', { class: CONFIG.DRAWER.CLASSES.ITEMS });

  return { drawer, content, itemsList };
}

/**
 * Inserts the drawer into the DOM
 * @param {HTMLElement} drawer - Drawer element
 * @param {HTMLElement} container - Container element
 */
function insertDrawerIntoDOM(drawer, container) {
  const wrapper = container.querySelector('.video-wrapper');
  if (wrapper) {
    wrapper.insertAdjacentElement('afterend', drawer);
  } else {
    container.appendChild(drawer);
  }
}

/**
 * Initializes the MobileRider drawer
 * @param {HTMLElement} container - Container element
 * @param {Object} config - Configuration object
 * @returns {HTMLElement|null} Drawer element or null
 */
export default function initDrawer(container, config) {
  const drawerenabled = config.drawerenabled !== false; // Default to true if not specified
  if (!drawerenabled) return null;

  const { drawer, content, itemsList } = createDrawerStructure(config);

  // Create drawer items for each video
  (config.videos || []).forEach((video) => {
    const item = createDrawerItem(video, container, config, itemsList);
    itemsList.appendChild(item);
  });

  content.appendChild(itemsList);
  drawer.appendChild(content);

  insertDrawerIntoDOM(drawer, container);

  return drawer;
}

/**
 * Legacy injectPlayer function (kept for backward compatibility)
 * @param {HTMLElement} wrapper - Video wrapper element
 * @param {string} videoId - Video ID
 * @param {string} skinId - Skin ID
 * @param {string} aslId - ASL video ID (optional)
 * @returns {Object} MobileRider player instance
 */
function injectPlayer(wrapper, videoId, skinId, aslId = null) {
  // Remove any existing player (iframe or video)
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }

  // Create a new div for the player
  const playerDiv = document.createElement('div');
  playerDiv.id = 'mr-adobe-player';
  wrapper.appendChild(playerDiv);

  // Dispose of existing player if it exists
  if (window.__mr_player) {
    window.__mr_player.dispose();
    window.__mr_player = null;
  }

  // Initialize new player
  window.__mr_player = window.mobilerider.embed(
    playerDiv.id,
    videoId,
    skinId,
    {
      autoplay: true,
      controls: true,
      muted: false,
      analytics: { provider: CONFIG.PLAYER.ANALYTICS_PROVIDER },
      identifier1: videoId,
      identifier2: aslId,
    }
  );

  return window.__mr_player;
}
