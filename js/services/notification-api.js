/**
 * API Notification Integration Manager
 * 
 * Bridges the API client and notification system.
 * This ensures notifications are properly displayed without direct coupling.
 */

import { notificationManager } from './toast.js';

/**
 * Show success notification through API
 * @param {string} message - Notification message
 * @param {number} duration - Auto-dismiss duration
 */
export function notifySuccess(message, duration = 5000) {
    return notificationManager.success(message, duration);
}

/**
 * Show error notification through API
 * @param {string} message - Notification message
 * @param {number} duration - Auto-dismiss duration
 */
export function notifyError(message, duration = 7000) {
    return notificationManager.error(message, duration);
}

/**
 * Show warning notification through API
 * @param {string} message - Notification message
 * @param {number} duration - Auto-dismiss duration
 */
export function notifyWarning(message, duration = 6000) {
    return notificationManager.warning(message, duration);
}

/**
 * Show info notification through API
 * @param {string} message - Notification message
 * @param {number} duration - Auto-dismiss duration
 */
export function notifyInfo(message, duration = 5000) {
    return notificationManager.info(message, duration);
}

/**
 * Get the notification manager instance
 */
export function getNotificationManager() {
    return notificationManager;
}
