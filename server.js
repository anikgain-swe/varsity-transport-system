const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------------------------
// IN-MEMORY DATABASE (State Storage)
// -------------------------------------------------------------
let fleet = [
  {
    id: "BUS-101",
    busNumber: "DIU-Bus-01",
    model: "Ashok Leyland Campus Shuttle",
    capacity: 40,
    availableSeats: 15,
    occupancyStatus: "AVAILABLE", // AVAILABLE, STANDING, FULL
    driverName: "Rahim Uddin",
    driverPhone: "+8801711000000",
    corridor: "Mirpur-10",
    routeCode: "R-101",
    lat: 23.8765,
    lng: 90.3211
  },
  {
    id: "BUS-102",
    busNumber: "DIU-Bus-02",
    model: "Eicher AC Special",
    capacity: 35,
    availableSeats: 0,
    occupancyStatus: "FULL",
    driverName: "Karim Sheikh",
    driverPhone: "+8801811000000",
    corridor: "Dhanmondi 32",
    routeCode: "R-201",
    lat: 23.8103,
    lng: 90.4125
  }
];

let drivers = [
  { id: "D-1", name: "Rahim Uddin", phone: "+8801711000000", license: "DL-88291", busId: "BUS-101" },
  { id: "D-2", name: "Karim Sheikh", phone: "+8801811000000", license: "DL-33491", busId: "BUS-102" }
];

let students = [];
let routes = [
  { code: "R-101", name: "Ashulia - Mirpur Corridor", distance: "18.5 Km", stops: "DSC, Birulia, Mirpur 1" },
  { code: "R-201", name: "Ashulia - Dhanmondi Line", distance: "24.0 Km", stops: "DSC, Gabtoli, Dhanmondi 32" }
];

let lostAndFound = [
  { id: 1, title: "Blue Water Bottle", busNumber: "DIU-Bus-01", seat: "Seat 12B", contact: "01700000000", type: "Lost" }
];

let reviews = [
  { id: 1, studentName: "Anik Gain", busNumber: "DIU-Bus-01", rating: 5, comment: "Punctual and smooth driving!" }
];

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// Get All Data API
app.get('/api/fleet', (req, res) => res.json(fleet));
app.get('/api/routes', (req, res) => res.json(routes));
app.get('/api/drivers', (req, res) => res.json(drivers));
app.get('/api/lost-found', (req, res) => res.json(lostAndFound));
app.get('/api/reviews', (req, res) => res.json(reviews));

// Admin: Add New Bus
app.post('/api/admin/bus', (req, res) => {
  const newBus = { id: `BUS-${Date.now()}`, ...req.body };
  fleet.push(newBus);
  io.emit('fleetUpdate', fleet);
  res.json({ success: true, bus: newBus });
});

// Admin: Delete Bus
app.delete('/api/admin/bus/:id', (req, res) => {
  fleet = fleet.filter(b => b.id !== req.params.id);
  io.emit('fleetUpdate', fleet);
  res.json({ success: true });
});

// Admin: Relocate Bus GPS Position
app.post('/api/admin/relocate', (req, res) => {
  const { busId, lat, lng } = req.body;
  const bus = fleet.find(b => b.id === busId);
  if (bus) {
    bus.lat = parseFloat(lat);
    bus.lng = parseFloat(lng);
    io.emit('fleetUpdate', fleet);
    return res.json({ success: true, bus });
  }
  res.status(404).json({ error: "Bus not found" });
});

// Student Pass Generator API
app.post('/api/student/register', (req, res) => {
  const student = { id: `STU-${Date.now()}`, ...req.body, passStatus: "ACTIVE" };
  students.push(student);
  res.json({ success: true, student });
});

// Lost & Found Post API
app.post('/api/lost-found', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  lostAndFound.push(item);
  io.emit('lostFoundUpdate', lostAndFound);
  res.json({ success: true, item });
});

// Reviews Post API
app.post('/api/reviews', (req, res) => {
  const rev = { id: Date.now(), ...req.body };
  reviews.push(rev);
  io.emit('reviewUpdate', reviews);
  res.json({ success: true, review: rev });
});

// -------------------------------------------------------------
// REAL-TIME SOCKET.IO ENGINE
// -------------------------------------------------------------
io.on('connection', (socket) => {
  console.log('⚡ User connected:', socket.id);

  // Send initial data snapshot
  socket.emit('fleetUpdate', fleet);

  // Driver Cockpit Seat & Live GPS Broadcast
  socket.on('driverUpdate', (data) => {
    const bus = fleet.find(b => b.id === data.busId);
    if (bus) {
      if (data.lat && data.lng) {
        bus.lat = data.lat;
        bus.lng = data.lng;
      }
      if (data.availableSeats !== undefined) {
        bus.availableSeats = data.availableSeats;
        bus.occupancyStatus = bus.availableSeats === 0 ? "FULL" : (bus.availableSeats < 5 ? "STANDING" : "AVAILABLE");
      }
      io.emit('fleetUpdate', fleet);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Fleet Management Server running on http://localhost:${PORT}`);
});