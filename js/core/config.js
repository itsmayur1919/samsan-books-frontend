/**
 * Detect environment and set API URL accordingly
 * 
 * Environment Detection:
 * - If hostname is localhost/127.0.0.1 → Use http://localhost:8000/api/v1
 * - If hostname is samsanbook.netlify.app → Check for NETLIFY_API_URL env var
 * - Otherwise → Use provided backend URL
 */

// Check for manually set override (set via script tag in HTML if needed)
const manualBackendUrl = window.__API_URL__ || null;

// Auto-detect based on hostname
let API_BASE_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Local development - use localhost backend
    API_BASE_URL = manualBackendUrl || 'http://localhost:8000/api/v1';
} else if (window.location.hostname === 'samsanbook.netlify.app') {
    // Netlify production - pointing to LOCAL backend as requested
    API_BASE_URL = manualBackendUrl || 'http://localhost:8000/api/v1';
} else {
    // Other environments
    API_BASE_URL = manualBackendUrl || 'http://localhost:8000/api/v1';
}

console.log('[Config] Environment:', window.location.hostname);
console.log('[Config] Using API URL:', API_BASE_URL);

export const CONFIG = {
    API_BASE_URL: API_BASE_URL,
    STORAGE_KEY: 'ledger_studio_local',
    APP_NAME: 'Samsan Books'
};

/**
 * For local development with Netlify CLI:
 * Run: netlify dev
 * This proxies /api/* to localhost:8000 automatically
 * 
 * For production with deployed backend:
 * 1. Set VITE_API_URL in Netlify environment variables
 * 2. Or update config.js with your backend domain
 * 3. Ensure backend has CORS configured for samsanbook.netlify.app
 */