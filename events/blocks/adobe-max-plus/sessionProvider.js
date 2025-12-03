import { createContext } from '../../scripts/deps/preact/index.js';
import { useState, useEffect, useContext } from '../../scripts/deps/preact/hooks/index.js';
import html from '../../scripts/html.js';
import sessionsData from './mock/sessions-data.json' with { type: 'json' };
import { useIMS } from './imsProvider.js';

// Create the Sessions context
const SessionsContext = createContext(null);

// const CHIMERA_ENDPOINT = "https://www.adobe.com/chimera-api/collection?originSelection=northstar&contentTypeTags=&secondSource=&secondaryTags=&collectionTags=&excludeContentWithTags=&language=en&country=us&complexQuery=%28%22caas%3Aevents%2Fmax%22%2BAND%2B%22caas%3Aevents%2Fsession-format%2Fonline%22%2BAND%2B%22caas%3Aevents%2Fyear%2F2025%22%29&excludeIds=&currentEntityId=&featuredCards=&environment=&draft=false&size=200&flatFile=false"

const STORAGE_KEY = 'adobe-max-plus-user-schedule';

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
            const timeA = a.sessionStartTime || '';
            const timeB = b.sessionStartTime || '';
            return timeA.localeCompare(timeB);
          });

          return {
            id: trackConfig.id,
            name: trackConfig.name,
            videoId: trackConfig.videoId,
            sessions: sortedSessions,
          };
        });

        // Check localStorage for existing schedule
        let mockSchedule = [];
        try {
          const savedSchedule = localStorage.getItem(STORAGE_KEY);
          if (savedSchedule) {
            const savedSessionIds = JSON.parse(savedSchedule);
            // Reconstruct full session objects from saved IDs
            mockSchedule = savedSessionIds
              .map((id) => allSessions.find((session) => session.id === id))
              .filter(Boolean) // Remove any sessions that no longer exist
              .sort((a, b) => {
                const timeA = a.sessionStartTime || '';
                const timeB = b.sessionStartTime || '';
                return timeA.localeCompare(timeB);
              });
            console.log('Loaded user schedule from localStorage:', mockSchedule.length, 'sessions');
          }
        } catch (storageError) {
          console.warn('Error reading from localStorage:', storageError);
        }

        // If no saved schedule, create a random mock schedule
        if (mockSchedule.length === 0) {
          const shuffled = [...allSessions].sort(() => 0.5 - Math.random());
          mockSchedule = shuffled.slice(0, 6).map((session) => session).sort((a, b) => {
            const timeA = a.sessionStartTime || '';
            const timeB = b.sessionStartTime || '';
            return timeA.localeCompare(timeB);
          });
          
          // Save the initial schedule to localStorage
          try {
            const scheduleIds = mockSchedule.map((session) => session.id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleIds));
            console.log('Created and saved new user schedule to localStorage');
          } catch (storageError) {
            console.warn('Error saving to localStorage:', storageError);
          }
        }

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

  // Update the user track whenever the schedule changes
  useEffect(() => {
    if (tracks.length > 0 && !loading) {
      const userName = profile?.first_name || "My";
      const updatedUserTrack = { 
        videoId: "3458790", 
        name: `${userName}'s sessions`, 
        sessions: userSchedule, 
        id: "user-sessions" 
      };
      
      // Update tracks with the new user schedule
      setTracks((prevTracks) => [updatedUserTrack, ...prevTracks.slice(1)]);
    }
  }, [userSchedule, loading, profile]);

  /**
   * Add a session to the user's schedule
   * @param {string} sessionId - The ID of the session to add
   */
  const addToSchedule = (sessionId) => {
    if (!isInSchedule(sessionId)) {
      const sessionToAdd = sessions.find((session) => session.id === sessionId);
      if (sessionToAdd) {
        const updatedSchedule = [...userSchedule, sessionToAdd].sort((a, b) => {
          const timeA = a.sessionStartTime || '';
          const timeB = b.sessionStartTime || '';
          return timeA.localeCompare(timeB);
        });
        setUserSchedule(updatedSchedule);
        
        // Save to localStorage
        try {
          const scheduleIds = updatedSchedule.map((session) => session.id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleIds));
          console.log('Session added to schedule and saved:', sessionId);
        } catch (storageError) {
          console.warn('Error saving to localStorage:', storageError);
        }
        // In the future, this would make an API call to save the schedule
      }
    }
  };

  /**
   * Remove a session from the user's schedule
   * @param {string} sessionId - The ID of the session to remove
   */
  const removeFromSchedule = (sessionId) => {
    const updatedSchedule = userSchedule.filter((session) => session.id !== sessionId);
    setUserSchedule(updatedSchedule);
    
    // Save to localStorage
    try {
      const scheduleIds = updatedSchedule.map((session) => session.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleIds));
      console.log('Session removed from schedule and saved:', sessionId);
    } catch (storageError) {
      console.warn('Error saving to localStorage:', storageError);
    }
    // In the future, this would make an API call to save the schedule
  };

  /**
   * Check if a session is in the user's schedule
   * @param {string} sessionId - The ID of the session to check
   * @returns {boolean} True if the session is in the schedule
   */
  const isInSchedule = (sessionId) => {
    return userSchedule.some((session) => session.id === sessionId);
  };

  /**
   * Get the full session objects for the user's schedule
   * @returns {Array} Array of session objects
   */
  const getScheduledSessions = () => {
    return userSchedule;
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

