import { state } from '../../core/state.js';
import { formatCurrency } from '../../utils/helpers.js';

export function renderPurchaseTable() {
    const container = document.getElementById('purchaseView');

    // Calculate totals dynamically from state
    const totals = (state.purchases || []).reduce((acc, row) => {
        acc.basic += Number(row.basic_amount || 0);
        acc.cgst += Number(row.cgst || 0);
        acc.sgst += Number(row.sgst || 0);
        acc.igst += Number(row.igst || 0);
        acc.total += Number(row.total_amount || 0);
        acc.tds += Number(row.tds_amount || 0);
        acc.payable += Number(row.payable_amount || 0);
        return acc;
    }, { basic: 0, cgst: 0, sgst: 0, igst: 0, total: 0, tds: 0, payable: 0 });

    container.innerHTML = `
        <div class="purchases-layout">
            
            <!-- Left: New Purchase Form -->
            <div class="card purchase-form-card">
                <div class="card-head">
                    <h3>New purchase</h3>
                </div>
                <div class="card-body">
                    <form id="purchaseForm">
                        <div class="form-group">
                            <label>MONTH</label>
                            <input type="text" id="pMonth" class="form-control" placeholder="Apr-2026" required>
                        </div>
                        <div class="form-group">
                            <label>INVOICE NO</label>
                            <input type="text" id="pInvoiceNo" class="form-control" placeholder="INV-001" required>
                        </div>
                        <div class="form-group">
                            <label>INVOICE DATE</label>
                            <input type="date" id="pInvoiceDate" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>VENDOR NAME</label>
                            <input type="text" id="pVendor" class="form-control" placeholder="Vendor / Supplier" required>
                        </div>
                        <div class="form-group">
                            <label>SERVICE DESCRIPTION</label>
                            <input type="text" id="pServiceDesc" class="form-control" placeholder="Consulting / Hosting / etc.">
                        </div>
                        <div class="form-group">
                            <label>TAX TYPE</label>
                            <select id="pTaxType" class="form-control" required>
                                <option>Intra (CGST+SGST)</option>
                                <option>Inter (IGST)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>GST %</label>
                            <input type="number" id="pGstPercent" class="form-control" value="18" required>
                        </div>
                        <div class="form-group">
                            <label>BASIC AMOUNT</label>
                            <input type="number" id="pBasicAmount" class="form-control" placeholder="10000" required step="0.01">
                        </div>
                        <div class="form-group">
                            <label>TDS %</label>
                            <input type="number" id="pTdsPercent" class="form-control" value="0" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>TDS AMOUNT</label>
                            <input type="number" id="pTdsAmount" class="form-control" value="0" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>PAID AMOUNT</label>
                            <input type="number" id="pPaidAmount" class="form-control" value="0" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>PAID DATE</label>
                            <input type="date" id="pPaidDate" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>PAYMENT MODE</label>
                            <input type="text" id="pPaymentMode" class="form-control" placeholder="Bank / UPI / Cash">
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" id="pClearBtn" class="btn btn-outline" style="flex: 1">Clear</button>
                            <button type="submit" id="pAddBtn" class="btn btn-success" style="flex: 1">Add</button>
                            <button type="button" id="pExportBtn" class="btn btn-outline" style="flex: 1">Export CSV</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Right: Register & Filters -->
            <div class="card purchase-register-card">
                <div class="card-head">
                    <h3>Register & filters</h3>
                    <span class="status-badge auto">${(state.purchases || []).length} rows (filtered)</span>
                </div>
                <div class="card-body">
                    
                    <!-- Advanced Filters -->
                    <div class="filter-bar">
                        <div class="form-group">
                            <label>SEARCH</label>
                            <input type="text" class="form-control" placeholder="Invoice/vendor/service...">
                        </div>
                        <div class="form-group">
                            <label>MONTH</label>
                            <select class="form-control">
                                <option>All</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>STATUS</label>
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
                        <table class="ledger-table purchases-table">
                            <thead>
                                <tr>
                                    <th>MONTH</th>
                                    <th>INVOICE</th>
                                    <th>DATE</th>
                                    <th>VENDOR</th>
                                    <th>SERVICE</th>
                                    <th>TAX</th>
                                    <th>GST%</th>
                                    <th class="num-cell">BASIC</th>
                                    <th class="num-cell">CGST</th>
                                    <th class="num-cell">SGST</th>
                                    <th class="num-cell">IGST</th>
                                    <th class="num-cell">TOTAL</th>
                                    <th class="num-cell">TDS</th>
                                    <th class="num-cell">PAYABLE</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.purchases?.length > 0 ? state.purchases.map(row => `
                                    <tr>
                                        <td>${row.month || '-'}</td>
                                        <td class="text-cell">${row.invoice_no}</td>
                                        <td>${row.invoice_date || '-'}</td>
                                        <td class="text-cell">${row.vendor_name}</td>
                                        <td>${row.service_desc || '-'}</td>
                                        <td>${row.tax_type || '-'}</td>
                                        <td>${row.gst_percent}%</td>
                                        <td class="num-cell">${formatCurrency(row.basic_amount)}</td>
                                        <td class="num-cell">${formatCurrency(row.cgst || 0)}</td>
                                        <td class="num-cell">${formatCurrency(row.sgst || 0)}</td>
                                        <td class="num-cell">${formatCurrency(row.igst || 0)}</td>
                                        <td class="num-cell">${formatCurrency(row.total_amount)}</td>
                                        <td class="num-cell">${formatCurrency(row.tds_amount || 0)}</td>
                                        <td class="num-cell" style="font-weight: 500;">${formatCurrency(row.payable_amount || 0)}</td>
                                        <td><span class="status-pill ${row.status?.toLowerCase() || 'pending'}">${row.status || 'Pending'}</span></td>
                                        <td>
                                            <div class="action-buttons" style="display: flex; gap: 4px;">
                                                <button type="button" class="btn btn-outline edit-purchase-btn" data-id="${row.id}" style="padding: 2px 8px; font-size: 0.8rem;">Edit</button>
                                                <button type="button" class="btn btn-outline delete-purchase-btn" data-id="${row.id}" style="padding: 2px 8px; font-size: 0.8rem; color: var(--danger);">Del</button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('') : `
                                    <tr><td colspan="16" style="text-align: center; padding: 2rem; color: var(--text-muted);">No purchases found. Use the form to add one.</td></tr>
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
                                    <td class="num-cell">${formatCurrency(totals.tds)}</td>
                                    <td class="num-cell">${formatCurrency(totals.payable)}</td>
                                    <td></td>
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