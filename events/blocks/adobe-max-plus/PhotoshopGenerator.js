import html from '../../scripts/html.js';

/**
 * PhotoshopGenerator component - Static Photoshop upload interface
 * Displayed when the Photography track is selected
 */
export default function PhotoshopGenerator() {
  return html`
    <div class="photoshop-generator">
      <div class="photoshop-generator-content">
        <h2 class="photoshop-generator-title">Create with Photoshop</h2>
        
        <div class="photoshop-upload-area">
          <div class="photoshop-upload-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 16V40M32 16L24 24M32 16L40 24" stroke="url(#gradient)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 44C16 42.8954 16.8954 42 18 42H46C47.1046 42 48 42.8954 48 44V46C48 47.1046 47.1046 48 46 48H18C16.8954 48 16 47.1046 16 46V44Z" stroke="url(#gradient)" stroke-width="3" stroke-linecap="round"/>
              <defs>
                <linearGradient id="gradient" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#5C5CE0"/>
                  <stop offset="1" stop-color="#00D4FF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <p class="photoshop-upload-text">Upload an image from your device</p>
          
          <button class="photoshop-browse-btn">Browse files</button>
        </div>
        
        <p class="photoshop-sample-text">Or select a sample image</p>
        
        <div class="photoshop-sample-images">
          <button class="photoshop-sample-image" aria-label="Sample image 1">
            <img src="https://placehold.co/160x120/e06a5a/ffffff?text=Sample+1" alt="Sample 1" />
          </button>
          <button class="photoshop-sample-image" aria-label="Sample image 2">
            <img src="https://placehold.co/160x120/4a90e2/ffffff?text=Sample+2" alt="Sample 2" />
          </button>
          <button class="photoshop-sample-image" aria-label="Sample image 3">
            <img src="https://placehold.co/160x120/7fb069/ffffff?text=Sample+3" alt="Sample 3" />
          </button>
        </div>
      </div>
    </div>
  `;
}

