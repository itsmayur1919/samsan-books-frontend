import { state } from '../../core/state.js';
import { formatCurrency } from '../../utils/helpers.js';

export function renderSalesTable() {
    const container = document.getElementById('salesView');

    // Calculate totals dynamically from state
    const totals = (state.sales || []).reduce((acc, row) => {
        acc.basic += Number(row.basic_amount || 0);
        acc.cgst += Number(row.cgst || 0);
        acc.sgst += Number(row.sgst || 0);
        acc.igst += Number(row.igst || 0);
        acc.total += Number(row.total_amount || 0);
        acc.received += Number(row.received_amount || 0);
        acc.balance += Number(row.balance_amount || 0);
        return acc;
    }, { basic: 0, cgst: 0, sgst: 0, igst: 0, total: 0, received: 0, balance: 0 });

    container.innerHTML = `
        <div class="sales-layout">
            
            <!-- Left: New Sale Form -->
            <div class="card sales-form-card">
                <div class="card-head">
                    <h3>New sale</h3>
                </div>
                <div class="card-body">
                    <form id="salesForm">
                        <div class="form-group">
                            <label>MONTH</label>
                            <input type="text" id="sMonth" class="form-control" placeholder="Apr-2026" required>
                        </div>
                        <div class="form-group">
                            <label>INVOICE NO</label>
                            <input type="text" id="sInvoiceNo" class="form-control" placeholder="S-INV-001" required>
                        </div>
                        <div class="form-group">
                            <label>INVOICE DATE</label>
                            <input type="date" id="sInvoiceDate" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>CUSTOMER NAME</label>
                            <input type="text" id="sCustomerName" class="form-control" placeholder="Customer / Client" required>
                        </div>
                        <div class="form-group">
                            <label>SERVICE DESCRIPTION</label>
                            <input type="text" id="sServiceDesc" class="form-control" placeholder="Project / Retainer / etc.">
                        </div>
                        <div class="form-group">
                            <label>TAX TYPE</label>
                            <select id="sTaxType" class="form-control" required>
                                <option>Intra (CGST+SGST)</option>
                                <option>Inter (IGST)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>GST %</label>
                            <input type="number" id="sGstPercent" class="form-control" value="18" required>
                        </div>
                        <div class="form-group">
                            <label>BASIC AMOUNT</label>
                            <input type="number" id="sBasicAmount" class="form-control" placeholder="25000" required step="0.01">
                        </div>
                        <div class="form-group">
                            <label>RECEIVED AMOUNT</label>
                            <input type="number" id="sReceivedAmount" class="form-control" value="0" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>RECEIVED DATE</label>
                            <input type="date" id="sReceivedDate" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>PAYMENT MODE</label>
                            <input type="text" id="sPaymentMode" class="form-control" placeholder="Bank / UPI / Cash">
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" id="sClearBtn" class="btn btn-outline" style="flex: 1">Clear</button>
                            <button type="submit" id="sAddBtn" class="btn btn-success" style="flex: 1">Add</button>
                            <button type="button" id="sExportBtn" class="btn btn-outline" style="flex: 1">Export CSV</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Right: Register & Filters -->
            <div class="card sales-register-card">
                <div class="card-head">
                    <h3>Register & filters</h3>
                    <span class="status-badge auto">${(state.sales || []).length} rows (filtered)</span>
                </div>
                <div class="card-body">
                    
                    <!-- Advanced Filters -->
                    <div class="filter-bar">
                        <div class="form-group">
                            <label>SEARCH</label>
                            <input type="text" class="form-control" placeholder="Invoice/customer/service...">
                        </div>
                        <div class="form-group">
                            <label>MONTH</label>
                            <select class="form-control">
                                <option>All</option>
                            </select>
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
                        <table class="ledger-table sales-table">
                            <thead>
                                <tr>
                                    <th>MONTH</th>
                                    <th>INVOICE</th>
                                    <th>DATE</th>
                                    <th>CUSTOMER</th>
                                    <th>SERVICE</th>
                                    <th>TAX</th>
                                    <th>GST%</th>
                                    <th class="num-cell">BASIC</th>
                                    <th class="num-cell">CGST</th>
                                    <th class="num-cell">SGST</th>
                                    <th class="num-cell">IGST</th>
                                    <th class="num-cell">TOTAL</th>
                                    <th class="num-cell">RECEIVED</th>
                                    <th class="num-cell">BALANCE</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.sales?.length > 0 ? state.sales.map(row => `
                                    <tr>
                                        <td>${row.month || '-'}</td>
                                        <td class="text-cell">${row.invoice_no}</td>
                                        <td>${row.invoice_date || '-'}</td>
                                        <td class="text-cell">${row.customer_name}</td>
                                        <td>${row.service_desc || '-'}</td>
                                        <td>${row.tax_type || '-'}</td>
                                        <td>${row.gst_percent}%</td>
                                        <td class="num-cell">${formatCurrency(row.basic_amount)}</td>
                                        <td class="num-cell">${formatCurrency(row.cgst || 0)}</td>
                                        <td class="num-cell">${formatCurrency(row.sgst || 0)}</td>
                                        <td class="num-cell">${formatCurrency(row.igst || 0)}</td>
                                        <td class="num-cell">${formatCurrency(row.total_amount)}</td>
                                        <td class="num-cell">${formatCurrency(row.received_amount || 0)}</td>
                                        <td class="num-cell" style="font-weight: 500;">${formatCurrency(row.balance_amount || 0)}</td>
                                        <td>
                                            <div class="action-buttons" style="display: flex; gap: 4px;">
                                                <button type="button" class="btn btn-outline edit-sale-btn" data-id="${row.id}" style="padding: 2px 8px; font-size: 0.8rem;">Edit</button>
                                                <button type="button" class="btn btn-outline delete-sale-btn" data-id="${row.id}" style="padding: 2px 8px; font-size: 0.8rem; color: var(--danger);">Del</button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('') : `
                                    <tr><td colspan="15" style="text-align: center; padding: 2rem; color: var(--text-muted);">No sales found. Use the form to add one.</td></tr>
                                `}
                            </tbody>
                            <tfoot>
                                <tr class="summary-row">
                                    <td colspan="7">TOTALS</td>
                                    <td class="num-cell">${formatCurrency(totals.basic)}</td>
                                    <td class="num-cell">${formatCurrency(totals.cgst)}</td>
                                    <td class="num-cell">${formatCurrency(totals.sgst)}</td>
                                    <td class="num-cell">${formatCurrency(totals.igst)}</td>
                                    <td class="num-cell">${formatCurrency(totals.total)}</td>
                                    <td class="num-cell">${formatCurrency(totals.received)}</td>
                                    <td class="num-cell">${formatCurrency(totals.balance)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    `;
}


