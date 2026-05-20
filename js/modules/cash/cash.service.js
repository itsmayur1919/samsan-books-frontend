import { CONFIG } from '../../core/config.js';
import { getToken } from '../auth/auth.service.js';

async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        if (response.status === 401) {
            console.error("Unauthorized. Token may be expired.");
            // Handle redirect to login if necessary
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'API request failed');
    }
    return response.json();
}

export const CashService = {
    async getDashboardData() {
        return authFetch(`${CONFIG.API_BASE_URL}/cash/`);
    },

    async updateOpeningBalance(opening_balance) {
        return authFetch(`${CONFIG.API_BASE_URL}/cash/opening`, {
            method: 'POST',
            body: JSON.stringify({ opening_balance: parseFloat(opening_balance) || 0 })
        });
    },

    async addEntry(entryData) {
        return authFetch(`${CONFIG.API_BASE_URL}/cash/entries`, {
            method: 'POST',
            body: JSON.stringify({
                date: entryData.date,
                description: entryData.description,
                cash_in: parseFloat(entryData.cash_in) || 0,
                cash_out: parseFloat(entryData.cash_out) || 0
            })
        });
    },

    async clearAllEntries() {
        return authFetch(`${CONFIG.API_BASE_URL}/cash/entries`, {
            method: 'DELETE'
        });
    }
};
