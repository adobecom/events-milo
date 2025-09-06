import { createTag, getIcon } from './utils.js';

export default async function addPagePathIndexerWidget() {
  const params = new URLSearchParams(document.location.search);
  if (!params.get('previewMode') || params.get('previewMode') !== 'true') {
    return;
  }

  // const chronoBoxes = document.querySelectorAll('.chrono-box');
  // const schedules = Array.from(chronoBoxes)
  //   .map((chronoBox) => {
  //   return {
  //     id: chronoBox.dataset.scheduleId,
  //     name: chronoBox.dataset.scheduleName,
  //   };
  // })
  //   .filter((schedule) => schedule.id);

  // mock schedules
  const schedules = [
    { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Schedule 1' },
    { id: 'f9e8d7c6-b5a4-3210-9876-543210fedcba', name: 'Schedule 2' },
    { id: '12345678-9abc-def0-1234-56789abcdef0' },
  ];
  const pagePath = window.location.pathname;
  const pagePathIndexerWidget = createTag('div', { class: 'page-path-indexer-widget dark' });

  // Create hover tab that remains visible when widget is hidden
  const hoverTab = createTag('div', { class: 'page-path-indexer-hover-tab' }, getIcon('clock-white'), { parent: pagePathIndexerWidget });

  const indexAllButton = createTag('button', { class: 'page-path-indexer-button con-button outline' }, 'Index all schedules on this page', { parent: pagePathIndexerWidget });

  const scheduleIdList = createTag('div', { class: 'page-path-indexer-schedule-id-list' });
  createTag('div', { class: 'page-path-indexer-schedule-id-list-title' }, 'Schedules on this page', { parent: scheduleIdList });
  const scheduleIdListItems = [];
  const individualIndexButtons = [];

  // const allScheduleIndexedPagePaths = Promise.all(scheduleIds.map(async (id) => {
  //   const indexedPagesForThisSchedule = await getSchedulePagePaths(id);
  //   return { [id]: indexedPagesForThisSchedule };
  // }));

  const mockedAllScheduleIndexedPagePaths = {
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890': [window.location.pathname, '/page-2', '/page-3'],
    'f9e8d7c6-b5a4-3210-9876-543210fedcba': ['/page-2', '/page-3'],
    '12345678-9abc-def0-1234-56789abcdef0': ['/page-7', '/page-8', '/page-9'],
  };

  schedules.forEach(async (schedule) => {
    const scheduleIdItem = createTag('div', { class: 'page-path-indexer-schedule-id-item', 'data-schedule-id': schedule.id });
    createTag('span', { class: 'page-path-indexer-schedule-id-item-text' }, schedule.name || schedule.id, { parent: scheduleIdItem });
    const statusArea = createTag('div', { class: 'page-path-indexer-schedule-id-item-status' }, '', { parent: scheduleIdItem });

    const indexedStatusWrapper = createTag('div', { class: 'page-path-indexer-schedule-id-item-status-wrapper indexed' }, '', { parent: statusArea });
    const indexedStatusText = createTag('span', { class: 'page-path-indexer-schedule-id-item-status-text' }, 'Indexed', { parent: indexedStatusWrapper });
    const greenDot = getIcon('dot-green');
    const notIndexedStatusWrapper = createTag('div', { class: 'page-path-indexer-schedule-id-item-status-wrapper not-indexed' }, '', { parent: statusArea });
    const notIndexedStatusAction = createTag('button', {
      class: 'page-path-indexer-schedule-id-item-status-text con-button outline',
      role: 'button',
      tabindex: 0,
      'aria-label': `Index this page for schedule ${schedule.id}`,
    }, 'Index', { parent: notIndexedStatusWrapper });

    indexedStatusWrapper.append(indexedStatusText, greenDot);
    notIndexedStatusWrapper.append(notIndexedStatusAction);

    scheduleIdList.append(scheduleIdItem);
    scheduleIdListItems.push(scheduleIdItem);
    individualIndexButtons.push(notIndexedStatusAction);

    const isThisPageIndexed = mockedAllScheduleIndexedPagePaths[schedule.id]
      .includes(window.location.pathname);
    if (isThisPageIndexed) {
      scheduleIdItem.classList.add('indexed');
    }

    notIndexedStatusAction.addEventListener('click', () => {
      notIndexedStatusAction.disabled = true;
      // await indexPathToSchedule(id, pagePath);

      // mock api calls response
      setTimeout(() => {
        console.log('mock api calls response', schedule.id, pagePath);
        const mockApiCallsResponse = {
          ok: true,
          data: { message: 'Path indexed to schedule' },
        };

        scheduleIdItem.classList.toggle('indexed', mockApiCallsResponse.ok);
        notIndexedStatusAction.removeAttribute('disabled');
      }, 1000);
    });
  });

  pagePathIndexerWidget.append(hoverTab);
  pagePathIndexerWidget.append(scheduleIdList);
  pagePathIndexerWidget.append(indexAllButton);
  document.body.append(pagePathIndexerWidget);

  if (schedules.length === 0) return;

  // Auto-hide widget after 3 seconds of inactivity
  let hideTimeout;
  const autoHideDelay = 3000;

  const showWidget = () => {
    clearTimeout(hideTimeout);
    pagePathIndexerWidget.classList.remove('hidden');
  };

  const hideWidget = () => {
    hideTimeout = setTimeout(() => {
      pagePathIndexerWidget.classList.add('hidden');
    }, autoHideDelay);
  };

  // Show widget on hover, hide after delay when not hovering
  pagePathIndexerWidget.addEventListener('mouseenter', showWidget);
  pagePathIndexerWidget.addEventListener('mouseleave', hideWidget);

  // Initial auto-hide
  hideWidget();

  indexAllButton.addEventListener('click', async () => {
    indexAllButton.disabled = true;
    // Disable all individual index buttons
    individualIndexButtons.forEach((button) => { button.disabled = true; });

    const indexingPromises = schedules.map(async (schedule) => {
      const scheduleIdItem = scheduleIdListItems.find((s) => s.dataset.scheduleId === schedule.id);
      if (scheduleIdItem && scheduleIdItem.classList.contains('indexed')) {
        return;
      }
      // await indexPathToSchedule(scheduleId, pagePath);
      // mock api calls response
      await new Promise((resolve) => {
        setTimeout(() => {
          console.log('mock api calls response', schedule.id, pagePath);
          const mockApiCallsResponse = {
            ok: true,
            data: { message: 'Path indexed to schedule' },
          };

          scheduleIdItem.classList.toggle('indexed', mockApiCallsResponse.ok);
          resolve();
        }, 1000);
      });
    });

    await Promise.all(indexingPromises);
    indexAllButton.removeAttribute('disabled');
    // Re-enable all individual index buttons
    individualIndexButtons.forEach((button) => { button.removeAttribute('disabled'); });
  });
}
