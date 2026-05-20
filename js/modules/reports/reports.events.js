import { state } from '../../core/state.js';
import { ReportService } from '../../services/reports.service.js';
import { renderReportsUI } from './reports.ui.js';
import { formatCurrency } from '../../utils/helpers.js';

/**
 * Initialize Reports module
 * Load report data from backend and render UI
 */
export async function initializeReports() {
    try {
        // Load initial report data from backend
        await refreshReportsData();
    } catch (err) {
        console.error("Failed to initialize reports:", err);
        renderErrorState(err.message);
    }

    // Setup event listeners for filters and refresh
    setupReportsEventListeners();
}

/**
 * Refresh reports data from backend
 * Called on module load and after Purchase/Sale changes
 * @param {string|null} month - Optional month filter (e.g., 'Apr-2026')
 */
export async function refreshReportsData(month = null) {
    try {
        showLoadingState();

        const data = await ReportService.getCompleteDashboard(month);

        state.reports = {
            monthSummary: data.month_summary,
            gstByMonth: data.gst_by_month,
            gstSummary: data.gst_summary,
            selectedMonth: month
        };

        renderReportsUI();
        return true;
    } catch (err) {
        console.error("Error refreshing reports:", err);
        renderErrorState(err.message);
        return false;
    }
}

/**
 * Show a loading spinner while data is being fetched
 */
function showLoadingState() {
    const container = document.getElementById('reportsView');
    if (!container) return;

    container.innerHTML = `
        <div class="page-content">
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading reports data...</p>
            </div>
        </div>
    `;
}

/**
 * Show error state if reports fail to load
 */
function renderErrorState(message) {
    const container = document.getElementById('reportsView');
    if (!container) return;

    container.innerHTML = `
        <div class="page-content">
            <div class="view-header">
                <div class="view-title">
                    <h2>Reports</h2>
                    <p>Month-wise summary + GST report</p>
                </div>
            </div>
            <div class="error-state">
                <span class="error-icon">⚠️</span>
                <p>Failed to load reports</p>
                <small>${message || 'Please check your connection and try again.'}</small>
                <button class="btn-action primary" id="reportRetryBtn">Retry</button>
            </div>
        </div>
    `;

    document.getElementById('reportRetryBtn')?.addEventListener('click', () => {
        initializeReports();
    });
}

/**
 * Setup event listeners for reports UI
 */
function setupReportsEventListeners() {
    const container = document.getElementById('reportsView');
    if (!container) return;

    // Use event delegation for dynamic elements
    container.addEventListener('change', async (e) => {
        if (e.target.id === 'reportMonthFilter') {
            const selectedMonth = e.target.value;
            await refreshReportsData(selectedMonth || null);
        }
    });

    container.addEventListener('click', async (e) => {
        if (e.target.closest('#reportRefreshBtn')) {
            const monthFilter = document.getElementById('reportMonthFilter');
            const selectedMonth = monthFilter ? monthFilter.value : null;
            await refreshReportsData(selectedMonth || null);
        }
    });
}

/**
 * Public function to refresh reports after Purchase/Sale changes.
 * Called from purchases.events.js and sales.events.js after
 * successful create/update/delete operations.
 */
export async function triggerReportsRefresh() {
    const monthFilter = document.getElementById('reportMonthFilter');
    const selectedMonth = monthFilter ? monthFilter.value : null;
    await refreshReportsData(selectedMonth || null);
}

/**
 * Format currency value for display (re-exported for convenience)
 */
export function getFormattedCurrency(value) {
    return formatCurrency(value || 0);
}
