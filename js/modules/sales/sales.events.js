import { state } from '../../core/state.js';
import { renderSalesTable } from './sales.table.js';
import { createSale, getSales } from '../../services/sales.service.js';
import { convertToCSV, downloadCSV, showToast } from '../../utils/helpers.js';
import { showAlertModal } from '../../components/modal.js';
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
            const form = e.target;
            const editId = form.dataset.editId;

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
                if (editId) {
                    const { updateSale } = await import('../../services/sales.service.js');
                    const updatedItem = await updateSale(editId, payload);
                    
                    // Optimistic update: Replace in local state
                    const index = state.sales.findIndex(s => s.id === editId);
                    if (index !== -1) {
                        state.sales[index] = updatedItem;
                    }
                    
                    showToast('Sale updated successfully!', 'success');
                } else {
                    const newItem = await createSale(payload);
                    
                    // Optimistic update: Add to top of local state
                    state.sales.unshift(newItem);
                    
                    showToast('Sale added successfully!', 'success');
                }
                
                // Re-render instantly without fetching
                renderSalesTable();
                
                // Update Reports in background
                triggerReportsRefresh();
                
                // Clear inputs
                form.reset();
                delete form.dataset.editId;
                document.getElementById('sAddBtn').textContent = 'Add';
                document.getElementById('sGstPercent').value = 18;
                document.getElementById('sReceivedAmount').value = 0;
                
            } catch(err) {
                showToast("Error saving sale: " + err.message, 'error');
            }
        }
    });

    // 3. Event Delegation for Buttons
    container.addEventListener('click', async (e) => {
        // Clear Form Button
        if (e.target.id === 'sClearBtn') {
            const form = document.getElementById('salesForm');
            form.reset();
            delete form.dataset.editId;
            document.getElementById('sAddBtn').textContent = 'Add';
            document.getElementById('sGstPercent').value = 18;
            document.getElementById('sReceivedAmount').value = 0;
        }

        // Export CSV
        if (e.target.id === 'sExportBtn') {
            if (!state.sales || state.sales.length === 0) {
                showAlertModal('NO DATA TO EXPORT', 'error', 'Export Failed');
                return;
            }
            const csvStr = convertToCSV(state.sales);
            downloadCSV(csvStr, 'sales_register.csv');
            showAlertModal('Sales exported successfully!', 'success', 'Export Complete');
        }

        // Edit Sale
        if (e.target.classList.contains('edit-sale-btn')) {
            const id = e.target.dataset.id;
            const item = state.sales.find(s => s.id === id);
            if (!item) return;

            document.getElementById('sMonth').value = item.month || '';
            document.getElementById('sInvoiceNo').value = item.invoice_no || '';
            document.getElementById('sInvoiceDate').value = item.invoice_date || '';
            document.getElementById('sCustomerName').value = item.customer_name || '';
            document.getElementById('sServiceDesc').value = item.service_desc || '';
            document.getElementById('sTaxType').value = item.tax_type || '';
            document.getElementById('sGstPercent').value = item.gst_percent || 18;
            document.getElementById('sBasicAmount').value = item.basic_amount || 0;
            document.getElementById('sReceivedAmount').value = item.received_amount || 0;
            document.getElementById('sReceivedDate').value = item.received_date || '';
            document.getElementById('sPaymentMode').value = item.payment_mode || '';

            const form = document.getElementById('salesForm');
            form.dataset.editId = id;
            document.getElementById('sAddBtn').textContent = 'Update';
            showToast('Editing sale entry...', 'info');
        }

        // Delete Sale
        if (e.target.classList.contains('delete-sale-btn')) {
            if (!confirm("Are you sure you want to delete this sale entry?")) return;
            const id = e.target.dataset.id;
            
            // Optimistic UI Update: Instantly remove and re-render
            const originalSales = [...state.sales];
            state.sales = state.sales.filter(s => s.id !== id);
            renderSalesTable();
            
            try {
                const { deleteSale } = await import('../../services/sales.service.js');
                await deleteSale(id);
                showToast('Sale deleted successfully.', 'success');
                
                // Trigger reports refresh in background
                triggerReportsRefresh();
            } catch (err) {
                // Revert if failed
                state.sales = originalSales;
                renderSalesTable();
                showToast("Error deleting sale: " + err.message, 'error');
            }
        }
    });
}

