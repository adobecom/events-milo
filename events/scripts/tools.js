import { createTag, getIcon } from './utils.js';
import { indexPathToSchedule } from './esp-controller.js';

export default function addPagePathIndexerWidget() {
  const params = new URLSearchParams(document.location.search);
  if (!params.get('previewMode') || params.get('previewMode') !== 'true') {
    return;
  }

  const chronoBoxes = document.querySelectorAll('.chrono-box');
  const scheduleIds = Array.from(chronoBoxes)
    .map((chronoBox) => chronoBox.dataset.scheduleId)
    .filter((scheduleId) => scheduleId);
  const pagePathIndexerWidget = createTag('div', { class: 'page-path-indexer-widget dark' });

  const indexButton = createTag('button', { class: 'page-path-indexer-button con-button fill' }, getIcon('data-upload'), { parent: pagePathIndexerWidget });
  const indexButtonText = createTag('span', { class: 'page-path-indexer-button-text' }, 'Index Page Schedules', { parent: indexButton });
  pagePathIndexerWidget.append(indexButton);
  document.body.append(pagePathIndexerWidget);

  // if (scheduleIds.length === 0) return;

  indexButton.addEventListener('click', () => {
    const pagePath = window.location.pathname;
    console.log('indexing path to schedule', pagePath, scheduleIds);
    scheduleIds.forEach((scheduleId) => {
      // indexPathToSchedule(scheduleId, pagePath);
    });
  });
}
