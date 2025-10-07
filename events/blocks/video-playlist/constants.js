/* constants.js */

export const AUTOPLAY_PLAYLIST_KEY = 'shouldAutoPlayPlaylist';
export const PLAYLIST_VIDEOS_KEY = 'playlistVideos';
export const PLAYLIST_PLAY_ALL_ID = 'playlist-play-all';
export const MPC_STATUS = 'mpcStatus';
export const RESTART_THRESHOLD = 30; // Increased threshold for better user experience
export const PROGRESS_SAVE_INTERVAL = 5;
export const VIDEO_ORIGIN = 'https://video.tv.adobe.com';
export const VIDEO_PLAYLIST_ID_URL_KEY = 'videoPlaylistId';
export const TOAST_CONTAINER_ID = 'playlist-toasts-container';
export const PLAYLIST_SKIP_TO_ID = 'playlist-skip-to';

export const EVENT_STATES = {
    LOAD: 'load',
    PAUSE: 'pause',
    TICK: 'tick',
    COMPLETE: 'complete',
};

export const ANALYTICS = {
    PLAYLIST: 'Playlist',
    TOGGLE_OFF: 'Play all_Off',
    TOGGLE_ON: 'Play all_On',
    VIDEO_SELECT: 'Video Select',
    FAVORITE: 'Favorite',
    UNFAVORITE: 'Unfavorite',
    CLOSE_FAVORITE_NOTIFICATION: 'Close Favorite Notification',
    VIEW_SCHEDULE: 'View Schedule',
    PLAYLIST_SKIP_TO_ID: 'playlist-skip-to',
};

export const MOCK_API = {
    // Mock data simplified for cleaner constants file
    getSessions: async (playlistId = null, entityIds = null) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        const mockSessions = [
            { id: "1tmt6y1", search: { mpcVideoId: '3449120', videoId: 'yt_001', videoService: 'mpc', sessionId: 'sess_001', thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg', videoDuration: '00:51:53', sessionCode: 'S744', }, contentArea: { title: 'Unlocking Modern Marketing\'s Potential', description: 'Discover Choreo, a transformative framework.' }, overlayLink: 'https://business.adobe.com/summit/2025/sessions/s744.html', endDate: new Date(Date.now() + 86400000).toISOString(), startDate: new Date(Date.now() - 86400000).toISOString() },
            { id: "2tmt6y2", search: { mpcVideoId: '5-bUvwi2L-E', videoId: 'yt_002', videoService: 'mpc', sessionId: 'sess_002', thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg', videoDuration: '00:51:53', sessionCode: 'S745', }, contentArea: { title: 'Pitch Perfect', description: 'Secure funding and resources.' }, overlayLink: 'https://business.adobe.com/summit/2025/sessions/s745.html', endDate: new Date(Date.now() + 86400000).toISOString(), startDate: new Date(Date.now() - 86400000).toISOString() },
            { id: "3tmt6y3", search: { mpcVideoId: '3424768', videoId: 'yt_003', videoService: 'mpc', sessionId: 'sess_003', thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg', videoDuration: '00:51:53', sessionCode: 'S746', }, contentArea: { title: 'The Future of Adobe Workfront', description: 'Transforming project management.' }, overlayLink: 'https://business.adobe.com/summit/2025/sessions/s746.html', endDate: new Date(Date.now() + 86400000).toISOString(), startDate: new Date(Date.now() - 86400000).toISOString() },
            { id: "4tmt6y4", search: { mpcVideoId: '3442589', videoId: 'yt_004', videoService: 'mpc', sessionId: 'sess_004', thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg', videoDuration: '00:51:53', sessionCode: 'S747', }, contentArea: { title: 'Maximize Martech Investments', description: 'Learn best practices on bridging IT and marketing.' }, overlayLink: 'https://business.adobe.com/summit/2025/sessions/s747.html', endDate: new Date(Date.now() + 86400000).toISOString(), startDate: new Date(Date.now() - 86400000).toISOString() },
            { id: "4tmt6y4", search: { mpcVideoId: '3442589', videoId: 'yt_004', videoService: 'mpc', sessionId: 'sess_004', thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg', videoDuration: '00:51:53', sessionCode: 'S747', }, contentArea: { title: 'Maximize Martech Investments', description: 'Learn best practices on bridging IT and marketing.' }, overlayLink: 'https://business.adobe.com/summit/2025/sessions/s747.html', endDate: new Date(Date.now() + 86400000).toISOString(), startDate: new Date(Date.now() - 86400000).toISOString() },
            { id: "4tmt6y4", search: { mpcVideoId: '3442589', videoId: 'yt_004', videoService: 'mpc', sessionId: 'sess_004', thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg', videoDuration: '00:51:53', sessionCode: 'S747', }, contentArea: { title: 'Maximize Martech Investments', description: 'Learn best practices on bridging IT and marketing.' }, overlayLink: 'https://business.adobe.com/summit/2025/sessions/s747.html', endDate: new Date(Date.now() + 86400000).toISOString(), startDate: new Date(Date.now() - 86400000).toISOString() },
            { id: "4tmt6y4", search: { mpcVideoId: '3442589', videoId: 'yt_004', videoService: 'mpc', sessionId: 'sess_004', thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg', videoDuration: '00:51:53', sessionCode: 'S747', }, contentArea: { title: 'Maximize Martech Investments', description: 'Learn best practices on bridging IT and marketing.' }, overlayLink: 'https://business.adobe.com/summit/2025/sessions/s747.html', endDate: new Date(Date.now() + 86400000).toISOString(), startDate: new Date(Date.now() - 86400000).toISOString() },
            { id: "4tmt6y4", search: { mpcVideoId: '3442589', videoId: 'yt_004', videoService: 'mpc', sessionId: 'sess_004', thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg', videoDuration: '00:51:53', sessionCode: 'S747', }, contentArea: { title: 'Maximize Martech Investments', description: 'Learn best practices on bridging IT and marketing.' }, overlayLink: 'https://business.adobe.com/summit/2025/sessions/s747.html', endDate: new Date(Date.now() + 86400000).toISOString(), startDate: new Date(Date.now() - 86400000).toISOString() },
            { id: "4tmt6y4", search: { mpcVideoId: '3442589', videoId: 'yt_004', videoService: 'mpc', sessionId: 'sess_004', thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg', videoDuration: '00:51:53', sessionCode: 'S747', }, contentArea: { title: 'Maximize Martech Investments', description: 'Learn best practices on bridging IT and marketing.' }, overlayLink: 'https://business.adobe.com/summit/2025/sessions/s747.html', endDate: new Date(Date.now() + 86400000).toISOString(), startDate: new Date(Date.now() - 86400000).toISOString() },
            { id: "4tmt6y4", search: { mpcVideoId: '3424767', videoId: 'yt_004', videoService: 'mpc', sessionId: 'sess_004', thumbnailUrl: 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg', videoDuration: '00:51:53', sessionCode: 'S747', }, contentArea: { title: 'Maximize Martech Investments', description: 'Learn best practices on bridging IT and marketing.' }, overlayLink: 'https://business.adobe.com/summit/2025/sessions/s747.html', endDate: new Date(Date.now() + 86400000).toISOString(), startDate: new Date(Date.now() - 86400000).toISOString() },
        ];
        return { cards: mockSessions.map(c => ({ ...c, endDate: c.endDate })) }; // Add endDate back
    },
    getFavorites: async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return { sessionInterests: [{ sessionID: 'sess_001' }, { sessionID: 'sess_003' }] };
    },
    toggleFavorite: async (sessionId) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { success: true };
    },
    isUserRegistered: async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
    },
};
