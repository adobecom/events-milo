import { createTag, readBlockConfig } from '../../scripts/utils.js';

export default async function init(block) {
  const config = readBlockConfig(block);
  const videoId = config['videoId'];
  const chatEnabled = config['chatId'];

  if (!videoId) return;

  block.textContent = '';
  const streamEl = buildYouTubeStream(videoId, config, chatEnabled);
  block.append(streamEl);
}

function buildYouTubeStream(videoId, config, showChat) {
  const container = createTag('div', { class: `youtube-stream${!showChat ? ' single-column' : ''}` });
  const videoIframe = createTag('iframe', {
    class: 'youtube-video',
    src: buildEmbedUrl(videoId, config),
    allowfullscreen: true,
  });

  const videoContainer = createTag('div', { class: 'iframe-container' }, videoIframe);
  const videoWrapper = createTag('div', { class: 'youtube-video-container'}, videoContainer);
  container.append(videoWrapper);

  if (showChat) {
    const chatIframe = createTag('iframe', {
      class: 'youtube-chat',
      src: `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname}`,
    });
    const chatContainer = createTag('div', { class: 'iframe-container' }, chatIframe);
    const chatWrap = createTag('div', { class: 'youtube-chat-container' }, chatContainer);
    container.append(chatWrap);
  }
  

  return container;
}

function buildEmbedUrl(videoId, config) {
  const base = `https://www.youtube.com/embed/${videoId}`;
  const params = new URLSearchParams();

  const options = {
    autoplay: 'autoplay',
    mute: 'mute',
    'show-controls': 'controls',
    'show-player-title-actions': 'modestbranding',
    'show-suggestions-after-video-ends': 'rel',
  };

  Object.entries(options).forEach(([key, param]) => {
    if (config[key] === 'true') params.append(param, '1');
  });

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}
