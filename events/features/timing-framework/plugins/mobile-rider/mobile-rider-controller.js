/**
 * MobileRider Controller
 * Handles all interactions with the MobileRider API
 */
class MobileRiderController {
  constructor() {
    this.baseUrl = 'https://overlay-admin-integration.mobilerider.com';
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
          headers: { 'Content-Type': 'application/json' },
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
