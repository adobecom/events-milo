import { LIBS } from '../../scripts/utils.js';

const { createTag, getConfig } = await import(`${LIBS}/utils/utils.js`);

const ANALYTICS_PROVIDER = 'adobe';
const MOBILE_RIDER_SCRIPTS = {
  dev: '//assets.mobilerider.com/p/player-adobe-dev/player.min.js',
  prod: '//assets.mobilerider.com/p/adobe/player.min.js',
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
        && parsedTimingVariations[index - 1]?.mobileRiderType?.toLowerCase()?.includes('keynote-video-asl')) {
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
    // Note: timingFramework needs to be imported or provided
    // timingFramework(timingElement, {}, valueTextForNextXF);
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

export default async function init(el) {
  const config = {
    skinid: el.dataset.skinid,
    videoid: el.dataset.videoid,
    identifier: {
      first: el.dataset.identifierFirst,
      second: el.dataset.identifierSecond,
    },
  };

  if (!config.skinid || !config.videoid) {
    // el.remove();
    return;
  }

  const container = createTag('div', { class: 'mobile-rider-container is-hidden' }, '', { parent: el });
  const video = createTag('video', {
    id: `id${config.videoid}`,
    class: 'mobile-rider-viewport',
    controls: true,
  }, '', { parent: container });

  // Initialize ASL button handling
  const aslButton = document.querySelector('#asl-button');
  if (!aslButton) {
    handleASLSubroutine(10000, 100, toggleClassHandler);
  } else {
    toggleClassHandler(aslButton);
  }

  // Determine environment and load appropriate script
  const env = getConfig().env || 'prod';
  const scriptPath = MOBILE_RIDER_SCRIPTS[env] || MOBILE_RIDER_SCRIPTS.prod;

  // Load the mobile rider script
  const script = document.createElement('script');
  script.src = scriptPath;
  script.onload = () => {
    const isAutoplay = !document.body.classList.contains('is-editor');
    window.mrPlayerEmbed = window.mobilerider?.embed(
      video.id,
      config.videoid,
      config.skinid || ANALYTICS_PROVIDER,
      {
        autoplay: isAutoplay,
        controls: true,
        muted: true,
        debug: true,
        analytics: { provider: ANALYTICS_PROVIDER },
        identifier1: config.identifier.first,
        identifier2: config.identifier.second,
      },
    );
    container.classList.remove('is-hidden');
  };
  document.head.appendChild(script);
}
