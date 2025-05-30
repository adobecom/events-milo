/**
 * MobileRider Controller
 * Handles all interactions with the MobileRider API
 */
class MobileRiderController {
  constructor() {
    this.baseUrl = 'https://overlay-admin-dev.mobilerider.com';
    this.token = null;
  }

  /**
   * Authenticate with the MobileRider API
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<string>} - Authentication token
   */
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      this.token = data.token;
      return this.token;
    } catch (error) {
      window.lana?.log(`MobileRider login error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get the status of multiple media items
   * @param {string[]} ids - Array of media IDs to check
   * @returns {Promise<{active: string[], inactive: string[]}>}
   */
  async getMediaStatus(ids) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/media-status?ids=${ids.join(',')}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        window.lana?.log(`MobileRider getMediaStatus error: ${JSON.stringify(error)}`);
        throw new Error(error.message || 'Failed to get media status');
      }

      return await response.json();
    } catch (error) {
      window.lana?.log(`MobileRider getMediaStatus error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Toggle media items between active and inactive states
   * @param {Object} params
   * @param {string[]} params.active - Array of media IDs to activate
   * @param {string[]} params.inactive - Array of media IDs to deactivate
   * @returns {Promise<Array<{id: string, previousState: string, currentState: string}>>}
   */
  async toggleVideos({ active = [], inactive = [] }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/toggle-videos`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ active, inactive }),
      });

      if (!response.ok) {
        const error = await response.json();
        window.lana?.log(`MobileRider toggleVideos error: ${JSON.stringify(error)}`);
        throw new Error(error.message || 'Failed to toggle videos');
      }

      return await response.json();
    } catch (error) {
      window.lana?.log(`MobileRider toggleVideos error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get headers for authenticated requests
   * @returns {Object} Headers object
   */
  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Check if a media item is active
   * @param {string} id - Media ID to check
   * @returns {Promise<boolean>}
   */
  async isMediaActive(id) {
    try {
      const { active } = await this.getMediaStatus([id]);
      return active.includes(id);
    } catch (error) {
      window.lana?.log(`MobileRider isMediaActive error: ${error.message}`);
      return false;
    }
  }

  /**
   * Get status for multiple media items and return as a map
   * @param {string[]} ids - Array of media IDs to check
   * @returns {Promise<Map<string, boolean>>} Map of media ID to active status
   */
  async getMediaStatusMap(ids) {
    try {
      const { active } = await this.getMediaStatus(ids);
      const statusMap = new Map();

      ids.forEach((id) => {
        statusMap.set(id, active.includes(id));
      });

      return statusMap;
    } catch (error) {
      window.lana?.log(`MobileRider getMediaStatusMap error: ${error.message}`);
      // Return a map with all IDs set to false in case of error
      return new Map(ids.map((id) => [id, false]));
    }
  }
}

export default MobileRiderController;
