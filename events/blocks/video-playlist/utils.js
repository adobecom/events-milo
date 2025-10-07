/* utils.js (Includes Storage and Time Helpers) */
import {
    PLAYLIST_VIDEOS_KEY,
    AUTOPLAY_PLAYLIST_KEY,
    VIDEO_ORIGIN
} from './constants.js'; // Assuming constants.js is in the same directory

/* --- Storage Helpers --- */

export const getLocalStorageVideos = () => {
    try {
        return JSON.parse(localStorage.getItem(PLAYLIST_VIDEOS_KEY)) || {};
    } catch (error) {
        console.error('Error parsing videos from local storage:', error);
        return {};
    }
};

export const saveLocalStorageVideos = (videos) => {
    try {
        localStorage.setItem(PLAYLIST_VIDEOS_KEY, JSON.stringify(videos));
    } catch (error) {
        console.error('Error saving videos to local storage:', error);
    }
};

const fetchVideoDuration = async (videoId) => {
    try {
        const url = new URL(`${VIDEO_ORIGIN}/v/${videoId}?format=json-ld`);
        const response = await fetch(url);
        const data = await response.json();
        const durationIso = data?.jsonLinkedData?.duration;
        return durationIso ? convertIsoDurationToSeconds(durationIso) : null;
    } catch (error) {
        console.error(`Failed to fetch duration for ${videoId}:`, error);
        return null;
    }
};

export const saveCurrentVideoProgress = async (id, currentTime, length = null) => {
    const localStorageVideos = getLocalStorageVideos();
    const currentSessionData = localStorageVideos[id];

    if (currentSessionData) {
        localStorageVideos[id] = {
            ...currentSessionData,
            secondsWatched: currentTime,
            completed: currentSessionData.completed || (length && currentTime >= length),
        };
        saveLocalStorageVideos(localStorageVideos);
    } else if (length) {
        localStorageVideos[id] = { secondsWatched: currentTime, length };
        saveLocalStorageVideos(localStorageVideos);
    } else if (id && !length) {
        const seconds = await fetchVideoDuration(id);
        if (seconds) {
            localStorageVideos[id] = { secondsWatched: currentTime, length: seconds };
            saveLocalStorageVideos(localStorageVideos);
        }
    }
};

export const getLocalStorageShouldAutoPlay = () => {
    try {
        return JSON.parse(localStorage.getItem(AUTOPLAY_PLAYLIST_KEY)) ?? true;
    } catch (error) {
        console.error('Error parsing autoplay flag:', error);
        return true;
    }
};

export const saveShouldAutoPlayToLocalStorage = (shouldAutoPlayPlaylist) => {
    try {
        localStorage.setItem(AUTOPLAY_PLAYLIST_KEY, JSON.stringify(shouldAutoPlayPlaylist));
    } catch (error) {
        console.error('Error saving autoplay flag:', error);
    }
};

export const getCurrentPlaylistId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('playlistId');
};

/* --- Time Conversion Operations --- */

/**
 * Converts an ISO 8601 duration string (e.g., 'PT51M53S') to total seconds.
 * Note: Only supports T (Time) components (H, M, S).
 * @param {string} isoDuration
 * @returns {number}
 */
export function convertIsoDurationToSeconds(isoDuration) {
    const pattern = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
    const match = isoDuration.match(pattern);

    if (!match) return 0;

    const hours = parseInt(match[4] || 0, 10);
    const minutes = parseInt(match[5] || 0, 10);
    const seconds = parseInt(match[6] || 0, 10);

    return (hours * 3600 + minutes * 60 + seconds);
}

/* --- Player & DOM Helpers --- */

export function findVideoIdFromIframeSrc(iframeSrc) {
  const patterns = {
      mpc: /v\/(\d+)\?/,
      youtube: /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  };
  const mpcMatch = iframeSrc.match(patterns.mpc);
  if (mpcMatch) return mpcMatch[1];

  const youtubeMatch = iframeSrc.match(patterns.youtube);
  return youtubeMatch ? youtubeMatch[1] : null;
}

export function startVideoFromSecond(videoContainer, seconds) {
  const iframe = videoContainer.querySelector('iframe');
  // Ensure seconds is an integer for cleaner API call
  const startSeconds = Math.floor(seconds); 
  iframe?.contentWindow?.postMessage(
      { type: 'mpcAction', action: 'play', currentTime: startSeconds },
      VIDEO_ORIGIN,
  );
}
