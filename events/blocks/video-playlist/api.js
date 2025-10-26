/**
 * @file api.js
 * @desc API utilities for video playlist favorites
 * TODO: Replace mock implementation with real API once window.northstar is available
 */

export const ENDPOINTS = {
    GET_FAVORITES: 'myInterests',
    TOGGLE_FAVORITES: 'toggleSessionInterest',
};

// Mock favorites storage (simulating API)
let mockFavorites = ['sess_001', 'sess_003'];

export async function initAPI(endpoint, sessionTimeId = null, sessionId = null) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
        if (endpoint === ENDPOINTS.GET_FAVORITES) {
            // Return mock favorites data
            return {
                sessionInterests: mockFavorites.map(id => ({ sessionID: id })),
                responseCode: '0'
            };
        }
        
        if (endpoint === ENDPOINTS.TOGGLE_FAVORITES) {
            // Toggle favorite in mock storage
            const index = mockFavorites.indexOf(sessionId);
            if (index > -1) {
                mockFavorites.splice(index, 1); // Remove
            } else {
                mockFavorites.push(sessionId); // Add
            }
            
            return {
                success: true,
                responseCode: '0'
            };
        }
        
        throw new Error(`Unknown endpoint: ${endpoint}`);
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}
