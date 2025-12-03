import html from '../../scripts/html.js';
import { useState, useEffect, useRef } from '../../scripts/deps/preact/hooks/index.js';
import { useSessions } from './sessionProvider.js';
import LiveSessionCard from './LiveSessionCard.js';

const DRAWER_STORAGE_KEY = 'adobe-max-plus-drawer-opened';

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
 * Check if a session is currently live
 */
function isSessionLive(startTime, endTime) {
  if (!startTime || !endTime) return false;
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  return now >= start && now <= end;
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
 * SessionDrawer Component - Draggable bottom drawer showing track sessions
 */
export default function SessionDrawer({ selectedTrack, isOpen, onToggle, openOnMount, onAIChatOpen }) {
  const { tracks, isInSchedule, addToSchedule, removeFromSchedule } = useSessions();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const drawerRef = useRef(null);
  const contentRef = useRef(null);

  // Find current track data
  const currentTrack = tracks.find((track) => track.id === selectedTrack);
  const trackName = currentTrack?.name || 'Sessions';
  const sessions = currentTrack?.sessions || [];

  // Auto-open drawer on mount if requested (first-time flow)
  useEffect(() => {
    const hasAutoOpened = localStorage.getItem(DRAWER_STORAGE_KEY);
    if (openOnMount && !hasAutoOpened && onToggle) {
      // Small delay for better UX
      setTimeout(() => {
        onToggle(true);
        localStorage.setItem(DRAWER_STORAGE_KEY, 'true');
      }, 300);
    }
  }, [openOnMount, onToggle]);

  // Drag handlers
  const handleDragStart = (e) => {
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStartY(clientY);
    setDragOffset(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    // Prevent default scrolling behavior
    e.preventDefault();
    
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const offset = clientY - dragStartY;
    
    // Only allow dragging down when open, or up when closed
    if ((isOpen && offset > 0) || (!isOpen && offset < 0)) {
      setDragOffset(offset);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Threshold for toggling (50px drag distance)
    const threshold = 50;
    
    if (isOpen && dragOffset > threshold) {
      // Dragged down while open -> close
      onToggle(false);
    } else if (!isOpen && dragOffset < -threshold) {
      // Dragged up while closed -> open
      onToggle(true);
    }
    
    setDragOffset(0);
    setDragStartY(0);
  };

  const handleHeaderClick = () => {
    if (!isDragging) {
      onToggle(!isOpen);
    }
  };

  const handleScheduleToggle = (sessionId, e) => {
    e.stopPropagation();
    if (isInSchedule(sessionId)) {
      removeFromSchedule(sessionId);
    } else {
      addToSchedule(sessionId);
    }
  };

  // Calculate dynamic height during drag
  const getDrawerStyle = () => {
    const style = {};
    
    if (isDragging && dragOffset !== 0) {
      if (!isOpen && dragOffset < 0) {
        // Dragging up from closed state - increase height
        const maxHeight = window.innerHeight - 60; // Account for navbar
        const minHeight = 70;
        const newHeight = Math.min(maxHeight, minHeight + Math.abs(dragOffset));
        style.height = `${newHeight}px`;
      } else if (isOpen && dragOffset > 0) {
        // Dragging down from open state - decrease height
        const maxHeight = window.innerHeight - 60;
        const minHeight = 70;
        const newHeight = Math.max(minHeight, maxHeight - dragOffset);
        style.height = `${newHeight}px`;
      }
    }
    
    return style;
  };

  return html`
    <div \
      class="session-drawer ${isOpen ? 'open' : 'closed'}" \
      ref=${drawerRef} \
      style=${getDrawerStyle()} \
    >
      <div \
        class="session-drawer-header" \
        onMouseDown=${handleDragStart} \
        onMouseMove=${handleDragMove} \
        onMouseUp=${handleDragEnd} \
        onMouseLeave=${handleDragEnd} \
        onTouchStart=${handleDragStart} \
        onTouchMove=${handleDragMove} \
        onTouchEnd=${handleDragEnd} \
        onClick=${handleHeaderClick} \
      >
        <div class="session-drawer-handle"></div>
        <div class="session-drawer-header-content">
          <div class="session-drawer-header-content-left">
            <h2 class="session-drawer-title">${trackName}</h2>
            <svg \
              class="session-drawer-chevron" \
              width="24" \
              height="24" \
              viewBox="0 0 24 24" \
              fill="none" \
              xmlns="http://www.w3.org/2000/svg" \
            >
              <path \
                d="M7 10L12 15L17 10" \
                stroke="currentColor" \
                stroke-width="2" \
                stroke-linecap="round" \
                stroke-linejoin="round" \
              />
            </svg>
          </div>
          <div class="session-drawer-header-content-right">
            <button \
              class="session-drawer-header-content-right-button" \
              onClick=${(e) => { e.stopPropagation(); onAIChatOpen?.(); }} \
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_264_18707)">
                  <rect width="40" height="40" rx="20" fill="#111111"/>
                  <g clip-path="url(#clip1_264_18707)">
                    <mask id="mask0_264_18707" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="9" y="9" width="22" height="22">
                      <path d="M15.875 29.8978C15.7654 29.8978 15.6558 29.8763 15.5516 29.8322C15.2476 29.7023 15.05 29.4036 15.05 29.0728V25.4978H14.225C11.9509 25.4978 10.1 23.6469 10.1 21.3728V15.3228C10.1 13.0486 11.9509 11.1978 14.225 11.1978H18.5734C19.0289 11.1978 19.3984 11.5673 19.3984 12.0228C19.3984 12.4782 19.0289 12.8478 18.5734 12.8478H14.225C12.8607 12.8478 11.75 13.9585 11.75 15.3228V21.3728C11.75 22.737 12.8607 23.8478 14.225 23.8478H15.875C16.3304 23.8478 16.7 24.2173 16.7 24.6728V27.1327L19.8721 24.0787C20.0258 23.9305 20.2309 23.8478 20.4447 23.8478H25.775C27.1392 23.8478 28.25 22.737 28.25 21.3728V19.9741C28.25 19.5187 28.6195 19.1491 29.075 19.1491C29.5304 19.1491 29.9 19.5187 29.9 19.9741V21.3728C29.9 23.6469 28.0491 25.4978 25.775 25.4978H20.7777L16.4475 29.6668C16.2907 29.8183 16.0844 29.8978 15.875 29.8978Z" fill="#292929"/>
                      <path d="M23.6062 18.9912C23.3989 18.9912 23.1905 18.9375 23.0025 18.829C22.5449 18.5658 22.3128 18.0427 22.4235 17.5271L22.9294 15.1896L21.3235 13.4182C20.969 13.0272 20.9078 12.4589 21.1709 12.0023C21.4352 11.5458 21.9637 11.3138 22.4729 11.4233L24.8104 11.9293L26.5818 10.3233C26.9728 9.96992 27.5443 9.90976 27.9976 10.1708C28.4552 10.434 28.6872 10.9571 28.5766 11.4728L28.0707 13.8103L29.6766 15.5816C30.0311 15.9727 30.0923 16.5409 29.8291 16.9975C29.5649 17.4551 29.0407 17.6893 28.5272 17.5765L26.1897 17.0705L24.4183 18.6765C24.1895 18.8838 23.8995 18.9912 23.6062 18.9912ZM23.4676 13.3268L24.3034 14.2485C24.5633 14.5321 24.6718 14.9317 24.5902 15.3142L24.327 16.5323L25.2487 15.6966C25.5333 15.4366 25.9373 15.3292 26.3143 15.4098L27.5325 15.6729L26.6967 14.7513C26.4368 14.4677 26.3283 14.0681 26.4099 13.6856L26.6731 12.4675L25.7514 13.3032C25.4678 13.5643 25.0661 13.6738 24.6858 13.59L23.4676 13.3268Z" fill="#292929"/>
                      <path d="M17.7258 21.6545C17.584 21.6545 17.4422 21.618 17.3133 21.5438C17.0029 21.3644 16.8439 21.0057 16.9191 20.6555L17.1146 19.7531L16.4948 19.0699C16.2541 18.8046 16.2122 18.4136 16.3916 18.1031C16.571 17.7927 16.932 17.6401 17.28 17.7089L18.1824 17.9044L18.8656 17.2846C19.132 17.0439 19.5208 17.002 19.8324 17.1814C20.1428 17.3608 20.3018 17.7196 20.2266 18.0698L20.0311 18.9722L20.6509 19.6553C20.8915 19.9207 20.9334 20.3117 20.754 20.6222C20.5746 20.9326 20.2126 21.0884 19.8657 21.0164L18.9633 20.8209L18.2801 21.4407C18.1244 21.5814 17.9256 21.6545 17.7258 21.6545Z" fill="#292929"/>
                    </mask>
                    <g mask="url(#mask0_264_18707)">
                      <rect x="9" y="9" width="22" height="22" fill="url(#paint0_linear_264_18707)"/>
                    </g>
                  </g>
                </g>
                <rect x="1" y="1" width="38" height="38" rx="19" stroke="url(#paint1_linear_264_18707)" stroke-width="2"/>
                <defs>
                  <linearGradient id="paint0_linear_264_18707" x1="4.92083" y1="15.6815" x2="39.1832" y2="20.5608" gradientUnits="userSpaceOnUse">
                    <stop offset="0.059183" stop-color="#9A3CF9"/>
                    <stop offset="0.344409" stop-color="#E743C8"/>
                    <stop offset="0.58317" stop-color="#ED457E"/>
                    <stop offset="0.84223" stop-color="#FF7918"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_264_18707" x1="2.5" y1="6.25" x2="41.25" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#AD3EEE"/>
                    <stop offset="0.473014" stop-color="#E944B6"/>
                    <stop offset="1" stop-color="#FA6B35"/>
                  </linearGradient>
                  <clipPath id="clip0_264_18707">
                    <rect width="40" height="40" rx="20" fill="white"/>
                  </clipPath>
                  <clipPath id="clip1_264_18707">
                    <rect width="22" height="22" fill="white" transform="translate(9 9)"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="session-drawer-content" ref=${contentRef}>
        ${sessions.length === 0 ? html`
          <div class="session-drawer-empty">
            <p>No sessions available for this track.</p>
          </div>
        ` : html`
          ${sessions[0] && html`
            <${LiveSessionCard} \
              session=${sessions[0]} \
              onScheduleToggle=${handleScheduleToggle} \
              isInSchedule=${isInSchedule} \
            />
          `}
          <div class="session-drawer-list">
            ${sessions.map((session) => {
              const isLive = isSessionLive(session.sessionStartTime, session.sessionEndTime);
              const inSchedule = isInSchedule(session.id);
              const startTime = formatTime(session.sessionStartTime);
              const duration = formatDuration(session.sessionDuration);
              
              // Get speaker photos
              const speakers = session.eventSpeakers || [];
              const speakerPhotos = speakers.slice(0, 4).map(s => s.backgroundImage).filter(Boolean);
              
              // Get product tags for display
              const productTags = (session.tags || [])
                .filter(tag => tag.tagId?.includes('products/') && !tag.tagId.includes('creative-cloud'))
                .map(tag => tag.title)
                .slice(0, 3);

              return html`
                <div key=${selectedTrack + '-' + session.id} class="session-card">

                  <div class="session-card-time">${startTime}</div>

                  <div class="session-card-main">
                    ${speakerPhotos.length > 0 ? html`
                      <div class="session-card-speakers">
                        ${speakerPhotos.map((photo, idx) => html`
                          <img \
                            key=${idx} \
                            src=${photo} \
                            alt="Speaker" \
                            class="session-speaker-photo" \
                          />
                        `)}
                      </div>
                    ` : session.backgroundImage ? html`
                      <div class="session-card-image">
                        <img src=${session.backgroundImage} alt=${session.title} />
                      </div>
                    ` : null}

                    <div class="session-card-content">
                      ${productTags.length > 0 ? html`
                        <div class="session-card-tags">
                          ${productTags.map((tag, idx) => html`
                            <span key=${idx} class="session-tag">${tag}</span>
                          `)}
                        </div>
                      ` : null}

                      <h3 class="session-card-title">${session.title}</h3>

                      ${session.description ? html`
                        <p class="session-card-description">
                          ${session.description.replace(/<[^>]*>/g, '').substring(0, 120)}${session.description.length > 120 ? '...' : ''}
                        </p>
                      ` : null}

                      ${duration ? html`
                        <div class="session-card-duration">${duration}</div>
                      ` : null}
                    </div>
                  </div>

                  <div class="session-card-actions">
                    <button \
                        class="session-btn ${inSchedule ? 'session-btn-added' : 'session-btn-secondary'}" \
                        onClick=${(e) => handleScheduleToggle(session.id, e)} \
                      >
                        ${inSchedule ? html`
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          Added
                        ` : 'Add to schedule'}
                      </button>
                  </div>
                </div>
              `;
            })}
          </div>
        `}
      </div>
    </div>
  `;
}

