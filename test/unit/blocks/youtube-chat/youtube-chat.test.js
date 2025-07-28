import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import init from '../../../../events/blocks/youtube-chat/youtube-chat.js';

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

  describe('init', () => {
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

    it('should not initialize when videoId is empty', async () => {
      // Create HTML with empty videoId
      const htmlWithEmptyVideoId = `
        <div class="youtube-chat">
          <div>
            <div>videoid</div>
            <div></div>
          </div>
          <div>
            <div>chatenabled</div>
            <div>true</div>
          </div>
        </div>
      `;
      
      document.body.innerHTML = htmlWithEmptyVideoId;
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

  describe('Error handling', () => {
    it('should remove block when video ID is missing', async () => {
      const htmlWithoutVideoId = `
        <div class="youtube-chat">
          <div>
            <div>chatenabled</div>
            <div>true</div>
          </div>
        </div>
      `;
      
      document.body.innerHTML = htmlWithoutVideoId;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      // Block should be removed from DOM
      expect(document.querySelector('.youtube-chat')).to.be.null;
    });

    it('should remove block when video ID is empty', async () => {
      const htmlWithEmptyVideoId = `
        <div class="youtube-chat">
          <div>
            <div>videoid</div>
            <div></div>
          </div>
          <div>
            <div>chatenabled</div>
            <div>true</div>
          </div>
        </div>
      `;
      
      document.body.innerHTML = htmlWithEmptyVideoId;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      // Block should be removed from DOM
      expect(document.querySelector('.youtube-chat')).to.be.null;
    });
  });

  describe('Accessibility', () => {
    it('should have proper title attribute on video iframe', async () => {
      document.body.innerHTML = defaultHtml;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      const videoIframe = block.querySelector('.youtube-video');
      expect(videoIframe).to.not.be.null;
      expect(videoIframe.getAttribute('title')).to.equal('YouTube video player');
      expect(videoIframe.getAttribute('loading')).to.equal('lazy');
    });

    it('should have proper title attribute on chat iframe', async () => {
      document.body.innerHTML = defaultHtml;
      const block = document.querySelector('.youtube-chat');
      
      await init(block);
      
      const chatIframe = block.querySelector('.youtube-chat');
      expect(chatIframe).to.not.be.null;
      expect(chatIframe.getAttribute('title')).to.equal('YouTube live chat');
      expect(chatIframe.getAttribute('loading')).to.equal('lazy');
    });
  });
});
