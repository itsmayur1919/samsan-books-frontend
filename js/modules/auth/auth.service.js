/**
 * Authentication Service
 * 
 * Handles user authentication with the new standardized API client.
 * Uses proper form validation and error handling.
 */

import { CONFIG } from '../../core/config.js';
import { state } from '../../core/state.js';
import { apiPost, APIError } from '../../services/api.js';
import { validateForm } from '../../services/validation.js';

/**
 * Sign up a new user
 * @param {Object} userData - User data {email, password, fullName}
 * @returns {Promise<Object>} {success: boolean, data: userData or error message}
 */
export async function signup(userData) {
    try {
        // Validate form before sending
        const validation = validateForm({
            email: userData.email,
            password: userData.password,
            fullName: userData.fullName
        });

        if (!validation.valid) {
            return {
                success: false,
                errors: validation.errors,
                message: 'Please correct the highlighted fields'
            };
        }

        // Make API request
        const response = await apiPost('/auth/signup', {
            email: userData.email,
            password: userData.password,
            full_name: userData.fullName
        });

        return { success: true, data: response };
    } catch (error) {
        if (error instanceof APIError) {
            return {
                success: false,
                errors: error.errors,
                message: error.message
            };
        }
        return { success: false, message: 'An unexpected error occurred' };
    }
}

/**
 * Log in a user
 * @param {Object} credentials - Credentials {email, password}
 * @returns {Promise<Object>} {success: boolean, data: token or error message}
 */
export async function login(credentials) {
    try {
        // Validate form before sending
        const validation = validateForm({
            email: credentials.email,
            password: credentials.password
        });

        if (!validation.valid) {
            return {
                success: false,
                errors: validation.errors,
                message: 'Please correct the highlighted fields'
            };
        }

        // Make API request (but suppress auto notification since we want custom messages)
        const response = await apiPost(
            '/auth/login',
            {
                email: credentials.email,
                password: credentials.password
            },
            { showNotification: false }
        );

        if (response && response.access_token) {
            // Store token after successful login
            localStorage.setItem('ledger_token', response.access_token);
            localStorage.setItem('ledger_user_email', credentials.email);

            // Show success notification
            const { notifySuccess } = await import('../../services/notification-api.js');
            notifySuccess('Login successful. Welcome back!');

            return { success: true, data: response };
        }

        return { success: false, message: 'Login failed. Please try again.' };
    } catch (error) {
        if (error instanceof APIError) {
            return {
                success: false,
                errors: error.errors,
                message: error.message
            };
        }
        return { success: false, message: 'An unexpected error occurred' };
    }
}

/**
 * Log out the current user
 */
export async function logout() {
    const token = getToken();
    
    if (token) {
        try {
            // Call logout API with new client (suppress notification)
            await apiPost(
                '/auth/logout',
                {},
                { showNotification: false }
            );
        } catch (error) {
            console.warn('Logout API call failed, continuing with local cleanup:', error);
        }
    }

    // Clear local storage keys
    localStorage.removeItem('ledger_token');
    localStorage.removeItem('ledger_user_email');
    
    // Purge frontend state to prevent stale data
    state.purchases = [];
    state.sales = [];
    state.cash = [];

    // Show logout notification and redirect
    try {
        const { notifySuccess } = await import('../../services/notification-api.js');
        const id = notifySuccess('Logged out successfully');
        // Delay redirect briefly to show notification
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    } catch (e) {
        // Fallback if notification fails
        window.location.href = 'login.html';
    }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    return !!localStorage.getItem('ledger_token');
}

/**
 * Get current user's authentication token
 */
export function getToken() {
    return localStorage.getItem('ledger_token');
}

/**
 * Get current user's email
 */
export function getUserEmail() {
    return localStorage.getItem('ledger_user_email');
}

