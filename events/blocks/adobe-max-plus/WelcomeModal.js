import { useState, useEffect } from '../../scripts/deps/preact/hooks/index.js';
import html from '../../scripts/html.js';
import { useIMS } from './imsProvider.js';

const STORAGE_KEY = 'adobe-max-plus-welcome-seen';

/**
 * Welcome Modal component that shows on first visit
 */
export default function WelcomeModal() {
  const [isVisible, setIsVisible] = useState(false);
  const { profile } = useIMS();

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem(STORAGE_KEY);
    
    if (!hasSeenModal) {
      // Show modal after a brief delay for better UX
      setTimeout(() => {
        setIsVisible(true);
      }, 500);
    }
  }, []);

  const handleClose = () => {
    // Mark modal as seen in localStorage
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  // Get user's first name from profile, fallback to generic greeting
  const firstName = profile?.first_name || profile?.displayName?.split(' ')[0] || '';
  const greeting = firstName ? `Welcome, ${firstName}!` : 'Welcome!';

  return html`
    <div class="welcome-modal-overlay" onClick=${handleClose}>
      <div class="welcome-modal" onClick=${(e) => e.stopPropagation()}>
        <button class="welcome-modal-close" onClick=${handleClose} aria-label="Close modal">
          ×
        </button>
        
        <div class="welcome-modal-content">
          <div class="welcome-modal-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M31.7381 42.3973C31.0381 42.3973 30.3318 42.216 29.6943 41.8473C28.1537 40.9566 27.3756 39.191 27.7537 37.4535L30.0818 26.6566L22.6631 18.4723C21.4693 17.1535 21.2631 15.2347 22.1537 13.6941C23.0443 12.1504 24.8256 11.3723 26.5474 11.7535L37.3443 14.0816L45.5287 6.66287C46.8506 5.46287 48.7693 5.26601 50.3068 6.1535C51.8474 7.04412 52.6256 8.80975 52.2474 10.5473L49.9193 21.3441L57.3381 29.5285C58.5318 30.8441 58.7349 32.7629 57.8474 34.3035C56.9568 35.841 55.1975 36.6254 53.4568 36.2504L42.66 33.916L34.4725 41.3379C33.7006 42.0379 32.7224 42.3973 31.7381 42.3973ZM34.8537 27.3067L32.9193 36.266L39.7099 30.1098C40.6787 29.2316 42.0162 28.8691 43.3006 29.1441L52.2662 31.0816L46.1099 24.291C45.2287 23.316 44.8693 21.9691 45.1506 20.6879L47.0818 11.7347L40.2912 17.891C39.3162 18.7723 37.9725 19.1285 36.6881 18.8504L27.735 16.9191L33.8912 23.7097C34.7725 24.6816 35.1318 26.0254 34.8537 27.3067Z" fill="#DBDBDB"/>
              <path d="M10.7063 58.4061C10.2938 58.4061 9.88131 58.2999 9.5063 58.0842C8.60317 57.5623 8.14067 56.5186 8.35942 55.4999L9.34067 50.9623L6.22192 47.5248C5.52192 46.753 5.40003 45.6155 5.92192 44.7123C6.44381 43.8092 7.49379 43.3592 8.5063 43.5654L13.0438 44.5467L16.4813 41.4279C17.2563 40.7248 18.3876 40.6061 19.2938 41.1279C20.197 41.6498 20.6595 42.6936 20.4407 43.7123L19.4595 48.2498L22.5782 51.6873C23.2782 52.4592 23.4001 53.5967 22.8782 54.4999C22.3563 55.403 21.3032 55.8467 20.2938 55.6467L15.7563 54.6655L12.3188 57.7842C11.8657 58.1936 11.2876 58.4061 10.7063 58.4061Z" fill="#DBDBDB"/>
          </svg>
          </div>
          
          <h2 class="welcome-modal-title">Your Event Experience, Personalized</h2>
          
          <p class="welcome-modal-text">
            ${greeting} We've tailored your Adobe MAX+ dashboard to fit your interests as a Creator—so you'll see sessions, products, and recommendations that matter most. Need something else? Our Events AI Agent is here to help.
          </p>
          
          <button class="welcome-modal-cta" onClick=${handleClose}>
            Explore your dashboard
          </button>
        </div>
      </div>
    </div>
  `;
}

