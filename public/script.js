// Initialize map using Leaflet
const map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Get references to UI elements
const startTrackingBtn = document.getElementById('startTracking');
const stopTrackingBtn = document.getElementById('stopTracking');
const calculateDistanceBtn = document.getElementById('calculateDistance');

// Initialize variables for tracking
let tracking = false;
let marker = null;
let prevLatLng = null;

// Event listeners for tracking buttons
startTrackingBtn.addEventListener('click', () => {
    // Start tracking logic
    if (!tracking) {
        tracking = true;
        startTrackingBtn.disabled = true;
        stopTrackingBtn.disabled = false;

        // Get user's location using Geolocation API
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;

                // Send location data to the server using WebSocket
                socket.emit('locationUpdate', { latitude, longitude });

                // Update map and marker
                const userLatLng = L.latLng(latitude, longitude);
                if (marker) {
                    marker.setLatLng(userLatLng);
                } else {
                    marker = L.marker(userLatLng).addTo(map);
                }
                if (prevLatLng) {
                    const line = [prevLatLng, userLatLng];
                    const polyline = L.polyline(line, { color: 'blue' }).addTo(map);
                    map.fitBounds(polyline.getBounds());
                }
                prevLatLng = userLatLng;
            });
        } else {
            console.log('Geolocation is not available.');
        }
    }
});

stopTrackingBtn.addEventListener('click', () => {
    // Stop tracking logic
    tracking = false;
    startTrackingBtn.disabled = false;
    stopTrackingBtn.disabled = true;
});

calculateDistanceBtn.addEventListener('click', () => {
    // Calculate and display distance between two points
    if (prevLatLng && marker) {
        const distance = prevLatLng.distanceTo(marker.getLatLng());
        alert(`Distance: ${distance.toFixed(2)} meters`);
    } else {
        alert('Not enough data to calculate distance.');
    }
});
