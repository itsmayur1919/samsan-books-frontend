import { CONFIG } from '../../core/config.js';
import { state } from '../../core/state.js';


export async function signup(userData) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userData.email,
                password: userData.password,
                full_name: userData.fullName
            })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, message: data.detail || 'Signup failed' };
        }
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, message: 'Network error or server unavailable' };
    }
}

export async function login(credentials) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('ledger_token', data.access_token);
            localStorage.setItem('ledger_user_email', credentials.email);
            return { success: true, data };
        } else {
            return { success: false, message: data.detail || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error or server unavailable' };
    }
}

export async function logout() {
    const token = getToken();
    
    if (token) {
        try {
            // Directly call the backend with fetch to avoid circular import with api.js
            await fetch(`${CONFIG.API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (err) {
            console.warn('Logout API call failed, continuing with local cleanup:', err);
        }
    }

    // Clear local storage keys
    localStorage.removeItem('ledger_token');
    localStorage.removeItem('ledger_user_email');
    
    // Purge frontend state to prevent stale data
    state.purchases = [];
    state.sales = [];
    state.cash = [];
    
    // Redirect to login
    window.location.href = 'login.html';
}

export function isAuthenticated() {
    return !!localStorage.getItem('ledger_token');
}

export function getToken() {
    return localStorage.getItem('ledger_token');
}
