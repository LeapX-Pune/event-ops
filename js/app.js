/* ============================================================
   CONCLAVE — Core App Logic
   Navigation, theme toggle, chat, particles, mobile menu
   ============================================================ */

(function () {
    'use strict';

    // ── Nav Scroll Effect ───────────────────────────────────────
    function initNavScroll() {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ── Mobile Menu Toggle ──────────────────────────────────────
    function initMobileMenu() {
        const openBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('mobile-menu-close');
        const menu = document.getElementById('mobile-menu');

        if (!openBtn || !menu) return;

        openBtn.addEventListener('click', () => {
            menu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                menu.classList.remove('open');
                document.body.style.overflow = '';
            });
        }

        // Close on link click
        menu.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ── Theme Toggle ────────────────────────────────────────────
    function initThemeToggle() {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        btn.addEventListener('click', () => {
            // For now, keep dark mode only (the design is built for dark)
            // Can add light mode later
            btn.textContent = btn.textContent === 'light_mode' ? 'dark_mode' : 'light_mode';
        });
    }

    // ── Chat Widget ─────────────────────────────────────────────
    function initChatWidget() {
        const toggle = document.getElementById('chat-toggle');
        const window_ = document.getElementById('chat-window');
        const close = document.getElementById('chat-close');
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');
        const messages = document.getElementById('chat-messages');

        if (!toggle || !window_) return;

        toggle.addEventListener('click', () => {
            window_.classList.toggle('open');
        });

        if (close) {
            close.addEventListener('click', () => {
                window_.classList.remove('open');
            });
        }

        function sendMessage() {
            if (!input || !messages) return;
            const text = input.value.trim();
            if (!text) return;

            // User message
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-msg user';
            userMsg.textContent = text;
            messages.appendChild(userMsg);
            input.value = '';
            messages.scrollTop = messages.scrollHeight;

            // Bot response
            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'chat-msg bot';

                const lower = text.toLowerCase();
                if (lower.includes('tech') || lower.includes('technology')) {
                    botMsg.textContent = "We have a 'Frontend Bootcamp' coming up. Check our events page for more tech events!";
                } else if (lower.includes('weekend')) {
                    botMsg.textContent = "Yes, there are several workshops this weekend. Filter by date on our events page.";
                } else if (lower.includes('music') || lower.includes('gala')) {
                    botMsg.textContent = "Music events are available under the 'Social' category. The Skyline Gala might interest you!";
                } else if (lower.includes('book') || lower.includes('register')) {
                    botMsg.textContent = "To book an event, browse our Events page, select an event, and click 'Reserve Pass'!";
                } else if (lower.includes('price') || lower.includes('cost')) {
                    botMsg.textContent = "Prices vary by event. Check individual event pages for pricing details.";
                } else {
                    botMsg.textContent = "I can help you find events. Try asking about 'tech events', 'weekend workshops', or 'music events'.";
                }

                messages.appendChild(botMsg);
                messages.scrollTop = messages.scrollHeight;
            }, 800);
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }
    }

    // ── Lightweight Particle Background (for inner pages) ───────
    function initParticleCanvas() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animId;
        const particles = [];
        const PARTICLE_COUNT = 80;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createParticles() {
            particles.length = 0;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.4 + 0.1,
                    phase: Math.random() * Math.PI * 2,
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const time = Date.now() * 0.001;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                const opacity = p.opacity * (0.5 + Math.sin(time + p.phase) * 0.5);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(230, 198, 135, ${opacity})`;
                ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        }

        resize();
        createParticles();
        draw();

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
    }

    // ── Loader ──────────────────────────────────────────────────
    function initLoader() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 1200);
        });
    }

    // ── Global Pre-fetch & Geolocation ──────────────────────────
    function initGlobePrefetch() {
        // Only run if not on venues.html
        if (!window.location.pathname.includes('venues.html')) {
            // 1. Prefetch heavy image assets
            const assets = [
                'https://unpkg.com/three-globe/example/img/earth-dark.jpg',
                'https://unpkg.com/three-globe/example/img/earth-topology.png',
                'https://unpkg.com/three-globe/example/img/night-sky.png'
            ];
            assets.forEach(src => {
                const img = new Image();
                img.src = src;
            });

            // 2. Preload the Three.js and Globe.gl scripts into browser cache
            setTimeout(() => {
                const script1 = document.createElement('script');
                script1.src = 'https://unpkg.com/three';
                script1.async = true;
                document.head.appendChild(script1);

                script1.onload = () => {
                    const script2 = document.createElement('script');
                    script2.src = 'https://unpkg.com/globe.gl';
                    script2.async = true;
                    document.head.appendChild(script2);
                };
            }, 2000); // Delay script preloading by 2 seconds to prioritize page load
        }
    }

    function initGeolocation() {
        // Only ask on index page if not already stored
        const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('event_new/');
        
        if (isIndex && !localStorage.getItem('conclave_user_lat')) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        localStorage.setItem('conclave_user_lat', position.coords.latitude);
                        localStorage.setItem('conclave_user_lng', position.coords.longitude);
                    },
                    (error) => {
                        console.warn("Geolocation denied. Using default.");
                        localStorage.setItem('conclave_user_lat', 40.7128);
                        localStorage.setItem('conclave_user_lng', -74.0060);
                    }
                );
            }
        }
    }

    // ── Initialize All ──────────────────────────────────────────
    function initAll() {
        initLoader();
        initNavScroll();
        initMobileMenu();
        initThemeToggle();
        initChatWidget();
        initParticleCanvas();
        initGlobePrefetch();
        initGeolocation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

})();
