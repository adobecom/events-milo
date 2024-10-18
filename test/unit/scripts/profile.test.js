import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getProfile, lazyCaptureProfile } from '../../../events/scripts/profile.js';
import BlockMediator from '../../../events/scripts/deps/block-mediator.min.js';

describe('Profile Functions', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    window.feds = null;
    window.adobeProfile = null;
    window.fedsConfig = null;
    window.adobeIMS = null;
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
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

    clock.tick(8000);

    expect(BlockMediator.get('rsvpData')).to.be.undefined;
  });

  it('should stop polling after 10 retries', async () => {
    lazyCaptureProfile();

    await clock.tick(8000);
    window.adobeIMS = { getProfile: () => Promise.resolve(null) };

    await clock.tick(3000);
    const profile = await getProfile();
    expect(profile).to.equal(null);
    expect(BlockMediator.get('rsvpData')).to.be.undefined;
    expect(BlockMediator.get('imsProfile')).to.deep.equal({ noProfile: true });
  });
});
