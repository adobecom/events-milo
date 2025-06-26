import { readBlockConfig, LIBS, getMetadata, parseMetadataPath } from '../../scripts/utils.js';

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
      const metadata = parseMetadataPath(key);
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

  el.innerHTML = '';

  const worker = setScheduleToScheduleWorker(thisSchedule);

  el.addEventListener('worker-message', (e) => {
    const { schedule, conditions } = e.detail.data;

    worker.postMessage({
      schedule,
      conditions,
    });
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
