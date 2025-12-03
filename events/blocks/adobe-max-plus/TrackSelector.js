import html from '../../scripts/html.js';
import { useRef, useEffect } from '../../scripts/deps/preact/hooks/index.js';

/**
 * TrackSelector Component - Horizontal scrollable track selector for mobile
 * @param {Object} props
 * @param {Array} props.tracks - Array of track objects with { id, name }
 * @param {string} props.selectedTrack - Currently selected track ID
 * @param {Function} props.onTrackSelect - Callback when a track is selected
 */
const TrackSelector = ({ tracks = [], selectedTrack, onTrackSelect }) => {
  const containerRef = useRef(null);
  const selectedButtonRef = useRef(null);

  // Auto-scroll to selected track when it changes
  useEffect(() => {
    if (selectedButtonRef.current && containerRef.current) {
      const button = selectedButtonRef.current;
      const container = containerRef.current;
      
      // Calculate the scroll position to center the selected button
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const containerWidth = container.offsetWidth;
      
      const scrollTo = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
      
      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }
  }, [selectedTrack]);

  if (!tracks || tracks.length === 0) {
    return null;
  }

  const handleTrackClick = (trackId) => {
    if (onTrackSelect) {
      onTrackSelect(trackId);
    }
  };

  return html`
    <div class="track-selector">
      <div class="track-selector-container" ref=${containerRef}>
        <div class="track-selector-list">
          ${tracks.map((track) => {
            const isSelected = track.id === selectedTrack;
            return html`
              <button \
                key=${track.id} \
                ref=${isSelected ? selectedButtonRef : null} \
                class="track-selector-button ${isSelected ? 'selected' : ''}" \
                onClick=${() => handleTrackClick(track.id)} \
                aria-pressed=${isSelected} \
                aria-label=${`Switch to ${track.name} track`} \
              >
                ${track.name}
              </button>
            `;
          })}
        </div>
      </div>
    </div>
  `;
};

export default TrackSelector;

