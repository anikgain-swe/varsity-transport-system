const socket = io();
let map, markers = {};
let currentFleet = [];

// Initialize Leaflet Map
function initMap() {
  map = L.map('map').setView([23.8765, 90.3211], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);
}

// Receive Real-time Fleet Updates from Backend Server
socket.on('fleetUpdate', (fleet) => {
  currentFleet = fleet;
  renderFleetList(fleet);
  updateMapMarkers(fleet);
  populateAdminSelects(fleet);
});

// Render Sidebar Fleet Cards
function renderFleetList(fleet) {
  const container = document.getElementById('fleetList');
  container.innerHTML = fleet.map(b => `
    <div class="fleet-card" onclick="focusBus(${b.lat}, ${b.lng})">
      <h3>${b.busNumber} <span class="badge ${b.occupancyStatus}">${b.occupancyStatus}</span></h3>
      <p><strong>Corridor:</strong> ${b.corridor} (${b.routeCode})</p>
      <p><strong>Driver:</strong> ${b.driverName} (${b.driverPhone})</p>
      <p><strong>Seats Available:</strong> ${b.availableSeats} / ${b.capacity}</p>
    </div>
  `).join('');
}

// Update Dynamic Map Markers
function updateMapMarkers(fleet) {
  fleet.forEach(b => {
    if (markers[b.id]) {
      markers[b.id].setLatLng([b.lat, b.lng]);
    } else {
      markers[b.id] = L.marker([b.lat, b.lng]).addTo(map)
        .bindPopup(`<b>${b.busNumber}</b><br>${b.corridor}<br>Seats: ${b.availableSeats}`);
    }
  });
}

function focusBus(lat, lng) {
  map.setView([lat, lng], 15);
}

function filterFleet() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = currentFleet.filter(b => 
    b.busNumber.toLowerCase().includes(query) || b.corridor.toLowerCase().includes(query)
  );
  renderFleetList(filtered);
}

// Modals Management
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// Student RFID Pass Generator
function generatePass(e) {
  e.preventDefault();
  const name = document.getElementById('stuName').value;
  const id = document.getElementById('stuId').value;
  const dept = document.getElementById('stuDept').value;
  const blood = document.getElementById('stuBlood').value;

  document.getElementById('passDetails').innerHTML = `
    <h3>${name}</h3>
    <p>ID: ${id} | Dept: ${dept}</p>
    <p>Blood Group: <strong>${blood}</strong></p>
  `;

  document.getElementById('qrcode').innerHTML = "";
  new QRCode(document.getElementById("qrcode"), {
    text: `DIU-PASS:${id}:${name}`, width: 128, height: 128
  });

  document.getElementById('passResult').classList.remove('hidden');
}

// Admin Operations
function loginAdmin() {
  const code = document.getElementById('adminCode').value;
  if (code === "admin123" || code === "") {
    document.getElementById('adminAuth').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
  } else {
    alert("Incorrect passcode!");
  }
}

function populateAdminSelects(fleet) {
  const select = document.getElementById('relocateBusSelect');
  const driverSelect = document.getElementById('driverBusSelect');
  if(!select || !driverSelect) return;
  
  select.innerHTML = fleet.map(b => `<option value="${b.id}">${b.busNumber}</option>`).join('');
  driverSelect.innerHTML = `<option value="">Select Your Bus</option>` + fleet.map(b => `<option value="${b.id}">${b.busNumber}</option>`).join('');
}

function quickRelocate(lat, lng) {
  const busId = document.getElementById('relocateBusSelect').value;
  fetch('/api/admin/relocate', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ busId, lat, lng })
  });
}

function adminAddBus(e) {
  e.preventDefault();
  const busNumber = document.getElementById('newBusNo').value;
  const model = document.getElementById('newModel').value;
  const capacity = parseInt(document.getElementById('newCap').value);
  const corridor = document.getElementById('newCorridor').value;

  fetch('/api/admin/bus', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      busNumber, model, capacity, availableSeats: capacity,
      occupancyStatus: "AVAILABLE", driverName: "Assigned Driver",
      driverPhone: "+8801700000000", corridor, routeCode: "R-NEW",
      lat: 23.8765, lng: 90.3211
    })
  }).then(() => closeModal('adminModal'));
}

// Driver Cockpit Operations
let activeDriverBus = null;
function loadDriverCockpit() {
  const busId = document.getElementById('driverBusSelect').value;
  activeDriverBus = currentFleet.find(b => b.id === busId);
  if (activeDriverBus) {
    document.getElementById('cockpitSeatCount').innerText = activeDriverBus.availableSeats;
    document.getElementById('cockpitControls').classList.remove('hidden');
  }
}

function updateSeat(change) {
  if (!activeDriverBus) return;
  let newSeats = activeDriverBus.availableSeats + change;
  if (newSeats >= 0 && newSeats <= activeDriverBus.capacity) {
    activeDriverBus.availableSeats = newSeats;
    document.getElementById('cockpitSeatCount').innerText = newSeats;
    socket.emit('driverUpdate', { busId: activeDriverBus.id, availableSeats: newSeats });
  }
}

// Lost and Found Fetch
fetch('/api/lost-found').then(res => res.json()).then(data => {
  document.getElementById('lostList').innerHTML = data.map(item => `
    <div style="padding:10px; border-bottom:1px solid #eee;">
      <strong>${item.title}</strong> (${item.type})<br>
      <small>Bus: ${item.busNumber} | ${item.seat}</small><br>
      <a href="tel:${item.contact}" style="color:#2563eb;">📞 Call Finder: ${item.contact}</a>
    </div>
  `).join('');
});

function submitLostItem(e) {
  e.preventDefault();
  const title = document.getElementById('lostTitle').value;
  const busNumber = document.getElementById('lostBus').value;
  const seat = document.getElementById('lostSeat').value;
  const contact = document.getElementById('lostPhone').value;

  fetch('/api/lost-found', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title, busNumber, seat, contact, type: "Lost" })
  }).then(() => {
    closeModal('addLostModal');
    location.reload();
  });
}

// Initialize on page load
window.onload = initMap;