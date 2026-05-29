/**
 * Notification/Toast Component System
 * 
 * Provides a reusable notification component for success, error, warning, and info messages.
 * Features:
 * - Auto-dismissal with configurable duration
 * - Manual close button
 * - Toast types: success, error, warning, info
 * - Stacking support for multiple toasts
 * - Unique identifiers for toast management
 */

class NotificationManager {
    constructor() {
        this.toasts = new Map();
        this.toastId = 0;
        this.initializeContainer();
    }

    /**
     * Initialize the toast container in the DOM if it doesn't exist
     */
    initializeContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    /**
     * Show a success notification
     * @param {string} message - Notification message
     * @param {number} duration - Auto-dismiss duration in ms (default: 5000)
     * @returns {number} Toast ID for manual dismissal
     */
    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    /**
     * Show an error notification
     * @param {string} message - Notification message
     * @param {number} duration - Auto-dismiss duration in ms (default: 7000)
     * @returns {number} Toast ID for manual dismissal
     */
    error(message, duration = 7000) {
        return this.show(message, 'error', duration);
    }

    /**
     * Show a warning notification
     * @param {string} message - Notification message
     * @param {number} duration - Auto-dismiss duration in ms (default: 6000)
     * @returns {number} Toast ID for manual dismissal
     */
    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }

    /**
     * Show an info notification
     * @param {string} message - Notification message
     * @param {number} duration - Auto-dismiss duration in ms (default: 5000)
     * @returns {number} Toast ID for manual dismissal
     */
    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }

    /**
     * Internal method to show a toast
     * @private
     */
    show(message, type = 'info', duration = 5000) {
        const id = ++this.toastId;
        const toast = this.createToastElement(message, type, id);
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        this.toasts.set(id, { element: toast, timeout: null });
        
        // Auto-dismiss
        if (duration > 0) {
            const timeout = setTimeout(() => {
                this.dismiss(id);
            }, duration);
            this.toasts.get(id).timeout = timeout;
        }
        
        return id;
    }

    /**
     * Create a toast DOM element
     * @private
     */
    createToastElement(message, type, id) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        
        const icon = this.getIconForType(type);
        
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${this.escapeHtml(message)}</span>
            </div>
            <button class="toast-close" data-toast-id="${id}" aria-label="Close notification">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
            </button>
        `;
        
        // Close button handler
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.dismiss(id);
        });
        
        return toast;
    }

    /**
     * Get appropriate icon for notification type
     * @private
     */
    getIconForType(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Escape HTML to prevent XSS
     * @private
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Dismiss a specific toast
     * @param {number} id - Toast ID
     */
    dismiss(id) {
        const toast = this.toasts.get(id);
        if (toast) {
            if (toast.timeout) {
                clearTimeout(toast.timeout);
            }
            toast.element.classList.remove('show');
            setTimeout(() => {
                if (toast.element.parentNode) {
                    toast.element.remove();
                }
                this.toasts.delete(id);
            }, 300); // Match CSS transition duration
        }
    }

    /**
     * Dismiss all toasts
     */
    dismissAll() {
        Array.from(this.toasts.keys()).forEach(id => {
            this.dismiss(id);
        });
    }
}

// Export as singleton
export const notificationManager = new NotificationManager();
