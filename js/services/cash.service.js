import { apiRequest } from './api.js';

export async function getCashEntries() {
    return apiRequest('/cash');
}

export async function createCashEntry(payload) {
    return apiRequest('/cash', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}