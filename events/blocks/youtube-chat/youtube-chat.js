import { createTag, readBlockConfig } from '../../scripts/utils.js';

export default async function init(block) {
  const config = readBlockConfig(block);
  const videoId = config['videoid'];
  const chatEnabled = config.chatenabled?.toLowerCase() === 'true';

  if (!videoId) {
    window.lana?.log('YouTube Chat Block: Invalid or missing video ID.');
    block.remove();
    return;
  }

  block.textContent = '';
  block.append(buildYouTubeStream(videoId, config, chatEnabled));
}

function buildYouTubeStream(videoId, config, showChat) {
  const container = createTag('div', {
    class: `youtube-stream${!showChat ? ' single-column' : ''}`,
  });

  container.append(createVideoSection(videoId, config));
  if (showChat) container.append(createChatSection(videoId));

  return container;
}

function createVideoSection(videoId, config) {
  const iframe = createTag('iframe', {
    class: 'youtube-video',
    src: buildEmbedUrl(videoId, config),
    allowfullscreen: true,
    title: config.title || 'YouTube video player',
    loading: 'lazy',
  });

  const wrapper = createTag('div', { class: 'iframe-container' }, iframe);
  return createTag('div', { class: 'youtube-video-container' }, wrapper);
}

function createChatSection(videoId) {
  const chatIframe = createTag('iframe', {
    class: 'youtube-chat',
    src: `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname}`,
    title: `YouTube live chat`,
    loading: 'lazy',
  });

  const wrapper = createTag('div', { class: 'iframe-container' }, chatIframe);
  return createTag('div', { class: 'youtube-chat-container' }, wrapper);
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

  for (const [key, param] of Object.entries(options)) {
    if (config[key]?.toLowerCase?.() === 'true') {
      params.append(param, '1');
    }
  }

  return params.toString() ? `${base}?${params}` : base;
}
