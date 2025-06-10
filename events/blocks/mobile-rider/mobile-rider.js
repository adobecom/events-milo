import { LIBS } from '../../scripts/utils.js';

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

function toggleASL(container, toggleClass = 'isASL') {
  if (!container.classList.contains(toggleClass)) {
    container.classList.add(toggleClass);
  }
}

function handleDXFs({ serverTime: { epoch } = {}, currentServerTime, parsedTimingVariations, container }) {
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

function setUpStreamendListener(timingElement, valueTextForNextXF) {
  if (!window.mrPlayer) return;

  window.mrPlayer.off('streamend');
  window.mrPlayer.on('streamend', () => {
    window.mrPlayer?.dispose();
    window.mrPlayer = null;
    window.mrStreamPublished = null;
    if (timingElement && valueTextForNextXF) {
      window.timingFramework?.(timingElement, {}, valueTextForNextXF);
    }
  });
}

function handleASLSubroutine(limit, interval, toggleHandlerCallback, buttonASL) {
  const maxChecks = limit / interval;
  let counter = 0;

  function aslSubroutine() {
    const aslButtonSecondLoad = buttonASL || document.querySelector('#asl-button');
    if (maxChecks === counter) return false;

    if (aslButtonSecondLoad) {
      const getTimingDataElement = document.querySelector('#mr-adobe')?.closest('.dxf[data-toggle-type="timing"]');
      const valueTextForNextXF = getValuesFromDomTimingElement(getTimingDataElement);
      setUpStreamendListener(getTimingDataElement, valueTextForNextXF);
      return toggleHandlerCallback(aslButtonSecondLoad);
    }
    counter += 1;
    return setTimeout(() => aslSubroutine(), interval);
  }

  return aslSubroutine();
}

function toggleClassHandler(aslButton) {
  aslButton.addEventListener('click', () => {
    const containerMR = document.querySelector('.mobile-rider-container');
    toggleASL(containerMR);
    handleASLSubroutine(5000, 100, toggleClassHandler);
  });
}

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
  return metaData;
}

function createConcurrentControls(container, config) {
  if (!config.showmsg || !config.hidemsg) return;

  const controls = createTag('div', { class: 'concurrent-controls' });
  const toggleButton = createTag('button', { 
    class: 'concurrent-toggle',
    'aria-label': config.showmsg
  }, config.showmsg);

  toggleButton.addEventListener('click', () => {
    const isHidden = container.classList.contains('concurrent-hidden');
    container.classList.toggle('concurrent-hidden');
    toggleButton.textContent = isHidden ? config.hidemsg : config.showmsg;
    toggleButton.setAttribute('aria-label', isHidden ? config.hidemsg : config.showmsg);
  });

  controls.appendChild(toggleButton);
  return controls;
}

function createEventCard(container, config, variation) {
  if (config.eventcard !== 'true') return;

  const eventData = variation || config;
  if (!eventData) return;

  const card = createTag('div', { class: 'event-card' });
  
  // Add event information if available in the variation/config
  if (eventData.eventTitle) {
    const title = createTag('h3', { class: 'event-title' }, eventData.eventTitle);
    card.appendChild(title);
  }

  if (eventData.eventDescription) {
    const desc = createTag('p', { class: 'event-description' }, eventData.eventDescription);
    card.appendChild(desc);
  }

  if (eventData.eventDateTime) {
    const time = createTag('time', { 
      class: 'event-time',
      datetime: eventData.eventDateTime 
    }, new Date(eventData.eventDateTime).toLocaleString());
    card.appendChild(time);
  }

  return card;
}

function createVideoPlayer(container, config, isASL = false) {
  const videoId = isASL ? config.identifier2 : config.videoid;
  const videoType = isASL ? 'asl' : 'main';
  
  // Get current variation's video ID if available
  if (config.timing?.variations) {
    const currentTime = window?.northstar?.servertime?.currentTime?.getInstance()?.getTime() || Date.now();
    const currentVariation = config.timing.variations.find(variation => 
      currentTime >= variation.toggleValue && 
      (!config.timing.variations.find(v => v.toggleValue > variation.toggleValue) || 
       currentTime < config.timing.variations.find(v => v.toggleValue > variation.toggleValue).toggleValue)
    );
    
    if (currentVariation) {
      const variationVideoId = isASL ? currentVariation.aslVideoId : currentVariation.videoId;
      if (variationVideoId) {
        videoId = variationVideoId;
      }
    }
  }

  const wrapper = createTag('div', { 
    class: `video-wrapper ${videoType}-wrapper`,
    'data-fragment-path': config.fragmentpath || '',
  });

  const video = createTag('video', {
    id: `id${videoId}`,
    class: `mobile-rider-viewport ${videoType}-video`,
    controls: true,
    'data-video-type': videoType,
  }, '', { parent: wrapper });

  container.appendChild(wrapper);
  return video;
}

function initializeMobileRider(video, config, isASL = false) {
  const isAutoplayEnabled = !document.body.classList.contains('is-editor') && config.autoplay !== 'false';
  const videoId = isASL ? config.identifier2 : config.videoid;
  
  // Check if we should avoid stream end handling
  const avoidStreamEnd = config.avoidstreamend === 'true' || 
    new URLSearchParams(window?.location?.search).get('avoidStreamEndFlag') === 'true';
  
  return window.mobilerider?.embed(
    video.id,
    videoId,
    config.skinid || ANALYTICS_PROVIDER,
    {
      autoplay: isAutoplayEnabled,
      controls: true,
      muted: isAutoplayEnabled,
      analytics: { provider: ANALYTICS_PROVIDER },
      identifier1: config.identifier1,
      identifier2: config.identifier2,
      avoidStreamEnd,
    },
  );
}

// Common player config
const getPlayerConfig = (cfg, id1, id2) => ({
  autoplay: !document.body.classList.contains('is-editor') && cfg.autoplay !== 'false',
  controls: true,
  muted: cfg.autoplay !== 'false',
  ...DEFAULT_CONFIG,
  identifier1: id1,
  identifier2: id2,
  responsive: cfg.fluidcontainer === 'true'
});

// Initialize or update player
const initPlayer = (el, vid, cfg, playerKey = 'mrPlayer', id1, id2) => {
  const player = window[playerKey];
  if (player) {
    player.changeMedia(vid);
    return;
  }
  window.mobilerider?.embed(el.id, vid, cfg.skinid, getPlayerConfig(cfg, id1, id2));
};

function loadVideo(el, cfg, data) {
  if (!data) return;
  const { vid, vid2, concurrent } = data;
  const id2 = cfg.identifiersecond;

  // Set up video elements
  const setupVideo = (sel, v, pKey, i1, i2) => {
    const vidEl = el.querySelector(sel);
    if (vidEl) {
      vidEl.id = `id${v}`;
      initPlayer(vidEl, v, cfg, pKey, i1, i2);
    }
  };

  // Case 1 & 2: Regular/Single livestream
  if (vid && !id2 && !concurrent) {
    setupVideo('.main-video', vid, 'mrPlayer', vid);
    return;
  }

  // Case 3: Livestream with ASL
  if (vid && id2 && !concurrent) {
    setupVideo('.main-video', vid, 'mrPlayer', vid);
    setupVideo('.asl-video', id2, 'mrPlayerASL', vid, id2);
    return;
  }

  // Case 4: Concurrent streams
  if (concurrent && vid && vid2) {
    setupVideo('.first-stream', vid, 'mrPlayerFirst', vid);
    setupVideo('.second-stream', vid2, 'mrPlayerSecond', vid2);
    
    if (id2) {
      setupVideo('.first-asl', id2, 'mrPlayerFirstASL', vid, id2);
      const id2_2 = cfg.identifiersecond2;
      if (id2_2) {
        setupVideo('.second-asl', id2_2, 'mrPlayerSecondASL', vid2, id2_2);
      }
    }
  }
}

/**
 * Function to be exported for timing framework to load livestream
 * @param {Object} params - Parameters for loading the livestream
 * @param {string} params.blockSelector - Selector to find the mobile rider block
 * @param {string} params.livestreamId - Main livestream ID
 * @param {string} [params.secondLivestreamId] - Secondary livestream ID for concurrent streams
 * @param {string} [params.aslVideoId] - ASL video ID
 * @param {boolean} [params.isConcurrent] - Whether this is a concurrent stream setup
 * @returns {boolean} - Success status of the operation
 */
export function loadLivestream({ blockSelector, livestreamId, secondLivestreamId, aslVideoId, isConcurrent }) {
  try {
    // Find the mobile rider block
    const block = document.querySelector(blockSelector);
    if (!block) {
      console.error('Mobile Rider block not found with selector:', blockSelector);
      return false;
    }

    // Get the block's configuration
    const config = getMetaData(block);
    if (!config.skinid) {
      console.error('Mobile Rider block missing skin ID');
      return false;
    }

    // Update the configuration with the new IDs
    if (aslVideoId) {
      config.identifiersecond = aslVideoId;
    }

    // Load the video with the provided parameters
    loadVideo(block, config, {
      vid: livestreamId,
      vid2: secondLivestreamId,
      concurrent: isConcurrent
    });

    return true;
  } catch (error) {
    console.error('Error loading livestream:', error);
    return false;
  }
}

export default async function init(el) {
  const config = getMetaData(el);
  if (!config.skinid) return;

  // Regular initialization if we have direct video ID
  if (!config.videoid) {
    // Add data attributes to identify this block
    el.setAttribute('data-mobile-rider-block', '');
    if (config.fragmentpath) {
      el.setAttribute('data-fragment-path', config.fragmentpath);
    }
    return;
  }

  // Create wrapper for modal if not rendering in page
  const wrapper = config.renderinpage === 'false' 
    ? createTag('div', { class: 'modal-wrapper' }) 
    : el;

  // Create main container with appropriate layout class
  const layoutClass = config.concurrentvideolayout ? LAYOUT_CLASSES[config.concurrentvideolayout] : '';
  const container = createTag('div', { 
    class: `mobile-rider-container is-hidden ${layoutClass}`,
    'data-type': config.mobileridertype || 'video',
    'data-fluid': config.fluidcontainer,
    'data-timing': config.timing ? JSON.stringify(config.timing) : '',
    'data-current-variation': '',
    'data-fragment-path': config.fragmentpath || '',
  }, '', { parent: wrapper });

  // Create concurrent controls if needed
  const controls = createConcurrentControls(container, config);
  if (controls) {
    wrapper.insertBefore(controls, container);
  }

  // Create main video player
  const mainVideo = createVideoPlayer(container, config);

  // Create ASL video player if identifier2 is provided
  if (config.identifier2) {
    const aslVideo = createVideoPlayer(container, config, true);
    container.classList.add('has-asl');
  }

  // Create event card if enabled
  const eventCard = createEventCard(container, config);
  if (eventCard) {
    container.appendChild(eventCard);
  }

  // Initialize ASL button handling if identifier2 is provided
  if (config.identifier2) {
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
    const mainPlayerEmbed = initializeMobileRider(mainVideo, config);

    // Initialize ASL video player if identifier2 is provided
    if (config.identifier2) {
      const aslPlayerEmbed = initializeMobileRider(
        document.querySelector('.asl-video'),
        config,
        true
      );
    }

    // Set up concurrent video handling
    const timingElement = container.closest('.dxf[data-toggle-type="timing"]');
    if (timingElement && config.mobileridertype?.toLowerCase() === 'concurrent-video') {
      const valueTextForNextXF = getValuesFromDomTimingElement(timingElement);
      if (valueTextForNextXF?.concurrentVariationToSend?.mobileRiderLiveNextSession) {
        setUpStreamendListener(timingElement, valueTextForNextXF);
      }
    }

    // Update current variation and event card
    if (config.timing?.variations) {
      const currentTime = window?.northstar?.servertime?.currentTime?.getInstance()?.getTime() || Date.now();
      const currentVariation = config.timing.variations.find(variation => 
        currentTime >= variation.toggleValue && 
        (!config.timing.variations.find(v => v.toggleValue > variation.toggleValue) || 
         currentTime < config.timing.variations.find(v => v.toggleValue > variation.toggleValue).toggleValue)
      );
      
      if (currentVariation) {
        container.dataset.currentVariation = currentVariation.variation;
        
        // Update event card with current variation data
        const existingCard = container.querySelector('.event-card');
        if (existingCard) {
          const newCard = createEventCard(container, config, currentVariation);
          if (newCard) {
            existingCard.replaceWith(newCard);
          }
        }
      }
    }

    container.classList.remove('is-hidden');

    // Initialize drawer if enabled
    if (config.drawerenabled === 'true') {
      initDrawer(container, config);
    }
  };
  document.head.appendChild(script);
}
