export const LIBS = (() => {
  const { hostname, search } = window.location;
  if (!(hostname.includes('.hlx.') || hostname.includes('.aem.') || hostname.includes('local'))) return '/libs';
  const branch = new URLSearchParams(search).get('milolibs') || 'main';
  if (branch === 'local') return 'http://localhost:6456/libs';
  return branch.includes('--') ? `https://${branch}.aem.live/libs` : `https://${branch}--milo--adobecom.aem.live/libs`;
})();

export const EVENT_LIBS = (EVENT_CONFIG) => {
  const { version } = EVENT_CONFIG;
  const { hostname, search } = window.location;

  let eventLibs = '/libs';

  if (!(hostname.includes('.hlx.') || hostname.includes('.aem.') || hostname.includes('local'))) return eventLibs;
  const branch = new URLSearchParams(search).get('eventlibs') || 'main';
  if (branch === 'local') eventLibs = `http://localhost:3868/event-libs/${version}`;
  if (branch.includes('--')) eventLibs = `https://${branch}.aem.live/event-libs/${version}`;
  if (branch.includes('--event-libs--adobecom.aem.live')) eventLibs = `https://${branch}--event-libs--adobecom.aem.live/event-libs/${version}`;
  EVENT_CONFIG.eventLibs = eventLibs;
  return eventLibs;
};
