/* utils.js */
import { PLAYLIST_VIDEOS_KEY, AUTOPLAY_PLAYLIST_KEY, VIDEO_ORIGIN } from './constants.js';

/* ---------- localStorage ---------- */
const readJSON = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`localStorage read error for key "${key}":`, error);
    return defaultValue;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`localStorage write error for key "${key}":`, error);
  }
};

export const getLocalStorageVideos=()=>readJSON(PLAYLIST_VIDEOS_KEY,{});
export const saveLocalStorageVideos=(videos)=>writeJSON(PLAYLIST_VIDEOS_KEY,videos);
export const getLocalStorageShouldAutoPlay=()=>readJSON(AUTOPLAY_PLAYLIST_KEY,true);
export const saveShouldAutoPlayToLocalStorage=(v)=>writeJSON(AUTOPLAY_PLAYLIST_KEY,v);

/* ---------- Duration fetching (memoized) ---------- */
const durationCache=new Map(); // id -> seconds
const inflight=new Map(); // id -> Promise<number|null>

const fetchVideoDuration = async (id) => {
  // Return cached duration if available
  if (durationCache.has(id)) {
    return durationCache.get(id);
  }
  
  // Return existing promise if already fetching
  if (inflight.has(id)) {
    return inflight.get(id);
  }
  
  // Create new fetch promise
  const fetchPromise = (async () => {
    try {
      const response = await fetch(`${VIDEO_ORIGIN}/v/${id}?format=json-ld`);
      const json = await response.json();
      const seconds = convertIsoDurationToSeconds(
        json?.jsonLinkedData?.duration || ''
      ) || null;
      
      // Cache the result if valid
      if (seconds != null) {
        durationCache.set(id, seconds);
      }
      
      return seconds;
    } catch (error) {
      console.error(`Failed to fetch video duration for ID "${id}":`, error);
      return null;
    } finally {
      // Clean up inflight tracking
      inflight.delete(id);
    }
  })();
  
  // Track the inflight request
  inflight.set(id, fetchPromise);
  return fetchPromise;
};

export const saveCurrentVideoProgress = async (id, currentTime, length = null) => {
  if (!id && id !== 0) return;
  
  const videos = getLocalStorageVideos();
  const previousVideo = videos[id];

  if (previousVideo) {
    // Update existing video progress
    const completed = previousVideo.completed || Boolean(
      length && currentTime >= length
    );
    videos[id] = {
      ...previousVideo,
      secondsWatched: currentTime,
      completed,
    };
  } else {
    // Create new video entry
    const videoLength = length ?? await fetchVideoDuration(id);
    if (videoLength != null) {
      videos[id] = {
        secondsWatched: currentTime,
        length: videoLength,
      };
    }
  }
  
  saveLocalStorageVideos(videos);
};

/* ---------- Time ---------- */
export const convertIsoDurationToSeconds = (iso) => {
  if (!iso || typeof iso !== 'string') return 0;
  
  // Match ISO 8601 duration format: P[nY][nM][nD][T[nH][nM][nS]]
  const match = iso.match(/P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/);
  if (!match) return 0;
  
  // Extract hours, minutes, and seconds from match groups
  const hours = parseInt(match[4] || 0, 10);
  const minutes = parseInt(match[5] || 0, 10);
  const seconds = parseInt(match[6] || 0, 10);
  
  return hours * 3600 + minutes * 60 + seconds;
};

/* ---------- Player helpers ---------- */
export const findVideoIdFromIframeSrc = (src = '') => {
  if (!src) return null;
  
  // MPC: https://video.tv.adobe.com/v/12345?...  -> 12345
  const mpcMatch = src.match(/\/v\/(\d+)\b/);
  if (mpcMatch) return mpcMatch[1];
  
  // YouTube embed/nocookie: youtube.com/embed/VIDEO_ID
  const youtubeEmbedMatch = src.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (youtubeEmbedMatch) return youtubeEmbedMatch[1];
  
  // Fallback: v= param on YouTube watch URLs
  const youtubeParamMatch = src.match(/[?&#]v=([a-zA-Z0-9_-]{11})/);
  return youtubeParamMatch ? youtubeParamMatch[1] : null;
};

export const startVideoFromSecond = (container, seconds = 0) => {
  const iframe = container?.querySelector('iframe');
  const iframeWindow = iframe?.contentWindow;
  
  if (!iframeWindow || Number.isNaN(seconds)) return;
  
  iframeWindow.postMessage(
    {
      type: 'mpcAction',
      action: 'play',
      currentTime: Math.floor(seconds),
    },
    VIDEO_ORIGIN
  );
};
