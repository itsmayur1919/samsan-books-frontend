import { CONFIG } from '../core/config.js';
import { getToken } from '../modules/auth/auth.service.js';

export async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
        if (response.status === 401) {
            console.error("Unauthorized. Token may be expired.");
            window.location.href = 'login.html';
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'API request failed');
    }
    
    return response.json();
}