/* eslint-disable class-methods-use-this */

/**
 * Firefly Generator Block
 * A simplified block that uses the Unity API to generate images inline
 */

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

    // Add download button
    const actions = createTag('div', { class: 'firefly-image-actions' });
    const downloadBtn = createTag('a', {
      class: 'firefly-download-btn',
      href: url,
      download: `firefly-${Date.now()}.png`,
      target: '_blank',
    }, 'Download Image');
    actions.appendChild(downloadBtn);
    this.imageContainer.appendChild(actions);
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

