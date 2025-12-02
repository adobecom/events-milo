import html from '../../scripts/html.js';
import { IMSProvider } from './imsProvider.js';
import WelcomeModal from './WelcomeModal.js';
import MPCVideo from './MPCVideo.js';

export default function AdobeMaxPlus() {
  return html`
    <${IMSProvider}>
      <div class="adobe-max-plus">
        <${WelcomeModal} />
        <${MPCVideo} videoId="3458790" autoplay=${true} />
      </div>
    </${IMSProvider}>
  `;
}
