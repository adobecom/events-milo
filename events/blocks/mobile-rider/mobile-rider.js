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

function getValuesFromDomTimingElement(element) {
  const { dataset: { timing } = {} } = element || {};

  try {
    const parsedTimingVariations = JSON.parse(timing);
    if (!element || !parsedTimingVariations.length) return null;

    const serverTimeEnabled = document?.head?.querySelector('meta[name="servertime-enabled"]');
    const variationProps = {
      serverTime: window?.northstar?.servertime,
      currentServerTime: window?.northstar?.servertime?.currentTime?.getInstance()?.getTime(),
      parsedTimingVariations,
      container: element,
    };

    function handleDXFs({ serverTime: { epoch } = {}, currentServerTime } = {}) {
      const currentTime = currentServerTime || epoch || Date.now();
      let sendThisValue;

      parsedTimingVariations.forEach(({ toggleValue } = {}, index) => {
        const nextVariation = parsedTimingVariations[index + 1];
        const getCST = window?.northstar?.servertime?.currentTime?.getInstance()?.getTime();
        const isVariationInShowingRange = (getCST || currentTime) >= toggleValue
          && (getCST || currentTime) < nextVariation?.toggleValue;

        if (isVariationInShowingRange) {
          let concurrentVariationToSend;
          if (parsedTimingVariations[index].mobileRiderLiveNextSession === false
            && parsedTimingVariations[index - 1]?.mobileRiderType?.toLowerCase()?.includes('concurrent')) {
            concurrentVariationToSend = parsedTimingVariations[index - 1];
            sendThisValue = {
              concurrentVariationToSend,
              sendObjectToTiming: 'concurrentVideo',
            };
            return;
          }
          concurrentVariationToSend = parsedTimingVariations[index];
          sendThisValue = {
            concurrentVariationToSend,
            sendObjectToTiming: 'concurrentVideo',
          };
        }
      });

      return sendThisValue;
    }

    function handleServertime() {
      return handleDXFs(variationProps);
    }

    if (serverTimeEnabled && !window?.northstar?.servertime?.epoch) {
      setTimeout(() => {
        window.removeEventListener('northstar:serverTime', handleServertime);
        return handleDXFs(variationProps);
      }, 3000);

      window.addEventListener('northstar:serverTime', handleServertime);
    }

    if (!serverTimeEnabled
      || (serverTimeEnabled && window?.northstar?.servertime?.epoch)
      || window?.northstar?.servertime?.failed) {
      return handleDXFs(variationProps);
    }

    return null;
  } catch (error) {
    window.lana?.log(`Failed to parse timing variations:\n${JSON.stringify(error, null, 2)}`);
    return null;
  }
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
    class: 'video-wrapper main-wrapper',
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
  if (!config.concurrent?.enabled) return null;

  const concurrentWrapper = createTag('div', {
    class: 'video-wrapper concurrent-wrapper',
    'data-fragment-path': config.fragmentpath || '',
  });

  const concurrentVideo = createTag('video', {
    id: 'idConcurrentPlayer',
    class: 'mobile-rider-viewport concurrent-video',
    controls: true,
  });

  concurrentWrapper.appendChild(concurrentVideo);
  container.appendChild(concurrentWrapper);

  // Initialize concurrent player
  const concurrentPlayer = window.mobilerider?.embed(
    concurrentVideo.id,
    config.concurrent.videos[0].videoId,
    config.skinid,
    {
      autoplay: false,
      controls: true,
      muted: true,
      analytics: { provider: ANALYTICS_PROVIDER },
      identifier1: config.concurrent.videos[0].videoId,
      identifier2: config.concurrent.videos[0].aslId
    }
  );

  // Update store with concurrent session status
  if (config.concurrent.videos[0].sessionId) {
    mobileRiderStore.set(config.concurrent.videos[0].sessionId, true);
  }

  return concurrentPlayer;
}

function createVideoMetadata(container, config) {
  if (!config.concurrent?.enabled) return;

  const metadataWrapper = createTag('div', { class: 'concurrent-metadata' });
  
  // Add title if available
  if (config.concurrent.videos[0].title) {
    const title = createTag('h3', { class: 'concurrent-title' }, config.concurrent.videos[0].title);
    metadataWrapper.appendChild(title);
  }

  // Add description if available
  if (config.concurrent.videos[0].description) {
    const desc = createTag('p', { class: 'concurrent-description' }, config.concurrent.videos[0].description);
    metadataWrapper.appendChild(desc);
  }

  container.appendChild(metadataWrapper);
}

export default async function init(el) {
  const config = getMetaData(el);
  if (!config.skinid || !config.videoid) return;

  // Create wrapper for modal if not rendering in page
  const wrapper = config.renderinpage === 'false' 
    ? createTag('div', { class: 'modal-wrapper' }) 
    : el;

  // Create main container with appropriate layout class
  const layoutClass = config.concurrent?.enabled 
    ? LAYOUT_CLASSES[config.concurrent.layout] || ''
    : '';

  const container = createTag('div', { 
    class: `mobileRider_container is-hidden ${layoutClass}`,
    'data-type': config.mobileridertype || 'video',
    'data-fluid': config.fluidcontainer,
    'data-timing': config.timing ? JSON.stringify(config.timing) : '',
    'data-current-variation': '',
    'data-fragment-path': config.fragmentpath || '',
    'data-videoid': config.videoid,
    'data-aslid': config.aslid,
    'data-skinid': config.skinid,
    'data-sessionid': config.sessionid || '',
    'id': 'mr-adobe'
  }, '', { parent: wrapper });

  // Create main video player
  const video = createVideoPlayer(container, config);
  
  // Handle ASL support
  if (config.aslid) {
    container.classList.add('has-asl');
    const aslButton = document.querySelector('#asl-button');
    if (!aslButton) {
      handleASLSubroutine(10000, 100, toggleClassHandler);
    } else {
      toggleClassHandler(aslButton);
    }
  }

  // If modal wrapper was created, add it to the page
  if (wrapper !== el) {
    el.appendChild(wrapper);
  }

  // Determine environment and load appropriate script
  const env = getConfig().env || 'prod';
  const scriptPath = MOBILE_RIDER_SCRIPTS[env] || MOBILE_RIDER_SCRIPTS.prod;

  // Load the mobile rider script
  const script = document.createElement('script');
  script.src = scriptPath;
  script.onload = () => {
    // Initialize main video player
    const mainPlayer = initializeMobileRider(video, config);

    // Initialize concurrent video if enabled
    if (config.concurrent?.enabled) {
      const concurrentPlayer = createConcurrentPlayer(container, config);
      createVideoMetadata(container, config);
    }

    // Set up stream end listener if needed
    const shouldSetStreamendListener = defineShouldSetStreamendListener(container);
    if (shouldSetStreamendListener) {
      setUpStreamendListener(container);
    }

    container.classList.remove('is-hidden');

    // Initialize drawer if enabled
    if (config.drawerenabled === 'true') {
      initDrawer(container, config);
    }
  };
  document.head.appendChild(script);
}
