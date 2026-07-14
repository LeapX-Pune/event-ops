(function() {
    // Inject the overlay into the DOM as soon as the script runs
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    document.documentElement.appendChild(overlay);

    // Fade in the page when it loads
    window.addEventListener('load', () => {
        // Small timeout to ensure initial layout is rendered before fading in
        setTimeout(() => {
            overlay.classList.add('is-loaded');
        }, 50);
    });

    // Handle clicks on internal links
    document.addEventListener('click', (e) => {
        // Find the closest anchor tag
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // Ignore links without href, anchors, target="_blank", or external links
        if (!href || 
            href.startsWith('#') || 
            link.getAttribute('target') === '_blank' ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.includes('javascript:')) {
            return;
        }

        // Ignore clicks with modifiers (Cmd, Ctrl, Shift) - let browser handle new tabs natively
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;

        // Ignore clicks on elements that have their own JS logic (like the sidebar trigger)
        if (link.classList.contains('nav-avatar') || link.closest('.no-transition')) return;

        // Prevent immediate navigation
        e.preventDefault();

        // Trigger the fade-out animation
        overlay.classList.remove('is-loaded');
        overlay.classList.add('is-exiting');

        // Wait for the animation to complete (0.6s as defined in CSS), then navigate
        setTimeout(() => {
            window.location.href = link.href;
        }, 600);
    });
})();
