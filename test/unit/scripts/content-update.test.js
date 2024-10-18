import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { LIBS } from '../../../events/scripts/utils.js';
import BlockMediator from '../../../events/scripts/deps/block-mediator.min.js';

const {
  default: autoUpdateContent,
  updateAnalyticTag,
  updateRSVPButtonState,
  signIn,
  validatePageAndRedirect,
  updatePictureElement,
  getNonProdData,
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
    BlockMediator.set('rsvpData', { ok: true, data: { status: { registered: false } } });

    expect(document.querySelector('a[href$="#rsvp-form-1"]').textContent).to.be.equal(buttonOriginalText);
  });

  it('should show expore all blade when more than 4 related products are found', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-5-blades.html' });

    document.body.innerHTML = body;
    const miloDeps = {
      getConfig,
      miloLibs: LIBS,
    };

    autoUpdateContent(document, miloDeps);
    const productBlades = document.querySelector('.event-product-blades');
    const frags = productBlades.querySelectorAll('a');
    expect(frags.length).to.be.equal(1);
    expect(frags[0].textContent).to.be.equal('/events/fragments/product-blades/explore-creative-cloud');
  });
});

describe('updateAnalyticTag', () => {
  it('updates the text content of an element', () => {
    const element = document.createElement('div');
    updateAnalyticTag(element, 'new text');
    expect(element.getAttribute('daa-ll')).to.equal('new text|Create Now Chicago 2024 Test');
  });
});

describe('updateRSVPButtonState', () => {
  it('updates the RSVP button state', async () => {
    BlockMediator.set('rsvpData', null);
    const rsvpBtn = {
      el: document.createElement('a'),
      originalText: 'RSVP',
    };

    let eventInfo = {
      attendeeLimit: 100,
      attendeeCount: 0,
    };

    await updateRSVPButtonState(rsvpBtn, LIBS, eventInfo);
    expect(rsvpBtn.el.textContent).to.equal('RSVP');

    eventInfo = {
      attendeeLimit: 100,
      attendeeCount: 100,
    };
    await updateRSVPButtonState(rsvpBtn, LIBS, eventInfo);
    BlockMediator.set('rsvpData', { ok: false, error: { message: 'Request to ESP failed: Event is full' } });
    await updateRSVPButtonState(rsvpBtn, LIBS, eventInfo);
    expect(rsvpBtn.el.classList.contains('disabled')).to.be.true;
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
    console.log(window.location);
    const data = await getNonProdData('stage');

    expect(data).to.not.be.null;
    expect(data).to.have.property('url', '/');
    fetchStub.restore();
  });
});
