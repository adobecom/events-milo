import { readBlockConfig, LIBS, getMetadata } from '../../scripts/utils.js';

// IMMEDIATE visual indicator that this file loaded
(() => {
  const marker = document.createElement('div');
  marker.id = 'chrono-box-loaded-marker';
  marker.innerHTML = '🟢 CHRONO-BOX FILE LOADED';
  marker.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; background: lime !important; color: black !important; padding: 15px !important; z-index: 999999 !important; font-size: 14px !important; font-weight: bold !important; text-align: center !important; border-bottom: 3px solid green !important;';
  
  const addMarker = () => {
    if (document.body && !document.getElementById('chrono-box-loaded-marker')) {
      document.body.insertBefore(marker, document.body.firstChild);
    } else if (!document.body) {
      setTimeout(addMarker, 50);
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addMarker);
  } else {
    addMarker();
  }
})();

// Debug logging function that displays messages on the page
function debugLog(message, isError = false) {
  try {
    // Also log to console for reference
    if (isError) {
      console.error(message);
    } else {
      console.log(message);
    }

    let debugContainer = document.getElementById('chrono-box-debug-log');
    if (!debugContainer) {
      debugContainer = document.createElement('div');
      debugContainer.id = 'chrono-box-debug-log';
      debugContainer.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; width: 100%; background: #f0f0f0; border-bottom: 2px solid #333; padding: 10px; z-index: 999999; max-height: 300px; overflow-y: auto; font-family: monospace; font-size: 11px; box-sizing: border-box;';

      // Ensure body exists before appending
      if (document.body) {
        document.body.insertBefore(debugContainer, document.body.firstChild);
      } else {
        // If body doesn't exist yet, wait for it
        const observer = new MutationObserver(() => {
          if (document.body) {
            document.body.insertBefore(debugContainer, document.body.firstChild);
            observer.disconnect();
          }
        });
        observer.observe(document.documentElement, { childList: true });
      }
    }

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.style.cssText = `margin: 2px 0; padding: 2px 0; ${isError ? 'color: red; font-weight: bold;' : 'color: #333;'}`;
    logEntry.textContent = `[${timestamp}] ${message}`;
    debugContainer.appendChild(logEntry);
    debugContainer.scrollTop = debugContainer.scrollHeight;
  } catch (e) {
    // Fallback if anything goes wrong with debug logging
    console.error('Debug log error:', e, 'Message was:', message);
  }
}

// Module-level log to confirm file is loaded
console.log('[CHRONO-BOX] Module loaded at', new Date().toISOString());
debugLog('CHRONO-BOX MODULE LOADED');

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
  debugLog(`Getting schedule with ID: ${scheduleId}`);
  const scheduleJSONString = getMetadata('schedules');
  debugLog(`Schedule metadata: ${scheduleJSONString ? 'found' : 'not found'}`);
  let thisSchedule;

  try {
    thisSchedule = JSON.parse(scheduleJSONString)[scheduleId];
    debugLog(`Schedule parsed successfully: ${thisSchedule ? 'yes' : 'no'}`);
  } catch (e) {
    debugLog(`Error parsing schedule: ${e.message}`, true);
    window.lana?.log(`Error parsing schedule: ${JSON.stringify(e)}`);
  }

  if (!thisSchedule) {
    debugLog(`Schedule not found: ${scheduleId}`, true);
    window.lana?.log(`Schedule not found: ${scheduleId}`);
    return null;
  }

  return thisSchedule;
}

async function initPlugins(schedule) {
  debugLog(`Initializing plugins for ${schedule.length} schedule entries`);
  const PLUGINS_MAP = {
    mobileRider: 'mobile-rider',
    metadata: 'metadata',
  };
  const hasPlugin = (plugin) => schedule.some((item) => item[plugin]);
  const pluginsNeeded = Object.keys(PLUGINS_MAP).filter(hasPlugin);
  debugLog(`Plugins needed: ${pluginsNeeded.join(', ') || 'none'}`);

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
    debugLog(`Created new tab ID: ${tabId}`);
  } else {
    debugLog(`Using existing tab ID: ${tabId}`);
  }

  const pluginsModules = new Map();
  await Promise.all(plugins.map(async (plugin, index) => {
    const pluginName = pluginsNeeded[index];
    pluginsModules.set(pluginName, await plugin.default(schedule));
    debugLog(`Plugin initialized: ${pluginName}`);
  }));

  return { plugins: pluginsModules, tabId };
}

function setScheduleToScheduleWorker(schedule, plugins, tabId) {
  debugLog(`Setting up worker for schedule with ${schedule.length} entries`);
  const scheduleLinkedList = buildScheduleDoubleLinkedList(schedule);

  // Add error handling for worker creation
  let worker;
  try {
    debugLog('Creating worker...');
    worker = new Worker('/events/features/timing-framework/worker.js', { type: 'module' });
    debugLog('Worker created successfully');
  } catch (error) {
    debugLog(`Error creating worker: ${error.message}`, true);
    window.lana?.log(`Error creating worker: ${JSON.stringify(error)}`);
    throw error;
  }

  // Get testing data from URL params
  const params = new URLSearchParams(document.location.search);
  const testTiming = params.get('timing');
  const testing = testTiming ? { toggleTime: testTiming } : null;
  if (testing) {
    debugLog(`Testing mode enabled with timing: ${testTiming}`);
  }

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
    debugLog('Posting message to worker...');
    worker.postMessage(messageData);
    debugLog('Message posted to worker successfully');
  } catch (error) {
    debugLog(`Error posting message to worker: ${error.message}`, true);
    window.lana?.log(`Error posting message to worker: ${JSON.stringify(error)}`);
    throw error;
  }

  return worker;
}

export default async function init(el) {
  try {
    debugLog('=== CHRONO-BOX INIT START ===');
    debugLog(`User agent: ${navigator.userAgent}`);
    debugLog(`Element: ${el ? 'exists' : 'missing'}`);

    const [{ default: loadFragment }, { createTag, getLocale, getConfig }] = await Promise.all([
      import(`${LIBS}/blocks/fragment/fragment.js`),
      import(`${LIBS}/utils/utils.js`),
    ]);
    debugLog('Dependencies loaded');

    // Log the raw HTML structure before parsing
    debugLog('=== RAW BLOCK HTML ===');
    debugLog(`Block element tag: ${el.tagName}`);
    debugLog(`Block element classes: ${el.className}`);
    debugLog(`Block children count: ${el.children.length}`);

    // Log each row in the block
    const rows = el.querySelectorAll(':scope > div');
    rows.forEach((row, i) => {
      debugLog(`Row ${i + 1}: ${row.children.length} columns`);
      Array.from(row.children).forEach((col, j) => {
        debugLog(`  Col ${j + 1} innerHTML: ${col.innerHTML.substring(0, 100)}${col.innerHTML.length > 100 ? '...' : ''}`);
        debugLog(`  Col ${j + 1} textContent: ${col.textContent.substring(0, 100)}${col.textContent.length > 100 ? '...' : ''}`);
      });
    });
    debugLog('=== END RAW HTML ===');

    const blockConfig = readBlockConfig(el);
    debugLog(`Block config: ${JSON.stringify(blockConfig)}`);

    const scheduleId = blockConfig?.['schedule-id'];
    debugLog(`Schedule ID from config: ${scheduleId || 'none'}`);

    let staticSchedule;

    if (blockConfig?.schedule) {
      debugLog('Static schedule found in config');
      debugLog(`Schedule config value type: ${typeof blockConfig.schedule}`);
      debugLog(`Schedule config value: ${JSON.stringify(blockConfig.schedule)}`);

      // Try to get raw text content from the schedule row
      let scheduleTextContent = null;
      rows.forEach((row) => {
        const cols = Array.from(row.children);
        if (cols.length >= 2) {
          const label = cols[0].textContent.trim().toLowerCase();
          if (label === 'schedule') {
            scheduleTextContent = cols[1].textContent.trim();
            debugLog(`Found raw schedule text: ${scheduleTextContent.substring(0, 200)}...`);
          }
        }
      });

      // Prefer text content if it looks like valid JSON
      let scheduleSource = blockConfig.schedule;
      if (scheduleTextContent && scheduleTextContent.startsWith('[')) {
        debugLog('Using text content instead of parsed config (starts with [)');
        scheduleSource = scheduleTextContent;
      }

      try {
        staticSchedule = JSON.parse(scheduleSource);
        debugLog(`✅ Static schedule parsed: ${staticSchedule.length} entries`);
        debugLog(`First entry: ${JSON.stringify(staticSchedule[0])}`);
      } catch (e) {
        debugLog(`❌ Error parsing static schedule: ${e.message}`, true);
        debugLog(`Failed to parse: ${typeof scheduleSource === 'string' ? scheduleSource.substring(0, 200) : JSON.stringify(scheduleSource)}`, true);
        window.lana?.log(`Error parsing static schedule: ${JSON.stringify(e)}`);
      }
    }
    const scheduleById = scheduleId ? getSchedule(scheduleId) : null;
    const thisSchedule = staticSchedule || scheduleById;

    if (!thisSchedule) {
      debugLog('No schedule found - removing element', true);
      el.remove();
      return Promise.resolve();
    }

    debugLog(`Final schedule has ${thisSchedule.length} entries`);
    el.innerHTML = '';

    const pluginsOutputs = await initPlugins(thisSchedule);
    const worker = setScheduleToScheduleWorker(
      thisSchedule,
      pluginsOutputs.plugins,
      pluginsOutputs.tabId,
    );

    // Create a promise that resolves when the first message is received
    return new Promise((resolve) => {
      debugLog('Waiting for worker message...');

      const timeout = setTimeout(() => {
        debugLog('Timeout waiting for worker message (3s)', true);
        window.lana?.log('Timeout waiting for first worker message, continuing without CLS prevention');
        resolve(); // resolve the promise without waiting for the first message
      }, 3000); // 3 second timeout - balances CLS prevention with LCP/FCP

      // Set up the message handler that resolves the promise
      worker.onmessage = (event) => {
        clearTimeout(timeout);
        debugLog('Received message from worker');

        const { pathToFragment } = event.data;
        debugLog(`Fragment path: ${pathToFragment}`);

        const { prefix } = getLocale(getConfig().locales);
        debugLog(`Locale prefix: ${prefix}`);

        el.style.height = `${el.clientHeight}px`;

        // load sp progress circle
        el.innerHTML = '';
        el.classList.add('loading');
        debugLog('Loading fragment...');

        const fullPath = `${prefix}${pathToFragment}`;
        debugLog(`Full fragment URL: ${fullPath}`);
        const a = createTag('a', { href: fullPath }, '', { parent: el });

        loadFragment(a).then(() => {
          // set el height to current height
          el.removeAttribute('style');
          el.classList.remove('loading');
          debugLog('Fragment loaded successfully');
          debugLog('=== CHRONO-BOX INIT COMPLETE ===');
        }).catch((error) => {
          // Handle fragment loading errors
          debugLog(`Error loading fragment: ${error.message}`, true);
          window.lana?.log(`Error loading fragment ${pathToFragment}: ${JSON.stringify(error)}`);

          // Remove loading state
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
  } catch (error) {
    debugLog(`FATAL ERROR in init: ${error.message}`, true);
    debugLog(`Stack: ${error.stack}`, true);
    console.error('Chrono-box init error:', error);
    throw error;
  }
}
