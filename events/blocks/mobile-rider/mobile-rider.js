import { LIBS } from '../../scripts/utils.js';
import { mobileRiderStore } from '../../features/timing-framework/plugins/mobile-rider/plugin.js';

const { createTag, getConfig } = await import(`${LIBS}/utils/utils.js`);
import initDrawer from './mobile-rider-drawer.js';

// Constants
const CONFIG = {
  ANALYTICS: {
    PROVIDER: 'adobe',
  },
  SCRIPTS: {
    dev: '//assets.mobilerider.com/p/player-adobe-dev/player.min.js',
    prod: '//assets.mobilerider.com/p/adobe/player.min.js',
  },
  PLAYER: {
    DEFAULT_OPTIONS: {
      autoplay: true,
      controls: true,
      muted: false,
    },
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

/**
 * Sanitizes text for use as CSS class names
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeTextForClass(text) {
  return text.trim().toLowerCase().replace(/ /g, '-');
}

/**
 * Extracts metadata from DOM element
 * @param {HTMLElement} element - DOM element containing metadata
 * @returns {Object} Parsed metadata object
 */
function extractMetadata(element) {
  const keyDivs = element.querySelectorAll(':scope > div > div:first-child');
  const metadata = {};
  
  keyDivs.forEach((div) => {
    const valueDivText = div.nextElementSibling.textContent;
    const keyValueText = sanitizeTextForClass(div.textContent);
    
    metadata[keyValueText] = valueDivText;
  });

  // Extract concurrent videos
  const concurrentVideos = extractConcurrentVideos(metadata);

  return {
    videoid: metadata.videoid || '',
    skinid: metadata.skinid || '',
    aslid: metadata.aslid || '',
    autoplay: metadata.autoplay === 'true',
    fluidContainer: metadata.fluidcontainer === 'true',
    renderInPage: metadata.renderinpage === 'true',
    concurrentenabled: metadata.concurrentenabled === 'true',
    concurrentVideos,
  };
}

/**
 * Extracts concurrent videos from metadata
 * @param {Object} metadata - Metadata object
 * @returns {Array} Array of concurrent video objects
 */
function extractConcurrentVideos(metadata) {
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

/**
 * Sets up stream end listener for live sessions
 * @param {HTMLElement} element - DOM element
 */
function setupStreamEndListener(element) {
  const timingDataElement = element?.closest('.dxf[data-toggle-type="timing"]');
  const valueTextForNextXF = getValuesFromDomTimingElement(timingDataElement);
  
  if (!window.__mr_player) return;

  // Remove any previous streamend listeners
  window.__mr_player.off('streamend');
  
  window.__mr_player.on('streamend', () => {
    window.__mr_player?.dispose();
    window.__mr_player = null;
    window.__mr_stream_published = null;
    if (timingDataElement && valueTextForNextXF) {
      window.timingFramework?.(timingDataElement, {}, valueTextForNextXF);
    }
  });
}

/**
 * Toggles ASL (American Sign Language) video
 * @param {HTMLElement} container - Video container
 * @param {string} toggleClass - CSS class for ASL state
 */
function toggleASL(container, toggleClass = CONFIG.ASL.TOGGLE_CLASS) {
  const video = container.querySelector('.mobile-rider-viewport');
  const isASL = container.classList.contains(toggleClass);
  const videoId = isASL ? container.dataset.videoid : container.dataset.aslid;
  
  if (!video || !window.mobilerider || !videoId) return;

  container.classList.toggle(toggleClass);
  
  window.mobilerider.embed(
    video.id,
    videoId,
    container.dataset.skinid,
    {
      ...CONFIG.PLAYER.DEFAULT_OPTIONS,
      muted: true,
      analytics: { provider: CONFIG.ANALYTICS.PROVIDER },
    }
  );

  // Update store with session status
  if (container.dataset.sessionid) {
    mobileRiderStore.set(container.dataset.sessionid, true);
  }
}

/**
 * Handles ASL button initialization with retry logic
 * @param {number} maxChecks - Maximum number of checks
 * @param {number} interval - Check interval in milliseconds
 * @param {Function} toggleHandlerCallback - Callback function
 * @param {HTMLElement} aslButton - ASL button element
 */
function handleASLInitialization(maxChecks, interval, toggleHandlerCallback, aslButton) {
  const maxCheckCount = maxChecks / interval;
  let counter = 0;

  function aslSubroutine() {
    const button = aslButton || document.querySelector(`#${CONFIG.ASL.BUTTON_ID}`);
    if (maxCheckCount === counter) return false;

    if (button) {
      const container = document.querySelector(`#${CONFIG.PLAYER.CONTAINER_ID}`);
      if (container) {
        // Removed shouldSetStreamEndListener check
      }
      return toggleHandlerCallback(button);
    }
    counter += 1;
    return setTimeout(() => aslSubroutine(), interval);
  }

  return aslSubroutine();
}

/**
 * Sets up ASL button click handler
 * @param {HTMLElement} aslButton - ASL button element
 */
function setupASLButtonHandler(aslButton) {
  aslButton.addEventListener('click', () => {
    const container = document.querySelector(`#${CONFIG.PLAYER.CONTAINER_ID}`);
    if (container) {
      toggleASL(container);
      handleASLInitialization(
        CONFIG.ASL.MAX_CHECKS * CONFIG.ASL.CHECK_INTERVAL,
        CONFIG.ASL.CHECK_INTERVAL,
        setupASLButtonHandler
      );
    }
  });
}

/**
 * Injects MobileRider player into wrapper
 * @param {HTMLElement} wrapper - Video wrapper element
 * @param {string} videoId - Video ID
 * @param {string} skinId - Skin ID
 * @param {string} aslId - ASL video ID (optional)
 * @param {string} sessionId - Session ID (optional)
 * @param {string} analyticsProvider - Analytics provider
 * @returns {Object} MobileRider player instance
 */
function injectPlayer(wrapper, videoId, skinId, aslId = null, sessionId = null, analyticsProvider = CONFIG.ANALYTICS.PROVIDER) {
  if (!wrapper) {
    console.warn('injectPlayer: wrapper is null');
    return;
  }

  // Find or create the container div
  let container = wrapper.querySelector('.mobileRider_container');
  if (!container) {
    container = createTag('div', {
      class: 'mobileRider_container',
      'data-videoid': videoId,
      'data-skinid': skinId,
      'data-aslid': aslId,
      'data-sessionid': sessionId,
      id: CONFIG.PLAYER.CONTAINER_ID,
    });
    wrapper.appendChild(container);
  } else {
    // Update data attributes
    container.dataset.videoid = videoId;
    container.dataset.skinid = skinId;
    container.dataset.aslid = aslId;
    container.dataset.sessionid = sessionId;
  }

  // Remove any existing video element
  const oldVideo = container.querySelector(`#${CONFIG.PLAYER.VIDEO_ID}`);
  if (oldVideo) {
    oldVideo.remove();
  }

  // Create and append a new video element
  const video = createTag('video', {
    id: CONFIG.PLAYER.VIDEO_ID,
    controls: true,
    class: CONFIG.PLAYER.VIDEO_CLASS,
  });
  container.appendChild(video);

  // Defensive: ensure video exists before embedding
  if (!video) {
    console.warn('injectPlayer: video element is null');
    return;
  }

  // Dispose of existing player if it exists
  if (window.__mr_player) {
    window.__mr_player.dispose();
    window.__mr_player = null;
  }

  // Initialize new player
  window.__mr_player = window.mobilerider.embed(
    video.id,
    videoId,
    skinId,
    {
      ...CONFIG.PLAYER.DEFAULT_OPTIONS,
      analytics: { provider: analyticsProvider },
      identifier1: videoId,
      identifier2: aslId,
      sessionId: sessionId,
    }
  );

  return window.__mr_player;
}

// Expose injectPlayer globally for drawer usage
window.injectPlayer = injectPlayer;

/**
 * Loads MobileRider script
 * @param {Function} callback - Callback function to execute after script loads
 */
function loadMobileRiderScript(callback) {
  if (window.mobilerider) {
    callback();
    return;
  }

  // Prevent loading multiple times
  if (window._mobileriderScriptLoading) {
    const checkInterval = setInterval(() => {
      if (window.mobilerider) {
        clearInterval(checkInterval);
        callback();
      }
    }, 50);
    return;
  }

  window._mobileriderScriptLoading = true;
  const env = getConfig().env || 'prod';
  const scriptPath = CONFIG.SCRIPTS[env] || CONFIG.SCRIPTS.prod;
  const script = document.createElement('script');
  script.src = scriptPath;
  script.onload = () => {
    callback();
  };
  document.head.appendChild(script);
}

/**
 * Creates the main player container structure
 * @param {HTMLElement} element - Root element
 * @returns {Object} Container and wrapper elements
 */
function createPlayerStructure(element) {
  // Remove/hide all authored metadata rows
  Array.from(element.children).forEach(child => {
    if (!child.classList.contains('mobile-rider')) {
      child.style.display = 'none';
    }
  });

  // Create player container
  let container = element.querySelector('.mobile-rider-player');
  if (!container) {
    container = createTag('div', { class: 'mobile-rider-player' });
    element.appendChild(container);
  }

  // Create video wrapper
  let wrapper = container.querySelector('.video-wrapper');
  if (!wrapper) {
    wrapper = createTag('div', { class: 'video-wrapper' });
    container.appendChild(wrapper);
  }

  return { container, wrapper };
}

/**
 * Main initialization function
 * @param {HTMLElement} element - Root element
 * @returns {Object} MobileRider player instance
 */
export default async function init(element) {
  const config = extractMetadata(element);
  const { container, wrapper } = createPlayerStructure(element);

  // Initialize drawer if concurrent videos are present
  let drawerElement = container.querySelector('.mobile-rider-drawer');
  if (config.concurrentVideos && config.concurrentVideos.length > 0 && !drawerElement) {
    const drawerConfig = {
      ...config,
      videos: config.concurrentVideos,
    };
    drawerElement = initDrawer(container, drawerConfig);
  }

  // Load script and initialize player
  loadMobileRiderScript(() => {
    injectPlayer(
      wrapper,
      config.videoid,
      config.skinid,
      config.aslid,
      config.sessionId,
    );
  });

  // Setup ASL button if needed
  if (config.aslid) {
    const aslButton = document.querySelector(`#${CONFIG.ASL.BUTTON_ID}`);
    if (aslButton) {
      handleASLInitialization(
        CONFIG.ASL.MAX_CHECKS * CONFIG.ASL.CHECK_INTERVAL,
        CONFIG.ASL.CHECK_INTERVAL,
        setupASLButtonHandler,
        aslButton
      );
    }
  }

  return window.__mr_player;
}
