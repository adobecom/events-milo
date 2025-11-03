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
    "cards": [
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2024/sessions/acom-test-keynote-and-sneaks-1003.html",
            "id": "5c2d0544-e402-3091-aa8d-49b908c1d1e2",
            "sortDate": "2024-10-15T15:00:00.000Z",
            "sessionTitle": "A.COM Test Keynote and Sneaks",
            "sessionCode": "1003",
            "sessionDuration": "120",
            "sessionEndTime": "2024-10-15T17:00:00.000Z",
            "sessionId": "1718042984290001uLaX",
            "sessionStartTime": "2024-10-15T15:00:00.000Z",
            "sessionTimeId": "1720550767041001ST2T",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/live-broadcast",
                "title": "Mainstage Broadcast"
            },
            "tags": [
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/session-format/in-person/on-demand-post-event",
                    "title": "On demand post event"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/max/category/inspiration",
                    "title": "Inspiration"
                },
                {
                    "tagId": "caas:events/session-type/keynote",
                    "title": "Keynote"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                }
            ]
        },
        {
            "cardUrl": "https://www.qa02.adobe.com/max/2024/sessions/acom-master-test-session-1005.html",
            "id": "d7f880a4-eabf-37bd-a81a-346238920fa9",
            "sortDate": "2024-10-16T15:00:00.000Z",
            "sessionTitle": "A.COM Master Test Session",
            "sessionCode": "1005",
            "sessionDuration": "45",
            "sessionEndTime": "2024-10-16T15:45:00.000Z",
            "sessionId": "1713813396202001u6BR",
            "sessionStartTime": "2024-10-16T15:00:00.000Z",
            "sessionTimeId": "1720550837935001fvBB",
            "sessionTrack": {
                "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                "title": "Social Media and Marketing"
            },
            "tags": [
                {
                    "tagId": "caas:events/max/primary-track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/products/substance-3d-sampler",
                    "title": "Substance 3D Sampler"
                },
                {
                    "tagId": "caas:events/products/not-product-specific",
                    "title": "Not Product Specific"
                },
                {
                    "tagId": "caas:events/technical-level/intermediate",
                    "title": "Intermediate"
                },
                {
                    "tagId": "caas:events/products/frame-io",
                    "title": "Frame.io"
                },
                {
                    "tagId": "caas:events/session-format/in-person/on-demand-post-event",
                    "title": "On demand post event"
                },
                {
                    "tagId": "caas:events/products/adobe-fresco",
                    "title": "Adobe Fresco"
                },
                {
                    "tagId": "caas:events/audience-type/educator",
                    "title": "Educator"
                },
                {
                    "tagId": "caas:events/audience-type/executive",
                    "title": "Executive"
                },
                {
                    "tagId": "caas:events/products/adobe-stock",
                    "title": "Adobe Stock"
                },
                {
                    "tagId": "caas:events/session-type/first-take",
                    "title": "First Take"
                },
                {
                    "tagId": "caas:events/session-type/sneaks",
                    "title": "Sneaks"
                },
                {
                    "tagId": "caas:events/products/creative-cloud-libraries",
                    "title": "Creative Cloud Libraries"
                },
                {
                    "tagId": "caas:events/year/2024",
                    "title": "2024"
                },
                {
                    "tagId": "caas:events/max/track/social-media-and-marketing",
                    "title": "Social Media and Marketing"
                },
                {
                    "tagId": "caas:events/max/primary-track/video-audio-and-motion",
                    "title": "Video, Audio, and Motion"
                },
                {
                    "tagId": "caas:events/products/acrobat",
                    "title": "Acrobat"
                },
                {
                    "tagId": "caas:events/products/pdf-api",
                    "title": "PDF API"
                },
                {
                    "tagId": "caas:events/audience-type/business-strategist-owner",
                    "title": "Business Strategist Owner"
                },
                {
                    "tagId": "caas:events/products/adobe-firefly",
                    "title": "Adobe Firefly"
                },
                {
                    "tagId": "caas:events/products/audition",
                    "title": "Audition"
                },
                {
                    "tagId": "caas:events/max/category/how-to",
                    "title": "How To"
                },
                {
                    "tagId": "caas:events/products/photoshop",
                    "title": "Photoshop"
                },
                {
                    "tagId": "caas:events/products/after-effects",
                    "title": "After Effects"
                },
                {
                    "tagId": "caas:events/region/japan",
                    "title": "Japan"
                },
                {
                    "tagId": "caas:events/region/americas",
                    "title": "Americas"
                },
                {
                    "tagId": "caas:events/products/adobe-fonts",
                    "title": "Adobe Fonts"
                },
                {
                    "tagId": "caas:events/products/adobe-express",
                    "title": "Adobe Express"
                },
                {
                    "tagId": "caas:events/products/indesign",
                    "title": "InDesign"
                },
                {
                    "tagId": "caas:events/products/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/audience-type/front-end-developer",
                    "title": "Front End Developer"
                },
                {
                    "tagId": "caas:events/products/aero",
                    "title": "Aero"
                },
                {
                    "tagId": "caas:events/products/character-animator",
                    "title": "Character Animator"
                },
                {
                    "tagId": "caas:events/products/bridge",
                    "title": "Bridge"
                },
                {
                    "tagId": "caas:events/max/primary-track/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/region/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-1",
                    "title": "Europe, Middle East, and Africa Day 1"
                },
                {
                    "tagId": "caas:events/products/adobe-scan",
                    "title": "Adobe Scan"
                },
                {
                    "tagId": "caas:events/technical-level/advanced",
                    "title": "Advanced"
                },
                {
                    "tagId": "caas:events/max/primary-track/photography",
                    "title": "Photography"
                },
                {
                    "tagId": "caas:events/session-type/creative-super-session",
                    "title": "Creative Super Session"
                },
                {
                    "tagId": "caas:events/audience-type/government",
                    "title": "Government"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa-day-2",
                    "title": "Europe, Middle East, and Africa Day 2"
                },
                {
                    "tagId": "caas:events/session-type/session",
                    "title": "Session"
                },
                {
                    "tagId": "caas:events/audience-type/web-designer",
                    "title": "Web Designer"
                },
                {
                    "tagId": "caas:events/audience-type/post-production-professional",
                    "title": "Post-Production Professional"
                },
                {
                    "tagId": "caas:content-type/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/europe-middle-east-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/game-developer",
                    "title": "Game Developer"
                },
                {
                    "tagId": "caas:events/products/lightroom",
                    "title": "Lightroom"
                },
                {
                    "tagId": "caas:events/max/primary-track/adobe-live-at-max",
                    "title": "Adobe Live @ MAX"
                },
                {
                    "tagId": "caas:events/max/primary-track/creativity-and-design-in-business",
                    "title": "Creativity and Design in Business"
                },
                {
                    "tagId": "caas:events/products/photoshop-express",
                    "title": "Photoshop Express"
                },
                {
                    "tagId": "caas:events/products/premiere-pro",
                    "title": "Premiere Pro"
                },
                {
                    "tagId": "caas:events/technical-level/general-audience",
                    "title": "General Audience"
                },
                {
                    "tagId": "caas:events/audience-type/3d",
                    "title": "3D"
                },
                {
                    "tagId": "caas:events/products/substance-3d-stager",
                    "title": "Substance 3D Stager"
                },
                {
                    "tagId": "caas:events/products/capture",
                    "title": "Capture"
                },
                {
                    "tagId": "caas:events/products/behance",
                    "title": "Behance"
                },
                {
                    "tagId": "caas:events/products/lightroom-classic",
                    "title": "Lightroom Classic"
                },
                {
                    "tagId": "caas:events/audience-type/graphic-designer",
                    "title": "Graphic Designer"
                },
                {
                    "tagId": "caas:events/products/creative-cloud",
                    "title": "Creative Cloud"
                },
                {
                    "tagId": "caas:events/audience-type/it",
                    "title": "IT"
                },
                {
                    "tagId": "caas:events/products/animate",
                    "title": "Animate"
                },
                {
                    "tagId": "caas:events/products/reader",
                    "title": "Reader"
                },
                {
                    "tagId": "caas:events/session-type/keynote",
                    "title": "Keynote"
                },
                {
                    "tagId": "caas:events/region/europe-middle-east-and-africa",
                    "title": "Europe, Middle East, and Africa"
                },
                {
                    "tagId": "caas:events/audience-type/art-creative-director",
                    "title": "Art Creative Director"
                },
                {
                    "tagId": "caas:events/products/substance-3d-assets",
                    "title": "Substance 3D Assets"
                },
                {
                    "tagId": "caas:card-style/event-session",
                    "title": "Event Session"
                },
                {
                    "tagId": "caas:events/day/americas-day-2",
                    "title": "Americas Day 2"
                },
                {
                    "tagId": "caas:events/day/americas-day-1",
                    "title": "Americas Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/print-designer",
                    "title": "Print Designer"
                },
                {
                    "tagId": "caas:events/day/day-1",
                    "title": "Day 1"
                },
                {
                    "tagId": "caas:events/max",
                    "title": "MAX"
                },
                {
                    "tagId": "caas:events/technical-level/beginner",
                    "title": "Beginner"
                },
                {
                    "tagId": "caas:events/audience-type/social-media-content-creator",
                    "title": "Social Media Content Creator"
                },
                {
                    "tagId": "caas:events/max/primary-track/education",
                    "title": "Education"
                },
                {
                    "tagId": "caas:events/day/day-2",
                    "title": "Day 2"
                },
                {
                    "tagId": "caas:events/audience-type/photographer",
                    "title": "Photographer"
                },
                {
                    "tagId": "caas:events/day/asia-pacific",
                    "title": "Asia Pacific"
                },
                {
                    "tagId": "caas:events/max/primary-track/live-broadcast",
                    "title": "Mainstage Broadcast"
                },
                {
                    "tagId": "caas:events/audience-type/illustrator",
                    "title": "Illustrator"
                },
                {
                    "tagId": "caas:events/products/substance-3d-painter",
                    "title": "Substance 3D Painter"
                },
                {
                    "tagId": "caas:events/audience-type/marketer",
                    "title": "Marketer"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-2",
                    "title": "Asia Pacific Day 2"
                },
                {
                    "tagId": "caas:events/session-format/online",
                    "title": "Online"
                },
                {
                    "tagId": "caas:events/session-format/in-person",
                    "title": "In-Person"
                },
                {
                    "tagId": "caas:events/session-type/luminary-session",
                    "title": "Luminary Session"
                },
                {
                    "tagId": "caas:events/products/lightroom-on-mobile",
                    "title": "Lightroom on mobile"
                },
                {
                    "tagId": "caas:events/day/asia-pacific-day-1",
                    "title": "Asia Pacific Day 1"
                },
                {
                    "tagId": "caas:events/audience-type/motion-design",
                    "title": "Motion Design"
                }
            ]
        }
    ]
};

// ============================================================================
// HARDCODED CONFIG - Simulates AEM Dialog values
// In real Digital Agenda, these come from AEM component dialog
// ============================================================================
const AGENDA_CONFIG = {
    // Tracks Configuration (from AEM dialog "Tracks Collection Tags")
    // Only includes tracks that exist in the mock data
    tracks: [
        { id: 'live-broadcast', tagId: 'caas:events/max/primary-track/live-broadcast', title: 'Mainstage Broadcast', description: 'Don\'t miss the Mainstage Broadcast of Keynotes, Sneaks, Creativity Super Sessions, and Luminary Sessions.', color: '#FF6B00' },
        { id: 'adobe-live-at-max', tagId: 'caas:events/max/primary-track/adobe-live-at-max', title: 'Adobe Live @ MAX', description: 'Visit your favorite MAX speakers online to get your questions answered.', color: '#1473E6' },
        { id: 'creativity-and-design-in-business', tagId: 'caas:events/max/primary-track/creativity-and-design-in-business', title: 'Creativity and Design in Business', description: 'Inspiring speakers share their expertise and insights about creative leadership.', color: '#00A38F' },
        { id: 'video-audio-and-motion', tagId: 'caas:events/max/primary-track/video-audio-and-motion', title: 'Video, Audio, and Motion', description: 'Learn how to edit your first video and transform static graphics into motion.', color: '#9C27B0' },
        { id: 'photography', tagId: 'caas:events/max/primary-track/photography', title: 'Photography', description: 'Spark your passion for photography with sessions that will help you build your skills.', color: '#795548' },
        { id: 'social-media-and-marketing', tagId: 'caas:events/max/primary-track/social-media-and-marketing', title: 'Social Media and Marketing', description: 'Leverage the power of social media and marketing to elevate your brand.', color: '#3F51B5' },
        { id: 'education', tagId: 'caas:events/max/primary-track/education', title: 'Education', description: 'Get essential creative and generative AI skills that open doors to a brighter future.', color: '#FF9800' },
        { id: '3d', tagId: 'caas:events/max/primary-track/3d', title: '3D', description: 'Add the power of 3D to your design skillset and take your career to new heights.', color: '#FF5722' }
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
                    <path d="M7.9,1.2C8,1.2,8.1,1,8.1,0.9c0,0,0,0,0,0s0,0,0,0c0-0.1-0.1-0.3-0.2-0.3C7.1,0.2,6.3,0,5.5,0L0,0c0.8,0,1.6-0.2,2.4-0.5c0.1-0.1,0.2-0.2,0.2-0.3c0,0,0,0,0,0s0,0,0,0C8.1,10,8,9.8,7.9,9.8C5.5,8.7,4.5,5.9,5.6,3.5C6.1,2.5,6.9,1.7,7.9,1.2L7.9,1.2z" fill="currentColor"/>
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
            
            // Initialize timeCursor to show the first session for the first day
            if (this.state.days.length > 0) {
                this.initializeTimeCursor();
            }
            
            this.state.isLoading = false;
        } catch (error) {
            // Handle error silently in production
            this.state.isLoading = false;
        }
    }

    /**
     * Initialize timeCursor to show the first session for the current day
     */
    initializeTimeCursor() {
        const currentDay = this.state.days[this.state.currentDay];
        if (!currentDay) return;

        const daySessions = this.getSessionsForCurrentDay();
        if (daySessions.length === 0) {
            this.state.timeCursor = 0;
            return;
        }

        // Find the earliest session start time for this day
        const earliestSessionTime = Math.min(
            ...daySessions.map(session => new Date(session.sessionStartTime).getTime())
        );

        const dayStartTime = new Date(currentDay.date + 'T08:00:00Z').getTime();
        
        // Calculate offset in slots
        const earliestSlot = (earliestSessionTime - dayStartTime) / (TIME_SLOT_DURATION * MINUTE_MS);
        
        // Set timeCursor to show the session (with a bit of padding, but ensure it's visible)
        // We want the session to appear in the visible window, ideally not at the very edge
        // If session is at slot 28, we want to show starting around slot 26-27
        const padding = 2; // Show 2 slots before the session
        this.state.timeCursor = Math.max(0, Math.floor(earliestSlot - padding));
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
        const currentDay = this.state.days[this.state.currentDay];
        const daySessions = this.getSessionsForCurrentDay();
        
        return this.state.tracks.map((track, index) => {
            const trackSessions = daySessions.filter(s => s.sessionTrack.tagId === track.tagId);
            const numberOfRows = this.calculateNumberOfRowsForTrack(trackSessions, currentDay);
            
            return `
                <div class="agenda-block__track-label" style="border-left: 4px solid ${track.color}; height: ${numberOfRows * 140 + (numberOfRows - 1) * 6}px;">
                    <div class="agenda-block__track-title-in-label">${track.title}</div>
                    ${track.description ? `<div class="agenda-block__track-description-in-label">${track.description}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Calculate grid positions for sessions (shared logic)
     * Returns { sessionTiles, numberOfRows, occupiedCells }
     */
    calculateSessionGridPositions(sessions, currentDay) {
        const dayStartTime = new Date(currentDay.date + 'T08:00:00Z').getTime();
        const visibleStart = dayStartTime + (this.state.timeCursor * TIME_SLOT_DURATION * MINUTE_MS);
        
        const sessionTiles = [];
        const occupiedCells = new Set();
        
        sessions.forEach(session => {
            const startTime = new Date(session.sessionStartTime).getTime();
            const endTime = new Date(session.sessionEndTime).getTime();
            const duration = endTime - startTime;
            
            const startOffset = (startTime - visibleStart) / (TIME_SLOT_DURATION * MINUTE_MS);
            const durationSlots = Math.ceil(duration / (TIME_SLOT_DURATION * MINUTE_MS));
            
            if (startOffset >= 0 && startOffset < VISIBLE_TIME_SLOTS) {
                const track = this.state.tracks.find(t => t.tagId === session.sessionTrack.tagId);
                const startColumn = Math.floor(startOffset) + 1;
                const endColumn = Math.min(startColumn + durationSlots, VISIBLE_TIME_SLOTS + 1);
                
                // Find available row for this session
                let rowNumber = 1;
                let foundRow = false;
                
                while (!foundRow && rowNumber <= 10) {
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
                
                sessionTiles.push({
                    session,
                    startColumn,
                    endColumn,
                    rowNumber,
                    track,
                    shouldDisplayDuration: (endColumn - startColumn) > 2
                });
            }
        });
        
        const numberOfRows = sessionTiles.length > 0 
            ? Math.max(...sessionTiles.map(t => t.rowNumber)) 
            : 1;
        
        return { sessionTiles, numberOfRows, occupiedCells };
    }

    /**
     * Calculate number of rows needed for a track
     */
    calculateNumberOfRowsForTrack(sessions, currentDay) {
        const { numberOfRows } = this.calculateSessionGridPositions(sessions, currentDay);
        return numberOfRows;
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
        // Get grid positions from shared logic
        const { sessionTiles, numberOfRows, occupiedCells } = this.calculateSessionGridPositions(sessions, currentDay);
        
        // Build HTML
        let html = '';
        
        sessionTiles.forEach(tile => {
            const { session, startColumn, endColumn, rowNumber, track, shouldDisplayDuration } = tile;
            const startTime = new Date(session.sessionStartTime).getTime();
            const endTime = new Date(session.sessionEndTime).getTime();
            
            // Determine duration display format
            const durationText = session.sessionDuration >= 60 
                ? `${Math.floor(session.sessionDuration / 60)} hr ` 
                : `${session.sessionDuration} min`;
            
            // Generate daa-lh attribute like React (for analytics)
            const trackDisplayIndex = (this.state.tracks.findIndex(t => t.tagId === session.sessionTrack.tagId) + 1);
            const daaLh = `Logged Out|No Filter|${session.sessionTrack.title}-${trackDisplayIndex}|${session.isFeatured ? 'Featured' : 'Not Featured'}|${session.sessionId}|${session.isOnDemand ? 'On Demand' : session.isLive ? 'Live' : 'Upcoming'}|${session.sessionTitle}`;
            
            html += `
                <div class="agenda_tile_wrapper agenda_tile_wrapper--col-width-${endColumn - startColumn}" style="grid-area: ${rowNumber} / ${startColumn} / ${rowNumber + 1} / ${endColumn};">
                    <article class="agenda_tile" daa-lh="${daaLh}" style="border-color: rgb(213, 213, 213);">
                        <a href="${session.cardUrl}" class="title" daa-ll="${session.isOnDemand ? 'On Demand Session Title Click' : 'Session Title Click'}|${session.sessionTitle}">
                            ${session.sessionTitle}
                        </a>
                        ${shouldDisplayDuration ? `<footer>
                            <p class="duration">${durationText}</p>
                        </footer>` : ''}
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
                        <article class="agenda_tile empty" daa-ll="Session title" style="grid-area: ${row} / ${col} / ${row + 1} / ${col + 1}; border-color: rgb(213, 213, 213); background-image: linear-gradient(135deg, rgb(213, 213, 213) 4.5%, rgba(0, 0, 0, 0) 4.5%, rgba(0, 0, 0, 0) 50%, rgb(213, 213, 213) 50%, rgb(213, 213, 213) 54.55%, rgba(0, 0, 0, 0) 54.55%, rgba(0, 0, 0, 0) 100%);"></article>
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
            this.initializeTimeCursor(); // Initialize to show first session for this day
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
            
            // Re-render only the time cells to avoid replacing dropdown
            const timeCells = Array.from(this.element.querySelectorAll('.agenda-block__time-cell'));
            timeCells.forEach((cell) => {
                cell.parentNode.removeChild(cell);
            });
            
            const timeHeader = this.element.querySelector('.agenda-block__time-header');
            if (timeHeader) {
                timeHeader.insertAdjacentHTML('beforeend', this.renderTimeHeader());
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

