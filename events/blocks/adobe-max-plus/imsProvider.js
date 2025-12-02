import { createContext } from '../../scripts/deps/preact/index.js';
import { useState, useEffect, useContext } from '../../scripts/deps/preact/hooks/index.js';
import html from '../../scripts/html.js';
import { LIBS } from '../../scripts/utils.js';

// Create the IMS context
const IMSContext = createContext(null);

/**
 * IMS Provider component that manages IMS profile data
 */
export function IMSProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadIMS() {
      const { loadIms } = await import(`${LIBS}/utils/utils.js`);
      await loadIms();

      if (window.adobeIMS.isSignedInUser()) {
        const profileData = await window.adobeIMS.getProfile();
        setProfile(profileData);
      } else {
        setProfile(null);
      }

      setLoading(false);
      setError(null);
    }
    loadIMS();
  }, []);

  const value = {
    profile,
    loading,
    error,
    isSignedIn: !!profile,
    signIn: () => window.adobeIMS?.signIn(),
    signOut: () => window.adobeIMS?.signOut(),
  };

  console.log('value', value);

  return html`
    <${IMSContext.Provider} value=${value}>
      ${children}
    <//>
  `;
}

/**
 * Hook to access IMS profile data
 * @returns {Object} IMS context with profile, loading, error, isSignedIn, signIn, signOut
 */
export function useIMS() {
  const context = useContext(IMSContext);
  
  if (context === null) {
    throw new Error('useIMS must be used within an IMSProvider');
  }
  
  return context;
}

