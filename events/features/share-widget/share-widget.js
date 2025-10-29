/**
 * Share Widget
 * 
 * A floating share button widget that appears in the bottom-right corner of the page.
 * On hover, it expands to show sharing options for Facebook, LinkedIn, X, and a copy link button.
 * 
 * Features:
 * - Fixed position in viewport (bottom-right)
 * - Hover to expand with smooth animation
 * - Share to Facebook, LinkedIn, X
 * - Copy current URL to clipboard with toast notification
 * - Responsive design for mobile devices
 * 
 * Usage:
 *   import initShareWidget from '../../features/share-widget/share-widget.js';
 *   initShareWidget();
 */

import { getIcon } from '../../scripts/utils.js';

// Load share widget CSS
function loadShareWidgetCSS() {
  const cssPath = '/events/features/share-widget/share-widget.css';
  if (!document.querySelector(`link[href="${cssPath}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
  }
}

// Share Types Enum
const ShareType = {
  LinkedIn: 'linkedin',
  Facebook: 'facebook',
  X: 'x',
};

// Open share popup
function openSharePopup(shareType, url) {
  const encodedUrl = encodeURIComponent(url);
  let shareUrl = '';

  switch (shareType) {
    case ShareType.LinkedIn:
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      break;
    case ShareType.Facebook:
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case ShareType.X:
      shareUrl = '';
      break;
    default:
      console.warn('Unknown share type:', shareType);
      return;
  }

  // Copy prefilled text to clipboard
  const prefilledText = `Can't keep calm — heading to the Adobe event! 🎉
Always inspired by the creativity, innovation, and people that make Adobe what it is. Can't wait to connect, learn, and bring back a spark of that creative energy! 🚀`;
  
  navigator.clipboard.writeText(prefilledText).catch((err) => {
    console.warn('Failed to copy to clipboard:', err);
  });

  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  }
}

// Copy current URL to clipboard and show toast
function copyLinkToClipboard() {
  const currentUrl = 'https://www.adobe.com/events/virtual-learn-events/virtual-learn-event-photoshop/2025-10-14.html';//window.location.href;
  
  navigator.clipboard.writeText(currentUrl).then(() => {
    showToast('Link copied to clipboard!');
  }).catch((err) => {
    console.error('Failed to copy link:', err);
    showToast('Failed to copy link', true);
  });
}

// Show toast notification
function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = `share-widget-toast ${isError ? 'error' : ''}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Create share widget
function createShareWidget() {
  const currentUrl = 'https://www.adobe.com/events/virtual-learn-events/virtual-learn-event-photoshop/2025-10-14.html';//window.location.href;
  
  // Create widget container
  const widget = document.createElement('div');
  widget.className = 'share-widget';
  
  // Create main share button
  const mainButton = document.createElement('button');
  mainButton.className = 'share-widget-main-btn';
  mainButton.setAttribute('aria-label', 'Share this event');
  mainButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
    </svg>
  `;
  
  // Create options container
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'share-widget-options';
  
  // Create Facebook button
  const facebookBtn = document.createElement('button');
  facebookBtn.className = 'share-widget-option';
  facebookBtn.setAttribute('aria-label', 'Share on Facebook');
  facebookBtn.appendChild(getIcon('facebook3'));
  facebookBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSharePopup(ShareType.Facebook, currentUrl);
  });
  
  // Create LinkedIn button
  const linkedinBtn = document.createElement('button');
  linkedinBtn.className = 'share-widget-option';
  linkedinBtn.setAttribute('aria-label', 'Share on LinkedIn');
  linkedinBtn.appendChild(getIcon('linkedin'));
  linkedinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSharePopup(ShareType.LinkedIn, currentUrl);
  });
  
  // Create X button
  const xBtn = document.createElement('button');
  xBtn.className = 'share-widget-option';
  xBtn.setAttribute('aria-label', 'Share on X');
  xBtn.appendChild(getIcon('x'));
  xBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSharePopup(ShareType.X, currentUrl);
  });
  
  // Create Copy Link button
  const copyLinkBtn = document.createElement('button');
  copyLinkBtn.className = 'share-widget-option';
  copyLinkBtn.setAttribute('aria-label', 'Copy link');
  copyLinkBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
    </svg>
  `;
  copyLinkBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    copyLinkToClipboard();
  });
  
  // Append options to container
  optionsContainer.append(copyLinkBtn, xBtn, linkedinBtn, facebookBtn);
  
  // Append elements to widget
  widget.append(optionsContainer, mainButton);
  
  // Add hover functionality
  let isHovered = false;
  
  widget.addEventListener('mouseenter', () => {
    isHovered = true;
    widget.classList.add('expanded');
  });
  
  widget.addEventListener('mouseleave', () => {
    isHovered = false;
    widget.classList.remove('expanded');
  });
  
  // Add to document
  document.body.appendChild(widget);
  
  return widget;
}

// Initialize share widget
export default function initShareWidget() {
  // Load CSS
  loadShareWidgetCSS();
  
  // Check if widget already exists
  if (document.querySelector('.share-widget')) {
    return;
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createShareWidget);
  } else {
    createShareWidget();
  }
}

