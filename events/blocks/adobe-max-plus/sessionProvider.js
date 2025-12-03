import { createContext } from '../../scripts/deps/preact/index.js';
import { useState, useEffect, useContext } from '../../scripts/deps/preact/hooks/index.js';
import html from '../../scripts/html.js';
import sessionsData from './mock/sessions-data.json' with { type: 'json' };
import { useIMS } from './imsProvider.js';

// Create the Sessions context
const SessionsContext = createContext(null);

// const CHIMERA_ENDPOINT = "https://www.adobe.com/chimera-api/collection?originSelection=northstar&contentTypeTags=&secondSource=&secondaryTags=&collectionTags=&excludeContentWithTags=&language=en&country=us&complexQuery=%28%22caas%3Aevents%2Fmax%22%2BAND%2B%22caas%3Aevents%2Fsession-format%2Fonline%22%2BAND%2B%22caas%3Aevents%2Fyear%2F2025%22%29&excludeIds=&currentEntityId=&featuredCards=&environment=&draft=false&size=200&flatFile=false"

const TRACKS_CONFIG = [
  { id: 'caas:events/max/primary-track/live-broadcast', name: 'Mainstage', videoId: '3458791' },
  { id: 'caas:events/max/category/generative-ai', name: 'Generative AI', videoId: '3458792' },
  { id: 'caas:events/max/track/creator', name: 'Creator', videoId: '3458793' },
  { id: 'caas:events/max/track/graphic-design-and-illustration', name: 'Design & Illustration', videoId: '3458794' },
  { id: 'caas:events/max/track/video-audio-and-motion', name: 'Video', videoId: '3458795' },
  { id: 'caas:events/max/track/photography', name: 'Photography', videoId: '3458796' },
  { id: 'caas:events/max/track/social-media-and-marketing', name: 'Social Media', videoId: '3458797' },
  { id: 'caas:events/max/track/branding', name: 'Branding', videoId: '3458798' },
];
/**
 * Sessions Provider component that manages session data and user schedule
 */
export function SessionsProvider({ children }) {
  const { profile } = useIMS();
  const [sessions, setSessions] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [userSchedule, setUserSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        // In the future, this would be:
        // const response = await fetch(CHIMERA_ENDPOINT);
        // const data = await response.json();
        
        // For now, use mocked data
        const data = await Promise.resolve(sessionsData);
        
        console.log('Sessions data loaded:', data);
        const allSessions = data.cards || [];
        setSessions(allSessions);

        // Build tracks with matched sessions
        const builtTracks = TRACKS_CONFIG.map((trackConfig) => {
          // Find all sessions that have this track's id in their tags
          const matchedSessions = allSessions.filter((session) => {
            return session.tags?.some((tag) => tag.tagId === trackConfig.id);
          });

          // Sort sessions by sessionStartTime
          const sortedSessions = matchedSessions.sort((a, b) => {
            const timeA = a.search?.sessionStartTime || '';
            const timeB = b.search?.sessionStartTime || '';
            return timeA.localeCompare(timeB);
          });

          return {
            id: trackConfig.id,
            name: trackConfig.name,
            videoId: trackConfig.videoId,
            sessions: sortedSessions,
          };
        });

        
        // Mock user schedule with random sessions from sessions data
        // In the future, this would come from a user schedule API
        const shuffled = [...allSessions].sort(() => 0.5 - Math.random());
        const mockSchedule = shuffled.slice(0, 6).map((session) => session);

        // Create user track with profile name or fallback
        const userName = profile?.first_name || "My";
        const userTrack = { 
          videoId: "3458790", 
          name: `${userName}'s sessions`, 
          sessions: mockSchedule, 
          id: "user-sessions" 
        };

        setTracks([userTrack, ...builtTracks]);
        setUserSchedule(mockSchedule);

        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error loading Sessions data:', err);
        setError(err);
        setSessions([]);
        setTracks([]);
        setUserSchedule([]);
        setLoading(false);
      }
    }
    
    loadSessions();
  }, [profile]);

  /**
   * Add a session to the user's schedule
   * @param {string} sessionId - The ID of the session to add
   */
  const addToSchedule = (sessionId) => {
    if (!userSchedule.includes(sessionId)) {
      setUserSchedule([...userSchedule, sessionId]);
      console.log('Session added to schedule:', sessionId);
      // In the future, this would make an API call to save the schedule
    }
  };

  /**
   * Remove a session from the user's schedule
   * @param {string} sessionId - The ID of the session to remove
   */
  const removeFromSchedule = (sessionId) => {
    setUserSchedule(userSchedule.filter((id) => id !== sessionId));
    console.log('Session removed from schedule:', sessionId);
    // In the future, this would make an API call to save the schedule
  };

  /**
   * Check if a session is in the user's schedule
   * @param {string} sessionId - The ID of the session to check
   * @returns {boolean} True if the session is in the schedule
   */
  const isInSchedule = (sessionId) => {
    return userSchedule.includes(sessionId);
  };

  /**
   * Get the full session objects for the user's schedule
   * @returns {Array} Array of session objects
   */
  const getScheduledSessions = () => {
    return sessions.filter((session) => userSchedule.includes(session.id));
  };

  const value = {
    sessions,
    tracks,
    userSchedule,
    loading,
    error,
    addToSchedule,
    removeFromSchedule,
    isInSchedule,
    getScheduledSessions,
  };

  return html`
    <${SessionsContext.Provider} value=${value}>
      ${children}
    </${SessionsContext.Provider}>
  `;
}

/**
 * Hook to access Sessions session data and user schedule
 * @returns {Object} Sessions context with sessions, schedule, and related methods
 */
export function useSessions() {
  const context = useContext(SessionsContext);
  
  if (context === null) {
    throw new Error('useSessions must be used within a SessionsProvider');
  }
  
  return context;
}

