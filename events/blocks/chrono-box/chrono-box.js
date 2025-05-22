import { getToggleTimeFromParams, getScheduleItemFromParams } from '../../features/timing-framework/testing.js';
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

function conditionsPreCheck(schedule) {
  const conditions = {};
  const allMetadataConditionSchedules = schedule.filter((entry) => entry.conditions?.some((condition) => condition.source === 'metadata'));
  allMetadataConditionSchedules.forEach((s) => {
    s.conditions.forEach((condition) => {
      const { key } = condition;

      const metadata = getMetadata(key);

      if (metadata) {
        conditions[key] = metadata;
      }
    });
  });

  return conditions;
}

function setScheduleToScheduleWorker(schedule) {
  const scheduleLinkedList = buildScheduleDoubleLinkedList(schedule);
  const worker = new Worker('/events/features/timing-framework/worker.js');
  const conditions = conditionsPreCheck(schedule);

  worker.postMessage({
    message: 'schedule',
    schedule: scheduleLinkedList,
    conditions,
    testing: {
      toggleTime: getToggleTimeFromParams(),
      scheduleItemId: getScheduleItemFromParams(),
    },
  });

  return worker;
}

export default async function init(el) {
  const [{ default: loadFragment }, { createTag }] = await Promise.all([
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

  // Check if schedule contains any MR sessions
  const hasMRSessions = thisSchedule.some((item) => item.mobileRiderSessionId);

  // Only add the class if MR sessions are present
  if (hasMRSessions) {
    el.classList.add('mobile-rider-enabled');
  }

  el.innerHTML = '';
  const worker = setScheduleToScheduleWorker(thisSchedule);

  // Add periodic MR session status check
  if (hasMRSessions) {
    setInterval(async () => {
      const sessionIds = thisSchedule
        .filter((item) => item.mobileRiderSessionId)
        .map((item) => item.mobileRiderSessionId);

      if (sessionIds.length > 0) {
        worker.postMessage({
          type: 'update_mr_status',
          sessionIds,
        });
      }
    }, 5000); // Check every 5 seconds
  }

  el.addEventListener('worker-message', (e) => {
    const { type, schedule, conditions, sessionId, status } = e.detail.data;

    if (type === 'mr_session_update') {
      // Handle MR session status update
      worker.postMessage({
        type: 'update_mr_status',
        sessionId,
        status,
        timestamp: Date.now(),
      });
    } else {
      // Handle regular schedule/condition updates
      worker.postMessage({
        schedule,
        conditions,
        testing: {
          toggleTime: getToggleTimeFromParams(),
          scheduleItemId: getScheduleItemFromParams(),
        },
      });
    }
  });

  worker.onmessage = (event) => {
    const { pathToFragment } = event.data;

    el.style.height = `${el.clientHeight}px`;

    // load sp progress circle
    const spTheme = createTag('sp-theme', { color: 'light', scale: 'medium', class: 'loading-screen' });
    createTag('sp-progress-circle', { size: 'l', indeterminate: true }, '', { parent: spTheme });
    el.innerHTML = '';
    el.classList.add('loading');
    el.append(spTheme);

    const a = createTag('a', { href: pathToFragment }, '', { parent: el });

    loadFragment(a).then(() => {
      // set el height to current height
      spTheme.remove();
      el.removeAttribute('style');
      el.classList.remove('loading');
    });
  };
}
