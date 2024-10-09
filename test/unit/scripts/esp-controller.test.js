import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

describe('Adobe Event Service API', () => {
  let api;

  before(async () => {
    api = await import('../../../events/scripts/esp-controller.js');
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
      window.location.search = '?eccEnv=local';
      const fetchStub = sinon.stub(window, 'fetch').resolves({ json: () => ({ eventId: '123' }), ok: true });
      const event = await api.getEvent('123');
      expect(event).to.be.an('object');
      expect(event.data).to.have.property('eventId', '123');
      fetchStub.restore();
    });
  });

  describe('getAttendee', () => {
    it('should fetch attendee details', async () => {
      window.location.search = '?eccEnv=local';
      const fetchStub = sinon.stub(window, 'fetch').resolves({ json: () => ({ attendeeId: '456' }), ok: true });
      const attendee = await api.getAttendee('123');
      expect(attendee).to.be.an('object');
      expect(attendee.data).to.have.property('attendeeId', '456');
      fetchStub.restore();
    });
  });

  describe('createAttendee', () => {
    it('should create an attendee and receive complete attendee data', async () => {
      window.location.search = '?eccEnv=local';
      const fetchStub = sinon.stub(window, 'fetch')
        .onFirstCall().resolves({ json: () => ({}), ok: true })
        .onSecondCall()
        .resolves({ json: () => ({ attendee: 'attendeeData' }), ok: true })
        .onThirdCall()
        .resolves({ json: () => ({ status: 'statusData' }), ok: true });

      const rsvpData = await api.createAttendee({ name: 'John Doe' });
      expect(rsvpData.data).to.be.an('object');
      fetchStub.restore();
    });
  });

  describe('addAttendeeToEvent', () => {
    it('should add an attendee to an event and receive complete attendee data', async () => {
      window.location.search = '?eccEnv=local';
      const fetchStub = sinon.stub(window, 'fetch')
        .onFirstCall().resolves({ json: () => ({}), ok: true })
        .onSecondCall()
        .resolves({ json: () => ({ attendee: 'attendeeData' }), ok: true })
        .onThirdCall()
        .resolves({ json: () => ({ status: 'statusData' }), ok: true });

      const rsvpData = await api.addAttendeeToEvent('123', { name: 'John Doe' });
      expect(rsvpData.data).to.be.an('object');
      fetchStub.restore();
    });
  });

  describe('updateAttendee', () => {
    it('should update attendee details and fetch complete attendee data', async () => {
      window.location.search = '?eccEnv=local';
      const fetchStub = sinon.stub(window, 'fetch')
        .onFirstCall().resolves({ json: () => ({}), ok: true })
        .onSecondCall()
        .resolves({ json: () => ({ attendee: 'attendeeData' }), ok: true })
        .onThirdCall()
        .resolves({ json: () => ({ status: 'statusData' }), ok: true });

      const rsvpData = await api.updateAttendee('123', { name: 'John Doe' });
      expect(rsvpData.data).to.be.an('object');
      fetchStub.restore();
    });
  });

  describe('deleteAttendeeFromEvent', () => {
    it('should delete an attendee and fetch complete attendee data', async () => {
      window.location.search = '?eccEnv=local';
      const fetchStub = sinon.stub(window, 'fetch')
        .onFirstCall().resolves({ json: () => ({}), ok: true })
        .onSecondCall()
        .resolves({ json: () => ({ attendee: 'attendeeData' }), ok: true })
        .onThirdCall()
        .resolves({ json: () => ({ status: 'statusData' }), ok: true });

      const rsvpData = await api.deleteAttendeeFromEvent('123');
      expect(rsvpData.data).to.be.an('object');
      fetchStub.restore();
    });
  });
});
