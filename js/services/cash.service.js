/**
 * Cash Service
 * 
 * Handles cash-related API calls using the standardized API client.
 */

import { apiGet, apiPost, apiDelete, APIError } from './api.js';

export async function getCashDashboard() {
    try {
        return await apiGet('/cash', { showNotification: false });
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to fetch cash data');
    }
}

export async function updateOpeningBalance(payload) {
    try {
        return await apiPost('/cash/opening', payload);
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to update opening balance');
    }
}

export async function addCashEntry(payload) {
    try {
        return await apiPost('/cash/entries', payload);
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to add cash entry');
    }
}

export async function clearCashEntries() {
    try {
        return await apiDelete('/cash/entries');
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to clear cash entries');
    }
}