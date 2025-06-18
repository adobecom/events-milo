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

  // Gather all concurrent videos (concurrentvideoid1, concurrentvideoid2, ...)
  const concurrentVideos = [];
  Object.keys(metaData).forEach((key) => {
    const match = key.match(/^concurrentvideoid(\d*)$/);
    if (match) {
      const idx = match[1] || '';
      concurrentVideos.push({
        videoid: metaData[`concurrentvideoid${idx}`],
        aslid: metaData[`concurrentaslid${idx}`] || '',
        title: metaData[`concurrenttitle${idx}`] || '',
        description: metaData[`concurrentdescription${idx}`] || '',
        thumbnail: metaData[`concurrentthumbnail${idx}`] || '',
        sessionid: metaData[`concurrentsessionid${idx}`] || '',
      });
    }
  });

  return {
    videoid: metaData.videoid || '',
    skinid: metaData.skinid || '',
    aslid: metaData.aslid || '',
    autoplay: metaData.autoplay === 'true',
    fluidContainer: metaData.fluidcontainer === 'true',
    renderInPage: metaData.renderinpage === 'true',
    drawerenabled: metaData.drawerenabled === 'true',
    drawerposition: metaData.drawerposition || metaData.drawerPosition || 'right',
    drawertitle: metaData.drawertitle || metaData.drawerTitle || '',
    concurrentenabled: metaData.concurrentenabled === 'true',
    concurrentlayout: metaData.concurrentlayout || 'side-by-side',
    timing: metaData.timing || null,
    concurrentVideos, // array of all concurrent videos
  };
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

function injectPlayer(wrapper, videoId, skinId, aslId = null, sessionId = null) {
  // Remove any existing player (iframe or video)
  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }

  // Create container div
  const container = createTag('div', { 
    class: 'mobileRider_container is-hidden',
    'data-videoid': videoId,
    'data-skinid': skinId,
    'data-aslid': aslId,
    'data-sessionid': sessionId,
    id: 'mr-adobe'
  });
  wrapper.appendChild(container);

  // Create video element
  const video = createTag('video', {
    id: 'idPlayer',
    controls: true,
    class: 'mobileRider_viewport'
  });
  container.appendChild(video);

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
      autoplay: true,
      controls: true,
      muted: false,
      analytics: { provider: ANALYTICS_PROVIDER },
      identifier1: videoId,
      identifier2: aslId,
      sessionId: sessionId,
    }
  );

  return window.__mr_player;
}

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
  const scriptPath = MOBILE_RIDER_SCRIPTS[env] || MOBILE_RIDER_SCRIPTS.prod;
  const script = document.createElement('script');
  script.src = scriptPath;
  script.onload = () => {
    callback();
  };
  document.head.appendChild(script);
}

export default async function init(el) {
  const config = getMetaData(el);
  const container = createTag('div', { class: 'mobile-rider' });
  el.appendChild(container);
  const wrapper = createTag('div', { class: 'video-wrapper' });
  container.appendChild(wrapper);

  loadMobileRiderScript(() => {
    injectPlayer(
      wrapper,
      config.videoid,
      config.skinid,
      config.aslid
    );
    if (config.drawerenabled && config.concurrentVideos.length > 0) {
      initDrawer(container, { ...config, videos: config.concurrentVideos });
    }
  });

  // ASL button logic (if needed)
  if (config.aslid) {
    const aslButton = document.querySelector('#asl-button');
    if (aslButton) {
      handleASLSubroutine(5000, 100, toggleClassHandler, aslButton);
    }
  }

  const shouldSetStreamendListener = defineShouldSetStreamendListener(el);
  if (shouldSetStreamendListener) {
    setUpStreamendListener(el);
  }
  return window.__mr_player;
}
