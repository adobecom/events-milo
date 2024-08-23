/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { lazyCaptureProfile } from './profile.js';
import autoUpdateContent, { getNonProdData, validatePageAndRedirect, runDAAInjection } from './content-update.js';
import { setMetadata } from './utils.js';

export const LIBS = (() => {
  const { hostname, search } = window.location;
  if (!(hostname.includes('.hlx.') || hostname.includes('local'))) return '/libs';
  const branch = new URLSearchParams(search).get('milolibs') || 'main';
  if (branch === 'local') return 'http://localhost:6456/libs';
  return branch.includes('--') ? `https://${branch}.hlx.live/libs` : `https://${branch}--milo--adobecom.hlx.live/libs`;
})();

const { loadArea, setConfig, getConfig, loadLana } = await import(`${LIBS}/utils/utils.js`);

function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

function getECCEnv(miloConfig) {
  const { env } = miloConfig;

  if (env.name === 'prod') return 'prod';

  if (env.name === 'stage') {
    const { host, search } = window.location;
    const usp = new URLSearchParams(search);
    const eccEnv = usp.get('eccEnv');

    if (eccEnv) return eccEnv;

    if (host.startsWith('main--')) return 'prod';
    if (host.startsWith('stage--') || host.startsWith('www.stage')) return 'stage';
    if (host.startsWith('dev--') || host.startsWith('www.dev')) return 'dev';
  }

  // fallback to dev
  return 'dev';
}

export function decorateArea(area = document) {
  const parsePhotosData = () => {
    const output = {};

    if (!area) return output;

    try {
      const photosData = JSON.parse(getMetadata('photos'));

      photosData.forEach((photo) => {
        output[photo.imageKind] = photo;
      });
    } catch (e) {
      window.lana?.log('Failed to parse photos metadata:', e);
    }

    return output;
  };

  const eagerLoad = (parent, selector) => {
    const img = parent.querySelector(selector);
    img?.removeAttribute('loading');
  };

  (async function loadLCPImage() {
    const marquee = area.querySelector('.marquee');
    if (!marquee) {
      eagerLoad(area, 'img');
      return;
    }

    // First image of first row
    eagerLoad(marquee, 'div:first-child img');
    // Last image of last column of last row
    eagerLoad(marquee, 'div:last-child > div:last-child img');
  }());

  // runDAAInjection(area);
  if (getMetadata('event-details-page') !== 'yes') return;

  const photosData = parsePhotosData(area);
  const eventTitle = getMetadata('event-title') || document.title;

  const miloDeps = {
    miloLibs: LIBS,
    getConfig,
  };

  autoUpdateContent(area, miloDeps, {
    ...photosData,
    'event-title': eventTitle,
  });
}

// Add project-wide style path here.
const STYLES = '';

// Add any config options.
const CONFIG = {
  codeRoot: '/events',
  contentRoot: '/events',
  imsClientId: 'events-milo',
  // imsScope: 'AdobeID,openid,gnav',
  // geoRouting: 'off',
  // fallbackRouting: 'off',
  decorateArea,
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    kr: { ietf: 'ko-KR', tk: 'zfo3ouc' },
  },
};

export const MILO_CONFIG = setConfig({ ...CONFIG, miloLibs: LIBS });
// FIXME: Code smell. This should be exportable.
window.eccEnv = getECCEnv(MILO_CONFIG);

function renderWithNonProdMetadata() {
  const isEventDetailsPage = getMetadata('event-details-page') === 'yes';

  if (!isEventDetailsPage) return false;

  const isLiveProd = window.eccEnv === 'prod' && window.location.hostname === 'www.adobe.com';
  const isMissingEventId = !getMetadata('event-id');

  if (!isLiveProd && isMissingEventId) return true;

  const isPreviewMode = new URLSearchParams(window.location.search).get('previewMode');

  if (isLiveProd && isPreviewMode) return true;

  return false;
}

async function fetchAndDecorateArea() {
  // Load non-prod data for stage and dev environments
  const nonProdData = await getNonProdData(window.eccEnv);
  if (!nonProdData) return;
  Object.entries(nonProdData).forEach(([key, value]) => {
    if (key === 'event-title') {
      setMetadata(key, nonProdData.title);
    } else {
      setMetadata(key, value);
    }
  });

  decorateArea();
}

// Decorate the page with site specific needs.

decorateArea();

// fetch metadata json and decorate again if non-prod or prod + preview mode
if (renderWithNonProdMetadata()) await fetchAndDecorateArea();

// Validate the page and redirect if is event-details-page
if (getMetadata('event-details-page') === 'yes') await validatePageAndRedirect();

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

(function loadStyles() {
  const paths = [`${LIBS}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}());

(async function loadPage() {
  await loadLana({ clientId: 'events-milo' });
  await loadArea().then(() => {
    lazyCaptureProfile();
  });
}());
