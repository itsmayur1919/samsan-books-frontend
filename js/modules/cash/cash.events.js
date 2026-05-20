import { state } from '../../core/state.js';
import { renderCashTable } from './cash.table.js';
import { CashService } from './cash.service.js';
import { convertToCSV, downloadCSV, showToast } from '../../utils/helpers.js';

export async function initializeCashEvents() {
    try {
        const data = await CashService.getDashboardData();
        state.cash = data.entries || [];
        state.cashOpening = data.settings?.opening_balance || 0;
        renderCashTable();
        setDefaultDateToToday();
    } catch (err) {
        console.error("Failed to load cash data", err);
    }

    // Attach events using event delegation on the container since table re-renders
    const container = document.getElementById('cashView');
    if (!container) return;

    container.addEventListener('click', async (e) => {
        // Save Opening Balance
        if (e.target.id === 'saveCashOpeningBtn') {
            const inputVal = document.getElementById('cashOpeningInput')?.value;
            try {
                const res = await CashService.updateOpeningBalance(inputVal);
                state.cashOpening = res.opening_balance;
                const data = await CashService.getDashboardData();
                state.cash = data.entries || [];
                renderCashTable();
                setDefaultDateToToday();
                showToast('Opening balance saved', 'success');
            } catch (err) {
                showToast("Error saving opening balance: " + err.message, 'error');
            }
        }

        // Clear All Entries
        if (e.target.id === 'clearCashBtn') {
            if(confirm("Are you sure you want to clear ALL petty cash entries?")) {
                try {
                    await CashService.clearAllEntries();
                    state.cash = [];
                    renderCashTable();
                    setDefaultDateToToday();
                    showToast('All entries cleared', 'info');
                } catch(err) {
                    showToast("Error clearing entries: " + err.message, 'error');
                }
            }
        }

        // Export CSV
        if (e.target.id === 'exportCashCsvBtn') {
            if (!state.cash || state.cash.length === 0) {
                showToast("No data to export.", 'error');
                return;
            }
            const csvStr = convertToCSV(state.cash);
            downloadCSV(csvStr, 'petty_cash_ledger.csv');
            showToast('Petty cash exported successfully.', 'success');
        }
    });

    // Handle Form Submit
    container.addEventListener('submit', async (e) => {
        if (e.target.id === 'cashForm') {
            e.preventDefault();
            const entryData = {
                date: document.getElementById('cashDateInput').value,
                description: document.getElementById('cashDescInput').value,
                cash_in: document.getElementById('cashInInput').value || 0,
                cash_out: document.getElementById('cashOutInput').value || 0
            };

            try {
                await CashService.addEntry(entryData);
                const data = await CashService.getDashboardData();
                state.cash = data.entries || [];
                renderCashTable();
                setDefaultDateToToday();
                setDefaultDateToToday();
                // Reset form
                document.getElementById('cashForm').reset();
                setDefaultDateToToday();
                showToast('Cash entry added successfully!', 'success');
            } catch(err) {
                showToast("Error adding entry: " + err.message, 'error');
            }
        }
    });
}

function setDefaultDateToToday() {
    const dateInput = document.getElementById('cashDateInput');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
}