import { state } from '../../core/state.js';
import { formatCurrency } from '../../utils/helpers.js';

export function renderCashTable() {
    const container = document.getElementById('cashView');

    // Calculate totals
    const totalCashIn = state.cash?.reduce((sum, row) => sum + Number(row.cash_in || 0), 0) || 0;
    const totalCashOut = state.cash?.reduce((sum, row) => sum + Number(row.cash_out || 0), 0) || 0;
    const opening = Number(state.cashOpening || 0);
    const overallBalance = opening + totalCashIn - totalCashOut;

    container.innerHTML = `
        <div class="cash-layout">
            
            <!-- Left: Opening & Lines -->
            <div class="card cash-form-card">
                <div class="card-head">
                    <h3>Opening & lines</h3>
                </div>
                <div class="card-body">
                    
                    <!-- Opening Balance Section -->
                    <div class="opening-balance-group">
                        <div class="form-group">
                            <label>OPENING BALANCE</label>
                            <input type="number" id="cashOpeningInput" class="form-control" value="${opening}">
                        </div>
                        <button id="saveCashOpeningBtn" class="btn btn-primary" style="padding: 0.625rem 0.75rem;">Save opening</button>
                    </div>

                    <form id="cashForm">
                        <div class="form-group">
                            <label>DATE</label>
                            <input type="date" id="cashDateInput" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>DESCRIPTION</label>
                            <input type="text" id="cashDescInput" class="form-control" placeholder="Office expenses / travel / snacks ..." required>
                        </div>
                        <div class="form-group">
                            <label>CASH IN</label>
                            <input type="number" id="cashInInput" class="form-control" value="0" min="0" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>CASH OUT</label>
                            <input type="number" id="cashOutInput" class="form-control" value="0" min="0" step="0.01">
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" id="clearCashBtn" class="btn btn-outline" style="flex: 1">Clear</button>
                            <button type="submit" class="btn btn-success" style="flex: 1">Add</button>
                            <button type="button" id="exportCashCsvBtn" class="btn btn-outline" style="flex: 1">Export CSV</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Right: Ledger & Filters -->
            <div class="card cash-register-card">
                <div class="card-head">
                    <h3>Ledger & filters</h3>
                    <span class="status-badge auto">${state.cash?.length || 0} rows (filtered)</span>
                </div>
                <div class="card-body">
                    
                    <!-- Advanced Filters -->
                    <div class="filter-bar" style="grid-template-columns: 1fr 150px 150px;">
                        <div class="form-group">
                            <label>SEARCH</label>
                            <input type="text" class="form-control" placeholder="description...">
                        </div>
                        <div class="form-group">
                            <label>DATE FROM</label>
                            <input type="date" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>DATE TO</label>
                            <input type="date" class="form-control">
                        </div>
                    </div>

                    <div class="table-container">
                        <table class="ledger-table cash-table">
                            <thead>
                                <tr>
                                    <th>DATE</th>
                                    <th>DESCRIPTION</th>
                                    <th class="num-cell">CASH IN</th>
                                    <th class="num-cell">CASH OUT</th>
                                    <th class="num-cell">BALANCE</th>
                                    <th style="text-align: center;">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.cash?.length > 0 ? state.cash.map(row => `
                                    <tr>
                                        <td>${row.date || '-'}</td>
                                        <td class="text-cell">${row.description}</td>
                                        <td class="num-cell">${formatCurrency(row.cash_in || 0)}</td>
                                        <td class="num-cell">${formatCurrency(row.cash_out || 0)}</td>
                                        <td class="num-cell" style="font-weight: 500;">${formatCurrency(row.balance || 0)}</td>
                                        <td style="text-align: center;">
                                            <button class="btn-action danger" style="padding: 0.25rem 0.5rem; font-size: 0.7rem;" disabled>Delete</button>
                                        </td>
                                    </tr>
                                `).join('') : `
                                    <tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No transactions found. Add one on the left.</td></tr>
                                `}
                            </tbody>
                        </table>
                    </div>

                    <!-- Summary Chips -->
                    <div class="cash-summary">
                        <div class="chip">
                            <span class="chip-label">Opening:</span>
                            <span class="chip-value">${formatCurrency(opening)}</span>
                        </div>
                        <div class="chip">
                            <span class="chip-label">Cash In (filtered):</span>
                            <span class="chip-value">${formatCurrency(totalCashIn)}</span>
                        </div>
                        <div class="chip">
                            <span class="chip-label">Cash Out (filtered):</span>
                            <span class="chip-value">${formatCurrency(totalCashOut)}</span>
                        </div>
                        <div class="chip" style="background: var(--primary-light); border-color: var(--primary);">
                            <span class="chip-label" style="color: var(--primary);">Current Balance (overall):</span>
                            <span class="chip-value" style="color: var(--primary); font-weight: 800;">${formatCurrency(overallBalance)}</span>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    `;
}

