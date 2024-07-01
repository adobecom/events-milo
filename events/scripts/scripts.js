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

import { captureProfile } from '../utils/event-apis.js';
import autoUpdateContent, { getNonProdData } from '../utils/content-update.js';

export const LIBS = (() => {
  const { hostname, search } = window.location;
  if (!(hostname.includes('.hlx.') || hostname.includes('local'))) return '/libs';
  const branch = new URLSearchParams(search).get('milolibs') || 'ecc';
  if (branch === 'local') return 'http://localhost:6456/libs';
  return branch.includes('--') ? `https://${branch}.hlx.live/libs` : `https://${branch}--milo--adobecom.hlx.live/libs`;
})();

function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
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

  const photosData = parsePhotosData(area);
  const eventTitle = getMetadata('event-title') || document.title;

  autoUpdateContent(area, LIBS, {
    ...photosData,
    'event-title': eventTitle,
  });
}

// Add project-wide style path here.
const STYLES = '';

// Add any config options.
const CONFIG = {
  codeRoot: '/events',
  // contentRoot: '',
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

const { loadArea, setConfig, loadLana } = await import(`${LIBS}/utils/utils.js`);
const miloConfig = setConfig({ ...CONFIG, miloLibs: LIBS });

// Decorate the page with site specific needs.
decorateArea();

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
    captureProfile();
  });
}());

function getECCEnv() {
  const { env } = miloConfig;

  if (env.name === 'prod') return 'prod';

  if (env.name === 'stage') {
    const { host, search } = window.location;
    const usp = new URLSearchParams(search);
    const eccEnv = usp.get('eccEnv');

    if (eccEnv) return eccEnv;

    if (host.startsWith('stage--') || host.startsWith('www.stage')) return 'stage';
    if (host.startsWith('dev--') || host.startsWith('www.dev')) return 'dev';
  }

  // fallback to Milo env
  return env.name;
}

const eventId = getMetadata('event-id');
if (!eventId) {
  const eccEnv = getECCEnv();

  if (eccEnv !== 'prod') {
    const nonProdData = await getNonProdData(eccEnv, miloConfig);
    console.log(nonProdData);
  }
}
