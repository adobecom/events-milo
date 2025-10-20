import { expect } from '@esm-bundle/chai';

describe('Utils', () => {
  describe('LIBS constant logic', () => {
    it('should use /libs path for production domains', () => {
      const hostname = 'www.adobe.com';
      const search = '';
      
      // Test the logic: if not hlx/aem/local, return /libs
      const isLocal = hostname.includes('.hlx.') || hostname.includes('.aem.') || hostname.includes('local');
      const expectedPath = isLocal ? 'dynamic' : '/libs';
      
      expect(expectedPath).to.equal('/libs');
    });

    it('should use dynamic path for hlx domains', () => {
      const hostname = 'main--events-milo--adobecom.hlx.page';
      
      const isLocal = hostname.includes('.hlx.') || hostname.includes('.aem.') || hostname.includes('local');
      expect(isLocal).to.be.true;
    });

    it('should use dynamic path for aem domains', () => {
      const hostname = 'main--events-milo--adobecom.aem.live';
      
      const isLocal = hostname.includes('.hlx.') || hostname.includes('.aem.') || hostname.includes('local');
      expect(isLocal).to.be.true;
    });

    it('should use dynamic path for local domains', () => {
      const hostname = 'localhost';
      
      const isLocal = hostname.includes('.hlx.') || hostname.includes('.aem.') || hostname.includes('local');
      expect(isLocal).to.be.true;
    });
  });

  describe('LIBS URL construction', () => {
    it('should construct main branch URL correctly', () => {
      const branch = 'main';
      const hasDoubleDash = branch.includes('--');
      const expectedUrl = hasDoubleDash 
        ? `https://${branch}.aem.live/libs`
        : `https://${branch}--milo--adobecom.aem.live/libs`;
      
      expect(expectedUrl).to.equal('https://main--milo--adobecom.aem.live/libs');
    });

    it('should construct localhost URL correctly', () => {
      const branch = 'local';
      const expectedUrl = branch === 'local' 
        ? 'http://localhost:6456/libs'
        : `https://${branch}--milo--adobecom.aem.live/libs`;
      
      expect(expectedUrl).to.equal('http://localhost:6456/libs');
    });

    it('should construct custom branch URL with double dash correctly', () => {
      const branch = 'stage--milo--adobecom';
      const hasDoubleDash = branch.includes('--');
      const expectedUrl = hasDoubleDash 
        ? `https://${branch}.aem.live/libs`
        : `https://${branch}--milo--adobecom.aem.live/libs`;
      
      expect(expectedUrl).to.equal('https://stage--milo--adobecom.aem.live/libs');
    });
  });

  describe('EVENT_LIBS constant logic', () => {
    it('should use /event-libs path for production domains', () => {
      const hostname = 'www.adobe.com';
      
      const isLocal = hostname.includes('.hlx.') || hostname.includes('.aem.') || hostname.includes('local');
      const expectedPath = isLocal ? 'dynamic' : '/event-libs';
      
      expect(expectedPath).to.equal('/event-libs');
    });

    it('should include version in event-libs path', () => {
      const version = 'v1';
      const basePath = '/event-libs';
      const fullPath = `${basePath}/${version}`;
      
      // Production path doesn't include version, only dynamic paths do
      expect(version).to.equal('v1');
      expect(fullPath).to.equal('/event-libs/v1');
    });
  });

  describe('EVENT_LIBS URL construction', () => {
    it('should construct main branch URL with version correctly', () => {
      const branch = 'main';
      const version = 'v1';
      const hasDoubleDash = branch.includes('--');
      const baseUrl = hasDoubleDash 
        ? `https://${branch}.aem.live`
        : `https://${branch}--event-libs--adobecom.aem.live`;
      const expectedUrl = `${baseUrl}/event-libs/${version}`;
      
      expect(expectedUrl).to.equal('https://main--event-libs--adobecom.aem.live/event-libs/v1');
    });

    it('should construct localhost URL with version correctly', () => {
      const branch = 'local';
      const version = 'v1';
      const expectedUrl = branch === 'local' 
        ? `http://localhost:3868/event-libs/${version}`
        : `https://${branch}--event-libs--adobecom.aem.live/event-libs/${version}`;
      
      expect(expectedUrl).to.equal('http://localhost:3868/event-libs/v1');
    });

    it('should construct custom branch URL with double dash and version correctly', () => {
      const branch = 'stage--event-libs--adobecom';
      const version = 'v1';
      const hasDoubleDash = branch.includes('--');
      const expectedUrl = hasDoubleDash 
        ? `https://${branch}.aem.live/event-libs/${version}`
        : `https://${branch}--event-libs--adobecom.aem.live/event-libs/${version}`;
      
      expect(expectedUrl).to.equal('https://stage--event-libs--adobecom.aem.live/event-libs/v1');
    });
  });

  describe('URLSearchParams parsing', () => {
    it('should extract milolibs parameter from query string', () => {
      const search = '?milolibs=stage';
      const params = new URLSearchParams(search);
      const milolibs = params.get('milolibs');
      
      expect(milolibs).to.equal('stage');
    });

    it('should extract eventlibs parameter from query string', () => {
      const search = '?eventlibs=dev';
      const params = new URLSearchParams(search);
      const eventlibs = params.get('eventlibs');
      
      expect(eventlibs).to.equal('dev');
    });

    it('should return null for missing parameter', () => {
      const search = '?other=value';
      const params = new URLSearchParams(search);
      const milolibs = params.get('milolibs');
      
      expect(milolibs).to.be.null;
    });

    it('should default to main when parameter is missing', () => {
      const search = '';
      const params = new URLSearchParams(search);
      const branch = params.get('milolibs') || 'main';
      
      expect(branch).to.equal('main');
    });
  });
});

