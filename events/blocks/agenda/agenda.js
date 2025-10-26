/**
 * Agenda Block - Vanilla JS Implementation
 * A grid-based event agenda/schedule display component
 */

import { isAuthor } from '@dexter/dexterui-tools/lib/environment';
import fetching from '@dexter/dexterui-tools/lib/utils/json/fetching';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const TIME_SLOT_MINUTES = 15; // Each column represents 15 minutes
const VISIBLE_HOURS = 4; // Show 4 hours at a time
const MOBILE_BREAKPOINT = 768;

/**
 * Main AgendaBlock class
 */
class AgendaBlock {
    constructor(element) {
        this.element = element;
        this.config = this.getConfig();
        this.state = {
            sessions: [],
            tracks: [],
            days: [],
            currentDay: 0,
            timeOffset: 0, // Offset in time slots
            isLoading: true,
            error: null,
            isMobile: window.innerWidth < MOBILE_BREAKPOINT,
        };
        
        this.init();
    }

    /**
     * Get configuration from data attributes
     */
    getConfig() {
        const dataset = this.element.dataset;
        return {
            chimeraEndpoint: dataset.chimeraEndpoint || '',
            collectionTags: this.parseJSON(dataset.collectionTags, []),
            tracksCollectionTags: this.parseJSON(dataset.tracksCollectionTags, []),
            country: dataset.collectionCountry || 'us',
            language: dataset.collectionLanguage || 'en',
            fallbackPath: dataset.fallbackPath || '',
            forceFallback: dataset.forceFallback === 'true',
            timeZoneLabel: dataset.timeZoneLabel || 'Times in',
            liveBadgeLabel: dataset.liveBadgeLabel || 'Live',
            onDemandBadgeLabel: dataset.onDemandBadgeLabel || 'On Demand',
            featuredSessionsColor: dataset.featuredSessionsColor || '#FF6B00',
            featuredLabel: dataset.featuredLabel || 'Featured',
            durationLabel: dataset.durationLabel || 'Duration',
            prevAriaLabel: dataset.prevAriaLabel || 'Previous time slots',
            nextAriaLabel: dataset.nextAriaLabel || 'Next time slots',
            loadingText: dataset.loadingText || 'Loading sessions...',
            noSessionsText: dataset.noSessionsText || 'No sessions available',
            primaryBgColor: dataset.primaryBgColor || '#F5F5F5',
            cellBorderColor: dataset.cellBorderColor || '#E0E0E0',
            cornerRadius: dataset.cornerRadius || '4',
            analyticsSessionClick: dataset.analyticsSessionClick || 'Session Click',
            analyticsDaySelector: dataset.analyticsDaySelector || 'Day Selected',
            analyticsPagination: dataset.analyticsPagination || 'Agenda Pagination',
        };
    }

    /**
     * Parse JSON string safely
     */
    parseJSON(str, defaultValue = null) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return defaultValue;
        }
    }

    /**
     * Initialize the component
     */
    async init() {
        if (isAuthor()) {
            this.renderAuthorMode();
            return;
        }

        this.render();
        await this.fetchSessions();
        this.processSessions();
        this.render();
        this.attachEventListeners();
        this.startLiveUpdateInterval();
    }

    /**
     * Render author mode placeholder
     */
    renderAuthorMode() {
        this.element.innerHTML = `
            <div class="agenda-block__author-placeholder">
                <h3>Agenda Block (Vanilla JS)</h3>
                <p>Configure data source in the dialog</p>
            </div>
        `;
    }

    /**
     * Fetch sessions from Chimera API
     */
    async fetchSessions() {
        try {
            this.state.isLoading = true;
            this.render();

            const endpoint = this.buildEndpoint();
            const response = await fetching(endpoint);
            
            if (response && response.cards) {
                this.state.sessions = response.cards.filter(card => {
                    // Filter out cards without required fields
                    return card.search && card.contentArea;
                });
            }

            this.state.isLoading = false;
            this.state.error = null;
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            this.state.isLoading = false;
            this.state.error = 'Failed to load sessions';
            this.render();
        }
    }

    /**
     * Build Chimera endpoint URL
     */
    buildEndpoint() {
        const { chimeraEndpoint, collectionTags, country, language } = this.config;
        
        if (!chimeraEndpoint) {
            throw new Error('Chimera endpoint not configured');
        }

        let url = chimeraEndpoint;
        
        // Add collection tags as query parameters
        if (collectionTags && collectionTags.length > 0) {
            const tagsParam = collectionTags.join(',');
            url += url.includes('?') ? '&' : '?';
            url += `tags=${encodeURIComponent(tagsParam)}`;
        }

        // Add country and language
        url += url.includes('?') ? '&' : '?';
        url += `country=${country}&language=${language}`;

        return url;
    }

    /**
     * Process sessions to organize by days and tracks
     */
    processSessions() {
        const { sessions } = this.state;
        const { tracksCollectionTags } = this.config;

        if (sessions.length === 0) return;

        // Extract unique days
        const daysMap = new Map();
        sessions.forEach(session => {
            const startTime = this.getSessionStartTime(session);
            if (startTime) {
                const dayKey = this.getDayKey(startTime);
                if (!daysMap.has(dayKey)) {
                    daysMap.set(dayKey, {
                        key: dayKey,
                        date: new Date(startTime),
                        label: this.formatDate(new Date(startTime)),
                    });
                }
            }
        });

        this.state.days = Array.from(daysMap.values()).sort((a, b) => 
            a.date.getTime() - b.date.getTime()
        );

        // Organize sessions by tracks
        this.state.tracks = tracksCollectionTags.map((track, index) => ({
            id: track.id || `track-${index}`,
            title: track.title || `Track ${index + 1}`,
            description: track.description || '',
            sessions: this.getSessionsForTrack(track),
        }));
    }

    /**
     * Get sessions for a specific track
     */
    getSessionsForTrack(track) {
        const trackTags = track.tags || [];
        return this.state.sessions.filter(session => {
            const sessionTags = session.tags || [];
            return trackTags.some(tag => sessionTags.includes(tag));
        });
    }

    /**
     * Get session start time
     */
    getSessionStartTime(session) {
        return session.search?.sessionStartTime || session.cardStartTime;
    }

    /**
     * Get session end time
     */
    getSessionEndTime(session) {
        return session.search?.sessionEndTime || session.cardEndTime;
    }

    /**
     * Get day key from timestamp
     */
    getDayKey(timestamp) {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    /**
     * Format date for display
     */
    formatDate(date) {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Format time for display
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    /**
     * Calculate duration in minutes
     */
    getDuration(session) {
        const start = this.getSessionStartTime(session);
        const end = this.getSessionEndTime(session);
        if (!start || !end) return 60; // Default 1 hour
        return Math.round((end - start) / MINUTE_MS);
    }

    /**
     * Check if session is currently live
     */
    isSessionLive(session) {
        const now = Date.now();
        const start = this.getSessionStartTime(session);
        const end = this.getSessionEndTime(session);
        return start && end && now >= start && now <= end;
    }

    /**
     * Check if session is on demand
     */
    isSessionOnDemand(session) {
        const now = Date.now();
        const end = this.getSessionEndTime(session);
        return end && now > end;
    }

    /**
     * Check if session is featured
     */
    isSessionFeatured(session) {
        return session.isFeatured || session.featured || false;
    }

    /**
     * Calculate grid column position
     */
    calculateGridColumn(session, dayStartTime) {
        const startTime = this.getSessionStartTime(session);
        if (!startTime) return { start: 1, end: 2 };

        const minutesFromDayStart = (startTime - dayStartTime) / MINUTE_MS;
        const startColumn = Math.floor(minutesFromDayStart / TIME_SLOT_MINUTES) + 1;
        const duration = this.getDuration(session);
        const endColumn = startColumn + Math.ceil(duration / TIME_SLOT_MINUTES);

        return { start: startColumn, end: endColumn };
    }

    /**
     * Get visible time range
     */
    getVisibleTimeRange() {
        const { currentDay, timeOffset } = this.state;
        if (!this.state.days[currentDay]) return { start: 0, end: 0 };

        const dayDate = this.state.days[currentDay].date;
        const dayStart = new Date(dayDate);
        dayStart.setHours(8, 0, 0, 0); // Default start at 8 AM

        const visibleStart = dayStart.getTime() + (timeOffset * TIME_SLOT_MINUTES * MINUTE_MS);
        const visibleEnd = visibleStart + (VISIBLE_HOURS * HOUR_MS);

        return { start: visibleStart, end: visibleEnd };
    }

    /**
     * Render the component
     */
    render() {
        const { isLoading, error } = this.state;

        if (isLoading) {
            this.renderLoading();
            return;
        }

        if (error) {
            this.renderError();
            return;
        }

        if (this.state.sessions.length === 0) {
            this.renderEmpty();
            return;
        }

        this.renderAgenda();
    }

    /**
     * Render loading state
     */
    renderLoading() {
        this.element.innerHTML = `
            <div class="agenda-block__loading">
                <div class="agenda-block__spinner"></div>
                <p>${this.config.loadingText}</p>
            </div>
        `;
    }

    /**
     * Render error state
     */
    renderError() {
        this.element.innerHTML = `
            <div class="agenda-block__error">
                <p>${this.state.error}</p>
            </div>
        `;
    }

    /**
     * Render empty state
     */
    renderEmpty() {
        this.element.innerHTML = `
            <div class="agenda-block__empty">
                <p>${this.config.noSessionsText}</p>
            </div>
        `;
    }

    /**
     * Render full agenda
     */
    renderAgenda() {
        const html = `
            <div class="agenda-block__container">
                ${this.renderHeader()}
                ${this.renderGrid()}
            </div>
        `;
        this.element.innerHTML = html;
    }

    /**
     * Render header with day selector and pagination
     */
    renderHeader() {
        const { days, currentDay } = this.state;
        
        return `
            <div class="agenda-block__header">
                <div class="agenda-block__day-selector">
                    ${days.map((day, index) => `
                        <button 
                            class="agenda-block__day-button ${index === currentDay ? 'active' : ''}"
                            data-day-index="${index}"
                            data-analytics="${this.config.analyticsDaySelector}">
                            ${day.label}
                        </button>
                    `).join('')}
                </div>
                <div class="agenda-block__pagination">
                    <button 
                        class="agenda-block__pagination-btn agenda-block__pagination-btn--prev"
                        data-direction="prev"
                        aria-label="${this.config.prevAriaLabel}"
                        ${this.state.timeOffset <= 0 ? 'disabled' : ''}>
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </button>
                    <button 
                        class="agenda-block__pagination-btn agenda-block__pagination-btn--next"
                        data-direction="next"
                        aria-label="${this.config.nextAriaLabel}">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render agenda grid
     */
    renderGrid() {
        const { tracks, currentDay } = this.state;
        
        if (!this.state.days[currentDay]) return '';

        const dayDate = this.state.days[currentDay].date;
        const dayStart = new Date(dayDate);
        dayStart.setHours(8, 0, 0, 0);

        const { start: visibleStart, end: visibleEnd } = this.getVisibleTimeRange();

        return `
            <div class="agenda-block__grid">
                ${this.renderTimeAxis(dayStart)}
                ${tracks.map(track => this.renderTrack(track, dayStart, visibleStart, visibleEnd)).join('')}
            </div>
        `;
    }

    /**
     * Render time axis
     */
    renderTimeAxis(dayStart) {
        const timeSlots = [];
        const { start: visibleStart, end: visibleEnd } = this.getVisibleTimeRange();

        for (let time = visibleStart; time < visibleEnd; time += HOUR_MS) {
            timeSlots.push(`
                <div class="agenda-block__time-slot">
                    ${this.formatTime(time)}
                </div>
            `);
        }

        return `
            <div class="agenda-block__time-axis">
                <div class="agenda-block__track-header"></div>
                ${timeSlots.join('')}
            </div>
        `;
    }

    /**
     * Render track row
     */
    renderTrack(track, dayStart, visibleStart, visibleEnd) {
        const currentDayKey = this.getDayKey(dayStart.getTime());
        
        // Filter sessions for current day and visible time range
        const visibleSessions = track.sessions.filter(session => {
            const sessionStart = this.getSessionStartTime(session);
            const sessionDayKey = this.getDayKey(sessionStart);
            
            return sessionDayKey === currentDayKey && 
                   sessionStart >= visibleStart && 
                   sessionStart < visibleEnd;
        });

        return `
            <div class="agenda-block__track">
                <div class="agenda-block__track-header">
                    <h3 class="agenda-block__track-title">${track.title}</h3>
                    ${track.description ? `<p class="agenda-block__track-description">${track.description}</p>` : ''}
                </div>
                <div class="agenda-block__track-sessions">
                    ${visibleSessions.map(session => this.renderSession(session, dayStart.getTime())).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render session tile
     */
    renderSession(session, dayStartTime) {
        const title = session.contentArea?.title || 'Untitled Session';
        const description = session.contentArea?.description || '';
        const url = session.overlayLink || session.cardUrl || '#';
        const duration = this.getDuration(session);
        const isLive = this.isSessionLive(session);
        const isOnDemand = this.isSessionOnDemand(session);
        const isFeatured = this.isSessionFeatured(session);

        const gridColumn = this.calculateGridColumn(session, dayStartTime);
        const columnSpan = gridColumn.end - gridColumn.start;

        const styles = [
            `grid-column: ${gridColumn.start - this.state.timeOffset * 4} / span ${columnSpan}`,
            this.config.cellBorderColor ? `border-color: ${this.config.cellBorderColor}` : '',
            this.config.cornerRadius ? `border-radius: ${this.config.cornerRadius}px` : '',
        ].filter(Boolean).join('; ');

        return `
            <a 
                href="${url}" 
                class="agenda-block__session ${isFeatured ? 'featured' : ''} ${isLive ? 'live' : ''}"
                style="${styles}"
                data-analytics="${this.config.analyticsSessionClick}">
                ${isFeatured ? `<span class="agenda-block__session-featured-indicator" style="background-color: ${this.config.featuredSessionsColor}"></span>` : ''}
                <div class="agenda-block__session-content">
                    <h4 class="agenda-block__session-title">${title}</h4>
                    ${description && columnSpan > 2 ? `<p class="agenda-block__session-description">${description}</p>` : ''}
                </div>
                <div class="agenda-block__session-footer">
                    <span class="agenda-block__session-duration">${this.formatDuration(duration)}</span>
                    ${isLive ? `<span class="agenda-block__session-badge live">${this.config.liveBadgeLabel}</span>` : ''}
                    ${isOnDemand ? `<span class="agenda-block__session-badge on-demand">${this.config.onDemandBadgeLabel}</span>` : ''}
                </div>
            </a>
        `;
    }

    /**
     * Format duration
     */
    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours > 0 && mins > 0) {
            return `${hours}h ${mins}m`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${mins}m`;
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Day selector buttons
        this.element.querySelectorAll('.agenda-block__day-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const dayIndex = parseInt(e.currentTarget.dataset.dayIndex, 10);
                this.changeDay(dayIndex);
            });
        });

        // Pagination buttons
        this.element.querySelectorAll('.agenda-block__pagination-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const direction = e.currentTarget.dataset.direction;
                this.paginate(direction);
            });
        });

        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Change current day
     */
    changeDay(dayIndex) {
        if (dayIndex >= 0 && dayIndex < this.state.days.length) {
            this.state.currentDay = dayIndex;
            this.state.timeOffset = 0; // Reset time offset
            this.render();
            this.attachEventListeners();
        }
    }

    /**
     * Paginate time slots
     */
    paginate(direction) {
        const step = 4; // Move by 4 time slots (1 hour)
        
        if (direction === 'next') {
            this.state.timeOffset += step;
        } else if (direction === 'prev' && this.state.timeOffset > 0) {
            this.state.timeOffset = Math.max(0, this.state.timeOffset - step);
        }

        this.render();
        this.attachEventListeners();
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const wasMobile = this.state.isMobile;
        this.state.isMobile = window.innerWidth < MOBILE_BREAKPOINT;
        
        if (wasMobile !== this.state.isMobile) {
            this.render();
            this.attachEventListeners();
        }
    }

    /**
     * Start interval to update live sessions
     */
    startLiveUpdateInterval() {
        // Update every 30 seconds to check for live sessions
        this.liveUpdateInterval = setInterval(() => {
            this.render();
            this.attachEventListeners();
        }, 30000);
    }

    /**
     * Destroy the component
     */
    destroy() {
        if (this.liveUpdateInterval) {
            clearInterval(this.liveUpdateInterval);
        }
        window.removeEventListener('resize', this.handleResize.bind(this));
    }
}

/**
 * Initialize agenda block
 */
export default function init(el) {
    return new AgendaBlock(el);
}

