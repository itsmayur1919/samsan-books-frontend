import { state } from '../../core/state.js';
import { formatCurrency } from '../../utils/helpers.js';

/**
 * Render the complete Reports UI with all sections:
 * - Filter bar with month selector
 * - Month Summary table (Sales + Purchases)
 * - GST by Month table
 * - GST Summary cards
 *
 * All data comes from state.reports, populated by reports.events.js
 */
export function renderReportsUI() {
    const container = document.getElementById('reportsView');
    if (!container) return;

    const reports = state.reports || {};
    const monthSummary = reports.monthSummary || { month: null, rows: [] };
    const gstByMonth = reports.gstByMonth || { rows: [] };
    const gstSummary = reports.gstSummary || {
        total_sales_gst: 0,
        total_purchases_gst: 0,
        net_gst: 0,
        gst_status: 'Payable'
    };

    // Collect available months from GST data for the filter dropdown
    const availableMonths = gstByMonth.rows.map(r => r.month).filter(Boolean);

    container.innerHTML = `
        <div class="page-content">

            <!-- View Header -->
            <div class="view-header">
                <div class="view-title">
                    <h2>Reports</h2>
                    <p>Month-wise summary + GST report</p>
                </div>
                <button class="btn-action" id="reportRefreshBtn">
                    <span class="refresh-icon">↻</span> Refresh
                </button>
            </div>

            <!-- Filters Card -->
            <div class="card filter-card">
                <div class="card-body filter-grid">
                    <div class="filter-group">
                        <label>MONTH FILTER</label>
                        <select class="filter-select" id="reportMonthFilter">
                            <option value="">All Months</option>
                            ${availableMonths.map(m => `
                                <option value="${m}" ${reports.selectedMonth === m ? 'selected' : ''}>${m}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="filter-info">
                        Intra = CGST + SGST &nbsp;|&nbsp; Inter = IGST
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="reports-grid">

                <!-- Month Summary Card -->
                <div class="card report-card">
                    <div class="card-head">
                        <h3>Month Summary</h3>
                        <span class="status-badge auto">Auto</span>
                    </div>
                    <div class="card-body">
                        <div class="table-container">
                            <table class="ledger-table" id="monthSummaryTable">
                                <thead>
                                    <tr>
                                        <th>SECTION</th>
                                        <th class="num-cell">BASIC</th>
                                        <th class="num-cell">GST</th>
                                        <th class="num-cell">TOTAL</th>
                                        <th class="num-cell">PAID / RECEIVED</th>
                                        <th class="num-cell">BALANCE / SHORTFALL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderMonthSummaryRows(monthSummary.rows)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- GST by Month Card -->
                <div class="card report-card">
                    <div class="card-head">
                        <h3>GST by Month</h3>
                        <span class="status-badge auto">Auto</span>
                    </div>
                    <div class="card-body">
                        <div class="table-container">
                            <table class="ledger-table" id="gstByMonthTable">
                                <thead>
                                    <tr>
                                        <th>MONTH</th>
                                        <th class="num-cell">SALES CGST</th>
                                        <th class="num-cell">SALES SGST</th>
                                        <th class="num-cell">SALES IGST</th>
                                        <th class="num-cell">SALES TOTAL</th>
                                        <th class="num-cell">PUR. CGST</th>
                                        <th class="num-cell">PUR. SGST</th>
                                        <th class="num-cell">PUR. IGST</th>
                                        <th class="num-cell">PUR. TOTAL</th>
                                        <th class="num-cell">NET GST</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderGSTByMonthRows(gstByMonth.rows)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <!-- GST Summary Cards -->
            <div class="gst-summary-grid">
                ${renderGSTSummaryCards(gstSummary)}
            </div>

        </div>
    `;
}


/**
 * Render Month Summary table rows
 */
function renderMonthSummaryRows(rows) {
    if (!rows || rows.length === 0) {
        return `
            <tr>
                <td class="text-cell">Sales (Receivable)</td>
                <td class="num-cell zero-val">0.00</td>
                <td class="num-cell zero-val">0.00</td>
                <td class="num-cell zero-val">0.00</td>
                <td class="num-cell zero-val">0.00</td>
                <td class="num-cell zero-val">0.00</td>
            </tr>
            <tr>
                <td class="text-cell">Purchases (Payable)</td>
                <td class="num-cell zero-val">0.00</td>
                <td class="num-cell zero-val">0.00</td>
                <td class="num-cell zero-val">0.00</td>
                <td class="num-cell zero-val">0.00</td>
                <td class="num-cell zero-val">0.00</td>
            </tr>
        `;
    }

    return rows.map(row => {
        const isSales = row.type.includes('Sales');
        const rowClass = isSales ? 'sales-row' : 'purchases-row';
        const icon = isSales ? '📈' : '📉';

        return `
            <tr class="${rowClass}">
                <td class="text-cell">
                    <span class="row-icon">${icon}</span>
                    ${row.type}
                </td>
                <td class="num-cell">${formatCurrency(row.basic_amount)}</td>
                <td class="num-cell">${formatCurrency(row.gst_amount)}</td>
                <td class="num-cell fw-bold">${formatCurrency(row.total_amount)}</td>
                <td class="num-cell ${Number(row.received_or_paid) > 0 ? 'text-success' : ''}">${formatCurrency(row.received_or_paid)}</td>
                <td class="num-cell ${Number(row.outstanding) > 0 ? 'text-warning' : ''}">${formatCurrency(row.outstanding)}</td>
            </tr>
        `;
    }).join('');
}


/**
 * Render GST by Month table rows
 */
function renderGSTByMonthRows(rows) {
    if (!rows || rows.length === 0) {
        return `
            <tr>
                <td colspan="10" class="empty-state">
                    <div class="empty-state-inner">
                        <span class="empty-icon">📊</span>
                        <p>No GST data available yet</p>
                        <small>Add purchases and sales to see GST breakdown</small>
                    </div>
                </td>
            </tr>
        `;
    }

    return rows.map(row => {
        const netClass = Number(row.net_gst) > 0 ? 'text-danger' : (Number(row.net_gst) < 0 ? 'text-success' : '');
        const netLabel = Number(row.net_gst) > 0 ? '↑ Payable' : (Number(row.net_gst) < 0 ? '↓ Credit' : '—');

        return `
            <tr>
                <td class="text-cell fw-bold">${row.month}</td>
                <td class="num-cell">${formatCurrency(row.sales_cgst)}</td>
                <td class="num-cell">${formatCurrency(row.sales_sgst)}</td>
                <td class="num-cell">${formatCurrency(row.sales_igst)}</td>
                <td class="num-cell fw-bold">${formatCurrency(row.sales_gst_total)}</td>
                <td class="num-cell">${formatCurrency(row.purchases_cgst)}</td>
                <td class="num-cell">${formatCurrency(row.purchases_sgst)}</td>
                <td class="num-cell">${formatCurrency(row.purchases_igst)}</td>
                <td class="num-cell fw-bold">${formatCurrency(row.purchases_gst_total)}</td>
                <td class="num-cell fw-bold ${netClass}">
                    ${formatCurrency(row.net_gst)}
                    <small class="net-label">${netLabel}</small>
                </td>
            </tr>
        `;
    }).join('');
}


/**
 * Render GST Summary Cards
 */
function renderGSTSummaryCards(summary) {
    const salesGst = Number(summary.total_sales_gst) || 0;
    const purchasesGst = Number(summary.total_purchases_gst) || 0;
    const netGst = Number(summary.net_gst) || 0;
    const status = summary.gst_status || 'Payable';
    const isPayable = status === 'Payable';

    return `
        <div class="gst-card gst-card-sales">
            <div class="gst-card-icon">📤</div>
            <div class="gst-card-content">
                <span class="gst-card-label">Sales GST (Collected)</span>
                <span class="gst-card-value">₹ ${formatCurrency(salesGst)}</span>
            </div>
        </div>

        <div class="gst-card gst-card-purchases">
            <div class="gst-card-icon">📥</div>
            <div class="gst-card-content">
                <span class="gst-card-label">Purchase GST (Input Credit)</span>
                <span class="gst-card-value">₹ ${formatCurrency(purchasesGst)}</span>
            </div>
        </div>

        <div class="gst-card ${isPayable ? 'gst-card-payable' : 'gst-card-refund'}">
            <div class="gst-card-icon">${isPayable ? '🏛️' : '💰'}</div>
            <div class="gst-card-content">
                <span class="gst-card-label">Net GST — ${status}</span>
                <span class="gst-card-value ${isPayable ? 'text-danger' : 'text-success'}">₹ ${formatCurrency(netGst)}</span>
            </div>
            <div class="gst-status-badge ${isPayable ? 'badge-payable' : 'badge-refund'}">
                ${status}
            </div>
        </div>
    `;
}
