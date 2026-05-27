import { state } from '../../core/state.js';
import { renderPurchaseTable } from './purchases.table.js';
import { createPurchase, getPurchases } from '../../services/purchases.service.js';
import { convertToCSV, downloadCSV, showToast } from '../../utils/helpers.js';
import { showAlertModal } from '../../components/modal.js';
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
            const form = e.target;
            const editId = form.dataset.editId;

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
                if (editId) {
                    const { updatePurchase } = await import('../../services/purchases.service.js');
                    const updatedItem = await updatePurchase(editId, payload);
                    
                    // Optimistic update: Replace in local state
                    const index = state.purchases.findIndex(p => p.id === editId);
                    if (index !== -1) {
                        state.purchases[index] = updatedItem;
                    }
                    
                    showToast('Purchase updated successfully!', 'success');
                } else {
                    const newItem = await createPurchase(payload);
                    
                    // Optimistic update: Add to top of local state
                    state.purchases.unshift(newItem);
                    
                    showToast('Purchase added successfully!', 'success');
                }
                
                // Re-render instantly without fetching
                renderPurchaseTable();
                
                // Update Reports in background
                triggerReportsRefresh();
                
                // Clear inputs
                form.reset();
                delete form.dataset.editId;
                document.getElementById('pAddBtn').textContent = 'Add';
                document.getElementById('pGstPercent').value = 18;
                document.getElementById('pTdsPercent').value = 0;
                document.getElementById('pTdsAmount').value = 0;
                document.getElementById('pPaidAmount').value = 0;
                
            } catch(err) {
                showToast("Error saving purchase: " + err.message, 'error');
            }
        }
    });

    // Handle Auto-calculation of TDS Amount
    container.addEventListener('input', (e) => {
        if (e.target.id === 'pBasicAmount' || e.target.id === 'pTdsPercent') {
            const basic = parseFloat(document.getElementById('pBasicAmount').value) || 0;
            const percent = parseFloat(document.getElementById('pTdsPercent').value) || 0;
            const amount = basic * (percent / 100);
            document.getElementById('pTdsAmount').value = amount.toFixed(2);
        }
    });

    // 3. Event Delegation for Buttons
    container.addEventListener('click', async (e) => {
        // Clear Form Button
        if (e.target.id === 'pClearBtn') {
            const form = document.getElementById('purchaseForm');
            form.reset();
            delete form.dataset.editId;
            document.getElementById('pAddBtn').textContent = 'Add';
            document.getElementById('pGstPercent').value = 18;
            document.getElementById('pTdsPercent').value = 0;
            document.getElementById('pTdsAmount').value = 0;
            document.getElementById('pPaidAmount').value = 0;
        }

        // Export CSV
        if (e.target.id === 'pExportBtn') {
            if (!state.purchases || state.purchases.length === 0) {
                showAlertModal('NO DATA TO EXPORT', 'error', 'Export Failed');
                return;
            }
            const csvStr = convertToCSV(state.purchases);
            downloadCSV(csvStr, 'purchases_register.csv');
            showAlertModal('Purchases exported successfully!', 'success', 'Export Complete');
        }

        // Edit Purchase
        if (e.target.classList.contains('edit-purchase-btn')) {
            const id = e.target.dataset.id;
            const item = state.purchases.find(p => p.id === id);
            if (!item) return;

            document.getElementById('pMonth').value = item.month || '';
            document.getElementById('pInvoiceNo').value = item.invoice_no || '';
            document.getElementById('pInvoiceDate').value = item.invoice_date || '';
            document.getElementById('pVendor').value = item.vendor_name || '';
            document.getElementById('pServiceDesc').value = item.service_desc || '';
            document.getElementById('pTaxType').value = item.tax_type || '';
            document.getElementById('pGstPercent').value = item.gst_percent || 18;
            document.getElementById('pBasicAmount').value = item.basic_amount || 0;
            document.getElementById('pTdsAmount').value = item.tds_amount || 0;
            
            // Calculate reverse TDS Percent
            const basic = parseFloat(item.basic_amount) || 0;
            const tdsAmt = parseFloat(item.tds_amount) || 0;
            if (basic > 0 && tdsAmt > 0) {
                document.getElementById('pTdsPercent').value = ((tdsAmt / basic) * 100).toFixed(2);
            } else {
                document.getElementById('pTdsPercent').value = 0;
            }

            document.getElementById('pPaidAmount').value = item.paid_amount || 0;
            document.getElementById('pPaidDate').value = item.paid_date || '';
            document.getElementById('pPaymentMode').value = item.payment_mode || '';

            const form = document.getElementById('purchaseForm');
            form.dataset.editId = id;
            document.getElementById('pAddBtn').textContent = 'Update';
            showToast('Editing purchase entry...', 'info');
        }

        // Delete Purchase
        if (e.target.classList.contains('delete-purchase-btn')) {
            if (!confirm("Are you sure you want to delete this purchase entry?")) return;
            const id = e.target.dataset.id;
            
            // Optimistic UI Update: Instantly remove and re-render
            const originalPurchases = [...state.purchases];
            state.purchases = state.purchases.filter(p => p.id !== id);
            renderPurchaseTable();
            
            try {
                const { deletePurchase } = await import('../../services/purchases.service.js');
                await deletePurchase(id);
                showToast('Purchase deleted successfully.', 'success');
                
                // Trigger reports refresh in background
                triggerReportsRefresh();
            } catch (err) {
                // Revert if failed
                state.purchases = originalPurchases;
                renderPurchaseTable();
                showToast("Error deleting purchase: " + err.message, 'error');
            }
        }
    });
}

