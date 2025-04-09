import { readBlockConfig, LIBS } from '../../scripts/utils.js';
import BlockMediator from '../../scripts/deps/block-mediator.min.js';

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

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

function getMockSchedule() {
  BlockMediator.set('scheduleConditions', { 'chrono-box-mock': {} });

  const now = new Date();

  const mockSchedule = buildScheduleDoubleLinkedList([
    {
      pathToFragment: '/drafts/qiyundai/fragments/dx-hero-base',
    },
    {
      conditions: [
        {
          bmKey: 'videoReady',
          expectedValue: true,
        },
      ],
      pathToFragment: '/drafts/qiyundai/fragments/dx-hero-pre',
    },
    {
      conditions: [
        {
          bmKey: 'streamEnded',
          expectedValue: true,
        },
      ],
      toggleTime: addMinutes(now, 1).getTime(),
      pathToFragment: '/drafts/qiyundai/fragments/dx-hero-post',
    },
  ]);

  return mockSchedule;
}

function setScheduleToScheduleWorker(schedule, scheduleId) {
  const worker = new Worker('/events/features/timing-framework/worker.js');
  worker.postMessage({
    message: 'schedule',
    schedule,
  });

  const conditions = BlockMediator.get('scheduleConditions');
  const thisConditions = conditions[scheduleId];

  if (thisConditions) {
    worker.postMessage({
      message: 'conditions',
      conditions: thisConditions,
    });
  }

  BlockMediator.subscribe('scheduleConditions', ({ newValue }) => {
    const tc = newValue[scheduleId];

    if (tc) {
      worker.postMessage({
        message: 'conditions',
        conditions: tc,
      });
    }
  });

  // TODO: remove this BM mock
  setTimeout(() => {
    const con = BlockMediator.get('scheduleConditions');
    con[scheduleId] = { ...con[scheduleId], videoReady: true, streamEnded: true };
    BlockMediator.set('scheduleConditions', con);
  }, 20 * 1000);

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
  console.log('blockConfig', blockConfig);
  // TODO: use blockConfig to fetch schedule from metadata instead of mockSchedule
  const mockSchedules = getMockSchedule();

  el.innerHTML = '';

  const worker = setScheduleToScheduleWorker(mockSchedules, 'chrono-box-mock');

  worker.onmessage = (event) => {
    const { pathToFragment } = event.data;

    el.style.height = `${el.clientHeight}px`;

    // load sp progress circle
    const spTheme = createTag('sp-theme', { color: 'light', scale: 'medium', class: 'loading-screen'  });
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
