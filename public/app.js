// Initialize Socket.io connection
const socket = io();

// Set default coordinates (Daffodil International University - Ashulia Campus)
const defaultLat = 23.8765;
const defaultLng = 90.3211;

// Initialize Leaflet Map
const map = L.map('map').setView([defaultLat, defaultLng], 14);

// Add OpenStreetMap Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Custom Bus Marker
let busMarker = L.marker([defaultLat, defaultLng]).addTo(map);
busMarker.bindPopup("<b>DIU Bus-01</b><br>Ashulia Route").openPopup();

// Receive real-time location update from Express server
socket.on('busLocationUpdate', (data) => {
  console.log("New location received:", data);

  // Update Map Marker position
  const newLatLng = [data.lat, data.lng];
  busMarker.setLatLng(newLatLng);
  map.panTo(newLatLng); // Smoothly center map to bus

  // Update UI Card Text
  const infoDiv = document.getElementById('bus-info');
  infoDiv.innerHTML = `
    <p><strong>Bus No:</strong> ${data.busId}</p>
    <p><strong>Route:</strong> ${data.route}</p>
    <p><strong>Status:</strong> <span class="status-badge">${data.status}</span></p>
    <p><strong>Last Updated:</strong> ${data.lastUpdated}</p>
  `;
});