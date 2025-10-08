/* utils.js */
import { PLAYLIST_VIDEOS_KEY, AUTOPLAY_PLAYLIST_KEY, VIDEO_ORIGIN } from './constants.js';

/* --- Storage Helpers --- */

const safeLocalStorage = (key, defaultValue, parse = true) => {
    try {
        const item = localStorage.getItem(key);
        return item ? (parse ? JSON.parse(item) : item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
};

const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

export const getLocalStorageVideos = () => safeLocalStorage(PLAYLIST_VIDEOS_KEY, {});
export const saveLocalStorageVideos = (videos) => saveToLocalStorage(PLAYLIST_VIDEOS_KEY, videos);
export const getLocalStorageShouldAutoPlay = () => safeLocalStorage(AUTOPLAY_PLAYLIST_KEY, true);
export const saveShouldAutoPlayToLocalStorage = (shouldAutoPlay) => saveToLocalStorage(AUTOPLAY_PLAYLIST_KEY, shouldAutoPlay);

export const getCurrentPlaylistId = () => new URLSearchParams(window.location.search).get('playlistId');

const fetchVideoDuration = async (videoId) => {
    try {
        const response = await fetch(`${VIDEO_ORIGIN}/v/${videoId}?format=json-ld`);
        const data = await response.json();
        return convertIsoDurationToSeconds(data?.jsonLinkedData?.duration || '');
    } catch (error) {
        console.error(`Failed to fetch duration for ${videoId}:`, error);
        return null;
    }
};

export const saveCurrentVideoProgress = async (id, currentTime, length = null) => {
    const videos = getLocalStorageVideos();
    const existing = videos[id];

    if (existing) {
        videos[id] = {
            ...existing,
            secondsWatched: currentTime,
            completed: existing.completed || (length && currentTime >= length),
        };
    } else if (length) {
        videos[id] = { secondsWatched: currentTime, length };
    } else if (id) {
        const duration = await fetchVideoDuration(id);
        if (duration) videos[id] = { secondsWatched: currentTime, length: duration };
    }

    saveLocalStorageVideos(videos);
};

/* --- Time Conversion --- */

export const convertIsoDurationToSeconds = (isoDuration) => {
    const match = isoDuration.match(/P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/);
    if (!match) return 0;
    return (parseInt(match[4] || 0, 10) * 3600) + (parseInt(match[5] || 0, 10) * 60) + parseInt(match[6] || 0, 10);
};

/* --- Player Helpers --- */

export const findVideoIdFromIframeSrc = (src) => {
    const mpcMatch = src.match(/v\/(\d+)\?/);
    if (mpcMatch) return mpcMatch[1];
    const ytMatch = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    return ytMatch ? ytMatch[1] : null;
};

export const startVideoFromSecond = (container, seconds) => {
    container?.querySelector('iframe')?.contentWindow?.postMessage(
        { type: 'mpcAction', action: 'play', currentTime: Math.floor(seconds) },
        VIDEO_ORIGIN
    );
};
