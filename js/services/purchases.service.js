/**
 * Purchases Service
 * 
 * Handles purchase-related API calls using the standardized API client.
 */

import { apiGet, apiPost, apiPut, apiDelete, APIError } from './api.js';

export async function getPurchases(params = {}) {
    try {
        return await apiGet('/purchases', { showNotification: false });
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to fetch purchases');
    }
}

export async function createPurchase(payload) {
    try {
        return await apiPost('/purchases', payload);
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to create purchase');
    }
}

export async function updatePurchase(id, payload) {
    try {
        return await apiPut(`/purchases/${id}`, payload);
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to update purchase');
    }
}

export async function deletePurchase(id) {
    try {
        return await apiDelete(`/purchases/${id}`);
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to delete purchase');
    }
}