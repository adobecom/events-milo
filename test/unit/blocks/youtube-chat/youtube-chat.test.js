import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import init, { YouTubeChat } from '../../../../events/blocks/youtube-chat/youtube-chat.js';

const defaultHtml = await readFile({ path: './mocks/default.html' });

describe('YouTube Chat Module', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    
    // Reset DOM
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
      });
    });

    describe('buildEmbedUrl', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
        youtubeChat.config = {
          autoplay: 'true',
          mute: 'true',
          'show-controls': 'true',
          'show-player-title-actions': 'true',
          'show-suggestions-after-video-ends': 'false'
        };
      });

      it('should build URL with all parameters when enabled', () => {
        const url = youtubeChat.buildEmbedUrl();
        expect(url).to.include('https://www.youtube.com/embed/dQw4w9WgXcQ');
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
        expect(url).to.equal('https://www.youtube.com/embed/dQw4w9WgXcQ');
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

      it('should create video section with correct structure', () => {
        const videoSection = youtubeChat.createVideoSection();
        
        expect(videoSection.classList.contains('youtube-video-container')).to.be.true;
        
        const iframeContainer = videoSection.querySelector('.iframe-container');
        expect(iframeContainer).to.not.be.null;
        
        const iframe = iframeContainer.querySelector('.youtube-video');
        expect(iframe).to.not.be.null;
        expect(iframe.tagName).to.equal('IFRAME');
        expect(iframe.getAttribute('title')).to.equal('Custom Video Title');
        expect(iframe.getAttribute('loading')).to.equal('lazy');
        expect(iframe.getAttribute('allowfullscreen')).to.equal('true');
      });

      it('should use default title when not provided', () => {
        delete youtubeChat.config.videotitle;
        
        const videoSection = youtubeChat.createVideoSection();
        const iframe = videoSection.querySelector('.youtube-video');
        
        expect(iframe.getAttribute('title')).to.equal('YouTube video player');
      });
    });

    describe('createChatSection', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
      });

      it('should create chat section with correct structure', () => {
        const chatSection = youtubeChat.createChatSection();
        
        expect(chatSection.classList.contains('youtube-chat-container')).to.be.true;
        
        const iframeContainer = chatSection.querySelector('.iframe-container');
        expect(iframeContainer).to.not.be.null;
        
        const iframe = iframeContainer.querySelector('.youtube-chat');
        expect(iframe).to.not.be.null;
        expect(iframe.tagName).to.equal('IFRAME');
        expect(iframe.getAttribute('title')).to.equal('YouTube live chat');
        expect(iframe.getAttribute('loading')).to.equal('lazy');
        expect(iframe.getAttribute('src')).to.include('https://www.youtube.com/live_chat?v=dQw4w9WgXcQ');
        expect(iframe.getAttribute('src')).to.include('embed_domain=');
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
  });

  describe('init function (backward compatibility)', () => {
    it('should initialize YouTube chat with video and chat enabled', async () => {
      document.body.innerHTML = defaultHtml;
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
      
      // Verify that iframes were created
      const videoIframe = videoContainer.querySelector('.youtube-video');
      expect(videoIframe).to.not.be.null;
      expect(videoIframe.tagName).to.equal('IFRAME');
      
      const chatIframe = chatContainer.querySelector('.youtube-chat');
      expect(chatIframe).to.not.be.null;
      expect(chatIframe.tagName).to.equal('IFRAME');
    });

    it('should initialize YouTube stream without chat when chatenabled is false', async () => {
      // Create HTML with chatenabled set to false
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
      
      // Verify that the block content was cleared
      expect(block.textContent).to.equal('');
      
      // Verify that a container was created
      const container = block.querySelector('.youtube-stream');
      expect(container).to.not.be.null;
      
      // Verify that single-column class was added
      expect(container.classList.contains('single-column')).to.be.true;
      
      // Verify that only video container was created
      const videoContainer = container.querySelector('.youtube-video-container');
      expect(videoContainer).to.not.be.null;
      
      const chatContainer = container.querySelector('.youtube-chat-container');
      expect(chatContainer).to.be.null;
    });

    it('should not initialize when videoId is missing', async () => {
      // Create HTML without videoId
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
  });

  describe('DOM structure', () => {
    it('should create proper nested DOM structure', async () => {
      document.body.innerHTML = defaultHtml;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      // Verify the complete DOM structure
      const container = block.querySelector('.youtube-stream');
      expect(container).to.not.be.null;
      
      // Video structure
      const videoWrapper = container.querySelector('.youtube-video-container');
      expect(videoWrapper).to.not.be.null;
      
      const videoContainer = videoWrapper.querySelector('.iframe-container');
      expect(videoContainer).to.not.be.null;
      
      const videoIframe = videoContainer.querySelector('.youtube-video');
      expect(videoIframe).to.not.be.null;
      
      // Chat structure
      const chatWrap = container.querySelector('.youtube-chat-container');
      expect(chatWrap).to.not.be.null;
      
      const chatContainer = chatWrap.querySelector('.iframe-container');
      expect(chatContainer).to.not.be.null;
      
      const chatIframe = chatContainer.querySelector('.youtube-chat');
      expect(chatIframe).to.not.be.null;
    });

    it('should create single-column structure when chat is disabled', async () => {
      // Create HTML with chatenabled set to false
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
      
      // Should only have video structure
      const videoWrapper = container.querySelector('.youtube-video-container');
      expect(videoWrapper).to.not.be.null;
      
      const chatWrap = container.querySelector('.youtube-chat-container');
      expect(chatWrap).to.be.null;
    });
  });

  describe('URL generation', () => {
    it('should build video URL with parameters', async () => {
      document.body.innerHTML = defaultHtml;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      const videoIframe = block.querySelector('.youtube-video');
      expect(videoIframe).to.not.be.null;
      
      const src = videoIframe.getAttribute('src');
      expect(src).to.include('https://www.youtube.com/embed/dQw4w9WgXcQ');
      expect(src).to.include('autoplay=1');
      expect(src).to.include('mute=1');
      expect(src).to.include('controls=1');
      expect(src).to.include('modestbranding=1');
    });

    it('should build chat URL with correct parameters', async () => {
      document.body.innerHTML = defaultHtml;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      const chatIframe = block.querySelector('.youtube-chat');
      expect(chatIframe).to.not.be.null;
      
      const src = chatIframe.getAttribute('src');
      expect(src).to.include('https://www.youtube.com/live_chat?v=dQw4w9WgXcQ');
      expect(src).to.include('embed_domain=');
    });
  });

  describe('Configuration options', () => {
    it('should handle different autoplay settings', async () => {
      // Create HTML with autoplay disabled
      const htmlWithAutoplayDisabled = `
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
          <div>
            <div>mute</div>
            <div>true</div>
          </div>
        </div>
      `;
      
      document.body.innerHTML = htmlWithAutoplayDisabled;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      const videoIframe = block.querySelector('.youtube-video');
      expect(videoIframe).to.not.be.null;
      
      const src = videoIframe.getAttribute('src');
      expect(src).to.not.include('autoplay=1');
      expect(src).to.include('mute=1');
    });

    it('should handle different mute settings', async () => {
      // Create HTML with mute disabled
      const htmlWithMuteDisabled = `
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
            <div>true</div>
          </div>
          <div>
            <div>mute</div>
            <div>false</div>
          </div>
        </div>
      `;
      
      document.body.innerHTML = htmlWithMuteDisabled;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      const videoIframe = block.querySelector('.youtube-video');
      expect(videoIframe).to.not.be.null;
      
      const src = videoIframe.getAttribute('src');
      expect(src).to.include('autoplay=1');
      expect(src).to.not.include('mute=1');
    });
  });
});
