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
  const normalContainerRef = useRef(null);
  const [videoTitle, setVideoTitle] = useState('Adobe Video Publishing Cloud Player');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [isPiPMode, setIsPiPMode] = useState(false); // Simple boolean: PiP active or not
  const [isHidden, setIsHidden] = useState(false);
  const [dragOffset, setDragOffset] = useState(0); // Track drag position for swipe gesture (when visible)
  const [showDragOffset, setShowDragOffset] = useState(0); // Track drag position for show gesture (when hidden)
  const pipPlayerRef = useRef(null);
  const dragOverlayRef = useRef(null);
  const tabButtonRef = useRef(null);

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

  // Simple scroll detection for PiP activation
  useEffect(() => {
    if (!normalContainerRef.current) return;

    let ticking = false;

    const checkPiPStatus = () => {
      if (!normalContainerRef.current) return;

      const rect = normalContainerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate visible portion
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(rect.bottom, viewportHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibilityRatio = visibleHeight / rect.height;
      
      // Activate PiP when less than 40% visible (60% scrolled past)
      const shouldActivatePiP = visibilityRatio < 0.4;
      
      setIsPiPMode(shouldActivatePiP);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkPiPStatus);
        ticking = true;
      }
    };

    // Initial check
    checkPiPStatus();

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-unhide when returning to normal mode
  useEffect(() => {
    if (!isPiPMode && isHidden) {
      setIsHidden(false);
    }
  }, [isPiPMode, isHidden]);

  // Handle PiP close
  const handleClosePiP = () => {
    setIsPiPMode(false);
  };

  // Handle hide to side
  const handleHide = () => {
    setIsHidden(true);
    setDragOffset(0); // Reset drag offset when hiding
  };

  // Handle show from hidden
  const handleShow = () => {
    setIsHidden(false);
    setShowDragOffset(0); // Reset drag offset when showing
  };

  // Swipe gesture handling for PiP
  useEffect(() => {
    if (!isPiPMode || isHidden || !dragOverlayRef.current) return;

    const element = dragOverlayRef.current;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      currentX = startX;
      isDragging = true;
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      
      // Only allow rightward swipes (positive values)
      if (diff > 0) {
        setDragOffset(diff);
        // Prevent default to avoid scrolling while swiping
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;

      const diff = currentX - startX;
      const threshold = 100; // Pixels to swipe before hiding

      if (diff > threshold) {
        // Swipe was far enough, hide the video
        handleHide();
      } else {
        // Snap back to original position
        setDragOffset(0);
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isPiPMode, isHidden]);

  // Swipe gesture handling for showing from hidden state
  useEffect(() => {
    if (!isPiPMode || !isHidden || !tabButtonRef.current) return;

    const element = tabButtonRef.current;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      currentX = startX;
      isDragging = true;
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      
      // Only allow leftward swipes (negative values) to reveal
      if (diff < 0) {
        setShowDragOffset(diff);
        // Prevent default to avoid scrolling while swiping
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;

      const diff = currentX - startX;
      const threshold = -80; // Pixels to swipe left before showing

      if (diff < threshold) {
        // Swipe was far enough, show the video
        handleShow();
      } else {
        // Snap back to hidden position
        setShowDragOffset(0);
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isPiPMode, isHidden]);

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

  // Single iframe approach: always rendered, positioned via CSS classes
  return html`
    <div>
      <!-- Normal player container - always maintains space -->
      <div \
        ref=${normalContainerRef} \
        class="mpc-video-container ${className}" \
      >
        <!-- Iframe wrapper that repositions based on mode -->
        <div \
          ref=${pipPlayerRef} \
          class="mpc-video-player ${isPiPMode ? 'pip-mode' : 'normal-mode'} ${isHidden ? 'pip-hidden' : ''}" \
          style="${
            dragOffset > 0 
              ? `transform: translateX(${dragOffset}px); opacity: ${Math.max(0.5, 1 - dragOffset / 200)}; transition: none;` 
              : showDragOffset < 0 && isHidden
                ? `transform: translateX(calc(100% + 16px + ${showDragOffset}px)); opacity: ${Math.min(1, Math.abs(showDragOffset) / 150)}; transition: none;`
                : ''
          }" \
        >
          <!-- Drag handle overlay for swipe gestures - only in PiP mode, not hidden -->
          ${isPiPMode && !isHidden && html`
            <div ref=${dragOverlayRef} class="mpc-video-pip-drag-overlay" aria-hidden="true"></div>
          `}

          <!-- PiP controls - only visible in PiP mode -->
          ${isPiPMode && html`
            <div class="mpc-video-pip-controls">
              <button \
                class="mpc-video-pip-btn mpc-video-pip-hide" \
                onClick=${handleHide} \
                aria-label="Hide video" \
                title="Hide to side" \
              >
                →
              </button>
              <button \
                class="mpc-video-pip-btn mpc-video-pip-close" \
                onClick=${handleClosePiP} \
                aria-label="Close picture-in-picture" \
                title="Close" \
              >
                ✕
              </button>
            </div>
          `}

          <!-- Single persistent iframe - NEVER unmounts -->
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
      </div>

      <!-- Show tab when hidden -->
      ${isPiPMode && isHidden && html`
        <button \
          ref=${tabButtonRef} \
          class="mpc-video-pip-tab" \
          onClick=${handleShow} \
          aria-label="Show video" \
          title="Show video or swipe left to reveal" \
          style="${showDragOffset < 0 ? `transform: translateX(${showDragOffset}px); transition: none;` : ''}" \
        >
          <svg width="18" height="28" viewBox="0 0 18 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 22L5 14L11 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
          </svg>
        </button>
      `}
    </div>
  `;
};

export default MPCVideo;
