import { initializeRouter, setActiveView } from './core/router.js';
import { loadState } from './core/storage.js';
import { state } from './core/state.js';

import { renderNavbar } from './components/navbar.js';

import { renderPurchaseTable } from './modules/purchases/purchases.table.js';
import { renderSalesTable } from './modules/sales/sales.table.js';
import { renderCashTable } from './modules/cash/cash.table.js';
import { initializeReports } from './modules/reports/reports.events.js';

import { initializePurchaseEvents } from './modules/purchases/purchases.events.js';
import { initializeSalesEvents } from './modules/sales/sales.events.js';
import { initializeCashEvents } from './modules/cash/cash.events.js';
import { isAuthenticated } from './modules/auth/auth.service.js';

function bootstrap() {
    try {
        console.log('Starting Samsan Books...');
        
        if (!isAuthenticated()) {
            console.log('User not authenticated, redirecting to login...');
            window.location.href = 'login.html';
            return;
        }

        loadState();
        renderNavbar();
        initializeRouter();
        renderPurchaseTable();
        renderSalesTable();
        renderCashTable();

        // Initialize Reports (fetches data from backend and renders UI)
        initializeReports();

        setActiveView(state.currentView);
        initializePurchaseEvents();
        initializeSalesEvents();
        initializeCashEvents();
        console.log('Samsan Books Ready');
    } catch (error) {
        console.error('CRITICAL: Bootstrap failed', error);
    }
}


bootstrap();