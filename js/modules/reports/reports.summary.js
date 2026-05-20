import { state } from '../../core/state.js';
import { formatCurrency } from '../../utils/helpers.js';

export function renderReportsSummary() {
    const reportsView = document.getElementById('reportsView');

    reportsView.innerHTML = `
        <div class="page-content">
            
            <!-- View Header -->
            <div class="view-header">
                <div class="view-title">
                    <h2>Reports</h2>
                    <p>Month-wise summary + GST report</p>
                </div>
                <button class="btn-action">Top</button>
            </div>

            <!-- Filters Card -->
            <div class="card filter-card">
                <div class="card-body filter-grid">
                    <div class="filter-group">
                        <label>MONTH (SUMMARY)</label>
                        <select class="filter-select">
                            <option>All</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>GST REPORT MONTH</label>
                        <select class="filter-select">
                            <option>All</option>
                        </select>
                    </div>
                    <div class="filter-info">
                        Intra = CGST+SGST | Inter = IGST
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="reports-grid">
                
                <!-- Month Summary Card -->
                <div class="card">
                    <div class="card-head">
                        <h3>Month summary</h3>
                        <span class="status-badge auto">Auto</span>
                    </div>
                    <div class="card-body">
                        <div class="table-container">
                            <table class="ledger-table">
                                <thead>
                                    <tr>
                                        <th>SECTION</th>
                                        <th class="num-cell">BASIC</th>
                                        <th class="num-cell">GST</th>
                                        <th class="num-cell">TOTAL</th>
                                        <th class="num-cell">PAID/RECEIVED</th>
                                        <th class="num-cell">BALANCE/SHORTFALL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="text-cell">Sales (Receivable)</td>
                                        <td class="num-cell">0</td>
                                        <td class="num-cell">0</td>
                                        <td class="num-cell">0</td>
                                        <td class="num-cell">0</td>
                                        <td class="num-cell">0</td>
                                    </tr>
                                    <tr>
                                        <td class="text-cell">Purchases (Payable)</td>
                                        <td class="num-cell">0</td>
                                        <td class="num-cell">0</td>
                                        <td class="num-cell">0</td>
                                        <td class="num-cell">0</td>
                                        <td class="num-cell">0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- GST by Month Card -->
                <div class="card">
                    <div class="card-head">
                        <h3>GST by month</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-container">
                            <table class="ledger-table">
                                <thead>
                                    <tr>
                                        <th>MONTH</th>
                                        <th class="num-cell">SALES CGST</th>
                                        <th class="num-cell">SALES SGST</th>
                                        <th class="num-cell">SALES IGST</th>
                                        <th class="num-cell">PURCHASE CGST</th>
                                        <th class="num-cell">PURCHASE SGST</th>
                                        <th class="num-cell">PURCHASE IGST</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Data will be injected here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Summary Chips -->
            <div class="summary-chips">
                <div class="chip">
                    <span class="chip-label">Sales GST:</span>
                    <span class="chip-value">0</span>
                </div>
                <div class="chip">
                    <span class="chip-label">Purchase GST:</span>
                    <span class="chip-value">0</span>
                </div>
                <div class="chip">
                    <span class="chip-label">Net GST:</span>
                    <span class="chip-value">0</span>
                </div>
            </div>

        </div>
    `;
}