/**
 * Standardized API Client
 * 
 * Handles all HTTP requests with:
 * - Proper status code handling
 * - Automatic error notifications
 * - Token management
 * - Consistent response format wrapping
 */

import { CONFIG } from '../core/config.js';
import { getToken } from '../modules/auth/auth.service.js';
import { notifySuccess, notifyError } from './notification-api.js';

// HTTP Status Messages
const STATUS_MESSAGES = {
    200: "Operation completed successfully",
    201: "Record created successfully",
    204: "Record deleted successfully",
    400: "Please verify the submitted information",
    401: "Your session has expired. Please login again",
    403: "You do not have permission to perform this action",
    404: "Requested resource not found",
    409: "Record already exists",
    422: "Please correct the highlighted fields",
    500: "Something went wrong. Please try again later",
    503: "Service is temporarily unavailable"
};

/**
 * Custom API Error Class
 */
export class APIError extends Error {
    constructor(status, message, errors = null, data = null) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors; // Field-level errors (for 422)
        this.data = data; // Original error data from server
    }
}

/**
 * Core API request function
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} options.body - Request body (will be JSON stringified)
 * @param {Object} options.headers - Additional headers
 * @param {boolean} options.showNotification - Whether to show notifications (default: true)
 * @returns {Promise<Object>} API response data
 * @throws {APIError} If request fails
 */
export async function apiRequest(endpoint, options = {}) {
    const {
        method = 'GET',
        body = null,
        headers = {},
        showNotification = true
    } = options;

    const token = getToken();
    const requestHeaders = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...headers
    };

    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
    
    try {
        let fetchOptions = {
            method,
            headers: requestHeaders,
            signal: controller.signal
        };

        if (body && method !== 'GET') {
            fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);
        
        // Try to parse response
        let responseData = null;
        try {
            const text = await response.text();
            if (text) {
                responseData = JSON.parse(text);
            }
        } catch (e) {
            // Response is not JSON or empty
            responseData = null;
        }

        // Handle 204 No Content
        if (response.status === 204) {
            if (showNotification) {
                notifySuccess(STATUS_MESSAGES[204]);
            }
            return { success: true };
        }

        // Handle success responses
        if (response.ok) {
            if (showNotification && responseData?.message) {
                notifySuccess(responseData.message);
            }
            return responseData?.data || responseData;
        }

        // Handle error responses
        handleErrorResponse(response.status, responseData, showNotification);

    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            const errorMsg = 'Request timed out. Please check your connection and try again.';
            if (showNotification) {
                notifyError(errorMsg);
            }
            throw new APIError(408, errorMsg);
        }
        
        // Network or other error
        const errorMsg = error.message || 'An unexpected error occurred. Please try again.';
        if (showNotification) {
            notifyError(errorMsg);
        }
        throw new APIError(0, errorMsg);
    }
}

/**
 * Handle error responses from the server
 * @private
 */
function handleErrorResponse(status, responseData, showNotification) {
    let message = STATUS_MESSAGES[status] || 'An error occurred';
    let errors = null;

    // If server sent error response, use its message
    if (responseData?.message) {
        message = responseData.message;
    }

    // Extract field-level errors for 422 responses
    if (status === 422 && responseData?.errors) {
        errors = responseData.errors;
    }

    // Handle 401 - redirect to login
    if (status === 401) {
        // Clear token and redirect
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }

    if (showNotification) {
        notifyError(message);
    }

    throw new APIError(status, message, errors, responseData);
}

/**
 * Convenience methods for different HTTP verbs
 */

export async function apiGet(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'GET' });
}

export async function apiPost(endpoint, body = null, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'POST', body });
}

export async function apiPut(endpoint, body = null, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'PUT', body });
}

export async function apiDelete(endpoint, options = {}) {
    return apiRequest(endpoint, { ...options, method: 'DELETE' });
}

