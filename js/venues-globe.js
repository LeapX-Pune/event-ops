// ═══ 3D Globe Implementation for Venues ═══
// Handles Globe rendering and event pin placements.

document.addEventListener('DOMContentLoaded', () => {
    // Check if Globe exists on this page
    if (!document.getElementById('globe-container')) return;

    // Force coordinates to center on India (Lat: 20.5937, Lng: 78.9629)
    let userLat = 20.5937;
    let userLng = 78.9629;

    initGlobe(userLat, userLng);

    // Theme-aware texture URLs
    function getGlobeTextures() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        return {
            globeImage: isLight 
                ? '../assets/img/earth-light.png' // Custom light theme earth texture
                : '../assets/img/earth-dark.jpg',
            bumpImage: '../assets/img/earth-topology.png',
            backgroundImage: isLight
                ? '../assets/img/light-sky-premium.png'
                : '../assets/img/night-sky.png',
            backgroundColor: isLight ? 'rgba(0,0,0,0)' : '#000000',
            atmosphereColor: isLight ? '#C49A2A' : '#E6C687'
        };
    }

    // --- 2. Globe Initialization ---
    function initGlobe(lat, lng) {
        const container = document.getElementById('globe-container');
        const textures = getGlobeTextures();
        
        // Setup Globe
        const world = Globe()
            (container)
            .globeImageUrl(textures.globeImage)
            .bumpImageUrl(textures.bumpImage)
            .backgroundImageUrl(textures.backgroundImage)
            .backgroundColor(textures.backgroundColor)
            .showAtmosphere(true)
            .atmosphereColor(textures.atmosphereColor)
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
                        <h4 style="font-family:var(--font-display); font-size:16px; font-weight:400; color:var(--text-primary); margin-bottom:6px;">${d.title}</h4>
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

        // Theme change handler - update globe textures
        window.addEventListener('themechange', (e) => {
            const newTextures = getGlobeTextures();
            world.globeImageUrl(newTextures.globeImage);
            world.backgroundImageUrl(newTextures.backgroundImage);
            world.backgroundColor(newTextures.backgroundColor);
            world.atmosphereColor(newTextures.atmosphereColor);
        });
    }

    // --- 3. Procedural Event Placement ---
    function generateNearbyEvents() {
        if (!window.CONCLAVE_EVENTS) return [];

        const allEvents = [...window.CONCLAVE_EVENTS];
        // Shuffle the events array
        for (let i = allEvents.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allEvents[i], allEvents[j]] = [allEvents[j], allEvents[i]];
        }

        // Take exactly 5 random events
        const selectedEvents = allEvents.slice(0, 5);
        const placedEvents = [];

        // Pre-defined safe land coordinates for major Indian cities
        const indiaLocations = [
            { lat: 28.7041, lng: 77.1025 }, // Delhi
            { lat: 19.0760, lng: 72.8777 }, // Mumbai
            { lat: 12.9716, lng: 77.5946 }, // Bangalore
            { lat: 13.0827, lng: 80.2707 }, // Chennai
            { lat: 22.5726, lng: 88.3639 }, // Kolkata
            { lat: 18.5204, lng: 73.8567 }, // Pune
            { lat: 17.3850, lng: 78.4867 }, // Hyderabad
            { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
            { lat: 26.9124, lng: 75.7873 }, // Jaipur
            { lat: 26.8467, lng: 80.9462 }, // Lucknow
            { lat: 30.7333, lng: 76.7794 }, // Chandigarh
            { lat: 23.2599, lng: 77.4126 }, // Bhopal
            { lat: 25.5941, lng: 85.1376 }, // Patna
            { lat: 9.9312, lng: 76.2673 },  // Kochi
            { lat: 26.1445, lng: 91.7362 }  // Guwahati
        ];

        // Shuffle the locations array
        for (let i = indiaLocations.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indiaLocations[i], indiaLocations[j]] = [indiaLocations[j], indiaLocations[i]];
        }

        selectedEvents.forEach((evt, index) => {
            // Assign a guaranteed land coordinate
            const loc = indiaLocations[index % indiaLocations.length];
            
            placedEvents.push({
                ...evt,
                lat: loc.lat,
                lng: loc.lng
            });
        });

        return placedEvents;
    }
});