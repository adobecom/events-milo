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
  const [videoTitle, setVideoTitle] = useState('Adobe Video Publishing Cloud Player');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  // Construct the video URL with parameters
  const getVideoUrl = () => {
    if (!videoId) return null;
    
    const url = new URL(`https://video.tv.adobe.com/v/${videoId}`);

    url.searchParams.set('fullscreen', 'true');
    url.searchParams.set('autoplay', 'true');
    url.searchParams.set('mute', 'false');
    
    // Add autoplay parameter
    if (autoplay) {
      url.searchParams.set('autoplay', 'true');
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

  // Auto-pause when scrolled out of view
  useEffect(() => {
    if (!iframeRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If video is playing and scrolled out of view, pause it
          if (!entry.isIntersecting && isPlaying && iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage(
              { type: 'mpcAction', action: 'pause' },
              iframeRef.current.src
            );
          }
        });
      },
      { rootMargin: '0px' }
    );

    observer.observe(iframeRef.current);

    return () => {
      if (iframeRef.current) {
        observer.unobserve(iframeRef.current);
      }
    };
  }, [isPlaying]);

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

  return html`
    <div class="milo-video mpc-video-container ${className}" data-video-id="${videoId}">
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
  `;
};

export default MPCVideo;
