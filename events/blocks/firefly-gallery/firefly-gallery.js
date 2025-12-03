/* eslint-disable class-methods-use-this */

/**
 * Firefly Gallery Block
 * Displays a gallery of community-generated Firefly images
 */

const API_ENDPOINT = 'https://community-hubs.adobe.io/api/v2/ff_community/assets';
const API_KEY = 'milo-ff-gallery-unity';

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

// Build rendition URL from template
function getRenditionUrl(renditionLink, size = 400) {
  if (!renditionLink?.href) return null;
  return renditionLink.href
    .replace('{format}', 'jpg')
    .replace('{dimension}', 'width')
    .replace('{size}', size.toString());
}

class FireflyGallery {
  constructor(el) {
    this.el = el;
    this.assets = [];
    this.cursor = '';
    this.isLoading = false;
    this.hasMore = true;
    this.parseBlockConfig();
  }

  parseBlockConfig() {
    // Parse block content for configuration
    const rows = this.el.querySelectorAll(':scope > div');
    this.title = 'Remix with the community.';
    this.category = 'VideoGeneration';
    this.imageCount = 6; // Fixed number of images

    rows.forEach((row) => {
      const cells = row.querySelectorAll(':scope > div');
      if (cells.length >= 2) {
        const key = cells[0].textContent.trim().toLowerCase();
        const value = cells[1].textContent.trim();
        switch (key) {
          case 'title':
            this.title = value;
            break;
          case 'category':
            this.category = value;
            break;
          case 'count':
            this.imageCount = parseInt(value, 10) || 6;
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

    // Load images
    await this.loadImages();
  }

  buildUI() {
    // Main container
    const container = createTag('div', { class: 'gallery-container' });

    // Title
    const titleEl = createTag('h2', { class: 'gallery-title' }, this.title);
    container.appendChild(titleEl);

    // Gallery grid with two columns
    this.galleryGrid = createTag('div', { class: 'gallery-grid' });

    // Left column
    this.leftColumn = createTag('div', { class: 'gallery-column gallery-column-left' });
    this.galleryGrid.appendChild(this.leftColumn);

    // Right column (offset)
    this.rightColumn = createTag('div', { class: 'gallery-column gallery-column-right' });
    this.galleryGrid.appendChild(this.rightColumn);

    container.appendChild(this.galleryGrid);

    // Loading indicator
    this.loadingEl = createTag('div', { class: 'gallery-loading' });
    const spinner = createTag('div', { class: 'gallery-spinner' });
    this.loadingEl.appendChild(spinner);
    container.appendChild(this.loadingEl);

    // Error message
    this.errorEl = createTag('div', { class: 'gallery-error hidden' });
    container.appendChild(this.errorEl);

    this.el.appendChild(container);
  }

  async loadImages() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.loadingEl.classList.remove('hidden');
    this.errorEl.classList.add('hidden');

    try {
      const params = new URLSearchParams({
        size: this.imageCount.toString(),
        sort: 'updated_desc',
        include_pending_assets: 'false',
        cursor: '',
        category_id: this.category,
      });

      const response = await fetch(`${API_ENDPOINT}?${params}`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Assets are in _embedded.assets
      const assets = data._embedded?.assets || [];

      if (assets.length > 0) {
        this.renderAssets(assets.slice(0, this.imageCount));
      }
    } catch (error) {
      console.error('Failed to load gallery images:', error);
      this.showError('Failed to load images. Please try again.');
    } finally {
      this.isLoading = false;
      this.loadingEl.classList.add('hidden');
    }
  }

  renderAssets(assets) {
    // Split assets into left and right columns
    assets.forEach((asset, index) => {
      const card = this.createAssetCard(asset, index);
      if (card) {
        // Alternate between columns: even indices go left, odd go right
        if (index % 2 === 0) {
          this.leftColumn.appendChild(card);
        } else {
          this.rightColumn.appendChild(card);
        }
      }
    });
  }

  createAssetCard(asset, index) {
    // Get the rendition URL from _links.rendition
    const renditionLink = asset._links?.rendition;
    const imageUrl = getRenditionUrl(renditionLink, 400);

    if (!imageUrl) return null;

    const card = createTag('div', { class: 'gallery-card' });
    card.style.animationDelay = `${index * 0.1}s`;

    // Image
    const img = createTag('img', {
      src: imageUrl,
      alt: asset.title || 'Firefly generated image',
      loading: 'lazy',
    });

    img.onerror = () => {
      card.classList.add('image-error');
      img.style.display = 'none';
    };

    card.appendChild(img);

    // Click handler to open lightbox
    card.addEventListener('click', () => this.openLightbox(asset));

    return card;
  }

  openLightbox(asset) {
    const renditionLink = asset._links?.rendition;
    const imageUrl = getRenditionUrl(renditionLink, 1200);

    if (!imageUrl) return;

    // Create lightbox
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
      alt: asset.title || 'Firefly generated image',
    });
    lightboxContent.appendChild(img);

    // Info panel
    const infoPanel = createTag('div', { class: 'gallery-lightbox-info' });

    // Get prompt from custom.input
    const prompt = asset.custom?.input?.['firefly#originalPrompt'] || asset.title;

    if (prompt) {
      const promptLabel = createTag('span', { class: 'gallery-lightbox-label' }, 'Prompt');
      infoPanel.appendChild(promptLabel);
      const promptEl = createTag('p', { class: 'gallery-lightbox-prompt' }, prompt);
      infoPanel.appendChild(promptEl);
    }

    // Author info
    const owner = asset._embedded?.owner;
    if (owner?.display_name) {
      const authorEl = createTag('p', { class: 'gallery-lightbox-author' }, `
        Created by <strong>${owner.display_name}</strong>
      `);
      infoPanel.appendChild(authorEl);
    }

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
    this.errorEl.textContent = message;
    this.errorEl.classList.remove('hidden');
  }
}

export default async function init(el) {
  const gallery = new FireflyGallery(el);
  await gallery.init();
}
