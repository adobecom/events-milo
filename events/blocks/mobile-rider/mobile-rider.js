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

function createVideoPlayer(container, config) {
  const wrapper = createTag('div', { 
    class: 'video-wrapper',
    'data-fragment-path': config.fragmentpath || '',
  });

  const video = createTag('video', {
    id: 'idPlayer',
    class: 'mobile-rider-viewport',
    controls: true,
  });

  wrapper.appendChild(video);
  container.appendChild(wrapper);
  return video;
}

function initializeMobileRider(video, config) {
  const isAutoplayEnabled = !document.body.classList.contains('is-editor') && config.autoplay !== 'false';
  
  window.__mr_player = window.mobilerider?.embed(
    video.id,
    config.videoid,
    config.skinid,
    {
      autoplay: isAutoplayEnabled,
      controls: true,
      muted: isAutoplayEnabled,
      analytics: { provider: ANALYTICS_PROVIDER },
      identifier1: config.videoid,
      identifier2: config.aslid
    }
  );

  // Update store with session status
  if (config.sessionid) {
    mobileRiderStore.set(config.sessionid, true);
  }

  return window.__mr_player;
}

function createConcurrentPlayer(container, config) {
  if (!config.concurrentenabled === 'true') return null;

  const concurrentVideo = createTag('video', {
    id: 'idConcurrentPlayer',
    class: 'mobile-rider-viewport concurrent-video',
    controls: true,
  });

  // Add concurrent video to the existing wrapper
  const wrapper = container.querySelector('.video-wrapper');
  wrapper.appendChild(concurrentVideo);

  // Initialize concurrent player
  const concurrentPlayer = window.mobilerider?.embed(
    concurrentVideo.id,
    config.concurrentvideoid,
    config.skinid,
    {
      autoplay: false,
      controls: true,
      muted: true,
      analytics: { provider: ANALYTICS_PROVIDER },
      identifier1: config.concurrentvideoid,
      identifier2: config.concurrentaslid
    }
  );

  // Update store with concurrent session status
  if (config.concurrentsessionid) {
    mobileRiderStore.set(config.concurrentsessionid, true);
  }

  return concurrentPlayer;
}

function createVideoMetadata(container, config) {
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

  container.appendChild(metadataWrapper);
}

export default async function init(el) {
  const config = getMetaData(el);
  
  // Create container
  const container = createTag('div', { class: 'mobile-rider' });
  el.appendChild(container);

  // Create video player
  const video = createVideoPlayer(container, config);
  const player = initializeMobileRider(video, config);

  // Create concurrent player if enabled
  if (config.concurrentenabled === 'true') {
    const concurrentPlayer = createConcurrentPlayer(container, config);
    if (concurrentPlayer) {
      window.__mr_concurrent_player = concurrentPlayer;
    }
  }

  // Create metadata section
  createVideoMetadata(container, config);

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

  return player;
}
