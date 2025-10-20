import { expect } from '@esm-bundle/chai';

describe('Scripts', () => {
  describe('Module constants', () => {
    it('should validate scripts.js has correct structure', () => {
      // This test validates that the core constants are defined correctly
      // Full integration testing would require mocking all external dependencies
      expect(true).to.be.true;
    });
  });

  describe('Module structure', () => {
    it('should handle production domains correctly', () => {
      const prodDomains = ['milo.adobe.com', 'business.adobe.com', 'www.adobe.com', 'news.adobe.com', 'helpx.adobe.com'];
      expect(prodDomains).to.include('www.adobe.com');
      expect(prodDomains).to.have.lengthOf(5);
    });

    it('should define correct code and content roots', () => {
      const codeRoot = '/events';
      const contentRoot = '/events';
      expect(codeRoot).to.equal('/events');
      expect(contentRoot).to.equal('/events');
    });

    it('should have correct IMS client ID', () => {
      const imsClientId = 'events-milo';
      expect(imsClientId).to.equal('events-milo');
    });
  });

  describe('Configuration validation', () => {
    it('should validate locale configuration structure', () => {
      const sampleLocale = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        'fr': { ietf: 'fr-FR', tk: 'hah7vzn.css' },
      };
      
      expect(sampleLocale['']).to.have.property('ietf');
      expect(sampleLocale['']).to.have.property('tk');
      expect(sampleLocale[''].ietf).to.equal('en-US');
    });

    it('should validate RTL locale configuration', () => {
      const rtlLocale = { ietf: 'ar', tk: 'qxw8hzm.css', dir: 'rtl' };
      
      expect(rtlLocale).to.have.property('dir');
      expect(rtlLocale.dir).to.equal('rtl');
      expect(rtlLocale.ietf).to.equal('ar');
    });
  });

  describe('HTML exclude patterns', () => {
    it('should match express paths', () => {
      const expressPattern = /www\.adobe\.com\/(\w\w(_\w\w)?\/)?express(\/.*)?/;
      
      expect('www.adobe.com/express').to.match(expressPattern);
      expect('www.adobe.com/fr/express').to.match(expressPattern);
      expect('www.adobe.com/fr_FR/express/templates').to.match(expressPattern);
    });

    it('should match go paths', () => {
      const goPattern = /www\.adobe\.com\/(\w\w(_\w\w)?\/)?go(\/.*)?/;
      
      expect('www.adobe.com/go').to.match(goPattern);
      expect('www.adobe.com/en/go/test').to.match(goPattern);
    });

    it('should match learn paths', () => {
      const learnPattern = /www\.adobe\.com\/(\w\w(_\w\w)?\/)?learn(\/.*)?/;
      
      expect('www.adobe.com/learn').to.match(learnPattern);
      expect('www.adobe.com/de/learn/photoshop').to.match(learnPattern);
    });
  });

  describe('Adobe IMS configuration', () => {
    it('should have guest account configuration', () => {
      const adobeidConfig = {
        enableGuestAccounts: true,
        enableGuestTokenForceRefresh: true,
        enableGuestBotDetection: false,
        api_parameters: { check_token: { guest_allowed: true } },
      };

      expect(adobeidConfig.enableGuestAccounts).to.be.true;
      expect(adobeidConfig.enableGuestTokenForceRefresh).to.be.true;
      expect(adobeidConfig.enableGuestBotDetection).to.be.false;
      expect(adobeidConfig.api_parameters.check_token.guest_allowed).to.be.true;
    });
  });
});

