import { LIBS } from '../../scripts/scripts.js';
import { getIcon } from '../../scripts/utils.js';

const { createTag, getMetadata } = await import(`${LIBS}/scripts/utils.js`);

function removeURLParameter(url, parameter) {
  const params = new URLSearchParams(url.search);

  params.delete(parameter);

  url.search = params.toString();

  return url.toString();
}

function getEventStatus() {
  const publishedMeta = getMetadata('status')?.toLowerCase() === 'live';
  const dot = publishedMeta ? getIcon('dot-purple') : getIcon('dot-green');
  const text = publishedMeta ? 'Published' : 'Draft';

  const statusTag = createTag('span', { class: 'event-status' });
  statusTag.append(dot, text);
  return statusTag.outerHTML;
}

function getPreviewTarget() {
  if (window.location.hash.startsWith('#rsvp-form')) return 'RSVP';

  const params = new URLSearchParams(document.location.search);
  const testTiming = params.get('timing');
  const eventEndTiming = getMetadata('local-end-time-millis');

  if (testTiming && eventEndTiming) return +testTiming > +eventEndTiming ? 'Event details (Post-event)' : 'Event details (pre-event)';

  return 'Event details';
}

function getCloseBtn(el) {
  const btn = createTag('button', { class: 'preview-close-btn' }, getIcon('close-x-circle'));

  btn.addEventListener('click', () => {
    el.remove();
    removeURLParameter(window.location, 'previewMode');
  });

  return btn;
}

export default async function init(el) {
  const params = new URLSearchParams(document.location.search);
  if (!params.get('previewMode')) {
    el.remove();
    return;
  }

  const infoContainer = createTag('div', { class: 'preview-info' });
  const actionContainer = createTag('div', { class: 'preview-actions' }, getCloseBtn(el));

  const eventNameWrapper = createTag('div', { class: 'preview-info-item' }, '', { parent: infoContainer });
  createTag('span', { class: 'preview-info-key' }, 'Event name: ', { parent: eventNameWrapper });
  createTag('span', { class: 'preview-info-val' }, getMetadata('event-title'), { parent: eventNameWrapper });

  const previewTargetWrapper = createTag('div', { class: 'preview-info-item' }, '', { parent: infoContainer });
  createTag('span', { class: 'preview-info-key' }, 'Preview: ', { parent: previewTargetWrapper });
  createTag('span', { class: 'preview-info-val' }, `${getPreviewTarget()}`, { parent: previewTargetWrapper });

  const eventStatusWrapper = createTag('div', { class: 'preview-info-item' }, '', { parent: infoContainer });
  createTag('span', { class: 'preview-info-key' }, 'Status: ', { parent: eventStatusWrapper });
  createTag('span', { class: 'preview-info-val' }, `${getEventStatus()}`, { parent: eventStatusWrapper });

  el.append(infoContainer, actionContainer);
}
