/* constants.js */

/* ---------- Storage Keys ---------- */
export const AUTOPLAY_PLAYLIST_KEY='shouldAutoPlayPlaylist';
export const PLAYLIST_VIDEOS_KEY='playlistVideos';
export const PLAYLIST_PLAY_ALL_ID='playlist-play-all';
export const PLAYLIST_SKIP_TO_ID='playlist-skip-to';
export const TOAST_CONTAINER_ID='playlist-toasts-container';

/* ---------- Video / MPC ---------- */
export const MPC_STATUS='mpcStatus';
export const RESTART_THRESHOLD=30;
export const PROGRESS_SAVE_INTERVAL=5;
export const VIDEO_ORIGIN='https://video.tv.adobe.com';
// TODO: Re-enable when AEM playlist ID implementation is ready
// export const VIDEO_PLAYLIST_ID_URL_KEY='videoPlaylistId';

/* ---------- Event States ---------- */
export const EVENT_STATES=Object.freeze({
  LOAD:'load',
  PAUSE:'pause',
  TICK:'tick',
  COMPLETE:'complete',
});

/* ---------- Analytics ---------- */
export const ANALYTICS=Object.freeze({
  PLAYLIST:'Playlist',
  TOGGLE_OFF:'Play all_Off',
  TOGGLE_ON:'Play all_On',
  VIDEO_SELECT:'Video Select',
  FAVORITE:'Favorite',
  UNFAVORITE:'Unfavorite',
  CLOSE_FAVORITE_NOTIFICATION:'Close Favorite Notification',
  VIEW_SCHEDULE:'View Schedule',
});

/* ---------- Social Icons (inline SVG) ---------- */
export const SOCIAL_ICONS=Object.freeze({
  facebook:'<path d="M15 2.5C14.9774 1.84415 14.7067 1.22133 14.2427 0.757298C13.7787 0.29327 13.1558 0.0226174 12.5 0L2.5 0C1.84415 0.0226174 1.22133 0.29327 0.757298 0.757298C0.29327 1.22133 0.0226174 1.84415 0 2.5L0 12.5C0.0226174 13.1558 0.29327 13.7787 0.757298 14.2427C1.22133 14.7067 1.84415 14.9774 2.5 15H7.5V9.33333H5.66667V6.83333H7.5V5.85917C7.46729 5.0672 7.7415 4.29316 8.26546 3.6984C8.78943 3.10364 9.52273 2.73405 10.3125 2.66667H12.3333V5.16667H10.3125C10.0917 5.16667 9.83333 5.435 9.83333 5.83333V6.83333H12.3333V9.33333H9.83333V15H12.5C13.1558 14.9774 13.7787 14.7067 14.2427 14.2427C14.7067 13.7787 14.9774 13.1558 15 12.5V2.5Z" fill="currentColor"/>',
  twitter:'<path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor"/>',
  linkedin:'<path d="M4.35803 14.9983H1.25053V4.98415H4.35803V14.9983ZM2.80136 3.61832C2.44359 3.61996 2.09335 3.51548 1.79495 3.3181C1.49654 3.12071 1.26336 2.83928 1.12488 2.50938C0.986411 2.17948 0.948862 1.81593 1.01699 1.46469C1.08511 1.11346 1.25585 0.790304 1.50761 0.536094C1.75937 0.281884 2.08086 0.10803 2.43142 0.0365126C2.78198 -0.0350043 3.14588 -0.000972847 3.4771 0.134304C3.80832 0.269582 4.092 0.50003 4.29226 0.796514C4.49252 1.093 4.60038 1.4422 4.6022 1.79998C4.60287 2.27942 4.41392 2.73966 4.07655 3.08031C3.73918 3.42096 3.28078 3.61436 2.80136 3.61832ZM16.0005 14.9983H12.8939V10.1233C12.8939 8.96165 12.8705 7.47165 11.2772 7.47165C9.66053 7.47165 9.4122 8.73415 9.4122 10.04V14.9983H6.30637V4.98415H9.28886V6.34998H9.33386C9.63207 5.83935 10.0633 5.41921 10.5815 5.13435C11.0996 4.84949 11.6854 4.7106 12.2764 4.73248C15.4222 4.73332 16.0005 6.80582 16.0005 9.49831V14.9983Z" fill="currentColor"/>',
  copy:'<path d="M10.5976 0.67421C10.165 0.792718 9.7546 0.981031 9.38262 1.23172C9.23095 1.33588 8.43679 2.09673 7.61929 2.91423L6.13011 4.40839H6.69761C7.21674 4.39759 7.73367 4.47914 8.22427 4.64923L8.52678 4.74838L9.50512 3.77505C10.6868 2.60255 10.7859 2.54171 11.4951 2.54171C11.7445 2.51126 11.9973 2.55901 12.2184 2.67838C12.5529 2.85629 12.8237 3.13383 12.9934 3.47254C13.1068 3.68729 13.153 3.9312 13.1259 4.17254C13.1259 4.91504 13.1351 4.90089 11.1926 6.85755C10.2801 7.77422 9.42929 8.59671 9.29679 8.69087C8.98114 8.90526 8.60146 9.00486 8.22122 8.97301C7.84098 8.94116 7.48319 8.77979 7.20761 8.51588C7.15379 8.44707 7.0848 8.39164 7.00601 8.35391C6.92723 8.31618 6.8408 8.29719 6.75345 8.29839C6.42012 8.27006 6.31845 8.3267 5.78012 8.87004L5.33594 9.3192L5.51093 9.56004C5.8782 10.0146 6.34844 10.3752 6.88272 10.612C7.417 10.8488 7.99998 10.9549 8.58344 10.9217C9.26266 10.8834 9.91686 10.6521 10.4693 10.2551C10.8284 9.99505 14.2601 6.55338 14.4693 6.24171C14.7152 5.87067 14.8942 5.45946 14.9984 5.0267C15.1414 4.37234 15.1153 3.69235 14.9226 3.05087C14.7459 2.511 14.4439 2.02061 14.0414 1.61972C13.639 1.21883 13.1473 0.918832 12.6068 0.744223C11.9523 0.560287 11.2633 0.536267 10.5976 0.67421Z" fill="currentColor"/><path d="M6.15423 5.27963C5.70839 5.36722 5.28028 5.5286 4.88757 5.75713C4.10995 6.36787 3.38516 7.04304 2.7209 7.77546C1.70923 8.77546 0.796734 9.72297 0.693401 9.8788C0.417757 10.2795 0.219878 10.7284 0.110067 11.2021C-0.00751559 11.8325 0.0232978 12.4816 0.200067 13.098C0.374617 13.6386 0.674596 14.1302 1.07549 14.5327C1.47639 14.9352 1.96683 15.2371 2.50673 15.4138C3.14823 15.6064 3.8282 15.6325 4.48257 15.4896C4.94785 15.3767 5.38735 15.1762 5.77757 14.8988C5.9384 14.7805 6.7234 14.0288 7.52757 13.2205L8.99257 11.7505H8.42507C7.90593 11.7612 7.38901 11.6797 6.8984 11.5096L6.5959 11.4105L5.6259 12.378C4.43507 13.5546 4.3309 13.6213 3.6309 13.6213C3.39964 13.6419 3.16695 13.6029 2.95507 13.508C2.60866 13.3333 2.32462 13.0559 2.14173 12.7138C2.01821 12.4941 1.96855 12.2405 2.00007 11.9905C2.00007 11.2338 1.9859 11.258 3.9284 9.30546C4.84507 8.3888 5.7009 7.5663 5.8284 7.47213C6.14405 7.25774 6.52371 7.15816 6.90395 7.19001C7.28419 7.22186 7.64198 7.38323 7.91757 7.64714C7.97138 7.71594 8.04038 7.77138 8.11916 7.80911C8.19795 7.84684 8.28439 7.86584 8.37173 7.86464C8.70507 7.89297 8.80673 7.8363 9.34507 7.28797L9.78923 6.8388L9.5959 6.57881C9.13876 6.0323 8.53775 5.62469 7.8609 5.40214C7.30857 5.2329 6.72507 5.19101 6.15423 5.27963Z" fill="currentColor"/>',
});

/* ---------- Chimera API Config ---------- */
export const CHIMERA_API=Object.freeze({
  baseUrl:'https://chimera-api.adobe.com', // Hardcoded for now
  endpoints:Object.freeze({
    featuredCards:'/api/v1/featured-cards',
    sessions:'/api/v1/sessions',
  }),
});

export const CHIMERA_COLLECTION_DEFAULT_PARAMS=Object.freeze({
  contentSource:'Northstar',
  originSelection:'Northstar',
  language:'en',
  country:'US',
  environment:'prod',
});

export const TAG_COLLECTION_URL='/chimera-api/collection';
export const FEATURED_COLLECTION_URL='/chimera-api/collection';
export const ENTITY_LOOKUP_URL='https://14257-chidlookupservice.adobeio-static.net/api/v1/web/chidlookupservice-0.0.1/__id-lookup';

/* ---------- MOCK API (dev only) ---------- */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ONE_DAY_MS = 86400000;
const baseThumbnail = 'https://images-tv.adobe.com/mpcv3/b8f920e0-0298-4d82-9ec3-c17d4c9ceda9/38f837a1-0b27-4319-9a7c-2429d88e3058/61f09647c0884bc3840da53bd2c2ffc0_1742533829-200x113.jpg';

const makeWindow = () => {
  const now = Date.now();
  return {
    startDate: new Date(now - ONE_DAY_MS).toISOString(),
    endDate: new Date(now + ONE_DAY_MS).toISOString(),
  };
};

const makeCard = ({ id, mpcVideoId, videoId, sessionId, sessionCode, title, description, overlay }) => {
  const { startDate, endDate } = makeWindow();
  return {
    id: String(id),
    search: {
      thumbnailUrl: baseThumbnail,
      videoDuration: '00:51:53',
      mpcVideoId,
      videoId,
      videoService: 'mpc',
      sessionId,
      sessionCode,
    },
    contentArea: {
      title,
      description,
    },
    overlayLink: overlay,
    startDate,
    endDate,
  };
};

// Helper to extract values from arbitrary array format
// Arbitrary array contains objects like [{ "sessionId": "..." }, { "videoId": "..." }]
const extractFromArbitrary = (arbitrary, key) => {
  if (!Array.isArray(arbitrary)) return null;
  
  const entry = arbitrary.find(
    (item) => item && typeof item === 'object' && key in item
  );
  
  return entry ? entry[key] : null;
};

// Transform entity lookup/featured cards response to card format
const transformEntityCard = (item) => {
  const arbitrary = item.arbitrary || [];
  
  const search = {
    thumbnailUrl: extractFromArbitrary(arbitrary, 'thumbnailUrl') || item.thumbnail?.url || '',
    videoDuration: extractFromArbitrary(arbitrary, 'videoDuration') || item.cardData?.details || '',
    mpcVideoId: extractFromArbitrary(arbitrary, 'mpcVideoId') || '',
    videoId: extractFromArbitrary(arbitrary, 'videoId') || extractFromArbitrary(arbitrary, 'mpcVideoId') || '',
    videoService: extractFromArbitrary(arbitrary, 'videoService') || 'adobeTv',
    sessionId: extractFromArbitrary(arbitrary, 'sessionId') || '',
    sessionCode: extractFromArbitrary(arbitrary, 'sessionCode') || '',
    sessionTimeId: extractFromArbitrary(arbitrary, 'sessionTimeID') || '',
  };
  
  let contentUrl = item.cardData?.cta?.primaryCta?.url || item.url || '';
  
  // Convert relative URLs to absolute if needed
  if (contentUrl && !contentUrl.startsWith('http') && contentUrl.startsWith('/')) {
    contentUrl = `https://www.adobe.com${contentUrl}`;
  }
  
  const contentArea = {
    title: item.cardData?.headline || item.title || '',
    description: item.description || item.cardData?.description || extractFromArbitrary(arbitrary, 'sessionDescription') || '',
    url: contentUrl,
  };
  
  const overlayLink = contentUrl;
  
  return {
    id: item.entityId || item.contentId || '',
    search,
    contentArea,
    overlayLink,
  };
};

export const MOCK_API={
  /* Tag-based playlist */
  async getSessions(){
    await delay(100);
    try {
      // Load mock data from JSON file matching actual API response format
      const response = await fetch('/events/blocks/video-playlist/mock-chimera-response.json');
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Failed to load mock-chimera-response.json:', error);
      throw error;
    }
  },

  /* User-authored playlist - simulates entity lookup from sessionPath */
  async getUserAuthoredPlaylist(config){
    await delay(150);
    try {
      // Load mock entity lookup response (simulates ID lookup service)
      const response = await fetch('/events/blocks/video-playlist/mock-entity-lookup-response.json');
      if (response.ok) {
        const lookupData = await response.json();
        const paths = (config.sessionPath || '').split(',').map(s => s.trim()).filter(Boolean);
        const sessions = lookupData.slice(0, paths.length).map((item, i) => {
          const arbitrary = item.arbitrary || [];
          const sessionCode = extractFromArbitrary(arbitrary, 'sessionCode') || `S${6000 + i}`;
          const entityId = item.entityId || item.contentId || '';
          return {
            sessionCode,
            entityId,
            sessionPath: paths[i] || '',
          };
        });
        return {
          playlistID: config.playlistId || '123',
          playlistTitle: config.playlistTitle || 'Sample playlistTitle',
          topicEyebrow: config.topicEyebrow || 'Eyebrow text',
          sessions,
        };
      }
    } catch (error) {
      console.error('Failed to load mock-entity-lookup-response.json:', error);
      throw error;
    }
  },

  /* Chimera Featured Cards for user-authored - simulates featuredCards API call */
  async getChimeraFeaturedCards(entityIds){
    await delay(200);
    try {
      // Load mock featured cards response (simulates Chimera featuredCards API)
      const response = await fetch('/events/blocks/video-playlist/mock-featured-cards-response.json');
      if (response.ok) {
        const featuredData = await response.json();
        // Transform entity lookup format to card format
        const cards = featuredData
          .slice(0, entityIds.length)
          .map(transformEntityCard)
          .filter(card => card.search?.thumbnailUrl);
        return { cards };
      }
    } catch (error) {
      console.error('Failed to load mock-featured-cards-response.json:', error);
      throw error;
    }
  },

  async getFavorites(){
    await delay(50);
    const raw=localStorage.getItem('mockFavorites');
    const arr=raw?JSON.parse(raw):['sess_001','sess_003'];
    return {sessionInterests:arr.map(id=>({sessionID:id}))};
  },

  async toggleFavorite(sessionId){
    await delay(200);
    const key='mockFavorites';
    const raw=localStorage.getItem(key);
    const set=new Set(raw?JSON.parse(raw):['sess_001','sess_003']);
    set.has(sessionId)?set.delete(sessionId):set.add(sessionId);
    localStorage.setItem(key,JSON.stringify([...set]));
    return {success:true};
  },

  async isUserRegistered(){ await delay(100); return true; },
};
