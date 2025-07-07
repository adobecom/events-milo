import { createTag, readBlockConfig } from '../../scripts/utils.js';

export default async function init(block) {
  const config = readBlockConfig(block);
  if (!config['video-id']) return;

  const container = createTag('div', { class: 'youtube-stream' });

  // Build YouTube embed URL with parameters
  const embedUrl = buildEmbedUrl(config);

  const videoIframe = createTag('iframe', {
    class: 'youtube-video',
    src: embedUrl,
    allowfullscreen: true,
  });

  const videoWrap = createTag('div', { class: 'youtube-video-container' }, videoIframe);
  container.append(videoWrap);

  // If chat-id is present, add the chat iframe
  if (config['chat-id']) {
    const chatIframe = createTag('iframe', {
      class: 'youtube-chat',
      src: `https://www.youtube.com/live_chat?v=${config['video-id']}&embed_domain=${window.location.hostname}`,
    });

    const chatWrap = createTag('div', { class: 'youtube-chat-container' }, chatIframe);
    container.append(chatWrap);
  }

  block.textContent = ''; // Clean authored content
  block.append(container);
}

function buildEmbedUrl(config) {
  const baseUrl = `https://www.youtube.com/embed/${config['video-id']}`;
  const params = new URLSearchParams();

  // Add optional parameters
  if (config.autoplay === 'true') params.append('autoplay', '1');
  if (config.mute === 'true') params.append('mute', '1');
  if (config['show-controls'] === 'true') params.append('controls', '1');
  if (config['show-player-title-actions'] === 'true') params.append('modestbranding', '0');
  if (config['show-suggestions-after-video-ends'] === 'true') params.append('rel', '1');

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
