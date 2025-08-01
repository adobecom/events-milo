import { createTag, readBlockConfig } from '../../scripts/utils.js';

export class YouTubeChat {
  constructor() {
    this.config = null;
    this.videoId = null;
    this.chatEnabled = false;
    this.isLoaded = false;
    this.isMobile = navigator.userAgent.includes('Mobi');
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

    // Preconnect to YouTube domains for better performance
    this.warmConnections();

    block.textContent = '';
    block.append(this.buildYouTubeStream());
  }

  warmConnections() {
    if (YouTubeChat.preconnected) return;
    YouTubeChat.preconnected = true;
    
    const domains = [
      'www.youtube-nocookie.com',
      'www.youtube.com',
      'www.google.com',
      'googleads.g.doubleclick.net',
      'static.doubleclick.net',
    ];
    
    domains.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${url}`;
      document.head.appendChild(link);
    });
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
    const videoContainer = createTag('div', { class: 'youtube-video-container' });
    const wrapper = createTag('div', { class: 'iframe-container' });
    
    // Check if autoplay is enabled
    const autoplayEnabled = this.config.autoplay?.toLowerCase() === 'true';
    
    if (autoplayEnabled) {
      // For autoplay, create the iframe directly but with optimized loading
      const iframe = createTag('iframe', {
        class: 'youtube-video',
        src: this.buildEmbedUrl(),
        allowfullscreen: true,
        title: this.config.videotitle || 'YouTube video player',
        allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
        loading: 'lazy', // Use lazy loading for better performance
      });
      
      wrapper.append(iframe);
      this.isLoaded = true;
      
      // Load chat immediately if enabled - add a small delay to ensure iframe is ready
      if (this.chatEnabled) {
        setTimeout(() => this.loadChat(), 100);
      }
    } else {
      // For non-autoplay, use lite-youtube approach
      const liteYT = createTag('lite-youtube', {
        videoid: this.videoId,
        playlabel: this.config.videotitle || 'YouTube video player',
        params: this.buildParamsString(),
      });
      
      // Set background image for thumbnail
      liteYT.style.backgroundImage = `url("https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg")`;
      liteYT.style.backgroundSize = 'cover';
      liteYT.style.backgroundPosition = 'center';
      
      // Create play button
      const playBtnEl = createTag('button', { type: 'button', class: 'lty-playbtn' });
      const playBtnLabelEl = createTag('span', { class: 'lyt-visually-hidden' });
      playBtnLabelEl.textContent = this.config.videotitle || 'YouTube video player';
      playBtnEl.append(playBtnLabelEl);
      liteYT.append(playBtnEl);
      
      // Add click handler to load actual player and chat
      liteYT.addEventListener('click', () => this.loadYouTubePlayer(liteYT));
      
      wrapper.append(liteYT);
    }
    
    videoContainer.append(wrapper);
    return videoContainer;
  }

  buildParamsString() {
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

    // Add mobile-specific params
    if (this.isMobile) {
      params.append('mute', '1');
    }

    return params.toString();
  }

  async loadYouTubePlayer(liteYT) {
    if (this.isLoaded) return;
    
    this.isLoaded = true;
    liteYT.classList.add('lyt-activated');
    
    // Show chat container if it was hidden (non-autoplay mode)
    if (this.chatContainer) {
      this.chatContainer.style.display = 'block';
    }
    
    // Create and load the actual iframe with autoplay enabled
    const iframe = createTag('iframe', {
      class: 'youtube-video',
      src: this.buildEmbedUrlWithAutoplay(),
      allowfullscreen: true,
      title: this.config.videotitle || 'YouTube video player',
      allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
    });
    
    // Replace lite-youtube with iframe
    liteYT.insertAdjacentElement('afterend', iframe);
    liteYT.remove();
    
    // Load chat if enabled
    if (this.chatEnabled) {
      this.loadChat();
    }
  }

  loadChat() {
    const chatContainer = document.querySelector('.youtube-chat-container');
    if (!chatContainer) return;
    
    const chatIframe = createTag('iframe', {
      class: 'youtube-chat',
      src: `https://www.youtube.com/live_chat?v=${this.videoId}&embed_domain=${window.location.hostname}`,
      title: 'YouTube live chat',
    });

    const wrapper = createTag('div', { class: 'iframe-container' }, chatIframe);
    chatContainer.innerHTML = '';
    chatContainer.append(wrapper);
  }

  createChatSection() {
    // Initially create an empty chat container
    const chatContainer = createTag('div', { class: 'youtube-chat-container' });
    const wrapper = createTag('div', { class: 'iframe-container' });
    
    // Check if autoplay is enabled
    const autoplayEnabled = this.config.autoplay?.toLowerCase() === 'true';
    
    if (autoplayEnabled) {
      // For autoplay, show placeholder that will be replaced by actual chat
      const chatPlaceholder = createTag('div', { 
        class: 'youtube-chat-placeholder' 
      }, 'Loading chat...');
      
      wrapper.append(chatPlaceholder);
    } else {
      // For non-autoplay, hide chat initially
      chatContainer.style.display = 'none';
      this.chatContainer = chatContainer; // Store reference for later showing
      
      const chatPlaceholder = createTag('div', { 
        class: 'youtube-chat-placeholder' 
      }, 'Chat will load when video is played');
      
      wrapper.append(chatPlaceholder);
    }
    
    chatContainer.append(wrapper);
    return chatContainer;
  }

  buildEmbedUrl() {
    const base = `https://www.youtube-nocookie.com/embed/${this.videoId}`;
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

    // Add mobile-specific params
    if (this.isMobile) {
      params.append('mute', '1');
    }

    return params.toString() ? `${base}?${params}` : base;
  }

  buildEmbedUrlWithAutoplay() {
    const base = `https://www.youtube-nocookie.com/embed/${this.videoId}`;
    const params = new URLSearchParams();

    // Always add autoplay and mute for click-to-play scenarios
    params.append('autoplay', '1');
    params.append('mute', '1'); // Required for autoplay to work

    const options = {
      'show-controls': 'controls',
      'show-player-title-actions': 'modestbranding',
      'show-suggestions-after-video-ends': 'rel',
    };

    for (const [key, param] of Object.entries(options)) {
      if (this.config[key]?.toLowerCase?.() === 'true') {
        params.append(param, '1');
      }
    }

    // Add mobile-specific params
    if (this.isMobile) {
      params.append('mute', '1');
    }

    return `${base}?${params}`;
  }
}

export default async function init(block) {
  const youtubeChat = new YouTubeChat();
  await youtubeChat.init(block);
}
