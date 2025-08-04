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
        expect(youtubeChat.pendingChatSection).to.be.null;
      });
    });

    describe('isAutoplayEnabled', () => {
      it('should return true when autoplay is enabled', () => {
        youtubeChat.config = { autoplay: 'true' };
        expect(youtubeChat.isAutoplayEnabled()).to.be.true;
      });

      it('should return false when autoplay is disabled', () => {
        youtubeChat.config = { autoplay: 'false' };
        expect(youtubeChat.isAutoplayEnabled()).to.be.false;
      });

      it('should return false when autoplay is not set', () => {
        youtubeChat.config = {};
        expect(youtubeChat.isAutoplayEnabled()).to.be.false;
      });
    });

    describe('buildUrlParams', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
      });

      it('should build params with all options enabled', () => {
        youtubeChat.config = {
          autoplay: 'true',
          mute: 'true',
          'show-controls': 'true',
          'show-player-title-actions': 'true',
          'show-suggestions-after-video-ends': 'false'
        };

        const params = youtubeChat.buildUrlParams();
        expect(params).to.include('autoplay=1');
        expect(params).to.include('mute=1');
        expect(params).to.include('controls=1');
        expect(params).to.include('modestbranding=1');
        expect(params).to.not.include('rel=1');
      });

      it('should build empty params when all options disabled', () => {
        youtubeChat.config = {
          autoplay: 'false',
          mute: 'false',
          'show-controls': 'false',
          'show-player-title-actions': 'false',
          'show-suggestions-after-video-ends': 'false'
        };
        
        const params = youtubeChat.buildUrlParams();
        expect(params).to.equal('');
      });

      it('should add mobile mute param when on mobile', () => {
        youtubeChat.isMobile = true;
        youtubeChat.config = { autoplay: 'true' };

        const params = youtubeChat.buildUrlParams();
        expect(params).to.include('mute=1');
      });
    });

    describe('buildEmbedUrl', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
      });

      it('should build URL with parameters when enabled', () => {
        youtubeChat.config = {
          autoplay: 'true',
          mute: 'true',
          'show-controls': 'true'
        };

        const url = youtubeChat.buildEmbedUrl();
        expect(url).to.include('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
        expect(url).to.include('autoplay=1');
        expect(url).to.include('mute=1');
        expect(url).to.include('controls=1');
      });

      it('should build URL without parameters when disabled', () => {
        youtubeChat.config = {
          autoplay: 'false',
          mute: 'false',
          'show-controls': 'false'
        };
        
        const url = youtubeChat.buildEmbedUrl();
        expect(url).to.equal('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
      });
    });

    describe('buildEmbedUrlWithAutoplay', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
      });

      it('should always include autoplay and mute', () => {
        youtubeChat.config = {
          'show-controls': 'true',
          'show-player-title-actions': 'true'
        };

        const url = youtubeChat.buildEmbedUrlWithAutoplay();
        expect(url).to.include('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
        expect(url).to.include('autoplay=1');
        expect(url).to.include('mute=1');
        expect(url).to.include('controls=1');
        expect(url).to.include('modestbranding=1');
      });

      it('should include autoplay and mute even when disabled in config', () => {
        youtubeChat.config = {
          autoplay: 'false',
          mute: 'false'
        };

        const url = youtubeChat.buildEmbedUrlWithAutoplay();
        expect(url).to.include('autoplay=1');
        expect(url).to.include('mute=1');
      });
    });

    describe('createChatSection', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
      });

      it('should create chat section with placeholder for autoplay disabled', () => {
        youtubeChat.config = { autoplay: 'false' };
        const chatSection = youtubeChat.createChatSection();
        
        expect(chatSection.classList.contains('youtube-chat-container')).to.be.true;
        
        const iframeContainer = chatSection.querySelector('.iframe-container');
        expect(iframeContainer).to.not.be.null;
        
        const placeholder = iframeContainer.querySelector('.youtube-chat-placeholder');
        expect(placeholder).to.not.be.null;
        expect(placeholder.textContent).to.equal('Chat will load when video is played');
      });

      it('should create chat section with loading placeholder for autoplay enabled', () => {
        youtubeChat.config = { autoplay: 'true' };
        const chatSection = youtubeChat.createChatSection();
        
        const placeholder = chatSection.querySelector('.youtube-chat-placeholder');
        expect(placeholder).to.not.be.null;
        expect(placeholder.textContent).to.equal('Loading chat...');
      });
    });

    describe('buildYouTubeStream', () => {
      beforeEach(() => {
        youtubeChat.videoId = 'dQw4w9WgXcQ';
        youtubeChat.config = { videotitle: 'Test Video' };
      });

      it('should build stream with chat when enabled and autoplay enabled', () => {
        youtubeChat.chatEnabled = true;
        youtubeChat.config.autoplay = 'true';
        
        const stream = youtubeChat.buildYouTubeStream();
        
        expect(stream.classList.contains('youtube-stream')).to.be.true;
        expect(stream.classList.contains('single-column')).to.be.false;
        
        const videoContainer = stream.querySelector('.youtube-video-container');
        expect(videoContainer).to.not.be.null;
        
        const chatContainer = stream.querySelector('.youtube-chat-container');
        expect(chatContainer).to.not.be.null;
      });

      it('should build stream with single column when chat disabled', () => {
        youtubeChat.chatEnabled = false;
        
        const stream = youtubeChat.buildYouTubeStream();
        
        expect(stream.classList.contains('youtube-stream')).to.be.true;
        expect(stream.classList.contains('single-column')).to.be.true;
        
        const videoContainer = stream.querySelector('.youtube-video-container');
        expect(videoContainer).to.not.be.null;
        
        const chatContainer = stream.querySelector('.youtube-chat-container');
        expect(chatContainer).to.be.null;
      });

      it('should build stream with single column when autoplay disabled', () => {
        youtubeChat.chatEnabled = true;
        youtubeChat.config.autoplay = 'false';
        
        const stream = youtubeChat.buildYouTubeStream();
        
        expect(stream.classList.contains('youtube-stream')).to.be.true;
        expect(stream.classList.contains('single-column')).to.be.true;
        
        const videoContainer = stream.querySelector('.youtube-video-container');
        expect(videoContainer).to.not.be.null;
        
        const chatContainer = stream.querySelector('.youtube-chat-container');
        expect(chatContainer).to.be.null;
        
        expect(youtubeChat.pendingChatSection).to.not.be.null;
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
});
