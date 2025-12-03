import html from '../../scripts/html.js';
import { useState } from '../../scripts/deps/preact/hooks/index.js';
import { IMSProvider } from './imsProvider.js';
import WelcomeModal from './WelcomeModal.js';
import MPCVideo from './MPCVideo.js';
import TrackSelector from './TrackSelector.js';

// Sample tracks with video IDs
const TRACKS = [
  { id: 'olivias-sessions', name: "Olivia's sessions", videoId: '3458790' },
  { id: 'mainstage', name: 'Mainstage', videoId: '3458791' },
  { id: 'generative-ai', name: 'Generative AI', videoId: '3458792' },
  { id: 'create', name: 'Create', videoId: '3458793' },
];

export default function AdobeMaxPlus() {
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0].id);

  // Find the current track's video ID
  const currentTrack = TRACKS.find((track) => track.id === selectedTrack);
  const currentVideoId = currentTrack?.videoId || TRACKS[0].videoId;

  const handleTrackSelect = (trackId) => {
    setSelectedTrack(trackId);
  };

  return html`
    <${IMSProvider}>
      <div class="adobe-max-plus">
        <${WelcomeModal} />
        <${MPCVideo} videoId=${currentVideoId} autoplay=${true} />
        <${TrackSelector} \
          tracks=${TRACKS} \
          selectedTrack=${selectedTrack} \
          onTrackSelect=${handleTrackSelect} \
        />
        <div style="height: 100vh; background-color: red;" />
      </div>
    </${IMSProvider}>
  `;
}
