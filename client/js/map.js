// Map functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if map element exists on this page
    if (document.getElementById('map')) {
        initMap();
    }
});

function initMap() {
    // Pune coordinates with zoom level 12
    const map = L.map('map').setView([18.5204, 73.8567], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Define our feeding locations in Pune
    const locations = [
        {
            id: 'koregaon-park',
            name: "Koregaon Park Feeding Station",
            latlng: [18.5340, 73.8906],
            description: "Daily 7-9 AM & 5-7 PM",
            dogsFed: 85,
            address: "Near Osho Ashram, Koregaon Park"
        },
        {
            id: 'fc-road',
            name: "FC Road Area",
            latlng: [18.5167, 73.8425],
            description: "Mon-Sat 6-8 PM",
            dogsFed: 120,
            address: "Opposite SPPU, Fergusson College Road"
        },
        {
            id: 'kothrud',
            name: "Kothrud Station",
            latlng: [18.5074, 73.8077],
            description: "Tue, Thu, Sun 5-7 PM",
            dogsFed: 65,
            address: "Near Karishma Society, Kothrud"
        },
        {
            id: 'viman-nagar',
            name: "Viman Nagar Feeding Point",
            latlng: [18.5689, 73.9191],
            description: "Wed, Fri, Sat 6-8 PM",
            dogsFed: 95,
            address: "Near Phoenix Marketcity, Viman Nagar"
        },
        {
            id: 'baner',
            name: "Baner Feeding Station",
            latlng: [18.5600, 73.7869],
            description: "Daily 6:30-8:30 PM",
            dogsFed: 110,
            address: "Near Balewadi High Street, Baner"
        }
    ];
    
    // Custom icon
    const feedingIcon = L.icon({
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff6b6b"><path d="M18 4a2 2 0 0 0-2 2v13c0 1.1-.9 2-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2h2zM8 2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8z"/></svg>',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
    
    // Add markers for each location
    locations.forEach(loc => {
        const marker = L.marker(loc.latlng, { icon: feedingIcon }).addTo(map);
        
        marker.bindPopup(`
            <div class="map-popup">
                <h3>${loc.name}</h3>
                <p><i class="fas fa-clock"></i> ${loc.description}</p>
                <p><i class="fas fa-dog"></i> Dogs fed last week: ${loc.dogsFed}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${loc.address}</p>
            </div>
        `);
        
        // Add to the location list
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h4>${loc.name}</h4>
            <p><i class="fas fa-clock"></i> Open: ${loc.description.split(': ')[1]}</p>
            <p><i class="fas fa-dog"></i> Dogs fed last week: ${loc.dogsFed}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${loc.address}</p>
            <button class="btn btn-small" data-location-id="${loc.id}">View on Map</button>
        `;
        
        document.querySelector('.location-list ul').appendChild(listItem);
        
        // Add click event to view on map buttons
        listItem.querySelector('button').addEventListener('click', function() {
            map.setView(loc.latlng, 15);
            marker.openPopup();
        });
    });
    
    // Locate me button functionality
    document.getElementById('locate-me').addEventListener('click', function() {
        if (navigator.geolocation) {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // Success callback
                    const userLatLng = [
                        position.coords.latitude,
                        position.coords.longitude
                    ];
                    
                    // Create user location marker
                    const userMarker = L.circleMarker(userLatLng, {
                        radius: 8,
                        fillColor: "#4ecdc4",
                        color: "#fff",
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8,
                        className: 'user-location-marker'
                    }).addTo(map);
                    
                    userMarker.bindPopup("Your location").openPopup();
                    
                    // Find nearest location
                    let nearest = null;
                    let minDistance = Infinity;
                    
                    locations.forEach(loc => {
                        const distance = map.distance(userLatLng, loc.latlng);
                        if (distance < minDistance) {
                            minDistance = distance;
                            nearest = loc;
                        }
                    });
                    
                    if (nearest) {
                        // Show alert with nearest location
                        const distanceKm = (minDistance/1000).toFixed(1);
                        
                        alert(`The nearest feeding station is ${nearest.name} (about ${distanceKm} km away)`);
                        
                        // Center map on the nearest location
                        map.setView(nearest.latlng, 15);
                        
                        // Add a line from user to nearest location
                        const line = L.polyline([userLatLng, nearest.latlng], {
                            color: 'red',
                            dashArray: '5, 5',
                            weight: 2
                        }).addTo(map);
                        
                        // Remove markers and line after 10 seconds
                        setTimeout(() => {
                            map.removeLayer(userMarker);
                            map.removeLayer(line);
                        }, 10000);
                    }
                    
                    // Reset button
                    document.getElementById('locate-me').disabled = false;
                    document.getElementById('locate-me').innerHTML = '<i class="fas fa-location-arrow"></i> Find Nearest Station';
                },
                function(error) {
                    // Error callback
                    let errorMessage;
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "Location access was denied. Please enable location services in your browser settings.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "Location information is unavailable.";
                            break;
                        case error.TIMEOUT:
                            errorMessage = "The request to get user location timed out.";
                            break;
                        case error.UNKNOWN_ERROR:
                            errorMessage = "An unknown error occurred.";
                            break;
                    }
                    
                    alert("Unable to determine your location: " + errorMessage);
                    
                    // Reset button
                    document.getElementById('locate-me').disabled = false;
                    document.getElementById('locate-me').innerHTML = '<i class="fas fa-location-arrow"></i> Find Nearest Station';
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
        }
    });
    
    // Fit bounds to show all markers
    if (locations.length > 0) {
        const bounds = L.latLngBounds(locations.map(loc => loc.latlng));
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}