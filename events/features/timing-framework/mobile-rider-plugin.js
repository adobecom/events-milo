export default class MobileRiderPlugin {
  constructor() {
    this.sessions = new Map(); // Store session statuses
    this.baseUrl = 'https://overlay-admin-dev.mobilerider.com';
  }

  async fetchSessionStatus(sessionIds) {
    try {
      const response = await fetch(`${this.baseUrl}/api/media-status?ids=${sessionIds.join(',')}`);
      const data = await response.json();

      // Update session statuses
      data.active.forEach((id) => this.sessions.set(id, 'active'));
      data.inactive.forEach((id) => this.sessions.set(id, 'inactive'));

      return data;
    } catch (error) {
      window.lana?.log(`Error fetching MobileRider session status: ${JSON.stringify(error)}`);
      return null;
    }
  }

  isSessionActive(sessionId) {
    return this.sessions.get(sessionId) === 'active';
  }

  async initializeSessions(schedule) {
    // Extract all MR session IDs from the schedule
    const sessionIds = [];
    let current = schedule;
    while (current) {
      if (current.mobileRiderSessionId) {
        sessionIds.push(current.mobileRiderSessionId);
      }
      current = current.next;
    }

    if (sessionIds.length > 0) {
      await this.fetchSessionStatus(sessionIds);
    }
  }

  static createSessionStatusEvent(sessionId, status) {
    return new CustomEvent('worker-message', {
      detail: {
        data: {
          type: 'mr_session_update',
          sessionId,
          status,
          timestamp: Date.now(),
        },
      },
    });
  }

  static dispatchSessionStatusEvent(element, sessionId, status) {
    const event = this.createSessionStatusEvent(sessionId, status);
    element.dispatchEvent(event);
  }
}
