import { state } from '../../core/state.js';
import { renderSalesTable } from './sales.table.js';
import { createSale, getSales } from '../../services/sales.service.js';
import { convertToCSV, downloadCSV, showToast } from '../../utils/helpers.js';
import { triggerReportsRefresh } from '../reports/reports.events.js';

export async function initializeSalesEvents() {
    // 1. Initial Load from Backend
    try {
        const data = await getSales();
        state.sales = data || [];
        renderSalesTable();
    } catch (err) {
        console.error("Failed to load sales", err);
    }

    const container = document.getElementById('salesView');
    if (!container) return;

    // 2. Event Delegation for Form Submit
    container.addEventListener('submit', async (e) => {
        if (e.target.id === 'salesForm') {
            e.preventDefault();

            const payload = {
                month: document.getElementById('sMonth').value,
                invoice_no: document.getElementById('sInvoiceNo').value,
                invoice_date: document.getElementById('sInvoiceDate').value,
                customer_name: document.getElementById('sCustomerName').value,
                service_desc: document.getElementById('sServiceDesc').value || null,
                tax_type: document.getElementById('sTaxType').value,
                gst_percent: parseFloat(document.getElementById('sGstPercent').value) || 0,
                basic_amount: parseFloat(document.getElementById('sBasicAmount').value) || 0,
                received_amount: parseFloat(document.getElementById('sReceivedAmount').value) || 0,
                received_date: document.getElementById('sReceivedDate').value || null,
                payment_mode: document.getElementById('sPaymentMode').value || null
            };

            try {
                // Post to API
                await createSale(payload);
                
                // Re-fetch authoritative list (which includes calculated GST values)
                const data = await getSales();
                state.sales = data || [];
                
                // Re-render
                renderSalesTable();
                
                // Update Reports in background
                triggerReportsRefresh();
                
                // Clear inputs but keep some defaults
                e.target.reset();
                document.getElementById('sGstPercent').value = 18;
                document.getElementById('sReceivedAmount').value = 0;
                
                showToast('Sale added successfully!', 'success');
                
            } catch(err) {
                showToast("Error adding sale: " + err.message, 'error');
            }
        }
    });

    // 3. Event Delegation for Buttons
    container.addEventListener('click', (e) => {
        // Clear Form Button
        if (e.target.id === 'sClearBtn') {
            document.getElementById('salesForm').reset();
            document.getElementById('sGstPercent').value = 18;
            document.getElementById('sReceivedAmount').value = 0;
        }

        // Export CSV
        if (e.target.id === 'sExportBtn') {
            if (!state.sales || state.sales.length === 0) {
                showToast("No sales to export.", 'error');
                return;
            }
            const csvStr = convertToCSV(state.sales);
            downloadCSV(csvStr, 'sales_register.csv');
            showToast('Sales exported successfully.', 'success');
        }
    });
}

