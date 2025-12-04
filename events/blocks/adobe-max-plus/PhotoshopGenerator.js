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
          <div class="photoshop-upload-inner">
            <div class="photoshop-upload-icon">
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_14_480" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="15" y="17" width="66" height="61">
              <path d="M48 62.5996C46.8954 62.5996 46 61.7042 46 60.5996L46 24.582L35.4141 35.168C34.633 35.949 33.367 35.949 32.5859 35.168C31.8049 34.3869 31.8049 33.1209 32.5859 32.3398L46.5859 18.3398L46.7373 18.2022C47.5229 17.5614 48.6818 17.6076 49.4141 18.3398L63.4141 32.3399C64.1951 33.1209 64.1951 34.3869 63.4141 35.168C62.633 35.949 61.367 35.949 60.5859 35.168L50 24.582L50 60.5996C50 61.7042 49.1046 62.5996 48 62.5996ZM24.2939 77.5996C19.146 77.5995 15.0002 73.3971 15 68.2471L15 50.5996C15 49.495 15.8954 48.5996 17 48.5996C18.1046 48.5996 19 49.495 19 50.5996L19 68.2471C19.0002 71.2184 21.3854 73.5995 24.2939 73.5996L71.7061 73.5996C74.6146 73.5995 76.9998 71.2184 77 68.2471L77 50.5996C77 49.495 77.8954 48.5996 79 48.5996C80.1046 48.5996 81 49.495 81 50.5996L81 68.2471C80.9998 73.3971 76.854 77.5995 71.7061 77.5996L24.2939 77.5996Z" fill="#292929"/>
              </mask>
              <g mask="url(#mask0_14_480)">
              <g clip-path="url(#clip0_14_480)">
              <rect y="8.39259e-06" width="96" height="96" rx="5.125" fill="#FFECCF"/>
              <rect width="96" height="96" fill="#FFECCF"/>
              <circle cx="54.2809" cy="3.72358" r="41.7653" transform="rotate(-0.0800682 54.2809 3.72358)" fill="url(#paint0_radial_14_480)"/>
              <path d="M36.6412 -16.9578C29.2685 -21.52 19.9273 -21.548 12.5272 -17.0299L-61.4873 28.1609C-68.7361 32.5869 -68.7482 43.0338 -61.5092 47.4765L12.0162 92.6033C19.4052 97.1376 28.7465 97.1323 36.1291 92.5871L109.503 47.4181C116.704 42.9849 116.717 32.5964 109.525 28.1464L36.6412 -16.9578Z" fill="url(#paint1_linear_14_480)"/>
              <path d="M13.835 45.5787C15.4758 9.73907 45.8597 -17.9845 81.6993 -16.3437C117.539 -14.7029 145.263 15.681 143.622 51.5206C141.981 87.3603 111.597 115.084 75.7574 113.443C39.9177 111.802 12.1941 81.4183 13.835 45.5787Z" fill="url(#paint2_linear_14_480)"/>
              <path d="M-38.8939 69.2097C-24.6476 63.1322 -9.28309 63.3927 4.0283 68.7087C30.6647 79.3725 46.1635 72.7794 56.9133 46.204C62.2679 32.8685 72.722 21.5746 86.9843 15.4902C115.5 3.34416 148.419 16.5235 160.548 44.9546C172.677 73.3857 159.402 106.254 130.893 118.416C116.599 124.514 101.205 124.228 87.8731 118.864C61.2798 108.257 45.8106 114.876 35.0743 141.483C29.7062 154.786 19.2544 166.042 5.00814 172.119C-23.4845 184.274 -56.4043 171.095 -68.5264 142.68C-80.6486 114.265 -67.3865 81.3649 -38.8939 69.2097Z" fill="url(#paint3_linear_14_480)"/>
              <circle cx="90.4045" cy="17.3437" r="41.7653" transform="rotate(-0.0800682 90.4045 17.3437)" fill="url(#paint4_radial_14_480)"/>
              </g>
              </g>
              <defs>
              <radialGradient id="paint0_radial_14_480" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.2809 3.72358) rotate(90) scale(41.7653)">
              <stop offset="0.166667" stop-color="#FF709F"/>
              <stop offset="1" stop-color="#FF709F" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="paint1_linear_14_480" x1="-24.1259" y1="85.7898" x2="131.952" y2="-9.16653" gradientUnits="userSpaceOnUse">
              <stop offset="0.0598452" stop-color="#8480FE"/>
              <stop offset="0.599632" stop-color="#8480FE" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="paint2_linear_14_480" x1="101.127" y1="17.683" x2="34.1696" y2="89.6802" gradientUnits="userSpaceOnUse">
              <stop stop-color="#0800EB"/>
              <stop offset="1" stop-color="#003FEB" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="paint3_linear_14_480" x1="19.7566" y1="99.6171" x2="138.453" y2="33.125" gradientUnits="userSpaceOnUse">
              <stop stop-color="#0082FC" stop-opacity="0"/>
              <stop offset="0.432292" stop-color="#0015FC"/>
              <stop offset="0.609375" stop-color="#007EFC"/>
              <stop offset="1" stop-color="#0043FC" stop-opacity="0"/>
              </linearGradient>
              <radialGradient id="paint4_radial_14_480" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(90.4045 17.3437) rotate(90) scale(41.7653)">
              <stop offset="0.166667" stop-color="#2700EB"/>
              <stop offset="1" stop-color="#D400EB" stop-opacity="0"/>
              </radialGradient>
              <clipPath id="clip0_14_480">
              <rect y="8.39259e-06" width="96" height="96" rx="5.125" fill="white"/>
              </clipPath>
              </defs>
              </svg>
            </div>
            
            <p class="photoshop-upload-text">Upload an image from your device</p>
            
            <button class="photoshop-browse-btn">Browse files</button>
          </div>
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

