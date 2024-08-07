import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

describe('Adobe Event Service API', () => {
  let api;

  before(async () => {
    api = await import('../../../events/scripts/esp-controller.js');
  });

  describe('getAPIConfig', () => {
    it('should return API configuration object', () => {
      const config = api.getAPIConfig();
      expect(config).to.be.an('object');
      expect(config).to.have.property('esl');
      expect(config).to.have.property('esp');
    });
  });

  describe('waitForAdobeIMS', () => {
    it('should resolve when adobeIMS is available', async () => {
      window.adobeIMS = { getAccessToken: () => ({ token: 'fake-token' }) };
      await api.waitForAdobeIMS();
      expect(window.adobeIMS.getAccessToken()).to.have.property('token', 'fake-token');
    });
  });

  describe('constructRequestOptions', () => {
    it('should construct request options with auth token', async () => {
      window.adobeIMS = { getAccessToken: () => ({ token: 'fake-token' }) };
      const options = await api.constructRequestOptions('GET');
      expect(options).to.be.an('object');
      expect(options).to.have.property('method', 'GET');
      expect(options.headers.get('Authorization')).to.equal('Bearer fake-token');
    });
  });

  describe('getEvent', () => {
    it('should fetch event details', async () => {
      window.eccEnv = 'local';
      const fetchStub = sinon.stub(window, 'fetch').resolves({ json: () => ({ eventId: '123' }), ok: true });
      const event = await api.getEvent('123');
      expect(event).to.be.an('object');
      expect(event).to.have.property('eventId', '123');
      fetchStub.restore();
    });
  });

  describe('getAttendee', () => {
    it('should fetch attendee details', async () => {
      window.eccEnv = 'local';
      const fetchStub = sinon.stub(window, 'fetch').resolves({ json: () => ({ attendeeId: '456' }), ok: true });
      const attendee = await api.getAttendee('123');
      expect(attendee).to.be.an('object');
      expect(attendee).to.have.property('attendeeId', '456');
      fetchStub.restore();
    });
  });

  describe('createAttendee', () => {
    it('should create an attendee and receive complete attendee data', async () => {
      window.eccEnv = 'local';
      const fetchStub = sinon.stub(window, 'fetch')
        .onFirstCall().resolves({ json: () => ({}), ok: true })
        .onSecondCall()
        .resolves({ json: () => ({ attendee: 'attendeeData' }), ok: true })
        .onThirdCall()
        .resolves({ json: () => ({ status: 'statusData' }), ok: true });

      const rsvpData = await api.createAttendee({ name: 'John Doe' });
      expect(rsvpData).to.be.an('object');
      expect(rsvpData).to.have.property('attendee');
      expect(rsvpData).to.have.property('status');
      fetchStub.restore();
    });
  });

  describe('addAttendeeToEvent', () => {
    it('should add an attendee to an event and receive complete attendee data', async () => {
      window.eccEnv = 'local';
      const fetchStub = sinon.stub(window, 'fetch')
        .onFirstCall().resolves({ json: () => ({}), ok: true })
        .onSecondCall()
        .resolves({ json: () => ({ attendee: 'attendeeData' }), ok: true })
        .onThirdCall()
        .resolves({ json: () => ({ status: 'statusData' }), ok: true });

      const rsvpData = await api.addAttendeeToEvent('123', { name: 'John Doe' });
      expect(rsvpData).to.be.an('object');
      expect(rsvpData).to.have.property('attendee');
      expect(rsvpData).to.have.property('status');
      fetchStub.restore();
    });
  });

  describe('updateAttendee', () => {
    it('should update attendee details and fetch complete attendee data', async () => {
      window.eccEnv = 'local';
      const fetchStub = sinon.stub(window, 'fetch')
        .onFirstCall().resolves({ json: () => ({}), ok: true })
        .onSecondCall()
        .resolves({ json: () => ({ attendee: 'attendeeData' }), ok: true })
        .onThirdCall()
        .resolves({ json: () => ({ status: 'statusData' }), ok: true });

      const rsvpData = await api.updateAttendee('123', { name: 'John Doe' });
      expect(rsvpData).to.be.an('object');
      expect(rsvpData).to.have.property('attendee');
      expect(rsvpData).to.have.property('status');
      fetchStub.restore();
    });
  });

  describe('deleteAttendee', () => {
    it('should delete an attendee and fetch complete attendee data', async () => {
      window.eccEnv = 'local';
      const fetchStub = sinon.stub(window, 'fetch')
        .onFirstCall().resolves({ json: () => ({}), ok: true })
        .onSecondCall()
        .resolves({ json: () => ({ attendee: 'attendeeData' }), ok: true })
        .onThirdCall()
        .resolves({ json: () => ({ status: 'statusData' }), ok: true });

      const rsvpData = await api.deleteAttendee('123');
      expect(rsvpData).to.be.an('object');
      expect(rsvpData).to.have.property('attendee');
      expect(rsvpData).to.have.property('status');
      fetchStub.restore();
    });
  });
});
