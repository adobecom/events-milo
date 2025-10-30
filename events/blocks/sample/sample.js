/**
 * Standalone Vanilla JS Agenda Block
 * Behaves like Digital Agenda but with NO dependencies (no AEM, no Dexter, no React)
 * Can run anywhere - just include this JS file!
 */

// ============================================================================
// MOCK CHIMERA API RESPONSE - Matches real Chimera API structure
// Only returns 'cards' array, just like the real API
// ============================================================================
const MOCK_CHIMERA_API_RESPONSE = {
    cards: [
        {
            sessionId: 's1',
            sessionTitle: 'Opening Keynote: The Future of Creativity',
            sessionStartTime: '2024-10-21T09:00:00.000Z',
            sessionEndTime: '2024-10-21T10:00:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track1', title: 'Keynote & Featured' },
            cardUrl: '#session-1',
            tags: ['keynote', 'innovation', 'ai'],
            isFeatured: true
        },
        {
            sessionId: 's2',
            sessionTitle: 'Deep Dive: Photoshop for Pros',
            sessionStartTime: '2024-10-21T10:15:00.000Z',
            sessionEndTime: '2024-10-21T11:15:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track2', title: 'Creative Cloud' },
            cardUrl: '#session-2',
            tags: ['photoshop', 'design'],
            isFeatured: false
        },
        {
            sessionId: 's3',
            sessionTitle: 'Acrobat & Sign: Document Workflows',
            sessionStartTime: '2024-10-21T11:30:00.000Z',
            sessionEndTime: '2024-10-21T12:30:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track3', title: 'Document Cloud' },
            cardUrl: '#session-3',
            tags: ['acrobat', 'sign'],
            isFeatured: false
        },
        {
            sessionId: 's4',
            sessionTitle: 'Personalizing Customer Journeys',
            sessionStartTime: '2024-10-21T13:00:00.000Z',
            sessionEndTime: '2024-10-21T14:00:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track4', title: 'Experience Cloud' },
            cardUrl: '#session-4',
            tags: ['experience', 'personalization'],
            isFeatured: true
        },
        {
            sessionId: 's5',
            sessionTitle: 'AI in Design: Future Forward',
            sessionStartTime: '2024-10-21T14:15:00.000Z',
            sessionEndTime: '2024-10-21T15:15:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track5', title: 'Emerging Tech' },
            cardUrl: '#session-5',
            tags: ['ai', 'design'],
            isFeatured: false
        },
        {
            sessionId: 's6',
            sessionTitle: 'Illustrator for Web Design',
            sessionStartTime: '2024-10-21T11:30:00.000Z',
            sessionEndTime: '2024-10-21T12:30:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track2', title: 'Creative Cloud' },
            cardUrl: '#session-6',
            tags: ['illustrator', 'web'],
            isFeatured: false
        },
        {
            sessionId: 's7',
            sessionTitle: 'Advanced PDF Security',
            sessionStartTime: '2024-10-21T13:00:00.000Z',
            sessionEndTime: '2024-10-21T14:00:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track3', title: 'Document Cloud' },
            cardUrl: '#session-7',
            tags: ['pdf', 'security'],
            isFeatured: false
        },
        {
            sessionId: 's20',
            sessionTitle: 'Overlapping Session Test',
            sessionStartTime: '2024-10-21T13:15:00.000Z',
            sessionEndTime: '2024-10-21T14:15:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track3', title: 'Document Cloud' },
            cardUrl: '#session-20',
            tags: ['test', 'overlap'],
            isFeatured: false
        },
        {
            sessionId: 's8',
            sessionTitle: 'Data-Driven Marketing with Analytics',
            sessionStartTime: '2024-10-21T14:15:00.000Z',
            sessionEndTime: '2024-10-21T15:15:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track4', title: 'Experience Cloud' },
            cardUrl: '#session-8',
            tags: ['analytics', 'marketing'],
            isFeatured: false
        },
        {
            sessionId: 's9',
            sessionTitle: 'VR/AR Content Creation',
            sessionStartTime: '2024-10-21T15:30:00.000Z',
            sessionEndTime: '2024-10-21T16:30:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track5', title: 'Emerging Tech' },
            cardUrl: '#session-9',
            tags: ['vr', 'ar'],
            isFeatured: false
        },
        // Day 2 Sessions
        {
            sessionId: 's10',
            sessionTitle: 'Keynote: Innovation in Action',
            sessionStartTime: '2024-10-22T09:00:00.000Z',
            sessionEndTime: '2024-10-22T10:00:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track1', title: 'Keynote & Featured' },
            cardUrl: '#session-10',
            tags: ['keynote', 'innovation'],
            isFeatured: true
        },
        {
            sessionId: 's11',
            sessionTitle: 'Premiere Pro: Advanced Editing',
            sessionStartTime: '2024-10-22T10:15:00.000Z',
            sessionEndTime: '2024-10-22T11:15:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track2', title: 'Creative Cloud' },
            cardUrl: '#session-11',
            tags: ['premiere', 'video'],
            isFeatured: false
        },
        {
            sessionId: 's12',
            sessionTitle: 'Adobe Scan & Fill & Sign',
            sessionStartTime: '2024-10-22T11:30:00.000Z',
            sessionEndTime: '2024-10-22T12:30:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track3', title: 'Document Cloud' },
            cardUrl: '#session-12',
            tags: ['mobile', 'productivity'],
            isFeatured: false
        },
        {
            sessionId: 's13',
            sessionTitle: 'Journey Orchestration with Adobe Journey Optimizer',
            sessionStartTime: '2024-10-22T13:00:00.000Z',
            sessionEndTime: '2024-10-22T14:00:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track4', title: 'Experience Cloud' },
            cardUrl: '#session-13',
            tags: ['journey', 'cxm'],
            isFeatured: false
        },
        {
            sessionId: 's14',
            sessionTitle: 'Metaverse & Digital Experiences',
            sessionStartTime: '2024-10-22T14:15:00.000Z',
            sessionEndTime: '2024-10-22T15:15:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track5', title: 'Emerging Tech' },
            cardUrl: '#session-14',
            tags: ['metaverse', 'web3'],
            isFeatured: false
        },
        // Day 3 Sessions
        {
            sessionId: 's15',
            sessionTitle: 'Closing Keynote: The Creative Revolution',
            sessionStartTime: '2024-10-23T09:00:00.000Z',
            sessionEndTime: '2024-10-23T10:00:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track1', title: 'Keynote & Featured' },
            cardUrl: '#session-15',
            tags: ['keynote', 'vision'],
            isFeatured: true
        },
        {
            sessionId: 's16',
            sessionTitle: 'Lightroom: Photo Editing Workflow',
            sessionStartTime: '2024-10-23T10:15:00.000Z',
            sessionEndTime: '2024-10-23T11:15:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track2', title: 'Creative Cloud' },
            cardUrl: '#session-16',
            tags: ['lightroom', 'photography'],
            isFeatured: false
        },
        {
            sessionId: 's17',
            sessionTitle: 'Advanced Adobe Sign Workflows',
            sessionStartTime: '2024-10-23T11:30:00.000Z',
            sessionEndTime: '2024-10-23T12:30:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track3', title: 'Document Cloud' },
            cardUrl: '#session-17',
            tags: ['sign', 'automation'],
            isFeatured: false
        },
        {
            sessionId: 's18',
            sessionTitle: 'Content Supply Chain Optimization',
            sessionStartTime: '2024-10-23T13:00:00.000Z',
            sessionEndTime: '2024-10-23T14:00:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track4', title: 'Experience Cloud' },
            cardUrl: '#session-18',
            tags: ['content', 'marketing'],
            isFeatured: false
        },
        {
            sessionId: 's19',
            sessionTitle: 'Ethical AI in Creative Tools',
            sessionStartTime: '2024-10-23T14:15:00.000Z',
            sessionEndTime: '2024-10-23T15:15:00.000Z',
            sessionDuration: '60',
            sessionTrack: { tagId: 'track5', title: 'Emerging Tech' },
            cardUrl: '#session-19',
            tags: ['ai', 'ethics'],
            isFeatured: false
        }
    ]
};

// ============================================================================
// HARDCODED CONFIG - Simulates AEM Dialog values
// In real Digital Agenda, these come from AEM component dialog
// ============================================================================
const AGENDA_CONFIG = {
    // Tracks Configuration (from AEM dialog "Tracks Collection Tags")
    tracks: [
        { id: 'track1', tagId: 'track1', title: 'Keynote & Featured', description: 'Main stage presentations', color: '#FF6B00' },
        { id: 'track2', tagId: 'track2', title: 'Creative Cloud', description: 'Design and creativity sessions', color: '#1473E6' },
        { id: 'track3', tagId: 'track3', title: 'Document Cloud', description: 'PDF and e-signature solutions', color: '#00A38F' },
        { id: 'track4', tagId: 'track4', title: 'Experience Cloud', description: 'Customer experience management', color: '#9D22C1' },
        { id: 'track5', tagId: 'track5', title: 'Emerging Tech', description: 'AI, AR, and future innovations', color: '#E63946' }
    ],
    
    // Place/Timezone Options
    places: [
        { id: 'live', name: 'Live', timezone: 'PST' },
        { id: 'americas', name: 'Americas', timezone: 'PST' },
        { id: 'emea', name: 'Europe, Middle East, and Africa', timezone: 'CET' },
        { id: 'apac', name: 'Asia Pacific', timezone: 'JST' }
    ],
    defaultPlace: 'americas',
    
    // Labels (from AEM dialog)
    labels: {
        liveLabel: 'LIVE',
        onDemandLabel: 'ON DEMAND',
        featuredLabel: 'FEATURED',
        timeZoneLabel: 'Times in',
        loadingText: 'Loading agenda...',
        noSessionsText: 'No sessions available for this day',
        prevAriaLabel: 'Previous',
        nextAriaLabel: 'Next'
    },
    
    // Styling (from AEM dialog)
    styles: {
        primaryBackgroundColor: '#F5F5F5',
        cellBorderColor: '#E0E0E0',
        cornerRadius: 4
    },
    
    // API Configuration
    api: {
        chimeraEndpoint: 'https://chimera-api.adobe.io/collection', // Placeholder
        useMockData: true // Set to false when using real API
    }
};

// Constants
const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const TIME_SLOT_DURATION = 15; // 15 minutes per time slot
const VISIBLE_TIME_SLOTS = 5; // Show 5 time slots

// ============================================================================
// HELPER FUNCTIONS (replacing Dexter utilities)
// ============================================================================

/**
 * Format date to readable string
 */
function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format time to readable string
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Get day key from timestamp
 */
function getDayKey(timestamp) {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
}

/**
 * Check if session is currently live
 */
function isSessionLive(session) {
    const now = Date.now();
    const start = new Date(session.sessionStartTime).getTime();
    const end = new Date(session.sessionEndTime).getTime();
    return now >= start && now <= end;
}

/**
 * Check if session is on demand (past session)
 */
function isSessionOnDemand(session) {
    const now = Date.now();
    const end = new Date(session.sessionEndTime).getTime();
    return now > end;
}

/**
 * Extract unique days from sessions (like Digital Agenda does)
 */
function extractDaysFromSessions(sessions) {
    const daysMap = new Map();
    
    sessions.forEach(session => {
        const startTime = new Date(session.sessionStartTime).getTime();
        const dayKey = getDayKey(startTime);
        
        if (!daysMap.has(dayKey)) {
            const date = new Date(startTime);
            daysMap.set(dayKey, {
                id: dayKey,
                date: dayKey,
                label: formatDate(date),
                startTime: new Date(dayKey + 'T00:00:00').getTime()
            });
        }
    });
    
    return Array.from(daysMap.values()).sort((a, b) => a.startTime - b.startTime);
}

/**
 * Debounce function for resize events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Render day/night icon (sun or moon)
 */
function renderDayNightIcon(showSun, showMoon) {
    if (showSun) {
        return `
            <div class="daytime_icon">
                <svg viewBox="0 0 14.5 14.5" xmlns="http://www.w3.org/2000/svg">
                    <title>Sun Icon</title>
                    <g transform="translate(-562 -997)">
                        <circle cx="569.2" cy="1004.2" r="3.2" fill="currentColor"/>
                        <path d="M569.2,998.4a0.641,0.641,0,0,1,0,1.283" fill="currentColor"/>
                        <path d="M569.2,1011.315a0.641,0.641,0,0,1,0-1.283" fill="currentColor"/>
                        <path d="M576.738,1001.527a0.641,0.641,0,0,1-.907.907" fill="currentColor"/>
                        <path d="M561.062,1008.066a0.641,0.641,0,0,1,.907-.907" fill="currentColor"/>
                        <path d="M576.738,1008.066a0.641,0.641,0,0,1-.907-.907" fill="currentColor"/>
                        <path d="M561.062,1001.527a0.641,0.641,0,0,1,.907.907" fill="currentColor"/>
                        <path d="M575.195,1004.2a0.641,0.641,0,0,1,1.283,0" fill="currentColor"/>
                        <path d="M562.205,1004.2a0.641,0.641,0,0,1-1.283,0" fill="currentColor"/>
                    </g>
                </svg>
            </div>
        `;
    }
    if (showMoon) {
        return `
            <div class="daytime_icon">
                <svg viewBox="0 0 8.1 11" xmlns="http://www.w3.org/2000/svg">
                    <title>Moon Icon</title>
                    <path d="M0,8.838C0.98,10.567,3.022,11.731,5.243,11.185c0.963-0.237,1.846-0.72,2.569-1.406c-0.495,0.046-1,0.014-1.493-0.096c-1.568-0.351-2.936-1.326-3.664-2.72C2.118,5.75,2.044,4.354,2.432,3.048C1.37,3.826,0.622,5.12,0.545,6.565C0.523,7.116,0.569,7.673,0.686,8.212C0.674,8.365,0.652,8.516,0.622,8.665C0.458,8.539,0.307,8.395,0.172,8.235C0.114,8.435,0.057,8.636,0,8.838z" fill="currentColor"/>
                </svg>
            </div>
        `;
    }
    return '';
}

/**
 * Check if locale uses 24-hour format
 */
function localeUses24HourTime() {
    try {
        const formatter = new Intl.DateTimeFormat(navigator.language, { hour: 'numeric' });
        const parts = formatter.formatToParts(new Date(2020, 0, 1, 13));
        const hourPart = parts.find(part => part.type === 'hour');
        return hourPart && hourPart.value.length === 2;
    } catch (e) {
        return false;
    }
}

/**
 * Get live indicator class
 */
function getLiveIndicator() {
    return `
        <span class="agenda-block__live-indicator">
            <svg class="live-circle" width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="4" r="4" fill="currentColor"/>
            </svg>
            <span class="live-label">LIVE</span>
        </span>
    `;
}

// ============================================================================
// MAIN AGENDA BLOCK CLASS
// ============================================================================

class VanillaAgendaBlock {
    constructor(element) {
        this.element = element;
        this.config = AGENDA_CONFIG;
        
        this.state = {
            sessions: [],
            tracks: this.config.tracks,
            days: [],
            currentDay: 0,
            timeCursor: 0, // Current time offset in slots
            isMobile: window.innerWidth < 768,
            isLoading: true,
            currentPlace: this.config.defaultPlace,
            isDropdownOpen: false,
            currentTime: Date.now()
        };
        
        // Live update interval
        this.updateInterval = null;
        
        this.init();
    }

    /**
     * Initialize the agenda block
     */
    async init() {
        this.renderLoading();
        await this.fetchAndProcessData();
        this.render();
        this.attachEventListeners();
        this.setupStickyHeader();
        this.startLiveUpdates();
    }

    /**
     * Fetch data from API and process it (like Digital Agenda does)
     */
    async fetchAndProcessData() {
        try {
            // Simulate API call
            const response = await this.fetchSessions();
            
            // Process sessions (add live/onDemand flags)
            this.state.sessions = response.cards.map(session => ({
                ...session,
                isLive: isSessionLive(session),
                isOnDemand: isSessionOnDemand(session)
            }));
            
            // Extract days from sessions (not from API!)
            this.state.days = extractDaysFromSessions(this.state.sessions);
            
            this.state.isLoading = false;
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            this.state.isLoading = false;
        }
    }

    /**
     * Fetch sessions from API (or mock)
     */
    async fetchSessions() {
        if (this.config.api.useMockData) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_CHIMERA_API_RESPONSE;
        } else {
            // Real API call
            const response = await fetch(this.config.api.chimeraEndpoint);
            return await response.json();
        }
    }

    /**
     * Render loading state
     */
    renderLoading() {
        this.element.innerHTML = `
            <div class="agenda-block__loading">
                <div class="agenda-block__spinner"></div>
                <p>${this.config.labels.loadingText}</p>
            </div>
        `;
    }

    /**
     * Main render function
     */
    render() {
        if (this.state.isLoading) {
            this.renderLoading();
            return;
        }

        const html = `
            <div class="agenda-block__container">
                ${this.renderHeader()}
            </div>
        `;
        
        this.element.innerHTML = html;
    }

    /**
     * Render header with day selector
     */
    renderHeader() {
        return `
            <div class="agenda-block__header">
                <div class="agenda-block__watch-nav">
                    <div class="agenda-block__watch-nav-row agenda-block__geo-row">
                        <span class="agenda-block__watch-label">Watch:</span>
                        <div class="agenda-block__place-selector">
                            <ul class="agenda-block__place-list">
                                ${this.config.places.map(place => `
                                    <li class="agenda-block__place-item">
                                        <button 
                                            class="agenda-block__place-tab ${place.id === this.state.currentPlace ? 'active' : ''}"
                                            data-place-id="${place.id}">
                                            ${place.name}
                                        </button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="agenda-block__pagination">
                            ${this.renderPagination()}
                        </div>
                    </div>
                    <div class="agenda-block__watch-nav-row agenda-block__date-row">
                        <div class="agenda-block__time-header">
                            <div class="agenda-block__day-dropdown-container">
                                <button 
                                    class="agenda-block__day-dropdown-toggle ${this.state.isDropdownOpen ? 'open' : ''}"
                                    data-dropdown-toggle="day-dropdown"
                                    aria-expanded="${this.state.isDropdownOpen}">
                                    <span>${this.state.days[this.state.currentDay]?.label || 'Select day'}</span>
                                    <span class="agenda-block__day-dropdown-chevron">▼</span>
                                </button>
                                <div class="agenda-block__day-dropdown ${this.state.isDropdownOpen ? 'open' : ''}" id="day-dropdown">
                                    ${this.state.days.map((day, index) => `
                                        <button 
                                            class="agenda-block__day-dropdown-item ${index === this.state.currentDay ? 'active' : ''}"
                                            data-day-index="${index}">
                                            <span>${day.label}</span>
                                            ${index === this.state.currentDay ? '<span class="agenda-block__day-checkmark">✓</span>' : ''}
                                        </button>
                                    `).join('')}
                                </div>
                                <div class="agenda-block__timezone-label">
                                    Date and times in IST
                                </div>
                            </div>
                            ${this.renderTimeHeader()}
                        </div>
                    </div>
                </div>
            </div>
            ${this.renderTracksColumnWithGrid()}
        `;
    }

    /**
     * Render combined tracks column with grid wrapper
     */
    renderTracksColumnWithGrid() {
        return `
            <div class="agenda-block__body">
                <div class="agenda-block__tracks-column">
                    ${this.renderTracksColumn()}
                </div>
                <div class="agenda-block__grid-wrapper">
                    <div class="agenda-block__grid-container">
                        ${this.renderGrid()}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render tracks column
     */
    renderTracksColumn() {
        return this.state.tracks.map(track => `
            <div class="agenda-block__track-label" style="border-left: 4px solid ${track.color}">
                <div class="agenda-block__track-title-in-label">${track.title}</div>
                ${track.description ? `<div class="agenda-block__track-description-in-label">${track.description}</div>` : ''}
            </div>
        `).join('');
    }

    /**
     * Render time header with icons and live indicators
     */
    renderTimeHeader() {
        const timeSlots = this.getVisibleTimeSlots();
        const now = this.state.currentTime || Date.now();
        const uses24Hour = localeUses24HourTime();
        
        return timeSlots.map((time, index) => {
            const nextTime = timeSlots[index + 1];
            const timeDate = new Date(time);
            
            // Check if this slot is currently live
            const isLive = nextTime 
                ? now >= time && now < nextTime 
                : now >= time;
            
            // Show icon at noon/midnight for 24-hour format
            const showIcon = uses24Hour && timeDate.getHours() % 12 === 0 && timeDate.getMinutes() === 0;
            const isDaytime = timeDate.getHours() > 11;
            
            const showSun = showIcon && isDaytime;
            const showMoon = showIcon && !isDaytime;
            
            return `
                <div class="agenda-block__time-cell ${isLive ? 'time-cell-live' : ''}">
                    ${isLive ? getLiveIndicator() : ''}
                    ${renderDayNightIcon(showSun, showMoon)}
                    <span class="time-value">${formatTime(time)}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Render main grid with sessions
     */
    renderGrid() {
        const currentDay = this.state.days[this.state.currentDay];
        if (!currentDay) {
            return `<div class="agenda-block__empty">${this.config.labels.noSessionsText}</div>`;
        }

        const daySessions = this.getSessionsForCurrentDay();
        
        return this.state.tracks.map(track => {
            const trackSessions = daySessions.filter(s => s.sessionTrack.tagId === track.tagId);
            // Each track gets its own grid section for proper separation
            return `
                <div class="agenda-block__track-row">
                    ${this.renderTrackSessions(trackSessions, currentDay)}
                </div>
            `;
        }).join('');
    }

    /**
     * Render sessions for a track with proper grid splitting
     */
    renderTrackSessions(sessions, currentDay) {
        const dayStartTime = new Date(currentDay.date + 'T08:00:00Z').getTime();
        const visibleStart = dayStartTime + (this.state.timeCursor * TIME_SLOT_DURATION * MINUTE_MS);
        
        // Calculate grid layout for sessions with rowNumber
        const sessionTiles = [];
        const occupiedCells = new Set();
        
        sessions.forEach(session => {
            const startTime = new Date(session.sessionStartTime).getTime();
            const endTime = new Date(session.sessionEndTime).getTime();
            const duration = endTime - startTime;

            // Calculate grid position
            const startOffset = (startTime - visibleStart) / (TIME_SLOT_DURATION * MINUTE_MS);
            const durationSlots = Math.ceil(duration / (TIME_SLOT_DURATION * MINUTE_MS));

            if (startOffset >= 0 && startOffset < VISIBLE_TIME_SLOTS) {
                const track = this.state.tracks.find(t => t.tagId === session.sessionTrack.tagId);
                const startColumn = Math.floor(startOffset) + 1;
                const endColumn = Math.min(startColumn + durationSlots, VISIBLE_TIME_SLOTS + 1);
                
                // Find available row for this session
                let rowNumber = 1;
                let foundRow = false;
                
                while (!foundRow && rowNumber <= 10) { // Max 10 rows
                    foundRow = true;
                    for (let col = startColumn; col < endColumn; col++) {
                        if (occupiedCells.has(`${rowNumber}-${col}`)) {
                            foundRow = false;
                            rowNumber++;
                            break;
                        }
                    }
                }
                
                // Mark cells as occupied
                for (let col = startColumn; col < endColumn; col++) {
                    occupiedCells.add(`${rowNumber}-${col}`);
                }
                
                const shouldDisplayDuration = (endColumn - startColumn) > 2;
                
                sessionTiles.push({
                    session,
                    startColumn,
                    endColumn,
                    rowNumber,
                    track,
                    shouldDisplayDuration
                });
            }
        });
        
        // Calculate number of rows needed
        const numberOfRows = sessionTiles.length > 0 
            ? Math.max(...sessionTiles.map(t => t.rowNumber)) 
            : 1;
        
        // Build HTML
        let html = '';
        
        sessionTiles.forEach(tile => {
            const { session, startColumn, endColumn, rowNumber, track, shouldDisplayDuration } = tile;
            const startTime = new Date(session.sessionStartTime).getTime();
            const endTime = new Date(session.sessionEndTime).getTime();
            
            html += `
                <div class="agenda_tile_wrapper agenda_tile_wrapper--col-width-${endColumn - startColumn}" style="grid-area: ${rowNumber} / ${startColumn} / ${rowNumber + 1} / ${endColumn};">
                    <article class="agenda_tile" style="border-color: rgb(213, 213, 213);">
                        <a href="${session.cardUrl}" class="title">
                            ${session.sessionTitle}
                        </a>
                        <footer>
                            <p class="duration">${session.sessionDuration} min</p>
                        </footer>
                    </article>
                </div>
            `;
        });
        
        // Add empty cells with diagonal pattern for all remaining positions
        // Generate empty cells for each row
        for (let row = 1; row <= numberOfRows; row++) {
            for (let col = 1; col <= VISIBLE_TIME_SLOTS; col++) {
                const cellKey = `${row}-${col}`;
                if (!occupiedCells.has(cellKey)) {
                    html += `
                        <article class="agenda_tile empty" style="grid-area: ${row} / ${col} / ${row + 1} / ${col + 1}; border-color: rgb(213, 213, 213); background-image: linear-gradient(135deg, rgb(213, 213, 213) 4.5%, rgba(0, 0, 0, 0) 4.5%, rgba(0, 0, 0, 0) 50%, rgb(213, 213, 213) 50%, rgb(213, 213, 213) 54.55%, rgba(0, 0, 0, 0) 54.55%, rgba(0, 0, 0, 0) 100%);"></article>
                    `;
                }
            }
        }
        
        // Render track row with inline grid-template-rows to match React structure
        return `
            <section class="agenda_grid" style="grid-template-rows: repeat(${numberOfRows}, 140px); background-color: rgb(248, 248, 248);">
                ${html}
            </section>
        `;
    }

    /**
     * Render pagination controls
     */
    renderPagination() {
        const maxOffset = this.getMaxTimeOffset();
        return `
            <button 
                class="agenda-block__pagination-btn prev" 
                data-direction="prev"
                ${this.state.timeCursor <= 0 ? 'disabled' : ''}
                aria-label="${this.config.labels.prevAriaLabel || 'Previous'}">
                <svg class="chevron" viewBox="0 0 13 18" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path id="Path_183918" data-name="Path 183918" d="M5.951,12.452a1.655,1.655,0,0,1,.487-1.173l6.644-6.642a1.665,1.665,0,1,1,2.39,2.307l-.041.041L9.962,12.452l5.47,5.468a1.665,1.665,0,0,1-2.308,2.389l-.041-.041L6.439,13.626a1.655,1.655,0,0,1-.488-1.174Z" transform="translate(-5.951 -4.045)" fill="#747474"></path></svg>
            </button>
            <button 
                class="agenda-block__pagination-btn next" 
                data-direction="next"
                ${this.state.timeCursor >= maxOffset ? 'disabled' : ''}
                aria-label="${this.config.labels.nextAriaLabel || 'Next'}">
                <svg class="chevron" viewBox="0 0 13 18" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><path id="Path_183691" data-name="Path 183691" d="M16.02,12.294a1.655,1.655,0,0,1-.487,1.173L8.889,20.108A1.665,1.665,0,1,1,6.5,17.8l.041-.041,5.469-5.467L6.539,6.825A1.665,1.665,0,0,1,8.847,4.436l.041.041,6.644,6.642a1.655,1.655,0,0,1,.488,1.174Z" transform="translate(-4 -4.045)" fill="#747474"></path></svg>
            </button>
        `;
    }

    /**
     * Get sessions for current day
     */
    getSessionsForCurrentDay() {
        const currentDay = this.state.days[this.state.currentDay];
        if (!currentDay) return [];

        return this.state.sessions.filter(session => {
            const sessionDayKey = getDayKey(new Date(session.sessionStartTime).getTime());
            return sessionDayKey === currentDay.id;
        });
    }

    /**
     * Get visible time slots
     */
    getVisibleTimeSlots() {
        const currentDay = this.state.days[this.state.currentDay];
        if (!currentDay) return [];

        const dayStartTime = new Date(currentDay.date + 'T08:00:00Z').getTime();
        const startTime = dayStartTime + (this.state.timeCursor * TIME_SLOT_DURATION * MINUTE_MS);

        const slots = [];
        for (let i = 0; i < VISIBLE_TIME_SLOTS; i++) {
            slots.push(startTime + (i * TIME_SLOT_DURATION * MINUTE_MS));
        }
        return slots;
    }

    /**
     * Get max time offset for pagination
     */
    getMaxTimeOffset() {
        const daySessions = this.getSessionsForCurrentDay();
        if (daySessions.length === 0) return 0;

        const currentDay = this.state.days[this.state.currentDay];
        const dayStartTime = new Date(currentDay.date + 'T08:00:00Z').getTime();
        const dayEndTime = new Date(currentDay.date + 'T20:00:00Z').getTime();

        const totalSlots = (dayEndTime - dayStartTime) / (TIME_SLOT_DURATION * MINUTE_MS);
        return Math.max(0, totalSlots - VISIBLE_TIME_SLOTS);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Place selector
        this.element.querySelectorAll('.agenda-block__place-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const placeId = e.currentTarget.dataset.placeId;
                this.changePlace(placeId);
            });
        });

        // Day dropdown toggle
        const dropdownToggle = this.element.querySelector('.agenda-block__day-dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        // Day dropdown items
        this.element.querySelectorAll('.agenda-block__day-dropdown-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dayIndex = parseInt(e.currentTarget.dataset.dayIndex, 10);
                this.changeDay(dayIndex);
                this.state.isDropdownOpen = false;
                this.render();
                this.attachEventListeners();
            });
        });

        // Close dropdown when clicking outside
        if (!this._outsideClickHandler) {
            this._outsideClickHandler = (e) => {
                if (!this.element.contains(e.target) && this.state.isDropdownOpen) {
                    this.state.isDropdownOpen = false;
                    this.render();
                    this.attachEventListeners();
                }
            };
            document.addEventListener('click', this._outsideClickHandler);
        }

        // Pagination
        this.element.querySelectorAll('.agenda-block__pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const direction = e.currentTarget.dataset.direction;
                this.paginate(direction);
            });
        });

        // Window resize
        const resizeHandler = debounce(() => {
            const wasMobile = this.state.isMobile;
            this.state.isMobile = window.innerWidth < 768;
            if (wasMobile !== this.state.isMobile) {
                this.render();
                this.attachEventListeners();
            }
        }, 250);
        
        window.addEventListener('resize', resizeHandler);
    }

    /**
     * Toggle dropdown
     */
    toggleDropdown() {
        this.state.isDropdownOpen = !this.state.isDropdownOpen;
        this.render();
        this.attachEventListeners();
    }

    /**
     * Change current place
     */
    changePlace(placeId) {
        this.state.currentPlace = placeId;
        // In a real implementation, you would convert times based on timezone here
        this.render();
        this.attachEventListeners();
    }

    /**
     * Change current day
     */
    changeDay(dayIndex) {
        if (dayIndex >= 0 && dayIndex < this.state.days.length) {
            this.state.currentDay = dayIndex;
            this.state.timeCursor = 0; // Reset time position
            this.render();
            this.attachEventListeners();
        }
    }

    /**
     * Paginate time slots
     */
    paginate(direction) {
        const step = VISIBLE_TIME_SLOTS; // Move by visible slots
        const maxOffset = this.getMaxTimeOffset();

        if (direction === 'next' && this.state.timeCursor < maxOffset) {
            this.state.timeCursor = Math.min(this.state.timeCursor + step, maxOffset);
        } else if (direction === 'prev' && this.state.timeCursor > 0) {
            this.state.timeCursor = Math.max(this.state.timeCursor - step, 0);
        }

        this.render();
        this.attachEventListeners();
    }

    /**
     * Setup sticky header using IntersectionObserver
     */
    setupStickyHeader() {
        const header = this.element.querySelector('.agenda-block__header');
        if (!header) return;

        const globalNavHeight = this.getSubNavHeight();

        // Set CSS variable for sticky top position
        header.style.setProperty('top', `${globalNavHeight - 1}px`);
        console.log('globalNavHeight', globalNavHeight);
        // Use IntersectionObserver to detect when header scrolls out of view
        const observer = new IntersectionObserver(([entry]) => {
            entry.target.classList.toggle('agenda-block__header--pinned', entry.intersectionRatio < 1);
        }, {
            threshold: [1],
            rootMargin: `-${globalNavHeight}px 0px 0px 0px`
        });

        observer.observe(header);
    }

    /**
     * Get height of sub-navigation (sticky header + secondary nav)
     */
    getSubNavHeight() {
        let top = 0;
        
        const stickyHeader = document.querySelector('.global-navigation');
        // const subNav = document.getElementById('AdobeSecondaryNav');
        
        // if (subNav) {
        //     top += subNav.offsetHeight;
        // }
        
        if (stickyHeader && !stickyHeader.classList.contains('feds-header-wrapper--retracted')) {
            top += stickyHeader.offsetHeight;
        }
        
        return top;
    }

    /**
     * Start live updates interval
     */
    startLiveUpdates() {
        // Update current time every 5 seconds
        this.updateInterval = setInterval(() => {
            this.state.currentTime = Date.now();
            
            // Update session live/on-demand status
            this.state.sessions = this.state.sessions.map(session => ({
                ...session,
                isLive: isSessionLive(session),
                isOnDemand: isSessionOnDemand(session)
            }));
            
            // Re-render only the time header to avoid full page refresh
            const timeHeader = this.element.querySelector('.agenda-block__time-header');
            if (timeHeader) {
                const newTimeHeader = document.createElement('div');
                newTimeHeader.className = 'agenda-block__time-header';
                newTimeHeader.innerHTML = this.renderTimeHeader();
                timeHeader.parentNode.replaceChild(newTimeHeader, timeHeader);
            }
        }, 5000); // Update every 5 seconds
    }
    
    /**
     * Clean up intervals
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// ============================================================================
// INIT FUNCTION FOR BLOCK LOADER
// ============================================================================

export default function init(el) {
    return new VanillaAgendaBlock(el);
}

