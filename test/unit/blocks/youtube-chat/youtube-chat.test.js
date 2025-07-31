import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import init, { YouTubeChat } from '../../../../events/blocks/youtube-chat/youtube-chat.js';

const defaultHtml = await readFile({ path: './mocks/default.html' });

describe('YouTube Chat Module', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('YouTubeChat Class', () => {
    let youtubeChat;

    beforeEach(() => {
      youtubeChat = new YouTubeChat();
    });

    describe('constructor', () => {
      it('should initialize with default values', () => {
        expect(youtubeChat.config).to.be.null;
        expect(youtubeChat.videoId).to.be.null;
        expect(youtubeChat.chatEnabled).to.be.false;
        expect(youtubeChat.isLoaded).to.be.false;
        expect(typeof youtubeChat.isMobile).to.equal('boolean');
      });
    });

    describe('buildEmbedUrl', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
      });

      it('should build URL with all parameters when enabled', () => {
        youtubeChat.config = {
          autoplay: 'true',
          mute: 'true',
          'show-controls': 'true',
          'show-player-title-actions': 'true',
          'show-suggestions-after-video-ends': 'false'
        };

        const url = youtubeChat.buildEmbedUrl();
        expect(url).to.include('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
        expect(url).to.include('autoplay=1');
        expect(url).to.include('mute=1');
        expect(url).to.include('controls=1');
        expect(url).to.include('modestbranding=1');
        expect(url).to.not.include('rel=1');
      });

      it('should build URL without parameters when disabled', () => {
        youtubeChat.config = {
          autoplay: 'false',
          mute: 'false',
          'show-controls': 'false',
          'show-player-title-actions': 'false',
          'show-suggestions-after-video-ends': 'false'
        };
        
        const url = youtubeChat.buildEmbedUrl();
        expect(url).to.equal('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
      });

      it('should handle mixed configuration', () => {
        youtubeChat.config = {
          autoplay: 'true',
          mute: 'false',
          'show-controls': 'true',
          'show-player-title-actions': 'false'
        };
        
        const url = youtubeChat.buildEmbedUrl();
        expect(url).to.include('autoplay=1');
        expect(url).to.not.include('mute=1');
        expect(url).to.include('controls=1');
        expect(url).to.not.include('modestbranding=1');
      });
    });

    describe('createVideoSection', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
        youtubeChat.config = {
          videotitle: 'Custom Video Title',
          autoplay: 'true',
          mute: 'true'
        };
      });

      it('should create video section with iframe when autoplay is enabled', () => {
        youtubeChat.config.autoplay = 'true';
        
        const videoSection = youtubeChat.createVideoSection();
        
        expect(videoSection.classList.contains('youtube-video-container')).to.be.true;
        
        const iframeContainer = videoSection.querySelector('.iframe-container');
        expect(iframeContainer).to.not.be.null;
        
        const iframe = iframeContainer.querySelector('.youtube-video');
        expect(iframe).to.not.be.null;
        expect(iframe.tagName).to.equal('IFRAME');
        expect(iframe.getAttribute('src')).to.include('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
        expect(iframe.getAttribute('title')).to.equal('Custom Video Title');
        expect(iframe.getAttribute('loading')).to.equal('lazy');
        
        // Should not have lite-youtube element
        const liteYT = iframeContainer.querySelector('lite-youtube');
        expect(liteYT).to.be.null;
        
        expect(youtubeChat.isLoaded).to.be.true;
      });

      it('should create video section with lite-youtube element when autoplay is disabled', () => {
        youtubeChat.config.autoplay = 'false';
        
        const videoSection = youtubeChat.createVideoSection();
        
        expect(videoSection.classList.contains('youtube-video-container')).to.be.true;
        
        const iframeContainer = videoSection.querySelector('.iframe-container');
        expect(iframeContainer).to.not.be.null;
        
        const liteYT = iframeContainer.querySelector('lite-youtube');
        expect(liteYT).to.not.be.null;
        expect(liteYT.getAttribute('videoid')).to.equal('dQw4w9WgXcQ');
        expect(liteYT.getAttribute('playlabel')).to.equal('Custom Video Title');
        expect(liteYT.style.backgroundImage).to.include('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
        
        const playButton = liteYT.querySelector('.lty-playbtn');
        expect(playButton).to.not.be.null;
        expect(playButton.tagName).to.equal('BUTTON');
        
        const playLabel = playButton.querySelector('.lyt-visually-hidden');
        expect(playLabel).to.not.be.null;
        expect(playLabel.textContent).to.equal('Custom Video Title');
        
        // Should not have iframe initially
        const iframe = iframeContainer.querySelector('.youtube-video');
        expect(iframe).to.be.null;
        
        expect(youtubeChat.isLoaded).to.be.false;
      });

      it('should use default title when not provided', () => {
        delete youtubeChat.config.videotitle;
        youtubeChat.config.autoplay = 'false';
        
        const videoSection = youtubeChat.createVideoSection();
        const liteYT = videoSection.querySelector('lite-youtube');
        
        expect(liteYT.getAttribute('playlabel')).to.equal('YouTube video player');
        
        const playLabel = liteYT.querySelector('.lyt-visually-hidden');
        expect(playLabel.textContent).to.equal('YouTube video player');
      });
    });

    describe('createChatSection', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
      });

      it('should create chat section with placeholder', () => {
        const chatSection = youtubeChat.createChatSection();
        
        expect(chatSection.classList.contains('youtube-chat-container')).to.be.true;
        
        const iframeContainer = chatSection.querySelector('.iframe-container');
        expect(iframeContainer).to.not.be.null;
        
        const placeholder = iframeContainer.querySelector('.youtube-chat-placeholder');
        expect(placeholder).to.not.be.null;
        expect(placeholder.textContent).to.equal('Chat will load when video is played');
      });
    });

    describe('buildYouTubeStream', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
        youtubeChat.config = { videotitle: 'Test Video' };
      });

      it('should build stream with chat when enabled', () => {
        youtubeChat.chatEnabled = true;
        
        const stream = youtubeChat.buildYouTubeStream();
        
        expect(stream.classList.contains('youtube-stream')).to.be.true;
        expect(stream.classList.contains('single-column')).to.be.false;
        
        const videoContainer = stream.querySelector('.youtube-video-container');
        expect(videoContainer).to.not.be.null;
        
        const chatContainer = stream.querySelector('.youtube-chat-container');
        expect(chatContainer).to.not.be.null;
      });

      it('should build stream without chat when disabled', () => {
        youtubeChat.chatEnabled = false;
        
        const stream = youtubeChat.buildYouTubeStream();
        
        expect(stream.classList.contains('youtube-stream')).to.be.true;
        expect(stream.classList.contains('single-column')).to.be.true;
        
        const videoContainer = stream.querySelector('.youtube-video-container');
        expect(videoContainer).to.not.be.null;
        
        const chatContainer = stream.querySelector('.youtube-chat-container');
        expect(chatContainer).to.be.null;
      });
    });

    describe('loadYouTubePlayer', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
        youtubeChat.config = {
          videotitle: 'Test Video',
          autoplay: 'true',
          mute: 'true'
        };
      });

      it('should load YouTube player when called', async () => {
        const liteYT = document.createElement('lite-youtube');
        liteYT.setAttribute('videoid', 'dQw4w9WgXcQ');
        
        await youtubeChat.loadYouTubePlayer(liteYT);
        
        expect(youtubeChat.isLoaded).to.be.true;
        expect(liteYT.classList.contains('lyt-activated')).to.be.true;
        
        const iframe = liteYT.nextElementSibling;
        expect(iframe).to.not.be.null;
        expect(iframe.tagName).to.equal('IFRAME');
        expect(iframe.getAttribute('src')).to.include('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
      });

      it('should not load player twice', async () => {
        const liteYT = document.createElement('lite-youtube');
        liteYT.setAttribute('videoid', 'dQw4w9WgXcQ');
        
        await youtubeChat.loadYouTubePlayer(liteYT);
        const firstIframe = liteYT.nextElementSibling;
        
        await youtubeChat.loadYouTubePlayer(liteYT);
        const secondIframe = liteYT.nextElementSibling;
        
        expect(firstIframe).to.equal(secondIframe);
      });
    });

    describe('loadChat', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
        youtubeChat.chatEnabled = true;
      });

      it('should load chat iframe when called', () => {
        // Create a mock chat container
        const chatContainer = document.createElement('div');
        chatContainer.className = 'youtube-chat-container';
        chatContainer.innerHTML = '<div class="iframe-container"><div class="youtube-chat-placeholder">Placeholder</div></div>';
        document.body.appendChild(chatContainer);
        
        youtubeChat.loadChat();
        
        const chatIframe = chatContainer.querySelector('.youtube-chat');
        expect(chatIframe).to.not.be.null;
        expect(chatIframe.tagName).to.equal('IFRAME');
        expect(chatIframe.getAttribute('src')).to.include('https://www.youtube.com/live_chat?v=dQw4w9WgXcQ');
        
        document.body.removeChild(chatContainer);
      });

      it('should not load chat if container not found', () => {
        youtubeChat.loadChat();
        // Should not throw error when no chat container exists
        expect(true).to.be.true;
      });
    });

    describe('warmConnections', () => {
      it('should add preconnect links for YouTube domains', () => {
        const originalHead = document.head.innerHTML;
        
        youtubeChat.warmConnections();
        
        const links = document.querySelectorAll('link[rel="preconnect"]');
        expect(links.length).to.be.greaterThan(0);
        
        const hrefs = Array.from(links).map(link => link.href);
        expect(hrefs).to.include('https://www.youtube-nocookie.com/');
        expect(hrefs).to.include('https://www.youtube.com/');
        
        // Clean up
        document.head.innerHTML = originalHead;
      });

      it('should only add preconnect links once', () => {
        const originalHead = document.head.innerHTML;
        
        youtubeChat.warmConnections();
        const firstCount = document.querySelectorAll('link[rel="preconnect"]').length;
        
        youtubeChat.warmConnections();
        const secondCount = document.querySelectorAll('link[rel="preconnect"]').length;
        
        expect(firstCount).to.equal(secondCount);
        
        // Clean up
        document.head.innerHTML = originalHead;
      });
    });
  });

  describe('Integration Tests', () => {
    it('should initialize YouTube chat with lite-youtube element when autoplay is disabled', async () => {
      const htmlWithoutAutoplay = `
        <div class="youtube-chat">
          <div>
            <div>videoid</div>
            <div>dQw4w9WgXcQ</div>
          </div>
          <div>
            <div>title</div>
            <div>My Custom Video Title</div>
          </div>
          <div>
            <div>chatenabled</div>
            <div>true</div>
          </div>
          <div>
            <div>autoplay</div>
            <div>false</div>
          </div>
          <div>
            <div>mute</div>
            <div>true</div>
          </div>
        </div>
      `;
      
      document.body.innerHTML = htmlWithoutAutoplay;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      // Verify that the block content was cleared
      expect(block.textContent).to.equal('');
      
      // Verify that a container was created
      const container = block.querySelector('.youtube-stream');
      expect(container).to.not.be.null;
      
      // Verify that both video and chat containers were created
      const videoContainer = container.querySelector('.youtube-video-container');
      expect(videoContainer).to.not.be.null;
      
      const chatContainer = container.querySelector('.youtube-chat-container');
      expect(chatContainer).to.not.be.null;
      
      // Verify that lite-youtube element was created
      const liteYT = videoContainer.querySelector('lite-youtube');
      expect(liteYT).to.not.be.null;
      expect(liteYT.getAttribute('videoid')).to.equal('dQw4w9WgXcQ');
      
      // Verify that no iframe exists initially
      const videoIframe = videoContainer.querySelector('.youtube-video');
      expect(videoIframe).to.be.null;
      
      // Verify chat placeholder exists
      const chatPlaceholder = chatContainer.querySelector('.youtube-chat-placeholder');
      expect(chatPlaceholder).to.not.be.null;
      expect(chatPlaceholder.textContent).to.equal('Chat will load when video is played');
    });

    it('should initialize YouTube chat with iframe when autoplay is enabled', async () => {
      const htmlWithAutoplay = `
        <div class="youtube-chat">
          <div>
            <div>videoid</div>
            <div>dQw4w9WgXcQ</div>
          </div>
          <div>
            <div>title</div>
            <div>My Custom Video Title</div>
          </div>
          <div>
            <div>chatenabled</div>
            <div>true</div>
          </div>
          <div>
            <div>autoplay</div>
            <div>true</div>
          </div>
          <div>
            <div>mute</div>
            <div>true</div>
          </div>
        </div>
      `;
      
      document.body.innerHTML = htmlWithAutoplay;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      // Verify that the block content was cleared
      expect(block.textContent).to.equal('');
      
      // Verify that a container was created
      const container = block.querySelector('.youtube-stream');
      expect(container).to.not.be.null;
      
      // Verify that both video and chat containers were created
      const videoContainer = container.querySelector('.youtube-video-container');
      expect(videoContainer).to.not.be.null;
      
      const chatContainer = container.querySelector('.youtube-chat-container');
      expect(chatContainer).to.not.be.null;
      
      // Verify that iframe was created directly (no lite-youtube)
      const videoIframe = videoContainer.querySelector('.youtube-video');
      expect(videoIframe).to.not.be.null;
      expect(videoIframe.tagName).to.equal('IFRAME');
      expect(videoIframe.getAttribute('src')).to.include('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
      
      // Verify that lite-youtube element was NOT created
      const liteYT = videoContainer.querySelector('lite-youtube');
      expect(liteYT).to.be.null;
      
      // Verify that chat iframe was loaded immediately
      const chatIframe = chatContainer.querySelector('.youtube-chat');
      expect(chatIframe).to.not.be.null;
      expect(chatIframe.tagName).to.equal('IFRAME');
    });

    it('should initialize YouTube stream without chat when chatenabled is false', async () => {
      const htmlWithoutChat = `
        <div class="youtube-chat">
          <div>
            <div>videoid</div>
            <div>dQw4w9WgXcQ</div>
          </div>
          <div>
            <div>chatenabled</div>
            <div>false</div>
          </div>
          <div>
            <div>autoplay</div>
            <div>true</div>
          </div>
          <div>
            <div>mute</div>
            <div>true</div>
          </div>
        </div>
      `;
      
      document.body.innerHTML = htmlWithoutChat;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      const container = block.querySelector('.youtube-stream');
      expect(container).to.not.be.null;
      expect(container.classList.contains('single-column')).to.be.true;
      
      const videoContainer = container.querySelector('.youtube-video-container');
      expect(videoContainer).to.not.be.null;
      
      const chatContainer = container.querySelector('.youtube-chat-container');
      expect(chatContainer).to.be.null;
    });

    it('should not initialize when videoId is missing', async () => {
      const htmlWithoutVideoId = `
        <div class="youtube-chat">
          <div>
            <div>chatenabled</div>
            <div>true</div>
          </div>
          <div>
            <div>autoplay</div>
            <div>true</div>
          </div>
        </div>
      `;
      
      document.body.innerHTML = htmlWithoutVideoId;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      // Verify that the block was removed from DOM
      expect(document.querySelector('.youtube-chat')).to.be.null;
    });

    it('should load player and chat when lite-youtube is clicked (non-autoplay)', async () => {
      const htmlWithoutAutoplay = `
        <div class="youtube-chat">
          <div>
            <div>videoid</div>
            <div>dQw4w9WgXcQ</div>
          </div>
          <div>
            <div>chatenabled</div>
            <div>true</div>
          </div>
          <div>
            <div>autoplay</div>
            <div>false</div>
          </div>
        </div>
      `;
      
      document.body.innerHTML = htmlWithoutAutoplay;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      const liteYT = block.querySelector('lite-youtube');
      expect(liteYT).to.not.be.null;
      
      // Simulate click on lite-youtube
      const clickEvent = new Event('click');
      liteYT.dispatchEvent(clickEvent);
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify that iframe was loaded
      const videoIframe = block.querySelector('.youtube-video');
      expect(videoIframe).to.not.be.null;
      expect(videoIframe.tagName).to.equal('IFRAME');
      
      // Verify that chat iframe was also loaded
      const chatIframe = block.querySelector('.youtube-chat');
      expect(chatIframe).to.not.be.null;
      expect(chatIframe.tagName).to.equal('IFRAME');
    });
  });
});
