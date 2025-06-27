import { getEvent } from './esp-controller.js';
import { getMetadata } from './utils.js';
import BlockMediator from './deps/block-mediator.min.js';
import { setCtaState } from './rsvp-state-logic.js';

class RSVPStateManager {
  constructor() {
    this.updateQueue = [];
    this.isProcessing = false;
    this.debounceTimers = new Map();
    this.lastUpdateTime = 0;
    this.DEBOUNCE_DELAY = 100; // 100ms debounce
    this.metadataCache = new Map();
  }

  // Debounced update function
  async debouncedUpdate(rsvpBtn, miloLibs) {
    const key = `${rsvpBtn.el.id || 'rsvp-btn'}-${miloLibs}`;
    // Clear existing timer
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }
    // Set new timer
    const timer = setTimeout(() => {
      this.debounceTimers.delete(key);
      this.queueUpdate(rsvpBtn, miloLibs);
    }, this.DEBOUNCE_DELAY);
    this.debounceTimers.set(key, timer);
  }

  // Queue-based update system
  async queueUpdate(rsvpBtn, miloLibs) {
    return new Promise((resolve, reject) => {
      this.updateQueue.push({ rsvpBtn, miloLibs, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.updateQueue.length === 0) {
      return;
    }
    this.isProcessing = true;
    try {
      // Process all items in queue sequentially
      const promises = this.updateQueue.map(async ({ rsvpBtn, miloLibs, resolve, reject }) => {
        try {
          const result = await this.performUpdate(rsvpBtn, miloLibs);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      await Promise.all(promises);
      this.updateQueue = [];
    } finally {
      this.isProcessing = false;
    }
  }

  // Memoized metadata parsing
  getParsedMetadata(key, defaultValue = null) {
    const cacheKey = `metadata-${key}`;
    if (this.metadataCache.has(cacheKey)) {
      return this.metadataCache.get(cacheKey);
    }
    const value = getMetadata(key) || defaultValue;
    this.metadataCache.set(cacheKey, value);
    return value;
  }

  // Main update logic (always fetches event info fresh)
  async performUpdate(rsvpBtn, miloLibs) {
    const rsvpData = BlockMediator.get('rsvpData');
    const eventId = this.getParsedMetadata('event-id');
    // Fast path: Handle RSVP state first
    if (rsvpData) {
      if (rsvpData.registrationStatus === 'registered') {
        return setCtaState('registered', rsvpBtn, miloLibs);
      }
      if (rsvpData.registrationStatus === 'waitlisted') {
        return setCtaState('waitlisted', rsvpBtn, miloLibs);
      }
    }
    // Always fetch event info fresh
    const eventInfo = await getEvent(eventId);
    const allowWaitlisting = this.getParsedMetadata('allow-wait-listing', 'true') === 'true';
    let eventFull = false;
    let waitlistEnabled = allowWaitlisting;
    if (eventInfo.ok) {
      const {
        isFull,
        allowWaitlisting: eventAllowWaitlisting,
        attendeeCount,
        attendeeLimit,
      } = eventInfo.data;
      eventFull = isFull || (!eventAllowWaitlisting && attendeeCount >= attendeeLimit);
      waitlistEnabled = eventAllowWaitlisting;
    }
    if (eventFull) {
      if (waitlistEnabled) {
        return setCtaState('toWaitlist', rsvpBtn, miloLibs);
      }
      return setCtaState('eventClosed', rsvpBtn, miloLibs);
    }
    return setCtaState('default', rsvpBtn, miloLibs);
  }

  // Clear metadata cache for testing or memory management
  clearCache() {
    this.metadataCache.clear();
  }
}

export const rsvpStateManager = new RSVPStateManager();
export default RSVPStateManager;
