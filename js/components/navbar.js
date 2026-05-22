export function renderNavbar() {
    const navbar = document.getElementById('navbar');

    navbar.innerHTML = `
        <div class="app-bar">
            <div class="app-bar-inner">

                <div class="brand">
                    <img src="./assets/logo.png" class="logo-icon-img" alt="Samsan Books Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                </div>

                <nav class="nav">
                    <button class="nav-item active" data-view="reportsView">
                        Reports <span class="badge auto">Auto</span>
                    </button>
                    <button class="nav-item" data-view="purchaseView">
                        Purchases <span class="badge">0</span>
                    </button>
                    <button class="nav-item" data-view="salesView">
                        Sales <span class="badge">0</span>
                    </button>
                    <button class="nav-item" data-view="cashView">
                        Petty cash <span class="badge">0</span>
                    </button>
                </nav>

                <div class="header-actions">
                    <button class="btn-action primary" id="printBtn">Print / PDF</button>
                    <button class="btn-action" id="exportBtn">Export all CSV</button>
                    <button class="btn-action danger" id="logoutBtn">Logout</button>
                </div>

            </div>
        </div>
    `;

    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        try {
            const auth = await import('../modules/auth/auth.service.js');
            await auth.logout();
        } catch (err) {
            console.error('Logout failed:', err);
            // Fallback: clear storage and redirect anyway
            localStorage.removeItem('ledger_token');
            localStorage.removeItem('ledger_user_email');
            window.location.href = 'login.html';
        }
    });

    document.getElementById('printBtn')?.addEventListener('click', () => {
        window.print();
    });

    document.getElementById('exportBtn')?.addEventListener('click', async () => {
        const { showToast, convertToCSV, downloadCSV } = await import('../utils/helpers.js');
        const { state } = await import('../core/state.js');
        
        const hasPurchases = state.purchases && state.purchases.length > 0;
        const hasSales = state.sales && state.sales.length > 0;
        const hasCash = state.cash && state.cash.length > 0;

        if (!hasPurchases && !hasSales && !hasCash) {
            showToast('No data available to export.', 'warning');
            return;
        }

        showToast('Preparing global CSV export. It will be done.', 'info');
        
        setTimeout(() => {
            if (state.purchases && state.purchases.length > 0) {
                downloadCSV(convertToCSV(state.purchases), 'purchases_register.csv');
            }
            if (state.sales && state.sales.length > 0) {
                downloadCSV(convertToCSV(state.sales), 'sales_register.csv');
            }
            if (state.cash && state.cash.length > 0) {
                downloadCSV(convertToCSV(state.cash), 'petty_cash_ledger.csv');
            }
            
            showToast('Global export complete.', 'success');
        }, 800);
    });
}