/* eslint-disable class-methods-use-this */

/**
 * Firefly Generator Block
 * A simplified block that uses the Unity API to generate images inline
 */

// Demo mode configuration - shows a pre-defined image for specific prompts
const DEMO_CONFIG = {
  // Trigger phrases (case-insensitive) that activate demo mode
  triggerPhrases: ['can you generate'],
  // URL to the demo image - update this with your hosted image path
  demoImageUrl: '/events/img/firefly-demo-castle.jpg',
};

/**
 * Check if prompt matches demo trigger phrases (case-insensitive)
 */
function isDemoPrompt(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  return DEMO_CONFIG.triggerPhrases.some((phrase) => lowerPrompt.includes(phrase.toLowerCase()));
}

// Get Unity config based on environment
const getUnityConfig = () => {
  const { host } = window.location;
  const isStage = host.includes('hlx.page')
    || host.includes('hlx.live')
    || host.includes('aem.page')
    || host.includes('aem.live')
    || host.includes('localhost')
    || host.includes('stage.adobe')
    || host.includes('corp.adobe');

  return {
    apiEndPoint: isStage
      ? 'https://unity-stage.adobe.io/api/v1'
      : 'https://unity.adobe.io/api/v1',
    connectorApiEndPoint: isStage
      ? 'https://unity-stage.adobe.io/api/v1/asset/connector'
      : 'https://unity.adobe.io/api/v1/asset/connector',
    apiKey: 'leo',
  };
};

// Get IMS access token
async function getAccessToken() {
  try {
    const accessToken = window.adobeIMS?.getAccessToken();
    if (accessToken?.token) {
      return `Bearer ${accessToken.token}`;
    }
    // Try to refresh
    if (window.adobeIMS?.refreshToken) {
      const { tokenInfo } = await window.adobeIMS.refreshToken();
      if (tokenInfo?.token) {
        return `Bearer ${tokenInfo.token}`;
      }
    }
  } catch (e) {
    console.warn('Failed to get access token:', e);
  }
  return null;
}

// Create DOM element helper
function createTag(tag, attributes = {}, content = '') {
  const el = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') {
      el.className = value;
    } else {
      el.setAttribute(key, value);
    }
  });
  if (content) {
    if (typeof content === 'string') {
      el.innerHTML = content;
    } else {
      el.appendChild(content);
    }
  }
  return el;
}

class FireflyGenerator {
  constructor(el) {
    this.el = el;
    this.config = getUnityConfig();
    this.isGenerating = false;
    this.parseBlockConfig();
  }

  parseBlockConfig() {
    // Parse block content for configuration
    const rows = this.el.querySelectorAll(':scope > div');
    this.title = 'Create with Firefly';
    this.promptLabel = 'Prompt';
    this.placeholder = 'Describe the image you want to generate';
    this.buttonText = 'Generate';

    rows.forEach((row) => {
      const cells = row.querySelectorAll(':scope > div');
      if (cells.length >= 2) {
        const key = cells[0].textContent.trim().toLowerCase();
        const value = cells[1].textContent.trim();
        switch (key) {
          case 'title':
            this.title = value;
            break;
          case 'prompt-label':
            this.promptLabel = value;
            break;
          case 'placeholder':
            this.placeholder = value;
            break;
          case 'button-text':
            this.buttonText = value;
            break;
          default:
            break;
        }
      }
    });
  }

  async init() {
    // Clear the block content
    this.el.innerHTML = '';

    // Build the UI
    this.buildUI();

    // Add event listeners
    this.addEventListeners();
  }

  buildUI() {
    // Main container
    const container = createTag('div', { class: 'firefly-container' });

    // Title
    const titleEl = createTag('h2', { class: 'firefly-title' }, this.title);
    container.appendChild(titleEl);

    // Prompt box
    const promptBox = createTag('div', { class: 'firefly-prompt-box' });

    // Prompt label
    const labelEl = createTag('label', {
      class: 'firefly-label',
      for: 'firefly-prompt-input',
    }, this.promptLabel);
    promptBox.appendChild(labelEl);

    // Input wrapper (contains textarea and button)
    const inputWrapper = createTag('div', { class: 'firefly-input-wrapper' });

    // Textarea
    this.promptInput = createTag('textarea', {
      class: 'firefly-input',
      id: 'firefly-prompt-input',
      placeholder: this.placeholder,
      rows: '3',
    });
    inputWrapper.appendChild(this.promptInput);

    // Generate button
    this.generateBtn = createTag('button', {
      class: 'firefly-generate-btn',
      type: 'button',
    });

    // Button icon (sparkle/magic icon)
    const btnIcon = createTag('span', { class: 'firefly-btn-icon' }, `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
      </svg>
    `);
    this.generateBtn.appendChild(btnIcon);

    // Button text
    const btnText = createTag('span', { class: 'firefly-btn-text' }, this.buttonText);
    this.generateBtn.appendChild(btnText);

    inputWrapper.appendChild(this.generateBtn);
    promptBox.appendChild(inputWrapper);
    container.appendChild(promptBox);

    // Result area (hidden initially)
    this.resultArea = createTag('div', { class: 'firefly-result hidden' });

    // Loading indicator
    this.loadingEl = createTag('div', { class: 'firefly-loading hidden' });
    const spinner = createTag('div', { class: 'firefly-spinner' });
    const loadingText = createTag('span', { class: 'firefly-loading-text' }, 'Generating your image...');
    this.loadingEl.appendChild(spinner);
    this.loadingEl.appendChild(loadingText);
    this.resultArea.appendChild(this.loadingEl);

    // Image container
    this.imageContainer = createTag('div', { class: 'firefly-image-container hidden' });
    this.resultArea.appendChild(this.imageContainer);

    // Error message
    this.errorEl = createTag('div', { class: 'firefly-error hidden' });
    this.resultArea.appendChild(this.errorEl);

    container.appendChild(this.resultArea);

    this.el.appendChild(container);
  }

  addEventListeners() {
    // Generate button click
    this.generateBtn.addEventListener('click', () => this.handleGenerate());

    // Enter key in textarea (Ctrl/Cmd + Enter to submit)
    this.promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.handleGenerate();
      }
    });
  }

  async handleGenerate() {
    const prompt = this.promptInput.value.trim();

    if (!prompt) {
      this.showError('Please enter a prompt to generate an image.');
      return;
    }

    if (this.isGenerating) return;

    this.isGenerating = true;
    this.showLoading();

    // Check for demo mode - show pre-defined image for specific prompts
    if (isDemoPrompt(prompt)) {
      // Simulate a brief loading delay for realism
      await new Promise((resolve) => { setTimeout(resolve, 1500); });
      this.showImage(DEMO_CONFIG.demoImageUrl, prompt);
      this.isGenerating = false;
      return;
    }

    try {
      const result = await this.generateImage(prompt);
      if (result?.url) {
        // The Unity connector returns a redirect URL to Firefly app
        // Check if it's a Firefly app URL (not a direct image)
        if (this.isFireflyAppUrl(result.url)) {
          this.showFireflyRedirect(result.url, prompt);
        } else {
          this.showImage(result.url, prompt);
        }
      } else if (result?.imageUrl) {
        this.showImage(result.imageUrl, prompt);
      } else {
        throw new Error('No image URL in response');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      this.showError(this.getErrorMessage(error));
    } finally {
      this.isGenerating = false;
    }
  }

  isFireflyAppUrl(url) {
    return url.includes('firefly.adobe.com')
      || url.includes('firefly-stage.corp.adobe.com')
      || url.includes('express.adobe.com')
      || url.includes('/hub?hData=');
  }

  async generateImage(prompt) {
    const token = await getAccessToken();

    if (!token) {
      throw new Error('Please sign in to generate images.');
    }

    const payload = {
      targetProduct: 'Firefly',
      payload: {
        workflow: 'text-to-image',
        locale: this.getLocale(),
        action: 'generate',
      },
      query: prompt,
    };

    const response = await fetch(this.config.connectorApiEndPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'x-api-key': this.config.apiKey,
        'x-unity-product': 'Firefly',
        'x-unity-action': 'generate-imageGeneration',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  getLocale() {
    const path = window.location.pathname;
    const localeMatch = path.match(/^\/([a-z]{2}(?:_[A-Z]{2})?)\//);
    return localeMatch ? localeMatch[1] : 'us';
  }

  showLoading() {
    this.resultArea.classList.remove('hidden');
    this.loadingEl.classList.remove('hidden');
    this.imageContainer.classList.add('hidden');
    this.errorEl.classList.add('hidden');
    this.generateBtn.disabled = true;
    this.generateBtn.classList.add('loading');
  }

  showFireflyRedirect(url, prompt) {
    this.loadingEl.classList.add('hidden');
    this.errorEl.classList.add('hidden');
    this.imageContainer.classList.remove('hidden');
    this.generateBtn.disabled = false;
    this.generateBtn.classList.remove('loading');

    // Clear previous content
    this.imageContainer.innerHTML = '';

    // Show a card with the prompt and link to Firefly
    const linkWrapper = createTag('div', { class: 'firefly-redirect-notice' });

    // Sparkle icon
    const iconEl = createTag('div', { class: 'firefly-redirect-icon' }, `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
      </svg>
    `);
    linkWrapper.appendChild(iconEl);

    const message = createTag('p', { class: 'firefly-redirect-message' }, 'Your creation is ready!');
    linkWrapper.appendChild(message);

    const promptPreview = createTag('p', { class: 'firefly-prompt-preview' }, `"${prompt}"`);
    linkWrapper.appendChild(promptPreview);

    const link = createTag('a', {
      href: url,
      target: '_blank',
      rel: 'noopener noreferrer',
      class: 'firefly-open-link',
    }, 'Open in Adobe Firefly →');
    linkWrapper.appendChild(link);

    const hint = createTag('p', { class: 'firefly-redirect-hint' }, 'Click to view and download your generated image');
    linkWrapper.appendChild(hint);

    this.imageContainer.appendChild(linkWrapper);
  }

  showImage(url, prompt) {
    this.loadingEl.classList.add('hidden');
    this.errorEl.classList.add('hidden');
    this.imageContainer.classList.remove('hidden');
    this.generateBtn.disabled = false;
    this.generateBtn.classList.remove('loading');

    // Clear previous image
    this.imageContainer.innerHTML = '';

    // Display the image inline
    const img = createTag('img', {
      class: 'firefly-generated-image',
      src: url,
      alt: prompt,
      loading: 'eager',
    });

    img.onerror = () => {
      this.showError('Failed to load the generated image.');
    };

    this.imageContainer.appendChild(img);

    // Add action buttons
    const actions = createTag('div', { class: 'firefly-image-actions' });
    
    // Download button wrapper
    const downloadWrapper = createTag('div', { class: 'firefly-btn-wrapper' });
    const downloadBtn = createTag('a', {
      class: 'firefly-action-btn',
      href: url,
      download: `firefly-${Date.now()}.png`,
      target: '_blank',
    }, 'Download Image');
    downloadWrapper.appendChild(downloadBtn);
    actions.appendChild(downloadWrapper);

    // Share button with dropdown
    const shareWrapper = createTag('div', { class: 'firefly-btn-wrapper firefly-share-wrapper' });
    
    const shareBtn = createTag('a', {
      class: 'firefly-action-btn firefly-share-btn',
      href: '#',
      role: 'button',
    }, 'Share');
    
    const shareDropdown = createTag('div', { class: 'firefly-share-dropdown hidden' });
    
    // Add to Gallery option
    const addToGalleryBtn = createTag('button', {
      class: 'firefly-share-option',
      type: 'button',
    }, 'Add to Community Gallery');
    
    addToGalleryBtn.addEventListener('click', () => {
      this.addToGallery(url, prompt);
      addToGalleryBtn.textContent = 'Added to Gallery ✓';
      addToGalleryBtn.disabled = true;
      addToGalleryBtn.classList.add('added');
      // Close dropdown after a moment
      setTimeout(() => {
        shareDropdown.classList.add('hidden');
      }, 1000);
    });
    
    shareDropdown.appendChild(addToGalleryBtn);
    shareWrapper.appendChild(shareBtn);
    shareWrapper.appendChild(shareDropdown);
    
    // Toggle dropdown on share button click
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      shareDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      shareDropdown.classList.add('hidden');
    });
    
    actions.appendChild(shareWrapper);
    this.imageContainer.appendChild(actions);
  }

  addToGallery(imageUrl, prompt) {
    // Find the gallery component on the page
    const gallery = document.querySelector('.firefly-gallery');
    if (!gallery) {
      console.warn('Gallery component not found on page');
      return;
    }

    // Find the first card in the left column and replace it
    const leftColumn = gallery.querySelector('.gallery-column-left');
    if (!leftColumn) return;

    const firstCard = leftColumn.querySelector('.gallery-card');
    if (firstCard) {
      // Create new card with the generated image
      const newCard = createTag('div', { class: 'gallery-card user-generated' });
      newCard.style.animationDelay = '0s';
      
      const img = createTag('img', {
        src: imageUrl,
        alt: prompt || 'Your generated image',
        loading: 'lazy',
      });
      
      newCard.appendChild(img);
      
      // Add click handler for lightbox
      newCard.addEventListener('click', () => {
        this.openGeneratedLightbox(imageUrl, prompt);
      });

      // Replace the first card
      leftColumn.replaceChild(newCard, firstCard);
      
      // Add a subtle animation
      newCard.style.animation = 'none';
      newCard.offsetHeight; // Trigger reflow
      newCard.style.animation = 'cardFadeIn 0.5s ease forwards';
    }
  }

  openGeneratedLightbox(imageUrl, prompt) {
    // Create lightbox for user-generated image
    const lightbox = createTag('div', { class: 'gallery-lightbox' });

    const lightboxContent = createTag('div', { class: 'gallery-lightbox-content' });

    // Close button
    const closeBtn = createTag('button', { class: 'gallery-lightbox-close' }, `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `);
    closeBtn.addEventListener('click', () => lightbox.remove());
    lightboxContent.appendChild(closeBtn);

    // Image
    const img = createTag('img', {
      class: 'gallery-lightbox-image',
      src: imageUrl,
      alt: prompt || 'Your generated image',
    });
    lightboxContent.appendChild(img);

    // Info panel
    const infoPanel = createTag('div', { class: 'gallery-lightbox-info' });

    if (prompt) {
      const promptLabel = createTag('span', { class: 'gallery-lightbox-label' }, 'Your Prompt');
      infoPanel.appendChild(promptLabel);
      const promptEl = createTag('p', { class: 'gallery-lightbox-prompt' }, prompt);
      infoPanel.appendChild(promptEl);
    }

    const authorEl = createTag('p', { class: 'gallery-lightbox-author' }, `
      Created by <strong>You</strong>
    `);
    infoPanel.appendChild(authorEl);

    lightboxContent.appendChild(infoPanel);
    lightbox.appendChild(lightboxContent);

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.remove();
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        lightbox.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    document.body.appendChild(lightbox);
  }

  showError(message) {
    this.resultArea.classList.remove('hidden');
    this.loadingEl.classList.add('hidden');
    this.imageContainer.classList.add('hidden');
    this.errorEl.classList.remove('hidden');
    this.errorEl.textContent = message;
    this.generateBtn.disabled = false;
    this.generateBtn.classList.remove('loading');
  }

  getErrorMessage(error) {
    if (error.message.includes('sign in')) {
      return error.message;
    }
    if (error.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    if (error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return 'Failed to generate image. Please try again.';
  }
}

export default async function init(el) {
  const generator = new FireflyGenerator(el);
  await generator.init();
}

