// Detect environment and set API URL accordingly
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isDevelopment 
    ? 'http://localhost:8000/api/v1'
    : 'https://your-backend-api.com/api/v1';  // Update with your production backend URL

export const CONFIG = {
    API_BASE_URL: API_BASE_URL,
    STORAGE_KEY: 'ledger_studio_local',
    APP_NAME: 'Samsan Books'
};