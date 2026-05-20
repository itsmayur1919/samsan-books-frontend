import { apiRequest } from './api.js';

export async function getSales(params = {}) {
    return apiRequest('/sales');
}

export async function createSale(payload) {
    return apiRequest('/sales', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export async function updateSale(id, payload) {
    return apiRequest(`/sales/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
}

export async function deleteSale(id) {
    return apiRequest(`/sales/${id}`, {
        method: 'DELETE'
    });
}