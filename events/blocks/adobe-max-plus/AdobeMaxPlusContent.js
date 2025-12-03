import html from '../../scripts/html.js';
import { useState } from '../../scripts/deps/preact/hooks/index.js';
import { useSessions } from './sessionProvider.js';
import { useIMS } from './imsProvider.js';
import WelcomeModal from './WelcomeModal.js';
import MPCVideo from './MPCVideo.js';
import TrackSelector from './TrackSelector.js';
import SessionDrawer from './SessionDrawer.js';

/**
 * Main content component that has access to provider data
 */
export default function AdobeMaxPlusContent() {
  // Access provider data
  const { tracks, loading: sessionsLoading } = useSessions();
  const { profile, isSignedIn } = useIMS();

  console.log('tracks', tracks);

  const [selectedTrack, setSelectedTrack] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shouldOpenDrawer, setShouldOpenDrawer] = useState(false);

  // Set initial track once tracks are loaded
  if (!selectedTrack && tracks.length > 0) {
    setSelectedTrack(tracks[0].id);
  }

  const handleTrackSelect = (trackId) => {
    setSelectedTrack(trackId);
  };

  const handleModalClose = () => {
    // Signal drawer to open after modal closes (first-time flow)
    setShouldOpenDrawer(true);
  };

  const handleAIChatOpen = () => {
    // Placeholder for AI chat modal
    // TODO: Open AI chat modal when implemented
    console.log('AI Chat button clicked - opening AI assistant...');
  };

  // Find the current track
  const currentTrack = tracks.find((track) => track.id === selectedTrack);
  const currentVideoId = currentTrack?.videoId || tracks[0]?.videoId;

  // Show loading state while sessions are loading
  if (sessionsLoading) {
    return html`
      <div class="adobe-max-plus">
        <div style="padding: 20px; text-align: center;">
          Loading sessions...
        </div>
      </div>
    `;
  }

  return html`
    <div class="adobe-max-plus">
      <${WelcomeModal} onClose=${handleModalClose} />
      <${MPCVideo} videoId=${currentVideoId} autoplay=${true} />
      <${TrackSelector} \
        tracks=${tracks} \
        selectedTrack=${selectedTrack} \
        onTrackSelect=${handleTrackSelect} \
      />
      <div style="height: 100vh; background-color: red;" />
      <${SessionDrawer} \
        selectedTrack=${selectedTrack} \
        isOpen=${drawerOpen} \
        onToggle=${setDrawerOpen} \
        openOnMount=${shouldOpenDrawer} \
        onAIChatOpen=${handleAIChatOpen} \
      />
    </div>
  `;
}

