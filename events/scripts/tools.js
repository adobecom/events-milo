import { createTag, getIcon } from './utils.js';
import { indexPathToSchedule } from './esp-controller.js';

export default function addPagePathIndexerWidget() {
  const chronoBoxes = document.querySelectorAll('.chrono-box');
  const scheduleIds = chronoBoxes
    .map((chronoBox) => chronoBox.dataset.scheduleId)
    .filter((scheduleId) => scheduleId);
  const pagePathIndexerWidget = createTag('div', { class: 'page-path-indexer-widget' });
  const indexButton = createTag('button', { class: 'page-path-indexer-button' }, getIcon('data-upload'));
  pagePathIndexerWidget.append(indexButton);
  document.body.append(pagePathIndexerWidget);

  if (scheduleIds.length === 0) return;

  indexButton.addEventListener('click', () => {
    const pagePath = window.location.pathname;
    scheduleIds.forEach((scheduleId) => {
      indexPathToSchedule(scheduleId, pagePath);
    });
  });
}
