const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Mock initial bus location state
let busLocation = {
  busId: "DIU-Bus-01",
  route: "Daffodil Smart City - Mirpur",
  lat: 23.8765,
  lng: 90.3211,
  status: "On Time",
  lastUpdated: new Date().toLocaleTimeString()
};

// Real-time socket communication
io.on('connection', (socket) => {
  console.log('⚡ Client connected:', socket.id);

  // Send initial bus location immediately on connect
  socket.emit('busLocationUpdate', busLocation);

  // Driver location updates from app
  socket.on('updateLocation', (data) => {
    busLocation = { ...busLocation, ...data, lastUpdated: new Date().toLocaleTimeString() };
    io.emit('busLocationUpdate', busLocation); // Broadcast to all students
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});