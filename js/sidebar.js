// Conclave Profile Sidebar Drawer Module

(function() {
    // 1. Inject Styles for the Sidebar
    const style = document.createElement('style');
    style.innerHTML = `
        #profile-sidebar-overlay {
            position: fixed;
            inset: 0;
            z-index: 9998;
            background-color: var(--glass-bg-heavy);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            opacity: 0;
            transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        }
        #profile-sidebar-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }
        #profile-sidebar-drawer {
            position: fixed;
            top: 0;
            right: -420px;
            width: 100%;
            max-width: 400px;
            height: 100%;
            z-index: 9999;
            background: var(--glass-bg-heavy);
            backdrop-filter: blur(30px) saturate(180%);
            -webkit-backdrop-filter: blur(30px) saturate(180%);
            border-left: 1px solid var(--glass-border);
            box-shadow: var(--shadow-float);
            transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            color: var(--text-primary);
            font-family: var(--font-body, 'Inter', sans-serif);
        }
        #profile-sidebar-drawer.active {
            right: 0;
        }
        .sidebar-header {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 24px;
            border-bottom: 1px solid var(--border-subtle);
        }
        .sidebar-title {
            font-family: var(--font-display, 'Montserrat', sans-serif);
            font-size: 20px;
            font-weight: 300;
            color: var(--text-primary);
            letter-spacing: -0.02em;
        }
        .sidebar-user {
            padding: 32px 24px;
            display: flex;
            align-items: center;
            gap: 24px;
        }
        .sidebar-avatar {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--gold-subtle), rgba(230,198,135,0.05));
            border: 1px solid var(--border-medium);
            color: var(--gold);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 400;
            font-family: var(--font-display, 'Montserrat', sans-serif);
        }
        .sidebar-user-info h3 {
            font-family: var(--font-display, 'Montserrat', sans-serif);
            font-size: 20px;
            font-weight: 300;
            margin-bottom: 4px;
            color: var(--text-primary);
        }
        .sidebar-user-info p {
            font-size: 13px;
            color: var(--text-secondary);
        }
        .sidebar-menu {
            flex-grow: 1;
            overflow-y: auto;
            padding: 0 24px 24px;
        }
        .sidebar-item-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            text-decoration: none;
            color: var(--text-primary);
            margin-bottom: 12px;
        }
        .sidebar-item-card:hover {
            border-color: var(--border-hover);
            background: var(--gold-glow);
            transform: translateX(4px);
        }
        .sidebar-item-card .flex {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .sidebar-item-card .flex span.material-symbols-outlined {
            color: var(--gold);
            font-size: 20px;
        }
        .sidebar-item-card .flex span:last-child {
            font-family: var(--font-body, 'Inter', sans-serif);
            font-size: 14px;
            font-weight: 400;
            color: var(--text-primary);
        }
        .sidebar-section-title {
            font-family: var(--font-body, 'Inter', sans-serif);
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--text-muted);
            margin: 32px 0 16px;
            display: block;
        }
        .sidebar-item-card.logout:hover {
            border-color: rgba(239, 68, 68, 0.3);
            background: rgba(239, 68, 68, 0.05);
        }
        .sidebar-item-card.logout .flex span.material-symbols-outlined {
            color: #ef4444;
        }
    `;
    document.head.appendChild(style);

    function initProfileSidebar() {
        const triggers = document.querySelectorAll('.nav-avatar');
        if (triggers.length === 0) return;

        const isSubdirectory = window.location.pathname.includes('/pages/');
        const bookingsPath = isSubdirectory ? 'bookings.html' : 'pages/bookings.html';
        const settingsPath = isSubdirectory ? 'settings.html' : 'pages/settings.html';
        const indexPath = isSubdirectory ? '../index.html' : 'index.html';

        let overlay = document.getElementById('profile-sidebar-overlay');
        let drawer = document.getElementById('profile-sidebar-drawer');

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'profile-sidebar-overlay';
            document.body.appendChild(overlay);
        }

        const userName = localStorage.getItem('conclave_user_name') || 'Member Guest';
        const userEmail = localStorage.getItem('conclave_user_email') || 'contact@conclave.com';
        const userInitial = userName.charAt(0).toUpperCase();

        if (!drawer) {
            drawer = document.createElement('div');
            drawer.id = 'profile-sidebar-drawer';
            drawer.innerHTML = `
                <div class="sidebar-header">
                    <button id="profile-close-btn" class="material-symbols-outlined" style="font-size:24px; cursor:pointer; color:var(--gold);">arrow_back</button>
                    <span class="sidebar-title">Profile</span>
                </div>
                <div class="sidebar-user">
                    <div class="sidebar-avatar">${userInitial}</div>
                    <div class="sidebar-user-info">
                        <h3>${userName}</h3>
                        <p>${userEmail}</p>
                    </div>
                </div>
                <div class="sidebar-menu">
                    <a href="${bookingsPath}" class="sidebar-item-card">
                        <div class="flex">
                            <span class="material-symbols-outlined">receipt_long</span>
                            <span style="font-size:14px; font-weight:500;">View all bookings</span>
                        </div>
                        <span class="material-symbols-outlined" style="opacity:0.5; font-size:20px;">chevron_right</span>
                    </a>
                    <a href="${settingsPath}" class="sidebar-item-card">
                        <div class="flex">
                            <span class="material-symbols-outlined">settings</span>
                            <span style="font-size:14px; font-weight:500;">Settings</span>
                        </div>
                        <span class="material-symbols-outlined" style="opacity:0.5; font-size:20px;">chevron_right</span>
                    </a>

                    <span class="sidebar-section-title">More</span>
                    <a href="#" class="sidebar-item-card" style="margin-bottom:0; border-bottom-left-radius:0; border-bottom-right-radius:0; border-bottom:none;">
                        <div class="flex">
                            <span class="material-symbols-outlined">help</span>
                            <span style="font-size:14px; font-weight:500;">Terms & Conditions</span>
                        </div>
                        <span class="material-symbols-outlined" style="opacity:0.5; font-size:20px;">chevron_right</span>
                    </a>
                    <a href="${isSubdirectory ? '../admin.html' : 'admin.html'}" class="sidebar-item-card" style="margin-bottom:0; border-radius:0; border-bottom:none;">
                        <div class="flex">
                            <span class="material-symbols-outlined">admin_panel_settings</span>
                            <span style="font-size:14px; font-weight:500;">Admin Dashboard</span>
                        </div>
                        <span class="material-symbols-outlined" style="opacity:0.5; font-size:20px;">chevron_right</span>
                    </a>
                    <a href="#" class="sidebar-item-card" style="margin-bottom:24px; border-top-left-radius:0; border-top-right-radius:0;">
                        <div class="flex">
                            <span class="material-symbols-outlined">description</span>
                            <span style="font-size:14px; font-weight:500;">Privacy Policy</span>
                        </div>
                        <span class="material-symbols-outlined" style="opacity:0.5; font-size:20px;">chevron_right</span>
                    </a>

                    <a href="${indexPath}" class="sidebar-item-card logout">
                        <div class="flex">
                            <span class="material-symbols-outlined" style="color:#ff4d4d;">logout</span>
                            <span style="font-size:14px; font-weight:500;">Logout</span>
                        </div>
                    </a>
                </div>
            `;
            document.body.appendChild(drawer);
        }

        const openDrawer = () => {
            overlay.classList.add('active');
            drawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeDrawer = () => {
            overlay.classList.remove('active');
            drawer.classList.remove('active');
            document.body.style.overflow = '';
        };

        triggers.forEach(trig => {
            trig.addEventListener('click', (e) => {
                e.preventDefault();
                openDrawer();
            });
        });

        document.getElementById('profile-close-btn').addEventListener('click', closeDrawer);
        overlay.addEventListener('click', closeDrawer);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('active')) {
                closeDrawer();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProfileSidebar);
    } else {
        initProfileSidebar();
    }
})();
