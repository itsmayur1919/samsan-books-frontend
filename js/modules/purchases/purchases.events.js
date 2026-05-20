import { state } from '../../core/state.js';
import { renderPurchaseTable } from './purchases.table.js';
import { createPurchase, getPurchases } from '../../services/purchases.service.js';
import { convertToCSV, downloadCSV, showToast } from '../../utils/helpers.js';
import { triggerReportsRefresh } from '../reports/reports.events.js';

export async function initializePurchaseEvents() {
    // 1. Initial Load from Backend
    try {
        const data = await getPurchases();
        state.purchases = data || [];
        renderPurchaseTable();
    } catch (err) {
        console.error("Failed to load purchases", err);
    }

    const container = document.getElementById('purchaseView');
    if (!container) return;

    // 2. Event Delegation for Form Submit
    container.addEventListener('submit', async (e) => {
        if (e.target.id === 'purchaseForm') {
            e.preventDefault();

            const payload = {
                month: document.getElementById('pMonth').value,
                invoice_no: document.getElementById('pInvoiceNo').value,
                invoice_date: document.getElementById('pInvoiceDate').value,
                vendor_name: document.getElementById('pVendor').value,
                service_desc: document.getElementById('pServiceDesc').value || null,
                tax_type: document.getElementById('pTaxType').value,
                gst_percent: parseFloat(document.getElementById('pGstPercent').value) || 0,
                basic_amount: parseFloat(document.getElementById('pBasicAmount').value) || 0,
                tds_amount: parseFloat(document.getElementById('pTdsAmount').value) || 0,
                paid_amount: parseFloat(document.getElementById('pPaidAmount').value) || 0,
                paid_date: document.getElementById('pPaidDate').value || null,
                payment_mode: document.getElementById('pPaymentMode').value || null
            };

            try {
                // Post to API
                await createPurchase(payload);
                
                // Re-fetch authoritative list (which includes calculated GST values)
                const data = await getPurchases();
                state.purchases = data || [];
                
                // Re-render
                renderPurchaseTable();
                
                // Update Reports in background
                triggerReportsRefresh();
                
                // Clear inputs but keep some defaults
                e.target.reset();
                document.getElementById('pGstPercent').value = 18;
                document.getElementById('pTdsAmount').value = 0;
                document.getElementById('pPaidAmount').value = 0;
                
                showToast('Purchase added successfully!', 'success');
                
            } catch(err) {
                showToast("Error adding purchase: " + err.message, 'error');
            }
        }
    });

    // 3. Event Delegation for Buttons
    container.addEventListener('click', (e) => {
        // Clear Form Button
        if (e.target.id === 'pClearBtn') {
            document.getElementById('purchaseForm').reset();
            document.getElementById('pGstPercent').value = 18;
            document.getElementById('pTdsAmount').value = 0;
            document.getElementById('pPaidAmount').value = 0;
        }

        // Export CSV
        if (e.target.id === 'pExportBtn') {
            if (!state.purchases || state.purchases.length === 0) {
                showToast("No purchases to export.", 'error');
                return;
            }
            const csvStr = convertToCSV(state.purchases);
            downloadCSV(csvStr, 'purchases_register.csv');
            showToast('Purchases exported successfully.', 'success');
        }
    });
}

