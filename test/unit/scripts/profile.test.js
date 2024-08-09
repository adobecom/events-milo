import { expect } from '@esm-bundle/chai';
import { getProfile, lazyCaptureProfile } from '../../../events/scripts/profile.js';
import BlockMediator from '../../../events/scripts/deps/block-mediator.min.js';

describe('Profile Functions', () => {
  beforeEach(() => {
    window.feds = {};
    window.adobeProfile = {};
    window.fedsConfig = {};
    window.adobeIMS = {};
  });

  it('should get the user profile', async () => {
    window.feds = {
      services: {
        universalnav: { interface: { adobeProfile: { getUserProfile: () => Promise.resolve({ name: 'John Doe' }) } } },
        profile: { interface: { adobeProfile: { getUserProfile: () => Promise.resolve({ name: 'John Doe' }) } } },
      },
    };
    window.adobeProfile = { getUserProfile: () => Promise.resolve({ name: 'Jane Doe' }) };
    window.fedsConfig = { universalNav: true };
    window.adobeIMS = { getProfile: () => Promise.resolve({ name: 'IMS User' }) };

    const profile = await getProfile();

    expect(profile).to.deep.equal({ name: 'John Doe' });
  });

  it('lazyCapture starts with the polling system', async () => {
    window.feds = {
      services: {
        universalnav: { interface: { adobeProfile: { getUserProfile: () => Promise.resolve({ name: 'John Doe' }) } } },
        profile: { interface: { adobeProfile: { getUserProfile: () => Promise.resolve({ name: 'John Doe' }) } } },
      },
    };
    window.adobeProfile = { getUserProfile: () => Promise.resolve({ name: 'Jane Doe' }) };
    window.fedsConfig = { universalNav: true };
    window.adobeIMS = { getProfile: () => Promise.resolve({ name: 'IMS User' }) };

    lazyCaptureProfile();

    expect(BlockMediator.get('rsvpData')).to.be.undefined;
  });
});
