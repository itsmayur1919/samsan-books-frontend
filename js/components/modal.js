/**
 * Modern, Ultra-Premium Modal Component
 * Displays beautifully styled dialogs in the center of the screen
 */

export function showModal(options = {}) {
    const {
        title = '',
        message = '',
        type = 'info', // 'info', 'success', 'error', 'warning'
        buttons = ['OK'],
        onButtonClick = null,
        autoClose = false,
        autoCloseDelay = 3000
    } = options;

    // Inject modern ultra-premium modal styles if they don't exist
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 23, 42, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            .modal-container {
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.4);
                border-radius: 20px;
                box-shadow: 
                    0 20px 40px -15px rgba(15, 23, 42, 0.2),
                    0 0 0 1px rgba(15, 23, 42, 0.05),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
                max-width: 400px;
                width: 90%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: 2.25rem 1.75rem 1.75rem 1.75rem;
                position: relative;
                animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                font-family: 'DM Sans', -apple-system, sans-serif;
            }

            .modal-badge {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.25rem;
                margin-bottom: 1.25rem;
                position: relative;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            }

            /* Type Specific Styles */
            .modal-info .modal-badge {
                background: linear-gradient(135deg, #eff6ff, #dbeafe);
                color: #2563eb;
            }
            .modal-success .modal-badge {
                background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                color: #10b981;
            }
            .modal-warning .modal-badge {
                background: linear-gradient(135deg, #fffbeb, #fef3c7);
                color: #d97706;
            }
            .modal-error .modal-badge {
                background: linear-gradient(135deg, #fef2f2, #fee2e2);
                color: #ef4444;
            }

            .modal-title {
                margin: 0 0 0.75rem 0;
                font-size: 1.4rem;
                font-weight: 700;
                color: #0f172a;
                letter-spacing: -0.025em;
            }

            .modal-message {
                color: #475569;
                font-size: 0.95rem;
                line-height: 1.6;
                margin: 0 0 1.75rem 0;
                font-weight: 500;
            }

            .modal-actions {
                width: 100%;
                display: flex;
                gap: 0.75rem;
                justify-content: center;
            }

            .modal-button {
                padding: 0.85rem 1.75rem;
                border: none;
                border-radius: 12px;
                font-size: 0.95rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                flex: 1;
                font-family: inherit;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .modal-btn-primary {
                background: #0f172a;
                color: white;
                box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
            }

            .modal-btn-primary:hover {
                background: #1e293b;
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(15, 23, 42, 0.25);
            }

            .modal-btn-primary:active {
                transform: translateY(0);
            }

            .modal-btn-secondary {
                background: #f1f5f9;
                color: #475569;
            }

            .modal-btn-secondary:hover {
                background: #e2e8f0;
                color: #0f172a;
                transform: translateY(-2px);
            }

            /* Animations */
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes modalSlideUp {
                from {
                    opacity: 0;
                    transform: scale(0.92) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            @keyframes modalFadeOut {
                from {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: scale(0.95) translateY(15px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // Create container
    const container = document.createElement('div');
    container.className = `modal-container modal-${type}`;

    // Select emoji badge
    const badgeMap = {
        info: 'ℹ️',
        success: '✨',
        warning: '⚡',
        error: '⚠️'
    };

    container.innerHTML = `
        <div class="modal-badge">${badgeMap[type] || '💬'}</div>
        <h2 class="modal-title">${title}</h2>
        <p class="modal-message">${message}</p>
        <div class="modal-actions">
            ${buttons.map((btn, idx) => `
                <button class="modal-button ${idx === 0 ? 'modal-btn-primary' : 'modal-btn-secondary'}" data-action="${idx}">
                    ${btn}
                </button>
            `).join('')}
        </div>
    `;

    // Event listeners
    const actionButtons = container.querySelectorAll('.modal-button');
    actionButtons.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            if (onButtonClick) {
                onButtonClick(idx);
            }
            closeModal();
        });
    });

    // Close function
    function closeModal() {
        container.style.animation = 'modalFadeOut 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.25s ease';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 250);
    }

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    if (autoClose) {
        setTimeout(() => {
            if (overlay.parentNode) {
                closeModal();
            }
        }, autoCloseDelay);
    }

    return {
        close: closeModal
    };
}

export function showConfirmModal(options = {}) {
    const {
        title = 'Confirm Action',
        message = 'Are you sure you want to proceed?',
        onConfirm = null,
        onCancel = null
    } = options;

    return showModal({
        title,
        message,
        type: 'warning',
        buttons: ['Confirm', 'Cancel'],
        onButtonClick: (index) => {
            if (index === 0 && onConfirm) {
                onConfirm();
            } else if (index === 1 && onCancel) {
                onCancel();
            }
        }
    });
}

export function showAlertModal(message, type = 'info', title = '') {
    return showModal({
        title: title || (type === 'error' ? 'Failed' : type === 'success' ? 'Success' : 'Notice'),
        message,
        type,
        buttons: ['OK'],
        autoClose: type === 'success'
    });
}
