import { createTag, getIcon } from './utils.js';

export default async function addPagePathIndexerWidget() {
  const params = new URLSearchParams(document.location.search);
  if (!params.get('previewMode') || params.get('previewMode') !== 'true') {
    return;
  }

  // const chronoBoxes = document.querySelectorAll('.chrono-box');
  // const scheduleIds = Array.from(chronoBoxes)
  //   .map((chronoBox) => chronoBox.dataset.scheduleId)
  //   .filter((scheduleId) => scheduleId);

  // const chevLeft = getIcon('chev-left');
  // const chevRight = getIcon('chev-right');

  // mock schedule ids
  const scheduleIds = ['123', '456', '789'];
  const pagePath = window.location.pathname;
  const pagePathIndexerWidget = createTag('div', { class: 'page-path-indexer-widget dark' });
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
    123: [window.location.pathname, '/page-2', '/page-3'],
    456: ['/page-2', '/page-3'],
    789: ['/page-7', '/page-8', '/page-9'],
  };

  scheduleIds.forEach(async (id) => {
    const scheduleIdItem = createTag('div', { class: 'page-path-indexer-schedule-id-item', 'data-schedule-id': id });
    createTag('span', { class: 'page-path-indexer-schedule-id-item-text' }, id, { parent: scheduleIdItem });
    const statusArea = createTag('div', { class: 'page-path-indexer-schedule-id-item-status' }, '', { parent: scheduleIdItem });

    const indexedStatusWrapper = createTag('div', { class: 'page-path-indexer-schedule-id-item-status-wrapper indexed' }, '', { parent: statusArea });
    const indexedStatusText = createTag('span', { class: 'page-path-indexer-schedule-id-item-status-text' }, 'Indexed', { parent: indexedStatusWrapper });
    const greenDot = getIcon('dot-green');
    const notIndexedStatusWrapper = createTag('div', { class: 'page-path-indexer-schedule-id-item-status-wrapper not-indexed' }, '', { parent: statusArea });
    const notIndexedStatusAction = createTag('button', {
      class: 'page-path-indexer-schedule-id-item-status-text con-button outline',
      role: 'button',
      tabindex: 0,
      'aria-label': `Index this page for schedule ${id}`,
    }, 'Index', { parent: notIndexedStatusWrapper });

    indexedStatusWrapper.append(indexedStatusText, greenDot);
    notIndexedStatusWrapper.append(notIndexedStatusAction);

    scheduleIdList.append(scheduleIdItem);
    scheduleIdListItems.push(scheduleIdItem);
    individualIndexButtons.push(notIndexedStatusAction);

    const isThisPageIndexed = mockedAllScheduleIndexedPagePaths[id]
      .includes(window.location.pathname);
    if (isThisPageIndexed) {
      scheduleIdItem.classList.add('indexed');
    }

    notIndexedStatusAction.addEventListener('click', () => {
      notIndexedStatusAction.disabled = true;
      // await indexPathToSchedule(id, pagePath);

      // mock api calls response
      setTimeout(() => {
        console.log('mock api calls response', id, pagePath);
        const mockApiCallsResponse = {
          ok: true,
          data: { message: 'Path indexed to schedule' },
        };

        scheduleIdItem.classList.toggle('indexed', mockApiCallsResponse.ok);
        notIndexedStatusAction.removeAttribute('disabled');
      }, 1000);
    });
  });

  pagePathIndexerWidget.append(scheduleIdList);
  pagePathIndexerWidget.append(indexAllButton);
  document.body.append(pagePathIndexerWidget);

  if (scheduleIds.length === 0) return;

  indexAllButton.addEventListener('click', async () => {
    indexAllButton.disabled = true;
    // Disable all individual index buttons
    individualIndexButtons.forEach((button) => { button.disabled = true; });

    const indexingPromises = scheduleIds.map(async (scheduleId) => {
      const scheduleIdItem = scheduleIdListItems.find((s) => s.dataset.scheduleId === scheduleId);
      if (scheduleIdItem && scheduleIdItem.classList.contains('indexed')) {
        return;
      }
      // await indexPathToSchedule(scheduleId, pagePath);
      // mock api calls response
      await new Promise((resolve) => {
        setTimeout(() => {
          console.log('mock api calls response', scheduleId, pagePath);
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
