import { CONFIG } from './config.js';
import { state } from './state.js';

export function loadState() {
    try {
        const raw = localStorage.getItem(CONFIG.STORAGE_KEY);

        if (!raw) return;

        const data = JSON.parse(raw);

        state.purchases = data.purchases || [];
        state.sales = data.sales || [];
        state.cash = data.cash || [];
        state.cashOpening = data.cashOpening || 0;

    } catch (error) {
        console.error('Failed to load state:', error);
    }
}

export function saveState() {
    localStorage.setItem(
        CONFIG.STORAGE_KEY,
        JSON.stringify(state)
    );
}