import html from '../../scripts/html.js';
import { IMSProvider } from './imsProvider.js';
import WelcomeModal from './WelcomeModal.js';

export default function AdobeMaxPlus() {
  return html`
    <${IMSProvider}>
      <div class="adobe-max-plus">
        <h1>Adobe Max Plus</h1>
        <${WelcomeModal} />
      </div>
    </${IMSProvider}>
  `;
}
