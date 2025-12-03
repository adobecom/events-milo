import html from '../../scripts/html.js';
import { useState, useEffect, useRef } from '../../scripts/deps/preact/hooks/index.js';
import { useSessions } from './sessionProvider.js';

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
export default function SessionDrawer({ selectedTrack, isOpen, onToggle, openOnMount }) {
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
        </div>
      </div>

      <div class="session-drawer-content" ref=${contentRef}>
        ${sessions.length === 0 ? html`
          <div class="session-drawer-empty">
            <p>No sessions available for this track.</p>
          </div>
        ` : html`
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
                <div key=${session.id} class="session-card">
                  ${isLive ? html`
                    <div class="session-live-badge">
                      <span class="session-live-dot"></span>
                      Live now
                    </div>
                  ` : null}

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
                    ${isLive ? html`
                      <button class="session-btn session-btn-primary">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 2L13 8L3 14V2Z" fill="currentColor"/>
                        </svg>
                        Watch now
                      </button>
                    ` : html`
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
                    `}
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

