import { getEvent } from './esp-controller.js';
import { getMetadata } from './utils.js';
import BlockMediator from './deps/block-mediator.min.js';
import { setCtaState } from './rsvp-state-helper.js';

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
    // Use the href hash as the unique identifier
    const key = rsvpBtn.el.href.split('#')[1] || 'default';
    console.log('[RSVPStateManager] debouncedUpdate called', { key, href: rsvpBtn.el.href, el: rsvpBtn.el });
    // Clear existing timer
    if (this.debounceTimers.has(key)) {
      console.log('[RSVPStateManager] Clearing existing debounce timer for', key);
      clearTimeout(this.debounceTimers.get(key));
    }
    // Set new timer
    const timer = setTimeout(async () => {
      console.log('[RSVPStateManager] Debounce timer fired for', key);
      this.debounceTimers.delete(key);
      console.log('[RSVPStateManager] Processing update for button:', rsvpBtn.el.href);
      await this.performUpdate(rsvpBtn, miloLibs);
    }, this.DEBOUNCE_DELAY);
    this.debounceTimers.set(key, timer);
    console.log('[RSVPStateManager] Set new debounce timer for', key);
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
