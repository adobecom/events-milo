import html from '../../scripts/html.js';

/**
 * Format ISO timestamp to readable time (e.g., "9:00 AM")
 */
function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Format duration in minutes to human-readable format
 */
function formatDuration(minutes) {
  if (!minutes) return '';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs}hr ${mins}min`;
  if (hrs > 0) return `${hrs} hr`;
  return `${mins} min`;
}

/**
 * LiveSessionCard Component - Highlights a live session in the drawer
 */
export default function LiveSessionCard({ session, onScheduleToggle, isInSchedule, onClose }) {
  if (!session) return null;

  const startTime = formatTime(session.sessionStartTime);
  const duration = formatDuration(session.sessionDuration);
  
  // Parse time for display
  const timeMatch = startTime.match(/^(\d+:\d+)\s*(AM|PM)$/);
  const timeText = timeMatch ? timeMatch[1] : startTime;
  const ampm = timeMatch ? timeMatch[2] : '';
  
  // Get speaker photos
  const speakers = session.eventSpeakers || [];
  const speakerPhotos = speakers.slice(0, 2).map(s => s.backgroundImage).filter(Boolean);
  
  // Get product tags for display
  const productTags = (session.tags || [])
    .filter(tag => tag.tagId?.includes('products/') && !tag.tagId.includes('creative-cloud') && !tag.tagId.includes('not-product-specific'))
    .map(tag => tag.title)
    .slice(0, 2);
  
  // Get track tags for display
  const trackTags = (session.tags || [])
    .filter(tag => tag.tagId?.includes('caas:events/max/track'))
    .map(tag => tag.title)
    .slice(0, 2);
  
  const inSchedule = isInSchedule?.(session.id);

  return html`
    <section class="session-drawer-live-session">
      <div class="session-drawer-live-session-badge">
        <span class="session-drawer-live-session-badge-dot"></span>
        <span class="session-drawer-live-session-badge-text">Live now</span>
      </div>
      <div class="session-drawer-live-session-highlight">
        <div class="session-drawer-live-session-highlight-content">
          <div class="session-drawer-live-session-highlight-content-left">
            <div class="session-drawer-live-session-time">
              <span class="session-drawer-live-session-time-text">${timeText}</span>
              ${ampm && html`<span class="session-drawer-live-session-time-ampm">${ampm}</span>`}
            </div>
            ${speakerPhotos.length > 0 && html`
              <div class="session-drawer-live-session-speakers-avatars">
                ${speakerPhotos.map((photo, idx) => html`
                  <div key=${idx} class="session-drawer-live-session-speakers-avatar">
                    <img src=${photo} alt="Speaker" />
                  </div>
                `)}
              </div>
            `}
            ${productTags.length > 0 && html`
              <div class="session-drawer-live-session-product-chips">
                ${productTags.map((tag, idx) => html`
                  <div key=${idx} class="session-drawer-live-session-product-chip">
                    <span class="session-drawer-live-session-product-chip-text">${tag}</span>
                  </div>
                `)}
              </div>
            `}
            ${trackTags.length > 0 && html`
              <div class="session-drawer-live-session-tracks-chips">
                ${trackTags.map((tag, idx) => html`
                  <div key=${idx} class="session-drawer-live-session-track-chip">
                    <span class="session-drawer-live-session-track-chip-text">${tag}</span>
                  </div>
                `)}
              </div>
            `}
            ${duration && html`
              <div class="session-drawer-live-session-duration-chip">
                <span class="session-drawer-live-session-duration-chip-text">${duration}</span>
              </div>
            `}
          </div>
          <div class="session-drawer-live-session-highlight-content-right">
            ${session.backgroundImage && html`
              <div class="session-drawer-live-session-image">
                <img src=${session.backgroundImage} alt=${session.title} />
              </div>
            `}
            <div class="session-drawer-live-session-title">
              <h3 class="session-drawer-live-session-title-text">${session.title}</h3>
            </div>
            ${session.description && html`
              <div class="session-drawer-live-session-description">
                <p class="session-drawer-live-session-description-text">\
                  ${session.description.replace(/<[^>]*>/g, '').substring(0, 150)}${session.description.length > 150 ? '...' : ''}\
                </p>
              </div>
            `}
            <div class="session-drawer-live-session-actions">
              <button \
                class="session-drawer-live-session-actions-button session-drawer-live-session-actions-button-primary" \
                onClick=${onClose} \
              >
                <svg width="31" height="24" viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_510_2790" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="10" y="4" width="16" height="16">
                    <path d="M13.7992 18.403C13.4809 18.403 13.1629 18.3171 12.8766 18.146C12.3277 17.8179 12 17.2397 12 16.6007V7.3991C12 6.76004 12.3277 6.18192 12.8766 5.85379C13.425 5.52645 14.0887 5.51004 14.652 5.81395L23.2129 10.4147C23.7973 10.7288 24.1602 11.3366 24.1602 11.9999C24.1602 12.6632 23.7973 13.271 23.2129 13.5851L14.652 18.1858C14.3828 18.3312 14.0906 18.403 13.7992 18.403ZM13.802 6.79676C13.6594 6.79676 13.5473 6.85145 13.4922 6.88426C13.4043 6.93661 13.2 7.09208 13.2 7.3991V16.6007C13.2 16.9077 13.4043 17.0632 13.4922 17.1155C13.5801 17.1678 13.8133 17.2741 14.084 17.1296L22.6445 12.5288C22.9293 12.3749 22.9602 12.1077 22.9602 11.9999C22.9602 11.8921 22.9293 11.6249 22.6445 11.471L14.084 6.8702C13.9828 6.81629 13.8871 6.79676 13.802 6.79676Z" fill="#292929"/>
                  </mask>
                  <g mask="url(#mask0_510_2790)">
                    <rect x="10" y="4" width="16" height="16" fill="currentColor"/>
                  </g>
                </svg>
                Watch now
              </button>
            </div>
          </div>
        </div>
        <div class="session-drawer-live-session-highlight-progress">
          <div class="session-drawer-live-session-highlight-progress-bar"></div>
        </div>
      </div>
    </section>
  `;
}

