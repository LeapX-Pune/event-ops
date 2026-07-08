/* ============================================================
   CONCLAVE — Scroll & Reveal Animations
   IntersectionObserver reveals, parallax, counters, stagger
   ============================================================ */

(function () {
    'use strict';

    // ── IntersectionObserver Reveal ──────────────────────────────
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally unobserve after reveal
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // ── Parallax on Scroll ──────────────────────────────────────
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;

        function updateParallax() {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.3;
                const rect = el.getBoundingClientRect();
                const offset = (rect.top + scrollY) * speed - scrollY * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        }

        window.addEventListener('scroll', updateParallax, { passive: true });
        updateParallax();
    }

    // ── Counter Animation ───────────────────────────────────────
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.counter);
                    const duration = parseInt(el.dataset.counterDuration) || 2000;
                    animateCounter(el, target, duration);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
    }

    function animateCounter(el, target, duration) {
        const start = 0;
        const startTime = performance.now();

        function tick(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.floor(start + (target - start) * eased);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(tick);
    }

    // ── Scroll Progress Bar ─────────────────────────────────────
    function initScrollProgress() {
        const bar = document.getElementById('scroll-progress');
        if (!bar) return;

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
            bar.style.width = progress + '%';
        }, { passive: true });
    }

    // ── Tilt on Mouse (for cards) ───────────────────────────────
    function initCardTilt() {
        const cards = document.querySelectorAll('.event-card');
        if (cards.length === 0) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                card.style.transform = `
                    translateY(-8px) 
                    perspective(1000px) 
                    rotateX(${-y * 5}deg) 
                    rotateY(${x * 5}deg) 
                    scale(1.01)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ── Magnetic Button Effect ──────────────────────────────────
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-outline');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ── Smooth Section Transitions ──────────────────────────────
    function initSectionTransitions() {
        const sections = document.querySelectorAll('.scroll-section');
        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-active');
                } else {
                    entry.target.classList.remove('section-active');
                }
            });
        }, {
            threshold: 0.3
        });

        sections.forEach(section => observer.observe(section));
    }

    // ── Text Scramble Effect ────────────────────────────────────
    function initTextScramble() {
        const scrambleElements = document.querySelectorAll('[data-scramble]');
        if (scrambleElements.length === 0) return;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const original = el.textContent;
                    let iteration = 0;

                    const interval = setInterval(() => {
                        el.textContent = original.split('')
                            .map((char, idx) => {
                                if (idx < iteration) return original[idx];
                                if (char === ' ') return ' ';
                                return chars[Math.floor(Math.random() * chars.length)];
                            })
                            .join('');

                        iteration += 1 / 2;
                        if (iteration >= original.length) {
                            clearInterval(interval);
                            el.textContent = original;
                        }
                    }, 30);

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        scrambleElements.forEach(el => observer.observe(el));
    }

    // ── Initialize All ──────────────────────────────────────────
    function initAll() {
        initRevealAnimations();
        initParallax();
        initCounters();
        initScrollProgress();
        initCardTilt();
        initMagneticButtons();
        initSectionTransitions();
        initTextScramble();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

})();
