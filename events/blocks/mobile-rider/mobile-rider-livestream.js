import { createTag } from '../../scripts/utils.js';

// Constants for livestream functionality
const LIVESTREAM_CONFIG = {
  EVENTS: {
    STREAM_START: 'streamstart',
    STREAM_END: 'streamend',
    STREAM_ERROR: 'streamerror',
    STREAM_PAUSE: 'streampause',
    STREAM_RESUME: 'streamresume',
  },
  STATES: {
    LOADING: 'loading',
    LIVE: 'live',
    ENDED: 'ended',
    ERROR: 'error',
    PAUSED: 'paused',
  },
  UI: {
    LIVE_INDICATOR_CLASS: 'live-indicator',
    LIVE_BADGE_CLASS: 'live-badge',
    VIEWER_COUNT_CLASS: 'viewer-count',
    STREAM_STATUS_CLASS: 'stream-status',
  },
  POLLING: {
    STATUS_CHECK_INTERVAL: 30000, // 30 seconds
    MAX_RETRIES: 3,
  },
};

/**
 * Livestream manager class
 */
class LivestreamManager {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.currentState = LIVESTREAM_CONFIG.STATES.LOADING;
    this.player = null;
    this.statusCheckInterval = null;
    this.retryCount = 0;
    this.viewerCount = 0;
    this.isLive = false;
    
    this.init();
  }

  /**
   * Initialize the livestream manager
   */
  init() {
    this.createLiveIndicator();
    this.setupEventListeners();
    this.startStatusPolling();
  }

  /**
   * Create live indicator UI elements
   */
  createLiveIndicator() {
    const indicator = createTag('div', {
      class: LIVESTREAM_CONFIG.UI.LIVE_INDICATOR_CLASS,
    });

    const liveBadge = createTag('div', {
      class: LIVESTREAM_CONFIG.UI.LIVE_BADGE_CLASS,
    }, 'LIVE');

    const viewerCount = createTag('div', {
      class: LIVESTREAM_CONFIG.UI.VIEWER_COUNT_CLASS,
    }, '0 viewers');

    const streamStatus = createTag('div', {
      class: LIVESTREAM_CONFIG.UI.STREAM_STATUS_CLASS,
    });

    indicator.appendChild(liveBadge);
    indicator.appendChild(viewerCount);
    indicator.appendChild(streamStatus);

    // Insert at the top of the video wrapper
    const videoWrapper = this.container.querySelector('.video-wrapper');
    if (videoWrapper) {
      videoWrapper.insertBefore(indicator, videoWrapper.firstChild);
    }

    this.liveIndicator = indicator;
    this.liveBadge = liveBadge;
    this.viewerCountElement = viewerCount;
    this.streamStatusElement = streamStatus;
  }

  /**
   * Setup event listeners for player events
   */
  setupEventListeners() {
    if (window.__mr_player) {
      this.player = window.__mr_player;
      
      // Listen for stream events
      this.player.on(LIVESTREAM_CONFIG.EVENTS.STREAM_START, () => {
        this.updateState(LIVESTREAM_CONFIG.STATES.LIVE);
      });

      this.player.on(LIVESTREAM_CONFIG.EVENTS.STREAM_END, () => {
        this.updateState(LIVESTREAM_CONFIG.STATES.ENDED);
      });

      this.player.on(LIVESTREAM_CONFIG.EVENTS.STREAM_ERROR, () => {
        this.updateState(LIVESTREAM_CONFIG.STATES.ERROR);
      });

      this.player.on(LIVESTREAM_CONFIG.EVENTS.STREAM_PAUSE, () => {
        this.updateState(LIVESTREAM_CONFIG.STATES.PAUSED);
      });

      this.player.on(LIVESTREAM_CONFIG.EVENTS.STREAM_RESUME, () => {
        this.updateState(LIVESTREAM_CONFIG.STATES.LIVE);
      });
    }
  }

  /**
   * Start polling for stream status
   */
  startStatusPolling() {
    this.statusCheckInterval = setInterval(() => {
      this.checkStreamStatus();
    }, LIVESTREAM_CONFIG.POLLING.STATUS_CHECK_INTERVAL);
  }

  /**
   * Check current stream status
   */
  async checkStreamStatus() {
    try {
      if (!this.config.sessionId) return;

      // This would typically call an API to get stream status
      const status = await this.getStreamStatus(this.config.sessionId);
      
      if (status) {
        this.updateViewerCount(status.viewerCount);
        this.updateStreamStatus(status.status);
        
        if (status.isLive && this.currentState !== LIVESTREAM_CONFIG.STATES.LIVE) {
          this.updateState(LIVESTREAM_CONFIG.STATES.LIVE);
        } else if (!status.isLive && this.currentState === LIVESTREAM_CONFIG.STATES.LIVE) {
          this.updateState(LIVESTREAM_CONFIG.STATES.ENDED);
        }
      }
    } catch (error) {
      console.warn('Failed to check stream status:', error);
      this.retryCount++;
      
      if (this.retryCount >= LIVESTREAM_CONFIG.POLLING.MAX_RETRIES) {
        this.stopStatusPolling();
      }
    }
  }

  /**
   * Get stream status from API
   * @param {string} sessionId - Session ID
   * @returns {Object} Stream status object
   */
  async getStreamStatus(sessionId) {
    // This is a placeholder - implement actual API call
    // Example implementation:
    /*
    const response = await fetch(`/api/stream-status/${sessionId}`);
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to fetch stream status');
    */
    
    // Mock response for now
    return {
      isLive: true,
      viewerCount: Math.floor(Math.random() * 1000) + 100,
      status: 'live',
    };
  }

  /**
   * Update the current state
   * @param {string} newState - New state
   */
  updateState(newState) {
    this.currentState = newState;
    this.isLive = newState === LIVESTREAM_CONFIG.STATES.LIVE;
    
    // Update UI based on state
    this.updateLiveIndicator();
    
    // Emit custom event
    this.container.dispatchEvent(new CustomEvent('livestream-state-change', {
      detail: { state: newState, isLive: this.isLive }
    }));
  }

  /**
   * Update live indicator UI
   */
  updateLiveIndicator() {
    if (!this.liveIndicator) return;

    this.liveIndicator.classList.toggle('is-live', this.isLive);
    this.liveIndicator.classList.toggle('is-ended', this.currentState === LIVESTREAM_CONFIG.STATES.ENDED);
    this.liveIndicator.classList.toggle('is-error', this.currentState === LIVESTREAM_CONFIG.STATES.ERROR);
    this.liveIndicator.classList.toggle('is-paused', this.currentState === LIVESTREAM_CONFIG.STATES.PAUSED);
  }

  /**
   * Update viewer count
   * @param {number} count - Viewer count
   */
  updateViewerCount(count) {
    this.viewerCount = count;
    if (this.viewerCountElement) {
      this.viewerCountElement.textContent = `${count} viewers`;
    }
  }

  /**
   * Update stream status text
   * @param {string} status - Status text
   */
  updateStreamStatus(status) {
    if (this.streamStatusElement) {
      this.streamStatusElement.textContent = status;
    }
  }

  /**
   * Stop status polling
   */
  stopStatusPolling() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stopStatusPolling();
    
    if (this.player) {
      this.player.off(LIVESTREAM_CONFIG.EVENTS.STREAM_START);
      this.player.off(LIVESTREAM_CONFIG.EVENTS.STREAM_END);
      this.player.off(LIVESTREAM_CONFIG.EVENTS.STREAM_ERROR);
      this.player.off(LIVESTREAM_CONFIG.EVENTS.STREAM_PAUSE);
      this.player.off(LIVESTREAM_CONFIG.EVENTS.STREAM_RESUME);
    }
  }

  /**
   * Get current state
   * @returns {string} Current state
   */
  getState() {
    return this.currentState;
  }

  /**
   * Check if stream is live
   * @returns {boolean} Whether stream is live
   */
  isStreamLive() {
    return this.isLive;
  }

  /**
   * Get current viewer count
   * @returns {number} Viewer count
   */
  getViewerCount() {
    return this.viewerCount;
  }
}

/**
 * Initialize livestream functionality
 * @param {HTMLElement} container - Container element
 * @param {Object} config - Configuration object
 * @returns {LivestreamManager} Livestream manager instance
 */
export function initLivestream(container, config) {
  // Only initialize if this is a livestream session
  if (!config.sessionId || !config.isLiveStream) {
    return null;
  }

  return new LivestreamManager(container, config);
}

/**
 * Check if a video is a livestream
 * @param {Object} config - Configuration object
 * @returns {boolean} Whether it's a livestream
 */
export function isLivestream(config) {
  return config.sessionId && config.isLiveStream;
}

export default LivestreamManager; 