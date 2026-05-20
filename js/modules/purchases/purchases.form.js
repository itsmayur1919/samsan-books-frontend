import { state } from '../../core/state.js';
import { saveState } from '../../core/storage.js';
import { calculateGST } from '../../utils/calculations.js';

export function initializePurchaseForm() {

    console.log('Purchase form initialized');
}

export function addPurchase(payload) {

    const gst = calculateGST(
        payload.basicAmount,
        payload.gstPercent,
        payload.taxType
    );

    const purchase = {
        ...payload,
        ...gst,
        createdAt: Date.now()
    };

    state.purchases.unshift(purchase);

    saveState();
}