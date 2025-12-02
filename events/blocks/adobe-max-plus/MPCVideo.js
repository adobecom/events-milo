import html from '../../scripts/html.js';
import { useEffect, useRef, useState } from '../../scripts/deps/preact/hooks/index.js';

/**
 * MPCVideo Component - Loads Adobe Video Publishing Cloud videos
 * @param {Object} props
 * @param {string} props.videoId - The MPC video ID (e.g., "332632")
 * @param {boolean} props.autoplay - Whether to autoplay the video
 * @param {boolean} props.loop - Whether to loop the video (use with end=replay param)
 * @param {string} props.captions - Caption language codes (e.g., "eng" or "fra,eng")
 * @param {Object} props.params - Additional URL parameters as key-value pairs
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onStateChange - Callback when play/pause state changes
 */
const MPCVideo = ({
  videoId,
  autoplay = false,
  loop = false,
  captions = null,
  params = {},
  className = '',
  onStateChange = null,
}) => {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const pipTransitionTimeoutRef = useRef(null);
  const [videoTitle, setVideoTitle] = useState('Adobe Video Publishing Cloud Player');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [isPiP, setIsPiP] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Construct the video URL with parameters
  const getVideoUrl = () => {
    if (!videoId) return null;
    
    const url = new URL(`https://video.tv.adobe.com/v/${videoId}`);

    url.searchParams.set('fullscreen', 'true');
    url.searchParams.set('mute', 'false');
    
    // Add autoplay parameter based on prop
    if (autoplay) {
      url.searchParams.set('autoplay', 'true');
    } else {
      url.searchParams.set('autoplay', 'false');
    }
    // Add loop/replay parameter
    if (loop) {
      url.searchParams.set('end', 'replay');
    }
    
    // Add captions parameter
    if (captions) {
      url.searchParams.set('captions', captions);
    }
    
    // Add any additional parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    
    return url.toString();
  };

  // Fetch video metadata for accessibility
  useEffect(() => {
    if (!videoId) {
      setError('Video ID is required');
      return;
    }

    const fetchVideoMetadata = async () => {
      try {
        const response = await fetch(`https://video.tv.adobe.com/v/${videoId}?format=json-ld`);
        if (!response.ok) throw new Error('Failed to fetch video metadata');
        
        const info = await response.json();
        if (info?.jsonLinkedData?.name) {
          setVideoTitle(info.jsonLinkedData.name);
        }
      } catch (err) {
        console.warn('Could not fetch MPC video metadata:', err);
        window.lana?.log(`MPC video metadata error for ${videoId}: ${err.message}`);
      }
    };

    fetchVideoMetadata();
  }, [videoId]);

  // Handle postMessage events from the video player
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://video.tv.adobe.com' || !event.data) return;
      
      const { state, id } = event.data;
      
      // Validate the message is for this video
      if (!['play', 'pause'].includes(state) || !Number.isInteger(id)) return;
      if (!iframeRef.current?.src.startsWith(`${event.origin}/v/${id}`)) return;
      
      const playing = state === 'play';
      setIsPlaying(playing);
      
      // Call the callback if provided
      if (onStateChange) {
        onStateChange({ state, videoId: id, isPlaying: playing });
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [videoId, onStateChange]);

  // Picture-in-Picture: Detect when video scrolls out of view
  // The anchor is positioned BELOW the video, so when it's not visible, 
  // the user has scrolled past the video
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Clear any pending transition
          if (pipTransitionTimeoutRef.current) {
            clearTimeout(pipTransitionTimeoutRef.current);
            pipTransitionTimeoutRef.current = null;
          }

          // Add debounce to prevent rapid toggling
          pipTransitionTimeoutRef.current = setTimeout(() => {
            // Anchor is OUT of view (scrolled past the video) -> Enable PiP
            if (!entry.isIntersecting && !isPiP && isPlaying) {
              setIsPiP(true);
            } 
            // Anchor is back IN view (scrolled back to video area) -> Disable PiP
            else if (entry.isIntersecting && isPiP) {
              setIsPiP(false);
              setIsHidden(false);
            }
          }, 100);
        });
      },
      { 
        threshold: [0, 1],
        // Negative bottom margin creates a buffer zone
        rootMargin: '0px 0px -100px 0px'
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (pipTransitionTimeoutRef.current) {
        clearTimeout(pipTransitionTimeoutRef.current);
      }
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isPiP, isPlaying]);

  // Handle PiP close
  const handleClosePiP = () => {
    setIsPiP(false);
    setIsHidden(false);
  };

  // Handle hide to side
  const handleHide = () => {
    setIsHidden(true);
  };

  // Handle show from hidden
  const handleShow = () => {
    setIsHidden(false);
  };

  if (error) {
    return html`
      <div class="mpc-video-error" role="alert">
        <p>Error loading video: ${error}</p>
      </div>
    `;
  }

  const videoUrl = getVideoUrl();
  if (!videoUrl) {
    return html`
      <div class="mpc-video-error" role="alert">
        <p>Invalid video configuration</p>
      </div>
    `;
  }

  // Single iframe wrapper that repositions with CSS to prevent recreation
  return html`
    <div>
      <!-- Single persistent iframe wrapper - always rendered, repositioned with CSS -->
      <div class="mpc-video-iframe-wrapper ${isPiP ? 'mpc-iframe-pip-mode' : 'mpc-iframe-normal-mode'} ${isPiP && isHidden ? 'mpc-video-pip-hidden' : ''}">
        <!-- PiP controls - only shown in PiP mode -->
        ${isPiP && html`
          <div class="mpc-video-pip-controls">
            <button \
              class="mpc-video-pip-btn mpc-video-pip-hide" \
              onClick=${handleHide} \
              aria-label="Hide video" \
              title="Hide to side" \
            >
              ←
            </button>
            <button \
              class="mpc-video-pip-btn mpc-video-pip-close" \
              onClick=${handleClosePiP} \
              aria-label="Close picture-in-picture" \
              title="Return to page" \
            >
              ✕
            </button>
          </div>
        `}

        <!-- Single iframe instance - never unmounted -->
        <iframe \
          ref=${iframeRef} \
          src=${videoUrl} \
          class="adobetv" \
          scrolling="no" \
          allow="encrypted-media; fullscreen" \
          title=${videoTitle} \
          data-playing=${isPlaying} \
          aria-label=${videoTitle} \
          allowfullscreen \
          frameborder="0" \
          width="100%" \
          height="100%" \
        />
      </div>

      <!-- Scroll detection anchor positioned BELOW the video -->
      <div \
        ref=${containerRef} \
        class="mpc-video-scroll-anchor ${className}" \
        data-video-id="${videoId}" \
      >
      </div>

      ${isPiP && isHidden && html`
        <button \
          class="mpc-video-pip-tab" \
          onClick=${handleShow} \
          aria-label="Show video" \
          title="Show video" \
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7z" fill="currentColor"/>
          </svg>
        </button>
      `}
    </div>
  `;
};

export default MPCVideo;
