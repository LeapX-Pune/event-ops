// ═══ Toast Notification System ═══
// Global toast for success, error, and info messages.
// Usage: showToast('Message text', 'success' | 'error' | 'info');

(function () {
    // Inject styles once
    const style = document.createElement('style');
    style.textContent = `
        #toast-container {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        }
        .toast {
            pointer-events: auto;
            min-width: 280px;
            max-width: 400px;
            padding: 14px 20px;
            border-radius: 10px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            line-height: 1.5;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 10px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            transform: translateX(120%);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .toast.show {
            transform: translateX(0);
            opacity: 1;
        }
        .toast.hide {
            transform: translateX(120%);
            opacity: 0;
        }
        .toast-success {
            background: rgba(34, 197, 94, 0.15);
            border-color: rgba(34, 197, 94, 0.3);
        }
        .toast-error {
            background: rgba(239, 68, 68, 0.15);
            border-color: rgba(239, 68, 68, 0.3);
        }
        .toast-info {
            background: rgba(99, 102, 241, 0.15);
            border-color: rgba(99, 102, 241, 0.3);
        }
        .toast-icon {
            font-size: 18px;
            flex-shrink: 0;
        }
        .toast-success .toast-icon { color: #22c55e; }
        .toast-error .toast-icon { color: #ef4444; }
        .toast-info .toast-icon { color: #818cf8; }
    `;
    document.head.appendChild(style);

    // Create container
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const iconMap = {
        success: 'check_circle',
        error: 'error',
        info: 'info'
    };

    window.showToast = function (message, type) {
        type = type || 'info';
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML = `
            <span class="material-symbols-outlined toast-icon">${iconMap[type] || 'info'}</span>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
        });

        // Auto dismiss
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    };
})();
