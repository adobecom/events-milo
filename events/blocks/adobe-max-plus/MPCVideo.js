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
  const wrapperRef = useRef(null);
  const [videoTitle, setVideoTitle] = useState('Adobe Video Publishing Cloud Player');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 = normal, 1 = full PiP
  const [isHidden, setIsHidden] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false); // User manually closed PiP

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

  // Continuous scroll-based transition from normal to PiP
  // Observe the wrapper itself to track when the video player scrolls out
  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visibilityRatio = entry.intersectionRatio;
          
          // Start transition when 60% visible (40% scrolled past)
          // Complete transition when 20% visible (80% scrolled past)
          const transitionStart = 0.6; // Start morphing at 60% visibility
          const transitionEnd = 0.2;   // End morphing at 20% visibility
          
          let progress;
          if (visibilityRatio >= transitionStart) {
            progress = 0; // Still mostly in view, normal mode
          } else if (visibilityRatio <= transitionEnd) {
            progress = 1; // Mostly scrolled past, full PiP
          } else {
            // Linear interpolation between start and end
            // Map [0.6 → 0.2] to [0 → 1]
            progress = (transitionStart - visibilityRatio) / (transitionStart - transitionEnd);
          }
          
          // Clamp to ensure valid range
          progress = Math.max(0, Math.min(1, progress));
          
          setScrollProgress(progress);

          // Update CSS custom properties for smooth animation
          if (wrapperRef.current) {
            wrapperRef.current.style.setProperty('--pip-progress', progress.toString());
          }
        });
      },
      {
        threshold: Array.from({ length: 61 }, (_, i) => i * (1/60)), // 0, 0.0167, 0.033, ... 1 (very granular)
        rootMargin: '0px 0px 0px 0px'
      }
    );

    const currentWrapper = wrapperRef.current;
    observer.observe(currentWrapper);

    return () => {
      if (currentWrapper) {
        observer.unobserve(currentWrapper);
      }
    };
  }, []);


  // Reset hidden and dismissed state when returning to normal mode (scrolled back to video)
  useEffect(() => {
    if (scrollProgress < 0.1) {
      if (isHidden) setIsHidden(false);
      if (isDismissed) setIsDismissed(false);
    }
  }, [scrollProgress, isHidden, isDismissed]);

  // Determine if we should show PiP (not dismissed and scrolled past)
  const shouldShowPiP = scrollProgress > 0.5 && !isDismissed;

  // Handle PiP close - dismiss PiP without scrolling
  const handleClosePiP = () => {
    setIsDismissed(true);
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

  // Single iframe wrapper that morphs smoothly based on scroll
  return html`
    <div>
      <!-- Wrapper for video and scroll anchor -->
      <div \
        ref=${wrapperRef} \
        class="mpc-video-wrapper ${className}" \
        style="--pip-progress: ${isDismissed ? 0 : scrollProgress}" \
      >
        <!-- Single persistent iframe wrapper - continuously transforms based on scroll -->
        <div \
          class="mpc-video-iframe-wrapper ${isHidden ? 'mpc-video-pip-hidden' : ''}" \
          data-pip-active=${shouldShowPiP} \
        >
          <!-- PiP controls - fade in as scroll progress increases -->
          ${shouldShowPiP && scrollProgress > 0.2 && html`
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

        <!-- Scroll detection anchor positioned absolutely at bottom -->
        <div \
          ref=${containerRef} \
          class="mpc-video-scroll-anchor" \
          data-video-id="${videoId}" \
        >
        </div>
      </div>

      ${shouldShowPiP && isHidden && html`
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
