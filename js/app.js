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

async function bootstrap() {
    try {
        console.log('Starting Samsan Books...');
        
        if (!isAuthenticated()) {
            console.log('User not authenticated, redirecting to login...');
            window.location.href = 'login.html';
            return;
        }

        // Show Global Loading State
        const loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.innerHTML = `
            <div style="position: fixed; inset: 0; background: var(--bg-body); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;">
                <div style="width: 48px; height: 48px; border: 4px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <h2 style="color: var(--text-main); font-weight: 600;">Loading Workspace...</h2>
            </div>
            <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
        `;
        document.body.appendChild(loader);

        loadState();
        renderNavbar();
        initializeRouter();
        
        // Initial empty renders
        renderPurchaseTable();
        renderSalesTable();
        renderCashTable();

        // Fetch all critical data concurrently
        await Promise.allSettled([
            initializePurchaseEvents(),
            initializeSalesEvents(),
            initializeCashEvents(),
            initializeReports()
        ]);

        setActiveView(state.currentView);
        console.log('Samsan Books Ready');
        
        // Remove loading state
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.4s ease';
        setTimeout(() => loader.remove(), 400);

    } catch (error) {
        console.error('CRITICAL: Bootstrap failed', error);
        document.getElementById('globalLoader')?.remove();
    }
}


bootstrap();