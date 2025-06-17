import { LIBS } from '../../scripts/utils.js';
import { mobileRiderStore } from '../../features/timing-framework/plugins/mobile-rider/plugin.js';

const { createTag, getConfig } = await import(`${LIBS}/utils/utils.js`);
import initDrawer from './mobile-rider-drawer.js';

const ANALYTICS_PROVIDER = 'adobe';
const MOBILE_RIDER_SCRIPTS = {
  dev: '//assets.mobilerider.com/p/player-adobe-dev/player.min.js',
  prod: '//assets.mobilerider.com/p/adobe/player.min.js',
};

const LAYOUT_CLASSES = {
  'side-by-side': 'layout-side-by-side',
  'picture-in-picture': 'layout-pip',
  'stacked': 'layout-stacked'
};

// Default configurations
const DEFAULT_CONFIG = {
  analytics: { provider: ANALYTICS_PROVIDER },
  debug: getConfig().env === 'dev',
};

function sanitizedKeyDiv(text) {
  return text.trim().toLowerCase().replace(/ /g, '-');
}

function getMetaData(el) {
  const keyDivs = el.querySelectorAll(':scope > div > div:first-child');
  const metaData = {};
  keyDivs.forEach((div) => {
    const valueDivText = div.nextElementSibling.textContent;
    const keyValueText = sanitizedKeyDiv(div.textContent);
    
    // Handle timing data specially to parse JSON
    if (keyValueText === 'timing') {
      try {
        metaData[keyValueText] = JSON.parse(valueDivText);
      } catch (e) {
        window.lana?.log(`Failed to parse timing data: ${e}`);
        metaData[keyValueText] = null;
      }
    } else {
      metaData[keyValueText] = valueDivText;
    }
  });
  console.log('metaData', metaData);
  return metaData;
}

function defineShouldSetStreamendListener(element) {
  const parentDXF = element?.closest('.dxf[data-toggle-type="timing"]');
  if (!parentDXF) return false;

  const currentVariation = parentDXF.dataset.currentVariation;
  const timingString = parentDXF.dataset.timing;
  const parsedTimingVariations = JSON.parse(timingString);
  const currentVariationObject = parsedTimingVariations.find(
    (variationObject) => variationObject.variation === currentVariation
  );
  
  if (!currentVariationObject) return false;
  
  // Check query param avoidStreamEndFlag=true used for testing purposes
  const avoidStreamEndFlag = new URLSearchParams(window?.location?.search).get('avoidStreamEndFlag');
  if (avoidStreamEndFlag === 'true') {
    return false;
  }
  
  return currentVariationObject.mobileRiderLiveNextSession === true;
}

function setUpStreamendListener(element) {
  const getTimingDataElement = element?.closest('.dxf[data-toggle-type="timing"]');
  const valueTextForNextXF = getValuesFromDomTimingElement(getTimingDataElement);
  
  if (!window.__mr_player) return;

  // Remove any previous streamend listeners
  window.__mr_player.off('streamend');
  
  window.__mr_player.on('streamend', () => {
    window.__mr_player?.dispose();
    window.__mr_player = null;
    window.__mr_stream_published = null;
    if (getTimingDataElement && valueTextForNextXF) {
      window.timingFramework?.(getTimingDataElement, {}, valueTextForNextXF);
    }
  });
}

function toggleASL(container, toggleClass = 'isASL') {
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
      autoplay: true,
      controls: true,
      muted: true,
      analytics: { provider: ANALYTICS_PROVIDER },
    }
  );

  // Update store with session status
  if (container.dataset.sessionid) {
    mobileRiderStore.set(container.dataset.sessionid, true);
  }
}

function handleASLSubroutine(limit, interval, toggleHandlerCallback, buttonASL) {
  const maxChecks = limit / interval;
  let counter = 0;

  function aslSubroutine() {
    const aslButton = buttonASL || document.querySelector('#asl-button');
    if (maxChecks === counter) return false;

    if (aslButton) {
      const container = document.querySelector('#mr-adobe');
      if (container) {
        const shouldSetStreamendListener = defineShouldSetStreamendListener(container);
        if (shouldSetStreamendListener) {
          setUpStreamendListener(container);
        }
      }
      return toggleHandlerCallback(aslButton);
    }
    counter += 1;
    return setTimeout(() => aslSubroutine(), interval);
  }

  return aslSubroutine();
}

function toggleClassHandler(aslButton) {
  aslButton.addEventListener('click', () => {
    const container = document.querySelector('#mr-adobe');
    if (container) {
      toggleASL(container);
      handleASLSubroutine(5000, 100, toggleClassHandler);
    }
  });
}

function injectPlayer(wrapper, videoId, skinId, aslId = null) {
  // Remove any existing player (iframe or video)
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }

  // Create a new div for the player (for iframe/JS player)
  const playerDiv = createTag('div', { id: 'mr-adobe-player' });
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
      analytics: { provider: ANALYTICS_PROVIDER },
      identifier1: videoId,
      identifier2: aslId
    }
  );

  return window.__mr_player;
}

function createVideoMetadata(container, config, wrapper) {
  if (!config.concurrentenabled === 'true') return;

  const metadataWrapper = createTag('div', { class: 'concurrent-metadata' });
  
  // Add title if available
  if (config.concurrenttitle) {
    const title = createTag('h3', { class: 'concurrent-title' }, config.concurrenttitle);
    metadataWrapper.appendChild(title);
  }

  // Add description if available
  if (config.concurrentdescription) {
    const desc = createTag('p', { class: 'concurrent-description' }, config.concurrentdescription);
    metadataWrapper.appendChild(desc);
  }

  // Create metadata items
  const metadataList = createTag('div', { class: 'concurrent-metadata-list' });

  // Add default video as first item
  const defaultItem = createTag('div', { 
    class: 'concurrent-metadata-item active',
    'data-videoid': config.videoid,
    'data-skinid': config.skinid,
    'data-aslid': config.aslid
  });
  
  const defaultLink = createTag('a', { 
    class: 'concurrent-metadata-link',
    href: '#'
  });
  
  const defaultTitle = createTag('div', { class: 'concurrent-metadata-title' }, 'Main Stream');
  defaultLink.appendChild(defaultTitle);
  defaultItem.appendChild(defaultLink);
  metadataList.appendChild(defaultItem);

  // Add concurrent video item if available
  if (config.concurrentvideoid) {
    const concurrentItem = createTag('div', { 
      class: 'concurrent-metadata-item',
      'data-videoid': config.concurrentvideoid,
      'data-skinid': config.skinid,
      'data-aslid': config.concurrentaslid
    });
    
    const concurrentLink = createTag('a', { 
      class: 'concurrent-metadata-link',
      href: '#'
    });
    
    const concurrentTitle = createTag('div', { 
      class: 'concurrent-metadata-title'
    }, config.concurrenttitle || 'Concurrent Stream');
    
    concurrentLink.appendChild(concurrentTitle);
    concurrentItem.appendChild(concurrentLink);
    metadataList.appendChild(concurrentItem);
  }

  metadataWrapper.appendChild(metadataList);
  container.appendChild(metadataWrapper);

  // Add click handlers for metadata items
  const items = metadataWrapper.querySelectorAll('.concurrent-metadata-item');
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all items
      items.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Load the selected video
      const videoId = item.dataset.videoid;
      const skinId = item.dataset.skinid;
      const aslId = item.dataset.aslid;
      injectPlayer(wrapper, videoId, skinId, aslId);
    });
  });
}

export default async function init(el) {
  const config = getMetaData(el);
  
  // Create container
  const container = createTag('div', { class: 'mobile-rider' });
  el.appendChild(container);

  // Create video wrapper
  const wrapper = createTag('div', { class: 'video-wrapper' });
  container.appendChild(wrapper);

  // Inject default player
  injectPlayer(wrapper, config.videoid, config.skinid, config.aslid);

  // Create metadata section if concurrent videos are enabled
  if (config.concurrentenabled === 'true') {
    createVideoMetadata(container, config, wrapper);
  }

  // Initialize drawer if needed
  if (config.drawerenabled === 'true') {
    initDrawer(container, config);
  }

  // Set up ASL toggle if needed
  if (config.aslenabled === 'true') {
    const aslButton = document.querySelector('#asl-button');
    if (aslButton) {
      handleASLSubroutine(5000, 100, toggleClassHandler, aslButton);
    }
  }

  // Set up stream end listener if needed
  const shouldSetStreamendListener = defineShouldSetStreamendListener(el);
  if (shouldSetStreamendListener) {
    setUpStreamendListener(el);
  }

  return window.__mr_player;
}
