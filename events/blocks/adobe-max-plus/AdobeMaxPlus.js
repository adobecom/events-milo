import html from '../../scripts/html.js';
import { IMSProvider } from './imsProvider.js';
import { SessionsProvider } from './sessionProvider.js';
import AdobeMaxPlusContent from './AdobeMaxPlusContent.js';

/**
 * Root component that sets up providers for the Adobe MAX Plus experience
 */
export default function AdobeMaxPlus() {
  return html`
    <${IMSProvider}>
      <${SessionsProvider}>
        <${AdobeMaxPlusContent} />
      </${SessionsProvider}>
    </${IMSProvider}>
  `;
}
