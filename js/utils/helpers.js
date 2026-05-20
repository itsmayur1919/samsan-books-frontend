export function $(id) {
    return document.getElementById(id);
}

export function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2
    }).format(value || 0);
}

export function toNumber(value) {
    const num = parseFloat(String(value || '').replace(/,/g, ''));
    return Number.isFinite(num) ? num : 0;
}

export function convertToCSV(data) {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header] === null || row[header] === undefined ? '' : String(row[header]);
            return `"${val.replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
}

export function downloadCSV(csvStr, filename) {
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function showToast(message, type = 'info') {
    // Inject styles if they don't exist
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-container {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                z-index: 9999;
                pointer-events: none;
            }
            .toast {
                min-width: 300px;
                padding: 1rem 1.25rem;
                background: white;
                color: var(--text-main);
                border-radius: var(--radius);
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-family: var(--font-sans);
                font-size: 0.85rem;
                font-weight: 600;
                transform: translateX(120%);
                animation: slideInToast 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                border-left: 4px solid transparent;
            }
            .toast.info { border-left-color: var(--primary); }
            .toast.success { border-left-color: #10b981; }
            .toast.error { border-left-color: #ef4444; }
            
            .toast-icon { font-size: 1.2rem; }
            .toast.info .toast-icon { content: 'ℹ️'; }
            
            @keyframes slideInToast {
                to { transform: translateX(0); }
            }
            @keyframes fadeOutToast {
                to { opacity: 0; transform: translateY(10px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Create container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Determine icon based on type
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOutToast 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}