import { readBlockConfig, LIBS, getMetadata } from '../../scripts/utils.js';

function buildScheduleDoubleLinkedList(entries) {
  if (!entries.length) return null;

  const head = { ...entries[0], next: null, prev: null };
  let current = head;

  for (let i = 1; i < entries.length; i += 1) {
    current.next = { ...entries[i], next: null, prev: current };
    current = current.next;
  }

  return head;
}

function getSchedule(scheduleId) {
  const scheduleJSONString = getMetadata('schedules');
  let thisSchedule;

  try {
    thisSchedule = JSON.parse(scheduleJSONString)[scheduleId];
  } catch (e) {
    window.lana?.log(`Error parsing schedule: ${JSON.stringify(e)}`);
  }

  if (!thisSchedule) {
    window.lana?.log(`Schedule not found: ${scheduleId}`);
    return null;
  }

  return thisSchedule;
}

/**
 * Determines the initial schedule item to show based on current time and testing parameters
 * @param {Array} schedule - The schedule array
 * @param {Object} testing - Testing configuration
 * @returns {Object} The initial schedule item
 */
export function getInitialScheduleItem(schedule, testing = null) {
  if (!schedule || !schedule.length) return null;

  const currentTime = new Date().getTime();
  let adjustedTime = currentTime;

  // Apply testing time adjustment if in testing mode
  if (testing?.toggleTime) {
    const testTime = parseInt(testing.toggleTime, 10);
    if (!Number.isNaN(testTime)) {
      adjustedTime = testTime;
    }
  }

  // Find the first item that should be shown based on toggleTime
  let initialItem = schedule[0]; // Default to first item

  schedule.some((item) => {
    const { toggleTime } = item;
    if (toggleTime) {
      const numericToggleTime = typeof toggleTime === 'string' ? parseInt(toggleTime, 10) : toggleTime;
      if (typeof numericToggleTime === 'number' && adjustedTime > numericToggleTime) {
        initialItem = item;
        return false; // Continue to next item
      }
      return true; // Stop at first item that hasn't passed its toggle time
    }
    // If no toggleTime, this item should be shown
    initialItem = item;
    return true; // Stop here
  });

  return initialItem;
}

/**
 * Loads and renders a fragment immediately
 * @param {HTMLElement} el - The container element
 * @param {Object} scheduleItem - The schedule item to load
 * @returns {Promise} Promise that resolves when fragment is loaded
 */
async function loadInitialFragment(el, scheduleItem) {
  const [{ default: loadFragment }, { createTag, getLocale, getConfig }] = await Promise.all([
    import(`${LIBS}/blocks/fragment/fragment.js`),
    import(`${LIBS}/utils/utils.js`),
  ]);

  const { pathToFragment } = scheduleItem;
  const { prefix } = getLocale(getConfig().locales);

  const a = createTag('a', { href: `${prefix}${pathToFragment}` }, '', { parent: el });

  try {
    await loadFragment(a);
  } catch (error) {
    window.lana?.log(`Error loading initial fragment ${pathToFragment}: ${JSON.stringify(error)}`);
  }
}

async function initPlugins(schedule) {
  const SUPPORTED_PLUGINS = ['mobile-rider', 'metadata'];
  const pluginsNeeded = SUPPORTED_PLUGINS.filter((plugin) => schedule.some((item) => item[plugin]));
  const plugins = await Promise.all(pluginsNeeded.map((plugin) => import(`../../features/timing-framework/plugins/${plugin}/plugin.js`)));

  // Get or create a global tabId that's shared across all chrono-boxes on this page
  // This ensures that multiple chrono-boxes on the same page use the same tabId,
  // allowing their plugin stores to communicate via BroadcastChannel correctly
  let tabId = sessionStorage.getItem('chrono-box-tab-id');
  if (!tabId) {
    tabId = crypto.randomUUID();
    sessionStorage.setItem('chrono-box-tab-id', tabId);
  }

  const pluginsModules = new Map();
  await Promise.all(plugins.map(async (plugin, index) => {
    const pluginName = pluginsNeeded[index].replace('-', '');
    pluginsModules.set(pluginName, await plugin.default(schedule));
  }));

  return { plugins: pluginsModules, tabId };
}

function setScheduleToScheduleWorker(schedule, plugins, tabId) {
  const scheduleLinkedList = buildScheduleDoubleLinkedList(schedule);

  // Add error handling for worker creation
  let worker;
  try {
    worker = new Worker('/events/features/timing-framework/worker.js', { type: 'module' });
  } catch (error) {
    window.lana?.log(`Error creating worker: ${JSON.stringify(error)}`);
    throw error;
  }

  // Get testing data from URL params
  const params = new URLSearchParams(document.location.search);
  const testTiming = params.get('timing');
  const testing = testTiming ? { toggleTime: testTiming } : null;

  // Convert plugin instances to their serializable state
  const pluginStates = Object.fromEntries(
    Array.from(plugins.entries())
      .map(([n, p]) => [n, { type: n, data: p.getAll ? p.getAll() : p }]),
  );

  const messageData = {
    schedule: scheduleLinkedList,
    plugins: pluginStates,
    testing,
    tabId,
  };

  try {
    worker.postMessage(messageData);
  } catch (error) {
    window.lana?.log(`Error posting message to worker: ${JSON.stringify(error)}`);
    throw error;
  }

  return worker;
}

export default async function init(el) {
  const [{ default: loadFragment }, { createTag, getLocale, getConfig }] = await Promise.all([
    import(`${LIBS}/blocks/fragment/fragment.js`),
    import(`${LIBS}/utils/utils.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/theme.js`),
    import(`${LIBS}/features/spectrum-web-components/dist/progress-circle.js`),
  ]);

  const blockConfig = readBlockConfig(el);
  const scheduleId = blockConfig?.['schedule-id'];
  let staticSchedule;

  if (blockConfig?.schedule) {
    try {
      staticSchedule = JSON.parse((blockConfig?.schedule));
    } catch (e) {
      window.lana?.log(`Error parsing static schedule: ${JSON.stringify(e)}`);
    }
  }
  const scheduleById = scheduleId ? getSchedule(scheduleId) : null;
  const thisSchedule = staticSchedule || scheduleById;

  if (!thisSchedule) {
    el.remove();
    return;
  }

  el.innerHTML = '';

  // Get testing data from URL params
  const params = new URLSearchParams(document.location.search);
  const testTiming = params.get('timing');
  const testing = testTiming ? { toggleTime: testTiming } : null;

  // Determine and load the initial fragment immediately
  const initialScheduleItem = getInitialScheduleItem(thisSchedule, testing);
  if (initialScheduleItem) {
    await loadInitialFragment(el, initialScheduleItem);
  }

  // Initialize plugins and start the worker for subsequent updates
  const pluginsOutputs = await initPlugins(thisSchedule);
  const worker = setScheduleToScheduleWorker(
    thisSchedule,
    pluginsOutputs.plugins,
    pluginsOutputs.tabId,
  );

  worker.onmessage = (event) => {
    const { pathToFragment } = event.data;
    const { prefix } = getLocale(getConfig().locales);
    el.style.height = `${el.clientHeight}px`;

    // load sp progress circle
    const spTheme = createTag('sp-theme', { color: 'light', scale: 'medium', class: 'loading-screen' });
    createTag('sp-progress-circle', { size: 'l', indeterminate: true }, '', { parent: spTheme });
    el.innerHTML = '';
    el.classList.add('loading');
    el.append(spTheme);

    const a = createTag('a', { href: `${prefix}${pathToFragment}` }, '', { parent: el });

    loadFragment(a).then(() => {
      // set el height to current height
      spTheme.remove();
      el.removeAttribute('style');
      el.classList.remove('loading');
    }).catch((error) => {
      // Handle fragment loading errors
      window.lana?.log(`Error loading fragment ${pathToFragment}: ${JSON.stringify(error)}`);

      // Remove loading state
      spTheme.remove();
      el.removeAttribute('style');
      el.classList.remove('loading');

      // Show error state to user
      el.innerHTML = '<div class="error-message">Unable to load content. Please refresh the page.</div>';
      el.classList.add('error');
    });
  };
}
