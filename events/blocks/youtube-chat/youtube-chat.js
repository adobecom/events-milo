import { createTag, readBlockConfig } from '../../scripts/utils.js';

export default async function init(block) {
  const config = readBlockConfig(block);
  if (!config.videourl) return;

  const container = createTag('div', { class: 'youtube-stream' });

  const videoIframe = createTag('iframe', {
    class: 'youtube-video',
    src: toEmbedURL(config.videourl),
    allowfullscreen: true,
  });

  const videoWrap = createTag('div', { class: 'youtube-video-container' }, videoIframe);
  container.append(videoWrap);

  // If chatId is present, add the chat iframe
  if (config.chatid) {
    const chatIframe = createTag('iframe', {
      class: 'youtube-chat',
      src: `https://www.youtube.com/live_chat?v=${getVideoId(config.videourl)}&embed_domain=${window.location.hostname}`,
    });

    const chatWrap = createTag('div', { class: 'youtube-chat-container' }, chatIframe);
    container.append(chatWrap);
  }

  block.textContent = ''; // Clean authored content
  block.append(container);
}

function toEmbedURL(url) {
  const videoId = getVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

function getVideoId(url) {
  return url.split('v=')[1]?.split('&')[0];
}
