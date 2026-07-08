// ═══ 3D Globe Implementation for Venues ═══
// Handles Globe rendering and event pin placements.

document.addEventListener('DOMContentLoaded', () => {
    // Check if Globe exists on this page
    if (!document.getElementById('globe-container')) return;

    // Load from localStorage or use default (NYC)
    let userLat = parseFloat(localStorage.getItem('conclave_user_lat')) || 40.7128;
    let userLng = parseFloat(localStorage.getItem('conclave_user_lng')) || -74.0060;

    initGlobe(userLat, userLng);

    // --- 2. Globe Initialization ---
    function initGlobe(lat, lng) {
        const container = document.getElementById('globe-container');
        
        // Setup Globe
        const world = Globe()
            (container)
            .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
            .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
            .showAtmosphere(true)
            .atmosphereColor('#E6C687')
            .atmosphereAltitude(0.15)
            .htmlElementsData(generateNearbyEvents(lat, lng))
            .htmlElement(d => {
                const el = document.createElement('div');
                el.className = 'globe-marker';
                
                // Construct the HTML for the pin and popup
                el.innerHTML = `
                    <div class="marker-pulse"></div>
                    <div class="marker-core"></div>
                    <div class="marker-popup">
                        <span class="text-label" style="color:var(--gold); display:block; margin-bottom:8px;">${d.category}</span>
                        <h4 style="font-family:var(--font-display); font-size:16px; font-weight:400; color:white; margin-bottom:6px;">${d.title}</h4>
                        <p style="font-size:12px; color:var(--text-secondary); margin-bottom: 16px;">
                            ${d.date} • ${d.time}
                        </p>
                        <a href="event-detail.html?event=${d.id}" class="btn-primary" style="padding: 8px 16px; font-size:11px; width:100%; display:inline-block; text-align:center;">
                            RSVP Now
                        </a>
                    </div>
                `;
                return el;
            });

        // Set initial camera position (Outer Space)
        world.pointOfView({ lat: lat, lng: lng, altitude: 3.5 });

        // Add auto-rotation
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 0.5;

        // Animate Zoom in after 0.5 seconds to feel more immediate
        setTimeout(() => {
            world.controls().autoRotate = false; // Stop rotation during zoom
            // Fly to the user's location, very close for "zoom" effect
            world.pointOfView({ lat: lat, lng: lng, altitude: 0.15 }, 4000);
            
            // Resume very slow rotation after zoom
            setTimeout(() => {
                world.controls().autoRotate = true;
                world.controls().autoRotateSpeed = 0.02; // very slow
            }, 4500);
        }, 500);

        // Handle window resize
        window.addEventListener('resize', () => {
            world.width(window.innerWidth);
            world.height(window.innerHeight);
        });
    }

    // --- 3. Procedural Event Placement ---
    function generateNearbyEvents(centerLat, centerLng) {
        // We take the 6 events from the global store (window.CONCLAVE_EVENTS)
        // We will assign 5 of them to be near the user's location, and 1 far away.
        if (!window.CONCLAVE_EVENTS) return [];

        const events = [...window.CONCLAVE_EVENTS]; // Copy
        const placedEvents = [];

        events.forEach((evt, index) => {
            // First 5 events will be placed near the center coordinates
            if (index < 5) {
                // Generate a random offset between -5 and +5 degrees
                const latOffset = (Math.random() - 0.5) * 8; 
                const lngOffset = (Math.random() - 0.5) * 8;
                
                placedEvents.push({
                    ...evt,
                    lat: centerLat + latOffset,
                    lng: centerLng + lngOffset
                });
            } else {
                // 6th event placed randomly elsewhere in the world
                placedEvents.push({
                    ...evt,
                    lat: (Math.random() - 0.5) * 160,
                    lng: (Math.random() - 0.5) * 360
                });
            }
        });

        return placedEvents;
    }
});
