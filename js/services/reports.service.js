import { CONFIG } from '../core/config.js';
import { getToken } from '../modules/auth/auth.service.js';

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
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'API request failed');
    }
    return response.json();
}

export const ReportService = {
    /**
     * Get Month Summary with combined Sales (Receivable) and Purchases (Payable) totals
     * @param {string} month - Optional month filter (e.g., 'Apr-2026')
     */
    async getMonthSummary(month = null) {
        const url = new URL(`${CONFIG.API_BASE_URL}/reports/month-summary`);
        if (month) {
            url.searchParams.append('month', month);
        }
        return authFetch(url.toString());
    },

    /**
     * Get GST breakdown by month with CGST, SGST, IGST for Sales and Purchases
     * @param {string} month - Optional month filter (e.g., 'Apr-2026')
     */
    async getGSTByMonth(month = null) {
        const url = new URL(`${CONFIG.API_BASE_URL}/reports/gst`);
        if (month) {
            url.searchParams.append('month', month);
        }
        return authFetch(url.toString());
    },

    /**
     * Get overall GST summary cards
     * @param {string} month - Optional month filter (e.g., 'Apr-2026')
     */
    async getGSTSummary(month = null) {
        const url = new URL(`${CONFIG.API_BASE_URL}/reports/gst-summary`);
        if (month) {
            url.searchParams.append('month', month);
        }
        return authFetch(url.toString());
    },

    /**
     * Get complete Reports dashboard with all sections
     * @param {string} month - Optional month filter (e.g., 'Apr-2026')
     */
    async getCompleteDashboard(month = null) {
        const url = new URL(`${CONFIG.API_BASE_URL}/reports/dashboard`);
        if (month) {
            url.searchParams.append('month', month);
        }
        return authFetch(url.toString());
    }
};