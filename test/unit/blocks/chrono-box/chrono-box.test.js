import { expect } from '@esm-bundle/chai';

describe('Chrono Box - Initial Fragment Loading', () => {
  describe('getInitialScheduleItem', () => {
    it('should return the first item when no toggleTime is specified', async () => {
      const schedule = [
        { pathToFragment: '/fragment1' },
        { pathToFragment: '/fragment2', toggleTime: Date.now() + 1000 },
      ];

      // Import the function directly from the module
      const { getInitialScheduleItem } = await import('../../../../events/blocks/chrono-box/chrono-box.js');

      const result = getInitialScheduleItem(schedule);
      expect(result).to.deep.equal(schedule[0]);
    });

    it('should return the appropriate item based on current time', async () => {
      const now = Date.now();
      const schedule = [
        { pathToFragment: '/fragment1', toggleTime: now - 2000 }, // Past
        { pathToFragment: '/fragment2', toggleTime: now - 1000 }, // Past
        { pathToFragment: '/fragment3', toggleTime: now + 1000 }, // Future
      ];

      const { getInitialScheduleItem } = await import('../../../../events/blocks/chrono-box/chrono-box.js');

      const result = getInitialScheduleItem(schedule);
      expect(result).to.deep.equal(schedule[1]); // Should return the last past item
    });

    it('should handle testing mode with custom time', async () => {
      const now = Date.now();
      const schedule = [
        { pathToFragment: '/fragment1', toggleTime: now - 2000 },
        { pathToFragment: '/fragment2', toggleTime: now - 1000 },
        { pathToFragment: '/fragment3', toggleTime: now + 1000 },
      ];

      const testing = { toggleTime: (now + 2000).toString() }; // Future time
      const { getInitialScheduleItem } = await import('../../../../events/blocks/chrono-box/chrono-box.js');

      const result = getInitialScheduleItem(schedule, testing);
      expect(result).to.deep.equal(schedule[2]); // Should return the future item
    });

    it('should return null for empty schedule', async () => {
      const { getInitialScheduleItem } = await import('../../../../events/blocks/chrono-box/chrono-box.js');

      const result = getInitialScheduleItem([]);
      expect(result).to.be.null;
    });

    it('should handle string toggleTime values', async () => {
      const now = Date.now();
      const schedule = [
        { pathToFragment: '/fragment1', toggleTime: (now - 1000).toString() },
        { pathToFragment: '/fragment2', toggleTime: (now + 1000).toString() },
      ];

      const { getInitialScheduleItem } = await import('../../../../events/blocks/chrono-box/chrono-box.js');

      const result = getInitialScheduleItem(schedule);
      expect(result).to.deep.equal(schedule[0]);
    });
  });
});
