import { createTag, readBlockConfig } from '../../scripts/utils.js';

// Constants
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
  DEFAULT_TITLE: 'YouTube video player',
  CHAT_LOAD_DELAY: 100,
  CSS_CLASSES: {
    STREAM: 'youtube-stream',
    SINGLE_COLUMN: 'single-column',
    HAS_CHAT: 'has-chat',
    VIDEO_CONTAINER: 'youtube-video-container',
    CHAT_CONTAINER: 'youtube-chat-container',
    IFRAME_CONTAINER: 'iframe-container',
    LITE_ACTIVATED: 'lyt-activated',
  },
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

  // ===== INITIALIZATION METHODS =====

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
      this.handleError(error, block);
    }
  }

  handleError(error, block) {
    window.lana?.log(`YouTube Chat Block: ${error.message}`);
    block.remove();
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

  // ===== DOM BUILDING METHODS =====

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
    const baseClasses = [CONFIG.CSS_CLASSES.STREAM];
    
    // Only add single-column class if chat is disabled OR if chat is enabled but autoplay is disabled
    const shouldBeSingleColumn = !this.chatEnabled || (this.chatEnabled && !this.isAutoplayEnabled());
    if (shouldBeSingleColumn) {
      baseClasses.push(CONFIG.CSS_CLASSES.SINGLE_COLUMN);
    }
    
    if (this.chatEnabled) {
      baseClasses.push(CONFIG.CSS_CLASSES.HAS_CHAT);
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
    const videoContainer = createTag('div', { class: CONFIG.CSS_CLASSES.VIDEO_CONTAINER });
    const wrapper = createTag('div', { class: CONFIG.CSS_CLASSES.IFRAME_CONTAINER });
    
    const autoplayEnabled = this.isAutoplayEnabled();
    
    if (autoplayEnabled) {
      this.createAutoplayVideo(wrapper);
    } else {
      this.createLiteYouTubeVideo(wrapper);
    }
    
    videoContainer.append(wrapper);
    return videoContainer;
  }

  // ===== VIDEO CREATION METHODS =====

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
    });
  }

  // ===== CHAT CREATION METHODS =====

  createChatSection() {
    const chatContainer = createTag('div', { class: CONFIG.CSS_CLASSES.CHAT_CONTAINER });
    const wrapper = createTag('div', { class: CONFIG.CSS_CLASSES.IFRAME_CONTAINER });
    
    const placeholderText = this.getChatPlaceholderText();
    const chatPlaceholder = createTag('div', { 
      class: 'youtube-chat-placeholder' 
    }, placeholderText);
    
    wrapper.append(chatPlaceholder);
    chatContainer.append(wrapper);
    return chatContainer;
  }

  loadChat() {
    const chatContainer = document.querySelector(`.${CONFIG.CSS_CLASSES.CHAT_CONTAINER}`);
    if (!chatContainer) return;
    
    const chatIframe = this.createChatIframe();
    const wrapper = createTag('div', { class: CONFIG.CSS_CLASSES.IFRAME_CONTAINER }, chatIframe);
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

  // ===== PLAYER INTERACTION METHODS =====

  async loadYouTubePlayer(liteYT) {
    if (this.isLoaded) return;
    
    this.isLoaded = true;
    liteYT.classList.add(CONFIG.CSS_CLASSES.LITE_ACTIVATED);
    
    this.addPendingChatSection(liteYT);
    this.replaceLiteYouTubeWithIframe(liteYT);
    
    if (this.chatEnabled) {
      this.loadChat();
    }
  }

  addPendingChatSection(liteYT) {
    const container = liteYT.closest(`.${CONFIG.CSS_CLASSES.STREAM}`);
    if (!container) return;

    if (this.pendingChatSection) {
      container.append(this.pendingChatSection);
      container.classList.remove(CONFIG.CSS_CLASSES.SINGLE_COLUMN);
      this.pendingChatSection = null;
    } else if (this.chatEnabled) {
      // If chat is enabled but no pending section, still remove single-column to show split layout
      container.classList.remove(CONFIG.CSS_CLASSES.SINGLE_COLUMN);
    }
    // If no chat is enabled, keep single-column class (100% width)
  }

  replaceLiteYouTubeWithIframe(liteYT) {
    const iframe = this.createVideoIframe(this.buildEmbedUrlWithAutoplay());
    liteYT.insertAdjacentElement('afterend', iframe);
    liteYT.remove();
  }

  // ===== UTILITY METHODS =====

  getVideoTitle() {
    return this.config.videotitle || CONFIG.DEFAULT_TITLE;
  }

  getChatPlaceholderText() {
    const autoplayEnabled = this.isAutoplayEnabled();
    return autoplayEnabled ? 'Loading chat...' : 'Chat will load when video is played';
  }

  isAutoplayEnabled() {
    return this.config.autoplay?.toLowerCase() === 'true';
  }

  // ===== URL BUILDING METHODS =====

  buildParamsString() {
    const params = new URLSearchParams();
    this.addPlayerOptionsToParams(params);
    return params.toString();
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

  buildChatUrl() {
    return `${CONFIG.YOUTUBE_CHAT_BASE}?v=${this.videoId}&embed_domain=${window.location.hostname}`;
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
}

export default async function init(block) {
  const youtubeChat = new YouTubeChat();
  await youtubeChat.init(block);
}
