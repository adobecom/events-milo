import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { LIBS, setMetadata } from '../../../events/scripts/utils.js';
import BlockMediator from '../../../events/scripts/deps/block-mediator.min.js';

const {
  default: autoUpdateContent,
  updateAnalyticTag,
  signIn,
  validatePageAndRedirect,
  updatePictureElement,
  getNonProdData,
  convertUtcTimestampToLocalDateTime,
  massageMetadata,
  areTimestampsOnSameDay,
  createSmartDateRange,
  createTemplatedDateRange,
} = await import('../../../events/scripts/content-update.js');
const { getConfig } = await import(`${LIBS}/utils/utils.js`);
const head = await readFile({ path: './mocks/head.html' });
const body = await readFile({ path: './mocks/full-event.html' });
const defaultDoc = await readFile({ path: './mocks/event-default-doc.html' });

function checkForDoubleSquareBrackets() {
  const bodyContent = document.body.innerHTML;
  const regex = /\[\[.*?\]\]/g;
  const matches = bodyContent.match(regex);
  return !!matches;
}

describe('Content Update Script', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = head;
    window.isTestEnv = true;
  });

  it('leaves no placeholders behind', () => {
    document.body.innerHTML = body;
    const miloDeps = {
      getConfig,
      miloLibs: LIBS,
    };

    autoUpdateContent(document, miloDeps);
    expect(checkForDoubleSquareBrackets()).to.be.false;
  });

  it('handles #event-template special case', () => {
    document.body.innerHTML = defaultDoc;
    const miloDeps = {
      getConfig,
      miloLibs: LIBS,
    };

    autoUpdateContent(document, miloDeps);
    expect(checkForDoubleSquareBrackets()).to.be.false;
  });

  it('handles RSVP buttons correctly', async () => {
    document.body.innerHTML = body;
    const miloDeps = {
      getConfig,
      miloLibs: LIBS,
    };

    const profile = {
      account_type: 'type3',
      utcOffset: 'null',
      preferred_languages: null,
      displayName: 'Qiyun Dai',
      last_name: 'Dai',
      userId: 'B90719A765B288680A494219@c62f24cc5b5b7e0e0a494004',
      authId: 'B90719A765B288680A494219@c62f24cc5b5b7e0e0a494004',
      tags: [
        'agegroup_unknown',
        'edu',
        'edu_k12',
      ],
      emailVerified: 'true',
      phoneNumber: null,
      countryCode: 'US',
      name: 'Qiyun Dai',
      mrktPerm: 'EMAIL:false,MAIL:false,PHONE:false,PHONE_RENT:false,FAX:false,MAIL_RENT:false,EMAIL_RENT:false',
      mrktPermEmail: 'false',
      first_name: 'Qiyun',
      email: 'cod87753@adobe.com',
    };

    BlockMediator.set('imsProfile', profile);

    const buttonOriginalText = document.querySelector('a[href$="#rsvp-form-1"]').textContent;
    autoUpdateContent(document, miloDeps);
    BlockMediator.set('rsvpData', null);

    expect(document.querySelector('a[href$="#rsvp-form-1"]').textContent).to.be.equal(buttonOriginalText);
  });
});

describe('updateAnalyticTag', () => {
  it('updates the text content of an element', () => {
    const element = document.createElement('div');
    updateAnalyticTag(element, 'new text');
    expect(element.getAttribute('daa-ll')).to.equal('new text|Create Now Chicago 2024 Test');
  });
});

describe('signIn', () => {
  it('calls the signIn method', () => {
    window.adobeIMS = { signIn: () => {} };
    const signInSpy = sinon.spy(window.adobeIMS, 'signIn');
    signIn();
    expect(signInSpy.calledOnce).to.be.true;
  });

  it('should log a warning if the signIn method is not available', () => {
    window.lana = { log: () => {} };
    const logSpy = sinon.spy(window.lana, 'log');
    window.adobeIMS = {};
    signIn();
    expect(logSpy.calledOnce).to.be.true;
  });
});

describe('validatePageAndRedirect', () => {
  it('should do nothing if no redirection condition is met', async () => {
    const currentLocation = window.location.href;
    await validatePageAndRedirect(LIBS);
    expect(window.location.href).to.equal(currentLocation);
  });
});

describe('updatePictureElement', () => {
  it('updates the srcset attribute of a picture element', () => {
    const picture = document.querySelector('picture');
    const img = document.createElement('img');
    img.setAttribute('src', '/mock-image-url.jpg');

    picture.append(img);
    updatePictureElement(img.src, picture, 'alt-text');
    const sources = picture.querySelectorAll('source');
    sources.forEach((source) => {
      expect(source.srcset.startsWith('http://localhost:2000/mock-image-url.jpg?')).to.be.true;
    });
  });

  it('should try to parse https://www.adobe.com/ image URLs', () => {
    const picture = document.querySelector('picture');

    updatePictureElement('https://www.adobe.com/mock-image-url.jpg', picture, 'alt-text');
    const sources = picture.querySelectorAll('source');
    sources.forEach((source) => {
      expect(source.srcset.startsWith('/mock-image-url.jpg?')).to.be.true;
    });
  });
});

describe('getNonProdData', () => {
  it('should return the correct data for non-prod environments', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves({
      json: () => ({
        data: [
          { url: '/' },
        ],
      }),
      ok: true,
    });

    const data = await getNonProdData('stage');
    expect(data).to.not.be.null;
    expect(data).to.have.property('url', '/');
    fetchStub.restore();
  });
});

describe('UTC Timestamp to Local DateTime Conversion', () => {
  let originalLana;

  beforeEach(() => {
    // Mock lana for testing
    originalLana = window.lana;
    window.lana = { log: () => {} };
  });

  afterEach(() => {
    window.lana = originalLana;
  });

  it('should convert valid UTC timestamp to local date time string', () => {
    const timestamp = '1759251599990';
    const result = convertUtcTimestampToLocalDateTime(timestamp);
    
    // Should return a formatted date string
    expect(result).to.be.a('string');
    expect(result).to.not.be.empty;
    expect(result).to.match(/\d{4}/); // Should contain a year
    expect(result).to.match(/\d{1,2}:\d{2}/); // Should contain time
  });

  it('should handle numeric timestamp input', () => {
    const timestamp = 1759251599990;
    const result = convertUtcTimestampToLocalDateTime(timestamp);
    
    expect(result).to.be.a('string');
    expect(result).to.not.be.empty;
  });

  it('should return empty string for invalid timestamp', () => {
    const result = convertUtcTimestampToLocalDateTime('invalid');
    expect(result).to.equal('');
  });

  it('should return empty string for null/undefined timestamp', () => {
    expect(convertUtcTimestampToLocalDateTime(null)).to.equal('');
    expect(convertUtcTimestampToLocalDateTime(undefined)).to.equal('');
    expect(convertUtcTimestampToLocalDateTime('')).to.equal('');
  });

  it('should use custom locale when provided', () => {
    const timestamp = '1759251599990';
    const resultEn = convertUtcTimestampToLocalDateTime(timestamp, 'en-US');
    const resultDe = convertUtcTimestampToLocalDateTime(timestamp, 'de-DE');
    
    expect(resultEn).to.be.a('string');
    expect(resultDe).to.be.a('string');
    expect(resultEn).to.not.equal(resultDe); // Different locales should produce different formats
  });

  it('should handle edge case timestamps', () => {
    // Test with current timestamp
    const currentTimestamp = Date.now().toString();
    const result = convertUtcTimestampToLocalDateTime(currentTimestamp);
    expect(result).to.be.a('string');
    expect(result).to.not.be.empty;
  });

  it('should log error for invalid timestamps', () => {
    const logSpy = sinon.spy(window.lana, 'log');
    
    convertUtcTimestampToLocalDateTime('not-a-number');
    expect(logSpy.calledWith(sinon.match(/Invalid timestamp provided/))).to.be.true;
    
    logSpy.restore();
  });
});

describe('Date Range Utilities', () => {
  let originalLana;

  beforeEach(() => {
    // Mock lana for testing
    originalLana = window.lana;
    window.lana = { log: () => {} };
  });

  afterEach(() => {
    window.lana = originalLana;
  });

  describe('areTimestampsOnSameDay', () => {
    it('should return true for timestamps on the same day', () => {
      // Same day, different times
      const startTimestamp = '1759251599990'; // Jan 15, 2025 2:30 PM
      const endTimestamp = '1759255199990';   // Jan 15, 2025 3:30 PM
      
      expect(areTimestampsOnSameDay(startTimestamp, endTimestamp)).to.be.true;
    });

    it('should return false for timestamps on different days', () => {
      // Different days
      const startTimestamp = '1759251599990'; // Jan 15, 2025
      const endTimestamp = '1759337999990';   // Jan 16, 2025
      
      expect(areTimestampsOnSameDay(startTimestamp, endTimestamp)).to.be.false;
    });

    it('should handle numeric timestamps', () => {
      const startTimestamp = 1759251599990;
      const endTimestamp = 1759255199990;
      
      expect(areTimestampsOnSameDay(startTimestamp, endTimestamp)).to.be.true;
    });

    it('should return false for invalid timestamps', () => {
      expect(areTimestampsOnSameDay('invalid', '1759255199990')).to.be.false;
      expect(areTimestampsOnSameDay('1759251599990', 'invalid')).to.be.false;
      expect(areTimestampsOnSameDay(null, '1759255199990')).to.be.false;
      expect(areTimestampsOnSameDay('1759251599990', undefined)).to.be.false;
    });

    it('should handle edge cases around midnight', () => {
      // Just before and after midnight (different days)
      const startTimestamp = '1759251599990'; // Jan 15, 2025 11:59 PM
      const endTimestamp = '1759251600000';   // Jan 15, 2025 12:00 AM (next day)
      
      // These are actually the same day, let's use a proper midnight crossing
      const startTimestamp2 = '1759251599990'; // Jan 15, 2025 11:59 PM
      const endTimestamp2 = '1759337999990';   // Jan 16, 2025 11:59 PM (next day)
      
      expect(areTimestampsOnSameDay(startTimestamp2, endTimestamp2)).to.be.false;
    });
  });

  describe('createSmartDateRange', () => {
    it('should return single date for same-day events', () => {
      const startTimestamp = '1759251599990';
      const endTimestamp = '1759255199990';
      
      const result = createSmartDateRange(startTimestamp, endTimestamp, 'en-US');
      
      expect(result).to.be.a('string');
      expect(result).to.not.include(' - '); // Should not contain range separator
      expect(result).to.match(/\d{4}/); // Should contain a year
    });

    it('should return date range for multi-day events', () => {
      const startTimestamp = '1759251599990'; // Jan 15, 2025
      const endTimestamp = '1759337999990';   // Jan 16, 2025
      
      const result = createSmartDateRange(startTimestamp, endTimestamp, 'en-US');
      
      expect(result).to.be.a('string');
      expect(result).to.include(' - '); // Should contain range separator
      expect(result).to.match(/\d{4}/); // Should contain a year
    });

    it('should handle missing timestamps gracefully', () => {
      expect(createSmartDateRange('', '1759255199990', 'en-US')).to.equal('');
      expect(createSmartDateRange('1759251599990', '', 'en-US')).to.equal('');
      expect(createSmartDateRange(null, '1759255199990', 'en-US')).to.equal('');
      expect(createSmartDateRange('1759251599990', null, 'en-US')).to.equal('');
    });

    it('should use different locales for formatting', () => {
      const startTimestamp = '1759251599990';
      const endTimestamp = '1759337999990';
      
      const resultEn = createSmartDateRange(startTimestamp, endTimestamp, 'en-US');
      const resultDe = createSmartDateRange(startTimestamp, endTimestamp, 'de-DE');
      
      expect(resultEn).to.be.a('string');
      expect(resultDe).to.be.a('string');
      expect(resultEn).to.not.equal(resultDe); // Different locales should produce different formats
    });

    it('should handle invalid timestamps gracefully', () => {
      const result = createSmartDateRange('invalid', '1759255199990', 'en-US');
      expect(result).to.equal('');
    });
  });

  describe('createTemplatedDateRange', () => {
    it('should format date using template tokens', () => {
      const startTimestamp = '1759251599990'; // Jan 15, 2025
      const endTimestamp = '1759255199990';   // Jan 15, 2025 (1 hour later)
      const template = '{LLL} {dd} | {timeRange} {timeZone}';
      
      const result = createTemplatedDateRange(startTimestamp, endTimestamp, 'en-US', template);
      
      expect(result).to.be.a('string');
      expect(result).to.match(/\w{3} \d{2} \| \d{1,2}:\d{2} [AP]M - \d{1,2}:\d{2} [AP]M \w{3}/); // Pattern like "Jan 15 | 2:30 PM - 3:30 PM PST"
    });

    it('should handle different template formats', () => {
      const startTimestamp = '1759251599990';
      const endTimestamp = '1759255199990';
      
      const template1 = '{ddd}, {LLL} {dd}';
      const template2 = '{timeRange} {timeZone}';
      const template3 = '{ddd}, {LLL} {dd} | {timeRange} {timeZone}';
      
      const result1 = createTemplatedDateRange(startTimestamp, endTimestamp, 'en-US', template1);
      const result2 = createTemplatedDateRange(startTimestamp, endTimestamp, 'en-US', template2);
      const result3 = createTemplatedDateRange(startTimestamp, endTimestamp, 'en-US', template3);
      
      expect(result1).to.match(/\w{3}, \w{3} \d{2}/); // "Wed, Jan 15"
      expect(result2).to.match(/\d{1,2}:\d{2} [AP]M - \d{1,2}:\d{2} [AP]M \w{3}/); // "2:30 PM - 3:30 PM PST"
      expect(result3).to.include('|'); // Should contain separator
    });

    it('should handle different locales', () => {
      const startTimestamp = '1759251599990';
      const endTimestamp = '1759255199990';
      const template = '{ddd}, {LLL} {dd}';
      
      const resultEn = createTemplatedDateRange(startTimestamp, endTimestamp, 'en-US', template);
      const resultDe = createTemplatedDateRange(startTimestamp, endTimestamp, 'de-DE', template);
      
      expect(resultEn).to.be.a('string');
      expect(resultDe).to.be.a('string');
      expect(resultEn).to.not.equal(resultDe); // Different locales should produce different formats
    });

    it('should handle missing parameters gracefully', () => {
      expect(createTemplatedDateRange('', '1759255199990', 'en-US', '{LLL} {dd}')).to.equal('');
      expect(createTemplatedDateRange('1759251599990', '', 'en-US', '{LLL} {dd}')).to.equal('');
      expect(createTemplatedDateRange('1759251599990', '1759255199990', 'en-US', '')).to.equal('');
      expect(createTemplatedDateRange('1759251599990', '1759255199990', 'en-US', null)).to.equal('');
    });

    it('should handle invalid timestamps gracefully', () => {
      const template = '{LLL} {dd} | {timeRange} {timeZone}';
      const result = createTemplatedDateRange('invalid', '1759255199990', 'en-US', template);
      expect(result).to.equal('');
    });

    it('should handle numeric timestamps', () => {
      const startTimestamp = 1759251599990;
      const endTimestamp = 1759255199990;
      const template = '{LLL} {dd}';
      
      const result = createTemplatedDateRange(startTimestamp, endTimestamp, 'en-US', template);
      
      expect(result).to.be.a('string');
      expect(result).to.match(/\w{3} \d{2}/); // Should match pattern like "Jan 15"
    });
  });
});

describe('Metadata Massaging', () => {
  let originalLana;

  beforeEach(() => {
    // Mock lana for testing
    originalLana = window.lana;
    window.lana = { log: () => {} };
  });

  afterEach(() => {
    window.lana = originalLana;
    // Clean up metadata
    const startMeta = document.head.querySelector('meta[name="local-start-time-millis"]');
    if (startMeta) document.head.removeChild(startMeta);
    const endMeta = document.head.querySelector('meta[name="local-end-time-millis"]');
    if (endMeta) document.head.removeChild(endMeta);
    const templateMeta = document.head.querySelector('meta[name="custom-date-time-format"]');
    if (templateMeta) document.head.removeChild(templateMeta);
  });

  it('should massage start time metadata', () => {
    // Set up test metadata
    setMetadata('local-start-time-millis', '1759251599990');

    // Call massageMetadata
    const result = massageMetadata('en-US');

    // Verify the timestamp was converted
    expect(result).to.have.property('user-start-date-time');
    expect(result['user-start-date-time']).to.be.a('string');
    expect(result['user-start-date-time']).to.not.be.empty;
    expect(result['user-start-date-time']).to.match(/\d{4}/); // Should contain a year
  });

  it('should massage end time metadata', () => {
    // Set up test metadata
    setMetadata('local-end-time-millis', '1759251599990');

    // Call massageMetadata
    const result = massageMetadata('en-US');

    // Verify the timestamp was converted
    expect(result).to.have.property('user-end-date-time');
    expect(result['user-end-date-time']).to.be.a('string');
    expect(result['user-end-date-time']).to.not.be.empty;
  });

  it('should massage multiple metadata fields', () => {
    // Set up test metadata
    setMetadata('local-start-time-millis', '1759251599990');
    setMetadata('local-end-time-millis', '1759255199990');

    // Call massageMetadata
    const result = massageMetadata('en-US');

    // Verify both timestamps were converted
    expect(result).to.have.property('user-start-date-time');
    expect(result).to.have.property('user-end-date-time');
    expect(result['user-start-date-time']).to.be.a('string');
    expect(result['user-end-date-time']).to.be.a('string');
  });

  it('should massage smart date range for same-day events', () => {
    // Set up test metadata for same-day event
    setMetadata('local-start-time-millis', '1759251599990');
    setMetadata('local-end-time-millis', '1759255199990');

    // Call massageMetadata
    const result = massageMetadata('en-US');

    // Verify smart date range was created
    expect(result).to.have.property('user-event-date-time-range');
    expect(result['user-event-date-time-range']).to.be.a('string');
    expect(result['user-event-date-time-range']).to.not.include(' - '); // Same day, no range separator
  });

  it('should massage smart date range for multi-day events', () => {
    // Set up test metadata for multi-day event
    setMetadata('local-start-time-millis', '1759251599990');
    setMetadata('local-end-time-millis', '1759337999990');

    // Call massageMetadata
    const result = massageMetadata('en-US');

    // Verify smart date range was created
    expect(result).to.have.property('user-event-date-time-range');
    expect(result['user-event-date-time-range']).to.be.a('string');
    expect(result['user-event-date-time-range']).to.include(' - '); // Multi-day, should have range separator
  });

  it('should handle missing timestamps for smart date range', () => {
    // Call massageMetadata without setting any timestamps
    const result = massageMetadata('en-US');

    // Should not have the smart date range for missing timestamps
    expect(result).to.not.have.property('user-event-date-time-range');
  });

  it('should use custom template when provided', () => {
    // Set up test metadata with custom template
    setMetadata('local-start-time-millis', '1759251599990');
    setMetadata('local-end-time-millis', '1759255199990');
    setMetadata('custom-date-time-format', '{LLL} {dd} | {timeRange} {timeZone}');

    // Call massageMetadata
    const result = massageMetadata('en-US');

    // Verify templated date range was created
    expect(result).to.have.property('user-event-date-time-range');
    expect(result['user-event-date-time-range']).to.be.a('string');
    expect(result['user-event-date-time-range']).to.match(/\w{3} \d{2} \| \d{1,2}:\d{2} [AP]M - \d{1,2}:\d{2} [AP]M \w{3}/);
  });

  it('should fallback to smart date range when no custom template', () => {
    // Set up test metadata without custom template
    setMetadata('local-start-time-millis', '1759251599990');
    setMetadata('local-end-time-millis', '1759255199990');

    // Call massageMetadata
    const result = massageMetadata('en-US');

    // Verify smart date range was created (fallback behavior)
    expect(result).to.have.property('user-event-date-time-range');
    expect(result['user-event-date-time-range']).to.be.a('string');
    expect(result['user-event-date-time-range']).to.not.include(' - '); // Same day, no range separator
  });

  it('should use custom locale for formatting', () => {
    // Set up test metadata
    setMetadata('local-start-time-millis', '1759251599990');

    // Call massageMetadata with different locales
    const resultEn = massageMetadata('en-US');
    const resultDe = massageMetadata('de-DE');

    // Both should have the property but with different formatting
    expect(resultEn).to.have.property('user-start-date-time');
    expect(resultDe).to.have.property('user-start-date-time');
    expect(resultEn['user-start-date-time']).to.not.equal(resultDe['user-start-date-time']);
  });

  it('should handle invalid metadata gracefully', () => {
    // Set up test metadata with invalid timestamp
    setMetadata('local-start-time-millis', 'invalid-timestamp');

    // Call massageMetadata
    const result = massageMetadata('en-US');

    // Should not have the hydrated field for invalid data
    expect(result).to.not.have.property('user-start-date-time');
  });

  it('should log errors for transformation failures', () => {
    // Set up test metadata with invalid timestamp
    setMetadata('local-start-time-millis', 'invalid-timestamp');
    const logSpy = sinon.spy(window.lana, 'log');

    // Call massageMetadata
    massageMetadata('en-US');

    // Should log error for invalid timestamp
    expect(logSpy.calledWith(sinon.match(/Invalid timestamp provided/))).to.be.true;

    logSpy.restore();
  });

  it('should handle transformation errors gracefully', () => {
    // Set up test metadata with invalid timestamp
    setMetadata('local-start-time-millis', 'invalid');

    // Call massageMetadata
    const result = massageMetadata('en-US');

    // Should handle error gracefully
    expect(result).to.be.an('object');
    expect(result).to.not.have.property('user-start-date-time');
  });
});

describe('autoUpdateContent - Timestamp Integration', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    // Mock lana for testing
    window.lana = { log: () => {} };
  });

  afterEach(() => {
    document.body.removeChild(container);
    // Clean up metadata
    const meta = document.head.querySelector('meta[name="local-start-time-millis"]');
    if (meta) document.head.removeChild(meta);
    const eventIdMeta = document.head.querySelector('meta[name="event-id"]');
    if (eventIdMeta) document.head.removeChild(eventIdMeta);
  });

  it('should hydrate metadata and convert timestamps in autoUpdateContent', () => {
    // Set up test metadata
    setMetadata('local-start-time-millis', '1759251599990');
    setMetadata('local-end-time-millis', '1759255199990');
    setMetadata('event-id', 'test-event');

    // Create test HTML that uses the converted timestamps
    container.innerHTML = '<p>Event starts: [[user-start-date-time]] and ends: [[user-end-date-time]]</p>';

    // Mock miloDeps
    const miloDeps = {
      getConfig: () => ({ locale: { ietf: 'en-US' } }),
      miloLibs: '/libs',
    };

    // Call autoUpdateContent
    autoUpdateContent(container, miloDeps, {});

    // Verify both timestamps were converted and used
    expect(container.textContent).to.not.include('[[');
    expect(container.textContent).to.not.include(']]');
    expect(container.textContent).to.match(/\d{4}/); // Should contain a year
    expect(container.textContent).to.match(/\d{1,2}:\d{2}/); // Should contain time
  });

  it('should massage smart date range in autoUpdateContent for same-day events', () => {
    // Set up test metadata for same-day event
    setMetadata('local-start-time-millis', '1759251599990');
    setMetadata('local-end-time-millis', '1759255199990');
    setMetadata('event-id', 'test-event');

    // Create test HTML that uses the smart date range
    container.innerHTML = '<p>Event: [[user-event-date-time-range]]</p>';

    // Mock miloDeps
    const miloDeps = {
      getConfig: () => ({ locale: { ietf: 'en-US' } }),
      miloLibs: '/libs',
    };

    // Call autoUpdateContent
    autoUpdateContent(container, miloDeps, {});

    // Verify smart date range was used (should not contain range separator for same day)
    expect(container.textContent).to.not.include('[[');
    expect(container.textContent).to.not.include(']]');
    expect(container.textContent).to.not.include(' - '); // Same day, no range separator
    expect(container.textContent).to.match(/\d{4}/); // Should contain a year
  });

  it('should massage smart date range in autoUpdateContent for multi-day events', () => {
    // Set up test metadata for multi-day event
    setMetadata('local-start-time-millis', '1759251599990');
    setMetadata('local-end-time-millis', '1759337999990');
    setMetadata('event-id', 'test-event');

    // Create test HTML that uses the smart date range
    container.innerHTML = '<p>Event: [[user-event-date-time-range]]</p>';

    // Mock miloDeps
    const miloDeps = {
      getConfig: () => ({ locale: { ietf: 'en-US' } }),
      miloLibs: '/libs',
    };

    // Call autoUpdateContent
    autoUpdateContent(container, miloDeps, {});

    // Verify smart date range was used (should contain range separator for multi-day)
    expect(container.textContent).to.not.include('[[');
    expect(container.textContent).to.not.include(']]');
    expect(container.textContent).to.include(' - '); // Multi-day, should have range separator
    expect(container.textContent).to.match(/\d{4}/); // Should contain a year
  });

  it('should handle missing local-start-time-millis gracefully', () => {
    // Set up test metadata without timestamp
    setMetadata('event-id', 'test-event');

    // Create test HTML
    container.innerHTML = '<p>Event starts: [[user-start-date-time]]</p>';

    // Mock miloDeps
    const miloDeps = {
      getConfig: () => ({ locale: { ietf: 'en-US' } }),
      miloLibs: '/libs',
    };

    // Call autoUpdateContent
    autoUpdateContent(container, miloDeps, {});

    // Should replace placeholder with empty string when no metadata
    expect(container.textContent).to.equal('Event starts: ');
  });

  it('should use locale from config for timestamp conversion', () => {
    // Set up test metadata
    setMetadata('local-start-time-millis', '1759251599990');
    setMetadata('event-id', 'test-event');

    // Create test HTML
    container.innerHTML = '<p>Event starts: [[user-start-date-time]]</p>';

    // Mock miloDeps with German locale
    const miloDeps = {
      getConfig: () => ({ locale: { ietf: 'de-DE' } }),
      miloLibs: '/libs',
    };

    // Call autoUpdateContent
    autoUpdateContent(container, miloDeps, {});

    // Verify the timestamp was converted using German locale
    expect(container.textContent).to.not.include('[[');
    expect(container.textContent).to.not.include(']]');
    expect(container.textContent).to.be.a('string');
    expect(container.textContent.length).to.be.greaterThan(0);
  });

  it('should handle invalid timestamp gracefully', () => {
    // Set up test metadata with invalid timestamp
    setMetadata('local-start-time-millis', 'invalid-timestamp');
    setMetadata('event-id', 'test-event');

    // Create test HTML
    container.innerHTML = '<p>Event starts: [[user-start-date-time]]</p>';

    // Mock miloDeps
    const miloDeps = {
      getConfig: () => ({ locale: { ietf: 'en-US' } }),
      miloLibs: '/libs',
    };

    // Call autoUpdateContent
    autoUpdateContent(container, miloDeps, {});

    // Should replace placeholder with empty string for invalid timestamp
    expect(container.textContent).to.equal('Event starts: ');
  });
});

describe('autoUpdateContent - Array Iteration', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('@array syntax', () => {
    it('should debug META_REG pattern', () => {
      // Test what META_REG captures
      const META_REG = /\[\[(.*?)\]\]/g;
      const testText = 'Contact us: [[@array(contacts),]]';
      const matches = [];
      let match;
      // eslint-disable-next-line no-cond-assign
      while ((match = META_REG.exec(testText)) !== null) {
        matches.push(match);
      }

      console.log('META_REG matches:', matches);
      expect(matches.length).to.be.greaterThan(0);
      expect(matches[0][1]).to.equal('@array(contacts),');
    });

    it('should process @array(contacts) with English commas', () => {
      // Set up test metadata
      setMetadata('contacts', JSON.stringify(['John Doe', 'Jane Smith', 'Bob Johnson']));
      setMetadata('event-id', 'test-event'); // Required for autoUpdateContent to run

      // Create test HTML with @array syntax
      container.innerHTML = '<p>Contact us: [[@array(contacts),]]</p>';

      // Mock miloDeps
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'en-US' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Debug: log the actual content
      console.log('Actual content:', container.textContent);
      console.log('Expected content:', 'Contact us: John Doe,Jane Smith,Bob Johnson');

      // Verify the result - comma is used exactly as provided
      expect(container.textContent).to.equal('Contact us: John Doe,Jane Smith,Bob Johnson');
    });

    it('should process @array(contacts) with custom separator', () => {
      // Set up test metadata
      setMetadata('contacts', JSON.stringify(['John Doe', 'Jane Smith', 'Bob Johnson']));
      setMetadata('event-id', 'test-event');

      // Create test HTML with custom separator
      container.innerHTML = '<p>Contact us: [[@array(contacts) | ]]</p>';

      // Mock miloDeps
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'en-US' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result uses custom separator
      expect(container.textContent).to.equal('Contact us: John Doe | Jane Smith | Bob Johnson');
    });

    it('should process @array(contacts) with no separator (defaults to space)', () => {
      // Set up test metadata
      setMetadata('contacts', JSON.stringify(['John Doe', 'Jane Smith', 'Bob Johnson']));
      setMetadata('event-id', 'test-event');

      // Create test HTML with no separator
      container.innerHTML = '<p>Contact us: [[@array(contacts)]]</p>';

      // Mock miloDeps
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'en-US' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result uses space as default separator
      expect(container.textContent).to.equal('Contact us: John Doe Jane Smith Bob Johnson');
    });

    it('should process @array(contacts) with Japanese separators for comma', () => {
      // Set up test metadata
      setMetadata('contacts', JSON.stringify(['田中太郎', '佐藤花子', '鈴木一郎']));
      setMetadata('event-id', 'test-event');

      // Create test HTML with @array syntax
      container.innerHTML = '<p>連絡先: [[@array(contacts),]]</p>';

      // Mock miloDeps with Japanese locale
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'ja-JP' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result uses the comma as provided (no locale-specific handling)
      expect(container.textContent).to.equal('連絡先: 田中太郎,佐藤花子,鈴木一郎');
    });

    it('should process @array(contacts) with Chinese separators for comma', () => {
      // Set up test metadata
      setMetadata('contacts', JSON.stringify(['张三', '李四', '王五']));
      setMetadata('event-id', 'test-event');

      // Create test HTML with @array syntax
      container.innerHTML = '<p>联系人: [[@array(contacts),]]</p>';

      // Mock miloDeps with Chinese locale
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'zh-CN' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result uses the comma as provided (no locale-specific handling)
      expect(container.textContent).to.equal('联系人: 张三,李四,王五');
    });

    it('should handle empty arrays gracefully', () => {
      // Set up test metadata with empty array
      setMetadata('contacts', JSON.stringify([]));
      setMetadata('event-id', 'test-event');

      // Create test HTML with @array syntax
      container.innerHTML = '<p>Contact us: [[@array(contacts),]]</p>';

      // Mock miloDeps
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'en-US' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result is empty
      expect(container.textContent).to.equal('Contact us: ');
    });

    it('should handle non-array metadata gracefully', () => {
      // Set up test metadata with non-array
      setMetadata('contacts', 'John Doe');
      setMetadata('event-id', 'test-event');

      // Create test HTML with @array syntax
      container.innerHTML = '<p>Contact us: [[@array(contacts),]]</p>';

      // Mock miloDeps
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'en-US' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result is empty (non-array returns empty string)
      expect(container.textContent).to.equal('Contact us: ');
    });

    it('should fallback to English commas for unsupported locales', () => {
      // Set up test metadata
      setMetadata('contacts', JSON.stringify(['John Doe', 'Jane Smith']));
      setMetadata('event-id', 'test-event');

      // Create test HTML with @array syntax
      container.innerHTML = '<p>Contact us: [[@array(contacts),]]</p>';

      // Mock miloDeps with unsupported locale
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'xx-XX' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result uses the comma as provided (no locale-specific handling)
      expect(container.textContent).to.equal('Contact us: John Doe,Jane Smith');
    });

    it('should work with nested metadata paths', () => {
      // Set up test metadata with nested structure
      setMetadata('event-data', JSON.stringify({
        contacts: ['John Doe', 'Jane Smith'],
        other: 'data',
      }));
      setMetadata('event-id', 'test-event');

      // Create test HTML with nested @array syntax
      container.innerHTML = '<p>Contact us: [[@array(event-data.contacts),]]</p>';

      // Mock miloDeps
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'en-US' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result
      expect(container.textContent).to.equal('Contact us: John Doe,Jane Smith');
    });

    it('should extract object attributes from array', () => {
      // Set up test metadata with array of objects
      setMetadata('speakers', JSON.stringify([
        { name: 'Dr. Alice Brown', title: 'Senior Researcher' },
        { name: 'Prof. Charlie Wilson', title: 'Professor' },
        { name: 'Jane Smith', title: 'Engineer' },
      ]));
      setMetadata('event-id', 'test-event');

      // Create test HTML with attribute extraction
      container.innerHTML = '<p>Speakers: [[@array(speakers.name),]]</p>';

      // Mock miloDeps
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'en-US' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Debug: log the actual content
      console.log('Actual content:', container.textContent);
      console.log('Expected content:', 'Speakers: Dr. Alice Brown,Prof. Charlie Wilson,Jane Smith');

      // Verify the result extracts the 'name' attribute
      expect(container.textContent).to.equal('Speakers: Dr. Alice Brown,Prof. Charlie Wilson,Jane Smith');
    });

    it('should extract object attributes with custom separator', () => {
      // Set up test metadata with array of objects
      setMetadata('speakers', JSON.stringify([
        { name: 'Dr. Alice Brown', title: 'Senior Researcher' },
        { name: 'Prof. Charlie Wilson', title: 'Professor' },
      ]));
      setMetadata('event-id', 'test-event');

      // Create test HTML with attribute extraction and custom separator
      container.innerHTML = '<p>Speakers: [[@array(speakers.name) | ]]</p>';

      // Mock miloDeps
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'en-US' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result uses custom separator
      expect(container.textContent).to.equal('Speakers: Dr. Alice Brown | Prof. Charlie Wilson');
    });

    it('should handle nested arrays with object attributes', () => {
      // Set up test metadata with nested structure containing objects
      setMetadata('event-data', JSON.stringify({
        speakers: [
          { name: 'Dr. Alice Brown', title: 'Senior Researcher' },
          { name: 'Prof. Charlie Wilson', title: 'Professor' },
        ],
        other: 'data',
      }));
      setMetadata('event-id', 'test-event');

      // Create test HTML with nested array and attribute extraction
      container.innerHTML = '<p>Speakers: [[@array(event-data.speakers.name),]]</p>';

      // Mock miloDeps
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'en-US' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result
      expect(container.textContent).to.equal('Speakers: Dr. Alice Brown,Prof. Charlie Wilson');
    });

    it('should handle objects without attribute specification', () => {
      // Set up test metadata with array of objects
      setMetadata('speakers', JSON.stringify([
        { name: 'Dr. Alice Brown', title: 'Senior Researcher' },
        { name: 'Prof. Charlie Wilson', title: 'Professor' },
      ]));
      setMetadata('event-id', 'test-event');

      // Create test HTML without attribute specification
      container.innerHTML = '<p>Speakers: [[@array(speakers),]]</p>';

      // Mock miloDeps
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'en-US' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result converts objects to JSON strings
      expect(container.textContent).to.include('Speakers: {"name":"Dr. Alice Brown","title":"Senior Researcher"},{"name":"Prof. Charlie Wilson","title":"Professor"}');
    });

    it('should handle missing attributes gracefully', () => {
      // Set up test metadata with array of objects
      setMetadata('speakers', JSON.stringify([
        { name: 'Dr. Alice Brown', title: 'Senior Researcher' },
        { name: 'Prof. Charlie Wilson' }, // Missing title
        { title: 'Engineer' }, // Missing name
      ]));
      setMetadata('event-id', 'test-event');

      // Create test HTML with attribute extraction
      container.innerHTML = '<p>Speakers: [[@array(speakers.name),]]</p>';

      // Mock miloDeps
      const miloDeps = {
        getConfig: () => ({ locale: { ietf: 'en-US' } }),
        miloLibs: '/libs',
      };

      // Call autoUpdateContent
      autoUpdateContent(container, miloDeps, {});

      // Verify the result handles missing attributes
      expect(container.textContent).to.equal('Speakers: Dr. Alice Brown,Prof. Charlie Wilson,');
    });
  });
});
