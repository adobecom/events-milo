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
  const now = new Date();

  const mockSchedule = buildScheduleLinkedList([
    {
      toggleTime: addMinutes(now, 0.25).getTime(),
      pathToFragment: '/drafts/qiyundai/fragments/dx-hero-pre',
    },
    {
      conditions: [
        {
          bmKey: 'videoReady',
          expectedValue: true,
        },
        {
          bmKey: 'registered',
          expectedValue: true,
        },
      ],
      pathToFragment: '/drafts/qiyundai/fragments/dx-hero-post',
    },
  ]);

  return mockSchedule;
}

function setScheduleToScheduleWorker(schedule) {
  const worker = new Worker('/events/features/timing-framework/worker.js');
  worker.postMessage({
    message: 'schedule',
    schedule,
  });

  const conditions = BlockMediator.get('scheduleConditions');

  if (conditions) {
    worker.postMessage({
      message: 'conditions',
      conditions,
    });
  }

  BlockMediator.subscribe('scheduleConditions', ({ newValue }) => {
    worker.postMessage({
      message: 'conditions',
      conditions: newValue,
    });
  });

  // TODO: remove this BM mock
  setTimeout(() => {
    BlockMediator.set('scheduleConditions', {
      videoReady: true,
      registered: true,
    });
  }, 30 * 1000);

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

  const worker = setScheduleToScheduleWorker(mockSchedules);

  worker.onmessage = (event) => {
    const { pathToFragment } = event.data;

    el.innerHTML = '';

    const a = createTag('a', { href: pathToFragment }, '', { parent: el });

    loadFragment(a);
  };
}
