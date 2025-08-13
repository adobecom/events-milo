import { createTag, readBlockConfig } from '../../scripts/utils.js';

const CONFIG = {
  PRELOAD_DOMAINS: [
    'www.youtube-nocookie.com',
    'www.youtube.com',
    'www.google.com',
    'googleads.g.doubleclick.net',
    'static.doubleclick.net',
  ],
  YOUTUBE_EMBED_BASE: 'https://www.youtube-nocookie.com/embed',
  YOUTUBE_CHAT_BASE: 'https://www.youtube.com/live_chat',
  THUMBNAIL_BASE: 'https://i.ytimg.com/vi',
  PLAYER_OPTIONS: {
    autoplay: 'autoplay',
    mute: 'mute',
    'show-controls': 'controls',
    'show-player-title-actions': 'modestbranding',
    'show-suggestions-after-video-ends': 'rel',
  },
  IFRAME_ATTRIBUTES: {
    allowfullscreen: true,
    allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
  },
  DEFAULT_TITLE: 'YouTube video player',
  CHAT_LOAD_DELAY: 100,
};

export class YouTubeChat {
  constructor() {
    this.config = null;
    this.videoId = null;
    this.chatEnabled = false;
    this.videoLoaded = false;
    this.pendingChatSection = null;
    this.chatContainer = null;
  }

  async init(block) {
    try {
      this.config = readBlockConfig(block);
      this.videoId = this.config.videoid;
      this.chatEnabled = this.config.chatenabled?.toLowerCase() === 'true';

      if (!this.videoId) throw new Error('Invalid or missing video ID.');

      YouTubeChat.preconnect();
      block.textContent = '';
      block.append(this.buildStream());
    } catch (err) {
      window.lana?.log(`YouTube Chat Block: ${err.message}`);
      block.remove();
    }
  }

  static preconnect() {
    if (YouTubeChat.preconnected) return;
    YouTubeChat.preconnected = true;

    CONFIG.PRELOAD_DOMAINS.forEach((domain) => {
      const link = createTag('link', { rel: 'preconnect', href: `https://${domain}` });
      document.head.appendChild(link);
    });
  }

  buildStream() {
    const autoplay = this.isAutoplayEnabled();
    const container = createTag('div', { class: `youtube-stream${!this.chatEnabled || !autoplay ? ' single-column' : ''}${this.chatEnabled ? ' has-chat' : ''}`.trim() });

    container.append(this.buildVideoSection(autoplay));
    if (this.chatEnabled && autoplay) container.append(this.buildChatSection());
    if (this.chatEnabled && !autoplay) this.pendingChatSection = this.buildChatSection();

    return container;
  }

  buildVideoSection(autoplay) {
    const container = createTag('div', { class: 'youtube-video-container' });
    const wrapper = createTag('div', { class: 'iframe-container' });

    if (autoplay) {
      this.insertAutoplayIframe(wrapper);
    } else {
      this.insertLitePlayer(wrapper);
    }

    container.append(wrapper);
    return container;
  }

  insertAutoplayIframe(wrapper) {
    const iframe = this.createVideoIframe(this.buildEmbedUrl(true));
    wrapper.append(iframe);
    this.videoLoaded = true;
    if (this.chatEnabled) setTimeout(() => this.loadChat(), CONFIG.CHAT_LOAD_DELAY);
  }

  insertLitePlayer(wrapper) {
    const liteYT = createTag('lite-youtube', {
      videoid: this.videoId,
      playlabel: this.getVideoTitle(),
      params: this.buildUrlParams(),
    });

    liteYT.style.backgroundImage = `url("${CONFIG.THUMBNAIL_BASE}/${this.videoId}/hqdefault.jpg")`;
    liteYT.style.backgroundSize = 'cover';
    liteYT.style.backgroundPosition = 'center';

    const playBtn = createTag('button', { type: 'button', class: 'lty-playbtn' });
    const label = createTag('span', { class: 'lyt-visually-hidden' });
    label.textContent = this.getVideoTitle();
    playBtn.append(label);
    liteYT.append(playBtn);

    liteYT.addEventListener('click', () => this.activateLitePlayer(liteYT));
    wrapper.append(liteYT);
  }

  activateLitePlayer(liteYT) {
    if (this.videoLoaded) return;
    this.videoLoaded = true;
    liteYT.classList.add('lyt-activated');

    const container = liteYT.closest('.youtube-stream');
    if (this.pendingChatSection && container) {
      container.append(this.pendingChatSection);
      container.classList.remove('single-column');
    }

    const iframe = this.createVideoIframe(this.buildEmbedUrl(true));
    liteYT.insertAdjacentElement('afterend', iframe);
    liteYT.remove();

    if (this.chatEnabled) this.loadChat();
  }

  buildChatSection() {
    this.chatContainer = createTag('div', { class: 'youtube-chat-container' });
    const wrapper = createTag('div', { class: 'iframe-container' });
    const msg = this.isAutoplayEnabled() ? 'Loading chat...' : 'Chat will load when video is played';
    const placeholder = createTag('div', { class: 'youtube-chat-placeholder' }, msg);
    wrapper.append(placeholder);
    this.chatContainer.append(wrapper);
    return this.chatContainer;
  }

  loadChat() {
    if (!this.chatContainer) return;
    const iframe = createTag('iframe', {
      class: 'youtube-chat',
      src: `${CONFIG.YOUTUBE_CHAT_BASE}?v=${this.videoId}&embed_domain=${window.location.hostname}`,
      title: 'YouTube live chat',
    });

    const wrapper = createTag('div', { class: 'iframe-container' }, iframe);
    this.chatContainer.innerHTML = '';
    this.chatContainer.append(wrapper);
  }

  createVideoIframe(src) {
    return createTag('iframe', {
      class: 'youtube-video',
      src,
      title: this.getVideoTitle(),
      loading: 'lazy',
      ...CONFIG.IFRAME_ATTRIBUTES,
    });
  }

  getVideoTitle() {
    return this.config.videotitle || CONFIG.DEFAULT_TITLE;
  }

  isAutoplayEnabled() {
    return this.config.autoplay?.toLowerCase() === 'true';
  }

  buildEmbedUrl(autoplay = false) {
    const base = `${CONFIG.YOUTUBE_EMBED_BASE}/${this.videoId}`;
    const params = new URLSearchParams();

    if (autoplay) {
      params.append('autoplay', '1');
      params.append('mute', '1');
    }

    Object.entries(CONFIG.PLAYER_OPTIONS).forEach(([key, param]) => {
      if (this.config[key]?.toLowerCase?.() === 'true') {
        params.append(param, '1');
      }
    });

    return `${base}?${params}`;
  }

  buildUrlParams() {
    const params = new URLSearchParams();
    Object.entries(CONFIG.PLAYER_OPTIONS).forEach(([key, param]) => {
      if (this.config[key]?.toLowerCase?.() === 'true') {
        params.append(param, '1');
      }
    });
    return params.toString();
  }
}

export default async function init(block) {
  const youtubeChat = new YouTubeChat();
  await youtubeChat.init(block);
}
