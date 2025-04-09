import { readBlockConfig, LIBS } from '../../scripts/utils.js';
import BlockMediator from '../../scripts/deps/block-mediator.min.js';

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function buildScheduleLinkedList(entries) {
  if (!entries.length) return null;

  const head = { ...entries[0], next: null };
  let current = head;

  for (let i = 1; i < entries.length; i += 1) {
    current.next = { ...entries[i], next: null };
    current = current.next;
  }

  return head;
}

function getMockSchedule() {
  BlockMediator.set('scheduleConditions', { 'chrono-box-mock': {} });

  const now = new Date();

  const mockSchedule = buildScheduleLinkedList([
    {
      toggleTime: addMinutes(now, 0.25).getTime(),
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
  ]);

  const blockConfig = readBlockConfig(el);
  console.log('blockConfig', blockConfig);
  // TODO: use blockConfig to fetch schedule from metadata instead of mockSchedule
  const mockSchedules = getMockSchedule();

  el.innerHTML = '';

  const worker = setScheduleToScheduleWorker(mockSchedules, 'chrono-box-mock');

  worker.onmessage = (event) => {
    const { pathToFragment } = event.data;

    el.innerHTML = '';

    const a = createTag('a', { href: pathToFragment }, '', { parent: el });

    loadFragment(a);
  };
}
