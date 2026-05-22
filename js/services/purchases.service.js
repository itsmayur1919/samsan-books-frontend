import { apiRequest } from './api.js';

export async function getPurchases(params = {}) {
    return apiRequest('/purchases');
}

export async function createPurchase(payload) {
    return apiRequest('/purchases', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export async function updatePurchase(id, payload) {
    return apiRequest(`/purchases/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export async function deletePurchase(id) {
    return apiRequest(`/purchases/${id}`, {
        method: 'DELETE'
    });
}