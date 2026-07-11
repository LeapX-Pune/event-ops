/* ============================================================
   CONCLAVE — WebGL Particle Field
   Shopify Editions-inspired particle continuum
   Particles form text, react to mouse, dissolve on scroll
   ============================================================ */

(function () {
    'use strict';

    const canvas = document.getElementById('world-canvas');
    if (!canvas) return;

    // ── Configuration ──
    const PARTICLE_COUNT = 40000;
    const MOUSE_RADIUS = 0.15;
    const MOUSE_PUSH = 0.02;
    const RETURN_SPEED = 0.12;

    // Read colors from CSS custom properties (theme-aware)
    function getThemeColors() {
        const rootStyles = getComputedStyle(document.documentElement);
        const particleColor = rootStyles.getPropertyValue('--particle-color').trim();
        const particleBg = rootStyles.getPropertyValue('--particle-bg').trim();
        
        // Parse particle color (format: "r, g, b")
        let color = { r: 230, g: 198, b: 135 }; // Default gold
        if (particleColor) {
            const parts = particleColor.split(',').map(n => parseInt(n.trim(), 10));
            if (parts.length === 3) {
                color = { r: parts[0], g: parts[1], b: parts[2] };
            }
        }
        
        // Parse background color
        let bg = { r: 10, g: 10, b: 18 }; // Default dark
        if (particleBg) {
            // Could be hex or rgb
            if (particleBg.startsWith('#')) {
                const hex = particleBg.slice(1);
                bg = {
                    r: parseInt(hex.slice(0, 2), 16),
                    g: parseInt(hex.slice(2, 4), 16),
                    b: parseInt(hex.slice(4, 6), 16)
                };
            } else if (particleBg.startsWith('rgb')) {
                const parts = particleBg.match(/\d+/g);
                if (parts && parts.length >= 3) {
                    bg = { r: parseInt(parts[0]), g: parseInt(parts[1]), b: parseInt(parts[2]) };
                }
            }
        }
        
        return { color, bg };
    }

    let width, height, dpr;
    let ctx;
    let particles = [];
    let textPositions = [];
    let mouseNorm = { x: -999, y: -999 };
    let scrollProgress = 0;
    let animId;
    let currentColors = getThemeColors();

    // ── Init ──
    function init() {
        ctx = canvas.getContext('2d');
        dpr = Math.min(window.devicePixelRatio, 2);
        resize();
        generateTextPositions();
        createParticles();
        bindEvents();
        animate();
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // ── Text-to-Points ──
    function generateTextPositions() {
        textPositions = [];
        const offscreen = document.createElement('canvas');
        const octx = offscreen.getContext('2d');

        const text = 'CONCLAVE';
        // Scale font to viewport
        const fontSize = Math.min(width * 0.13, 160);
        offscreen.width = width * dpr;
        offscreen.height = height * dpr;
        octx.setTransform(dpr, 0, 0, dpr, 0, 0);

        octx.fillStyle = '#fff';
        // Use font weight 200 to give the text strokes slightly more density for clean sampling
        octx.font = `150 ${fontSize}px 'Montserrat', sans-serif`;
        octx.textAlign = 'center';
        octx.textBaseline = 'middle';
        octx.fillText(text, width / 2, height / 2 - 20);

        // Sample pixels with a smaller step to capture thin strokes without missing parts (like N or L)
        const step = 2;

        const imageData = octx.getImageData(0, 0, offscreen.width, offscreen.height);
        const data = imageData.data;

        for (let y = 0; y < offscreen.height; y += step * dpr) {
            for (let x = 0; x < offscreen.width; x += step * dpr) {
                const idx = (Math.floor(y) * offscreen.width + Math.floor(x)) * 4;
                if (idx < data.length && data[idx + 3] > 80) { // Slightly lower alpha threshold to capture edges
                    textPositions.push({
                        x: x / dpr,
                        y: y / dpr
                    });
                }
            }
        }

        // Shuffle the textPositions array so that if PARTICLE_COUNT < textPositions.length,
        // particles are distributed randomly across all letters rather than filling left-to-right
        for (let i = textPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = textPositions[i];
            textPositions[i] = textPositions[j];
            textPositions[j] = temp;
        }
    }

    // ── Create Particles ──
    function createParticles() {
        currentColors = getThemeColors();
        particles = [];
        const count = Math.min(PARTICLE_COUNT, textPositions.length);

        for (let i = 0; i < count; i++) {
            const tp = textPositions[i];
            particles.push({
                // Current position (start scattered)
                x: Math.random() * width,
                y: Math.random() * height,
                // Target position (text shape)
                tx: tp.x,
                ty: tp.y,
                // Scattered position (random)
                sx: Math.random() * width,
                sy: Math.random() * height,
                // Velocity
                vx: 0, vy: 0,
                // Size
                baseSize: Math.random() * 1.5 + 0.8,
                // Opacity
                alpha: Math.random() * 0.5 + 0.5,
                // Phase for subtle animation
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.5 + 0.5,
            });
        }

        // Add ambient floating particles (extra ones that never form text)
        const ambientCount = Math.floor(PARTICLE_COUNT * 0.3);
        for (let i = 0; i < ambientCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                tx: Math.random() * width,
                ty: Math.random() * height,
                sx: Math.random() * width,
                sy: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                baseSize: Math.random() * 1.2 + 0.3,
                alpha: Math.random() * 0.2 + 0.05,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.3 + 0.2,
                isAmbient: true,
            });
        }
    }

    // ── Animation ──
    function animate() {
        animId = requestAnimationFrame(animate);
        const time = performance.now() * 0.001;

        // Clear with theme-aware background
        ctx.fillStyle = `rgb(${currentColors.bg.r}, ${currentColors.bg.g}, ${currentColors.bg.b})`;
        ctx.fillRect(0, 0, width, height);

        // Determine text formation vs scatter based on scroll
        // At scroll 0 = particles form text, scroll > 0.1 = scattered/dissolved
        const formFactor = Math.max(0, 1 - scrollProgress * 5); // Dissolves fast

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (p.isAmbient) {
                // Ambient particles just float
                p.x += p.vx + Math.sin(time * p.speed + p.phase) * 0.1;
                p.y += p.vy + Math.cos(time * p.speed + p.phase) * 0.1;

                // Wrap around
                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;

                // Scale down on scroll for depth
                const size = p.baseSize * (0.5 + (1 - scrollProgress) * 0.5);
                const alpha = p.alpha * (0.3 + (1 - scrollProgress) * 0.7);

                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.2, size), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${currentColors.color.r}, ${currentColors.color.g}, ${currentColors.color.b}, ${alpha})`;
                ctx.fill();
                continue;
            }

            // Target: blend between text position and scattered position
            const targetX = p.tx * formFactor + p.sx * (1 - formFactor);
            const targetY = p.ty * formFactor + p.sy * (1 - formFactor);

            // Move toward target
            const dx = targetX - p.x;
            const dy = targetY - p.y;
            p.x += dx * RETURN_SPEED;
            p.y += dy * RETURN_SPEED;

            // Mouse repulsion
            const mdx = p.x / width - mouseNorm.x;
            const mdy = p.y / height - mouseNorm.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < MOUSE_RADIUS && mDist > 0) {
                const force = (MOUSE_RADIUS - mDist) / MOUSE_RADIUS;
                p.x += (mdx / mDist) * force * MOUSE_PUSH * width * 0.05;
                p.y += (mdy / mDist) * force * MOUSE_PUSH * height * 0.05;
            }

            // Size + alpha
            const breathe = Math.sin(time * p.speed + p.phase) * 0.3;
            const size = p.baseSize * (0.8 + breathe * 0.2) * (0.4 + formFactor * 0.6);
            const alpha = p.alpha * (0.15 + formFactor * 0.85);

            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0.2, size), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${currentColors.color.r}, ${currentColors.color.g}, ${currentColors.color.b}, ${alpha})`;
            ctx.fill();
        }
    }

    // ── Events ──
    function bindEvents() {
        window.addEventListener('resize', () => {
            resize();
            generateTextPositions();
            // Update text targets for existing particles
            const count = Math.min(textPositions.length, particles.filter(p => !p.isAmbient).length);
            let ti = 0;
            for (let i = 0; i < particles.length && ti < count; i++) {
                if (!particles[i].isAmbient) {
                    particles[i].tx = textPositions[ti].x;
                    particles[i].ty = textPositions[ti].y;
                    ti++;
                }
            }
        });

        window.addEventListener('mousemove', (e) => {
            mouseNorm.x = e.clientX / width;
            mouseNorm.y = e.clientY / height;
        });

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
        }, { passive: true });

        // Theme change handler
        window.addEventListener('themechange', () => {
            currentColors = getThemeColors();
            // Recreate particles with new colors
            createParticles();
        });
    }

    // ── Start ──
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        });
    } else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            setTimeout(init, 200);
        }
    }

    // Expose cleanup
    window.destroyThreeWorld = function () {
        if (animId) cancelAnimationFrame(animId);
    };

})();
