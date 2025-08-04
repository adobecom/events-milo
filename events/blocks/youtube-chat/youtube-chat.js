import { createTag, readBlockConfig } from '../../scripts/utils.js';

// Constants
const CONFIG = {
  ASPECT_RATIO: 56.25, // 16:9 aspect ratio
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
    this.isLoaded = false;
    this.isMobile = navigator.userAgent.includes('Mobi');
    this.pendingChatSection = null;
  }

  async init(block) {
    try {
      this.config = readBlockConfig(block);
      this.videoId = this.config['videoid'];
      this.chatEnabled = this.config['chatenabled']?.toLowerCase() === 'true';

      if (!this.videoId) {
        throw new Error('Invalid or missing video ID.');
      }

      this.warmConnections();
      this.renderBlock(block);
    } catch (error) {
      window.lana?.log(`YouTube Chat Block: ${error.message}`);
      block.remove();
    }
  }

  renderBlock(block) {
    block.textContent = '';
    block.append(this.buildYouTubeStream());
  }

  warmConnections() {
    if (YouTubeChat.preconnected) return;
    YouTubeChat.preconnected = true;
    
    CONFIG.PRELOAD_DOMAINS.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      document.head.appendChild(link);
    });
  }

  buildYouTubeStream() {
    const autoplayEnabled = this.isAutoplayEnabled();
    
    const container = createTag('div', {
      class: this.buildContainerClasses(),
    });

    container.append(this.createVideoSection());
    this.handleChatSection(container, autoplayEnabled);

    return container;
  }

  buildContainerClasses() {
    const baseClasses = ['youtube-stream'];
    
    // Only add single-column class if chat is disabled OR if chat is enabled but autoplay is disabled
    const shouldBeSingleColumn = !this.chatEnabled || (this.chatEnabled && !this.isAutoplayEnabled());
    if (shouldBeSingleColumn) {
      baseClasses.push('single-column');
    }
    
    if (this.chatEnabled) {
      baseClasses.push('has-chat');
    }
    
    return baseClasses.join(' ');
  }

  handleChatSection(container, autoplayEnabled) {
    if (this.chatEnabled && autoplayEnabled) {
      container.append(this.createChatSection());
    } else if (this.chatEnabled && !autoplayEnabled) {
      this.pendingChatSection = this.createChatSection();
    }
  }

  createVideoSection() {
    const videoContainer = createTag('div', { class: 'youtube-video-container' });
    const wrapper = createTag('div', { class: 'iframe-container' });
    
    const autoplayEnabled = this.isAutoplayEnabled();
    
    if (autoplayEnabled) {
      this.createAutoplayVideo(wrapper);
    } else {
      this.createLiteYouTubeVideo(wrapper);
    }
    
    videoContainer.append(wrapper);
    return videoContainer;
  }

  createAutoplayVideo(wrapper) {
    const iframe = this.createVideoIframe(this.buildEmbedUrl());
    wrapper.append(iframe);
    this.isLoaded = true;
    
    if (this.chatEnabled) {
      setTimeout(() => this.loadChat(), CONFIG.CHAT_LOAD_DELAY);
    }
  }

  createLiteYouTubeVideo(wrapper) {
    const liteYT = this.createLiteYouTubeElement();
    wrapper.append(liteYT);
  }

  createLiteYouTubeElement() {
    const liteYT = createTag('lite-youtube', {
      videoid: this.videoId,
      playlabel: this.getVideoTitle(),
      params: this.buildParamsString(),
    });
    
    this.setupLiteYouTubeThumbnail(liteYT);
    this.setupLiteYouTubePlayButton(liteYT);
    liteYT.addEventListener('click', () => this.loadYouTubePlayer(liteYT));
    
    return liteYT;
  }

  setupLiteYouTubeThumbnail(liteYT) {
    liteYT.style.backgroundImage = `url("${CONFIG.THUMBNAIL_BASE}/${this.videoId}/hqdefault.jpg")`;
    liteYT.style.backgroundSize = 'cover';
    liteYT.style.backgroundPosition = 'center';
  }

  setupLiteYouTubePlayButton(liteYT) {
    const playBtnEl = createTag('button', { type: 'button', class: 'lty-playbtn' });
    const playBtnLabelEl = createTag('span', { class: 'lyt-visually-hidden' });
    playBtnLabelEl.textContent = this.getVideoTitle();
    playBtnEl.append(playBtnLabelEl);
    liteYT.append(playBtnEl);
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

  buildParamsString() {
    const params = new URLSearchParams();
    this.addPlayerOptionsToParams(params);
    return params.toString();
  }

  async loadYouTubePlayer(liteYT) {
    if (this.isLoaded) return;
    
    this.isLoaded = true;
    liteYT.classList.add('lyt-activated');
    
    this.addPendingChatSection(liteYT);
    this.replaceLiteYouTubeWithIframe(liteYT);
    
    if (this.chatEnabled) {
      this.loadChat();
    }
  }

  addPendingChatSection(liteYT) {
    const container = liteYT.closest('.youtube-stream');
    if (!container) return;

    if (this.pendingChatSection) {
      container.append(this.pendingChatSection);
      container.classList.remove('single-column');
      this.pendingChatSection = null;
    } else if (this.chatEnabled) {
      // If chat is enabled but no pending section, still remove single-column to show split layout
      container.classList.remove('single-column');
    }
    // If no chat is enabled, keep single-column class (100% width)
  }

  replaceLiteYouTubeWithIframe(liteYT) {
    const iframe = this.createVideoIframe(this.buildEmbedUrlWithAutoplay());
    liteYT.insertAdjacentElement('afterend', iframe);
    liteYT.remove();
  }

  loadChat() {
    const chatContainer = document.querySelector('.youtube-chat-container');
    if (!chatContainer) return;
    
    const chatIframe = this.createChatIframe();
    const wrapper = createTag('div', { class: 'iframe-container' }, chatIframe);
    chatContainer.innerHTML = '';
    chatContainer.append(wrapper);
  }

  createChatIframe() {
    return createTag('iframe', {
      class: 'youtube-chat',
      src: this.buildChatUrl(),
      title: 'YouTube live chat',
    });
  }

  buildChatUrl() {
    return `${CONFIG.YOUTUBE_CHAT_BASE}?v=${this.videoId}&embed_domain=${window.location.hostname}`;
  }

  createChatSection() {
    const chatContainer = createTag('div', { class: 'youtube-chat-container' });
    const wrapper = createTag('div', { class: 'iframe-container' });
    
    const placeholderText = this.getChatPlaceholderText();
    const chatPlaceholder = createTag('div', { 
      class: 'youtube-chat-placeholder' 
    }, placeholderText);
    
    wrapper.append(chatPlaceholder);
    chatContainer.append(wrapper);
    return chatContainer;
  }

  getChatPlaceholderText() {
    const autoplayEnabled = this.isAutoplayEnabled();
    return autoplayEnabled ? 'Loading chat...' : 'Chat will load when video is played';
  }

  buildEmbedUrl() {
    const base = `${CONFIG.YOUTUBE_EMBED_BASE}/${this.videoId}`;
    const params = this.buildUrlParams();
    return params ? `${base}?${params}` : base;
  }

  buildEmbedUrlWithAutoplay() {
    const base = `${CONFIG.YOUTUBE_EMBED_BASE}/${this.videoId}`;
    const params = new URLSearchParams();
    
    // Always add autoplay and mute for click-to-play scenarios
    params.append('autoplay', '1');
    params.append('mute', '1');
    
    this.addPlayerOptionsToParams(params);
    
    return `${base}?${params}`;
  }

  buildUrlParams() {
    const params = new URLSearchParams();
    this.addPlayerOptionsToParams(params);
    return params.toString();
  }

  addPlayerOptionsToParams(params) {
    Object.entries(CONFIG.PLAYER_OPTIONS).forEach(([key, param]) => {
      if (this.config[key]?.toLowerCase?.() === 'true') {
        params.append(param, '1');
      }
    });

    if (this.isMobile) {
      params.append('mute', '1');
    }
  }

  isAutoplayEnabled() {
    return this.config.autoplay?.toLowerCase() === 'true';
  }
}

export default async function init(block) {
  const youtubeChat = new YouTubeChat();
  await youtubeChat.init(block);
}
