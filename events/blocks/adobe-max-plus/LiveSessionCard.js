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
export default function LiveSessionCard({ session, onScheduleToggle, isInSchedule }) {
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
    .filter(tag => tag.tagId?.includes('products/') && !tag.tagId.includes('creative-cloud'))
    .map(tag => tag.title)
    .slice(0, 2);
  
  // Get track tags for display
  const trackTags = (session.tags || [])
    .filter(tag => tag.tagId?.includes('topics/'))
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
              <button class="session-drawer-live-session-actions-button session-drawer-live-session-actions-button-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 2L13 8L3 14V2Z" fill="currentColor"/>
                </svg>
                Watch now
              </button>
              ${onScheduleToggle && html`
                <button \
                  class="session-drawer-live-session-actions-button ${inSchedule ? 'session-drawer-live-session-actions-button-added' : 'session-drawer-live-session-actions-button-secondary'}" \
                  onClick=${(e) => { e.stopPropagation(); onScheduleToggle(session.id, e); }} \
                >
                  ${inSchedule ? html`
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Added
                  ` : 'Add to schedule'}
                </button>
              `}
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

