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

async function initPlugins(schedule) {
  const PLUGINS_MAP = {
    mobileRider: 'mobile-rider',
    metadata: 'metadata',
  };
  const hasPlugin = (plugin) => schedule.some((item) => item[plugin]);
  const pluginsNeeded = Object.keys(PLUGINS_MAP).filter(hasPlugin);
  const plugins = await Promise.all(pluginsNeeded.map((plugin) => {
    const pluginDir = PLUGINS_MAP[plugin];
    return import(`../../features/timing-framework/plugins/${pluginDir}/plugin.js`);
  }));

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
    const pluginName = pluginsNeeded[index];
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
    return Promise.resolve();
  }

  el.innerHTML = '';

  const pluginsOutputs = await initPlugins(thisSchedule);
  const worker = setScheduleToScheduleWorker(
    thisSchedule,
    pluginsOutputs.plugins,
    pluginsOutputs.tabId,
  );

  // Create a promise that resolves when the first message is received
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      window.lana?.log('Timeout waiting for first worker message, continuing without CLS prevention');
      resolve(); // resolve the promise without waiting for the first message
    }, 3000); // 3 second timeout - balances CLS prevention with LCP/FCP

    // Set up the message handler that resolves the promise
    worker.onmessage = (event) => {
      clearTimeout(timeout);

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

      // Resolve the promise
      resolve();
    };
  });
}
