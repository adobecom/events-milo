import { createTag, readBlockConfig } from '../../scripts/utils.js';

export class YouTubeChat {
  constructor() {
    this.config = null;
    this.videoId = null;
    this.chatEnabled = false;
  }

  async init(block) {
    this.config = readBlockConfig(block);
    this.videoId = this.config['videoid'];
    this.chatEnabled = this.config['chatenabled']?.toLowerCase() === 'true';

    if (!this.videoId) {
      window.lana?.log('YouTube Chat Block: Invalid or missing video ID.');
      block.remove();
      return;
    }

    block.textContent = '';
    block.append(this.buildYouTubeStream());
  }

  buildYouTubeStream() {
    const container = createTag('div', {
      class: `youtube-stream${!this.chatEnabled ? ' single-column' : ''}`,
    });

    container.append(this.createVideoSection());
    if (this.chatEnabled) {
      container.append(this.createChatSection());
    }

    return container;
  }

  createVideoSection() {
    const iframe = createTag('iframe', {
      class: 'youtube-video',
      src: this.buildEmbedUrl(),
      allowfullscreen: true,
      title: this.config.videotitle || 'YouTube video player',
    });

    const wrapper = createTag('div', { class: 'iframe-container' }, iframe);
    return createTag('div', { class: 'youtube-video-container' }, wrapper);
  }

  createChatSection() {
    const chatIframe = createTag('iframe', {
      class: 'youtube-chat',
      src: `https://www.youtube.com/live_chat?v=${this.videoId}&embed_domain=${window.location.hostname}`,
      title: 'YouTube live chat',
    });

    const wrapper = createTag('div', { class: 'iframe-container' }, chatIframe);
    return createTag('div', { class: 'youtube-chat-container' }, wrapper);
  }

  buildEmbedUrl() {
    const base = `https://www.youtube.com/embed/${this.videoId}`;
    const params = new URLSearchParams();

    const options = {
      autoplay: 'autoplay',
      mute: 'mute',
      'show-controls': 'controls',
      'show-player-title-actions': 'modestbranding',
      'show-suggestions-after-video-ends': 'rel',
    };

    for (const [key, param] of Object.entries(options)) {
      if (this.config[key]?.toLowerCase?.() === 'true') {
        params.append(param, '1');
      }
    }

    return params.toString() ? `${base}?${params}` : base;
  }
}

export default async function init(block) {
  const youtubeChat = new YouTubeChat();
  await youtubeChat.init(block);
}
