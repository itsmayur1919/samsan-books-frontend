/**
 * Reports Service
 * 
 * Handles reports-related API calls using the standardized API client.
 */

import { apiGet, APIError } from './api.js';

export const ReportService = {
    /**
     * Get Month Summary with combined Sales (Receivable) and Purchases (Payable) totals
     * @param {string} month - Optional month filter (e.g., 'Apr-2026')
     */
    async getMonthSummary(month = null) {
        try {
            const params = month ? `?month=${encodeURIComponent(month)}` : '';
            return await apiGet(`/reports/month-summary${params}`, { showNotification: false });
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            throw new Error('Failed to fetch month summary');
        }
    },

    /**
     * Get GST breakdown by month with CGST, SGST, IGST for Sales and Purchases
     * @param {string} month - Optional month filter (e.g., 'Apr-2026')
     */
    async getGSTByMonth(month = null) {
        try {
            const params = month ? `?month=${encodeURIComponent(month)}` : '';
            return await apiGet(`/reports/gst${params}`, { showNotification: false });
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            throw new Error('Failed to fetch GST data');
        }
    },

    /**
     * Get overall GST summary cards
     * @param {string} month - Optional month filter (e.g., 'Apr-2026')
     */
    async getGSTSummary(month = null) {
        try {
            const params = month ? `?month=${encodeURIComponent(month)}` : '';
            return await apiGet(`/reports/gst-summary${params}`, { showNotification: false });
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            throw new Error('Failed to fetch GST summary');
        }
    },

    /**
     * Get complete Reports dashboard with all sections
     * @param {string} month - Optional month filter (e.g., 'Apr-2026')
     */
    async getCompleteDashboard(month = null) {
        try {
            const params = month ? `?month=${encodeURIComponent(month)}` : '';
            return await apiGet(`/reports/dashboard${params}`, { showNotification: false });
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            throw new Error('Failed to fetch dashboard');
        }
    }
};