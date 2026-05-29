/**
 * Sales Service
 * 
 * Handles sales-related API calls using the standardized API client.
 */

import { apiGet, apiPost, apiPut, apiDelete, APIError } from './api.js';

export async function getSales(params = {}) {
    try {
        return await apiGet('/sales', { showNotification: false });
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to fetch sales');
    }
}

export async function createSale(payload) {
    try {
        return await apiPost('/sales', payload);
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to create sale');
    }
}

export async function updateSale(id, payload) {
    try {
        return await apiPut(`/sales/${id}`, payload);
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to update sale');
    }
}

export async function deleteSale(id) {
    try {
        return await apiDelete(`/sales/${id}`);
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new Error('Failed to delete sale');
    }
}