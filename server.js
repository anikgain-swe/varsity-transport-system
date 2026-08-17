const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const PORT = 3000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ===============================
// FLEET DATA
// ===============================

let fleet = [
  {
    id: "BUS-101",
    busNumber: "DIU-Bus-01",
    model: "Campus Shuttle",
    licensePlate: "DHAKA-METRO-101",
    capacity: 40,
    availableSeats: 18,
    occupancyStatus: "AVAILABLE",
    driverName: "Rahim Ahmed",
    driverPhone: "01700000001",
    corridor: "Ashulia",
    routeCode: "R-101",
    speed: 28,
    lat: 23.8759,
    lng: 90.3202,
    status: "RUNNING",
    nextStop: "DIU Main Gate",
    eta: 5
  },

  {
    id: "BUS-202",
    busNumber: "DIU-Bus-02",
    model: "University Express",
    licensePlate: "DHAKA-METRO-202",
    capacity: 45,
    availableSeats: 10,
    occupancyStatus: "STANDING",
    driverName: "Karim Hasan",
    driverPhone: "01700000002",
    corridor: "Uttara",
    routeCode: "R-202",
    speed: 35,
    lat: 23.8750,
    lng: 90.3270,
    status: "RUNNING",
    nextStop: "Uttara Sector 7",
    eta: 8
  },

  {
    id: "BUS-303",
    busNumber: "DIU-Bus-03",
    model: "Student Shuttle",
    licensePlate: "DHAKA-METRO-303",
    capacity: 40,
    availableSeats: 4,
    occupancyStatus: "FULL",
    driverName: "Sakib Khan",
    driverPhone: "01700000003",
    corridor: "Mirpur",
    routeCode: "R-303",
    speed: 22,
    lat: 23.8070,
    lng: 90.3680,
    status: "RUNNING",
    nextStop: "Mirpur-10",
    eta: 12
  },

  {
    id: "BUS-404",
    busNumber: "DIU-Bus-04",
    model: "Campus Cruiser",
    licensePlate: "DHAKA-METRO-404",
    capacity: 42,
    availableSeats: 25,
    occupancyStatus: "AVAILABLE",
    driverName: "Nayeem Islam",
    driverPhone: "01700000004",
    corridor: "Dhanmondi",
    routeCode: "R-404",
    speed: 30,
    lat: 23.7465,
    lng: 90.3760,
    status: "RUNNING",
    nextStop: "Dhanmondi 32",
    eta: 7
  }
];

// ===============================
// ROUTES
// ===============================

let routes = [
  {
    id: "R-101",
    code: "R-101",
    name: "Ashulia Campus Route",
    corridor: "Ashulia",
    distance: "12 km",
    start: "Ashulia",
    end: "DIU Campus",
    stops: [
      "Ashulia",
      "Baipayl",
      "Nobinagar",
      "DIU Main Gate"
    ]
  },

  {
    id: "R-202",
    code: "R-202",
    name: "Uttara Campus Route",
    corridor: "Uttara",
    distance: "18 km",
    start: "Uttara",
    end: "DIU Campus",
    stops: [
      "Uttara",
      "House Building",
      "Airport",
      "DIU Main Gate"
    ]
  },

  {
    id: "R-303",
    code: "R-303",
    name: "Mirpur Campus Route",
    corridor: "Mirpur",
    distance: "20 km",
    start: "Mirpur-10",
    end: "DIU Campus",
    stops: [
      "Mirpur-10",
      "Kazipara",
      "Agargaon",
      "DIU Main Gate"
    ]
  },

  {
    id: "R-404",
    code: "R-404",
    name: "Dhanmondi Campus Route",
    corridor: "Dhanmondi",
    distance: "16 km",
    start: "Dhanmondi 32",
    end: "DIU Campus",
    stops: [
      "Dhanmondi 32",
      "Science Lab",
      "Mohammadpur",
      "DIU Main Gate"
    ]
  }
];

// ===============================
// SCHEDULE
// ===============================

let schedules = [
  {
    id: 1,
    routeCode: "R-101",
    tripType: "Morning Pick",
    departure: "07:30 AM",
    arrival: "08:20 AM"
  },

  {
    id: 2,
    routeCode: "R-101",
    tripType: "Midday",
    departure: "01:00 PM",
    arrival: "01:50 PM"
  },

  {
    id: 3,
    routeCode: "R-101",
    tripType: "Evening Return",
    departure: "05:30 PM",
    arrival: "06:20 PM"
  },

  {
    id: 4,
    routeCode: "R-202",
    tripType: "Morning Pick",
    departure: "07:00 AM",
    arrival: "08:00 AM"
  },

  {
    id: 5,
    routeCode: "R-202",
    tripType: "Evening Return",
    departure: "05:00 PM",
    arrival: "06:00 PM"
  },

  {
    id: 6,
    routeCode: "R-303",
    tripType: "Morning Pick",
    departure: "07:15 AM",
    arrival: "08:15 AM"
  },

  {
    id: 7,
    routeCode: "R-303",
    tripType: "Evening Return",
    departure: "05:15 PM",
    arrival: "06:15 PM"
  },

  {
    id: 8,
    routeCode: "R-404",
    tripType: "Morning Pick",
    departure: "07:45 AM",
    arrival: "08:35 AM"
  }
];

// ===============================
// STUDENTS
// ===============================

let students = [
  {
    id: 1,
    studentId: "241-15-00001",
    name: "Anik Gain",
    department: "Software Engineering",
    bloodGroup: "B+",
    corridor: "Ashulia",
    passStatus: "ACTIVE"
  }
];

// ===============================
// LOST & FOUND
// ===============================

let lostFound = [
  {
    id: 1,
    type: "FOUND",
    item: "Water Bottle",
    category: "Personal Item",
    busNumber: "DIU-Bus-01",
    seat: "14",
    phone: "01700000000",
    description: "Black water bottle",
    status: "FOUND"
  }
];

// ===============================
// FEEDBACK
// ===============================

let feedback = [
  {
    id: 1,
    studentName: "Anik Gain",
    busNumber: "DIU-Bus-01",
    rating: 5,
    punctuality: 5,
    safety: 5,
    comment: "Very smooth and safe journey."
  }
];

// ===============================
// BASIC ROUTE
// ===============================

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ===============================
// FLEET API
// ===============================

app.get("/api/fleet", (req, res) => {
  res.json(fleet);
});

// GET SINGLE BUS

app.get("/api/fleet/:id", (req, res) => {
  const bus = fleet.find(
    item => item.id === req.params.id
  );

  if (!bus) {
    return res.status(404).json({
      message: "Bus not found"
    });
  }

  res.json(bus);
});

// ADD BUS

app.post("/api/fleet", (req, res) => {

  const {
    busNumber,
    model,
    licensePlate,
    capacity,
    driverName,
    corridor,
    routeCode,
    lat,
    lng
  } = req.body;

  if (!busNumber || !model || !capacity) {
    return res.status(400).json({
      message: "Bus number, model and capacity are required."
    });
  }

  const newBus = {
    id: "BUS-" + Date.now(),

    busNumber,

    model,

    licensePlate:
      licensePlate || "NOT-ASSIGNED",

    capacity: Number(capacity),

    availableSeats: Number(capacity),

    occupancyStatus: "AVAILABLE",

    driverName:
      driverName || "Unassigned",

    driverPhone: "",

    corridor:
      corridor || "Ashulia",

    routeCode:
      routeCode || "R-101",

    speed: 0,

    lat:
      Number(lat) || 23.8759,

    lng:
      Number(lng) || 90.3202,

    status: "STOPPED",

    nextStop: "DIU Main Gate",

    eta: 0
  };

  fleet.push(newBus);

  io.emit("fleetUpdate", fleet);

  res.status(201).json(newBus);
});

// UPDATE BUS

app.put("/api/fleet/:id", (req, res) => {

  const bus = fleet.find(
    item => item.id === req.params.id
  );

  if (!bus) {
    return res.status(404).json({
      message: "Bus not found"
    });
  }

  Object.assign(bus, req.body);

  if (bus.availableSeats <= 0) {
    bus.occupancyStatus = "FULL";
  } else if (
    bus.availableSeats <= 5
  ) {
    bus.occupancyStatus = "STANDING";
  } else {
    bus.occupancyStatus = "AVAILABLE";
  }

  io.emit("fleetUpdate", fleet);

  res.json(bus);
});

// DELETE BUS

app.delete("/api/fleet/:id", (req, res) => {

  const index = fleet.findIndex(
    item => item.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Bus not found"
    });
  }

  const deletedBus = fleet.splice(index, 1)[0];

  io.emit("fleetUpdate", fleet);

  res.json({
    message: "Bus deleted successfully",
    bus: deletedBus
  });
});

// ===============================
// ROUTES API
// ===============================

app.get("/api/routes", (req, res) => {
  res.json(routes);
});

app.post("/api/routes", (req, res) => {

  const newRoute = {
    id: req.body.code,
    code: req.body.code,
    name: req.body.name,
    corridor: req.body.corridor,
    distance: req.body.distance,
    start: req.body.start,
    end: req.body.end,
    stops: req.body.stops || []
  };

  routes.push(newRoute);

  res.status(201).json(newRoute);
});

app.delete("/api/routes/:id", (req, res) => {

  const index = routes.findIndex(
    route => route.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Route not found"
    });
  }

  const deletedRoute =
    routes.splice(index, 1)[0];

  res.json({
    message: "Route deleted",
    route: deletedRoute
  });
});

// ===============================
// SCHEDULE API
// ===============================

app.get("/api/schedules", (req, res) => {
  res.json(schedules);
});

// ===============================
// STUDENT API
// ===============================

app.get("/api/students", (req, res) => {
  res.json(students);
});

// ===============================
// LOST & FOUND API
// ===============================

app.get("/api/lost-found", (req, res) => {
  res.json(lostFound);
});

app.post("/api/lost-found", (req, res) => {

  const report = {
    id: Date.now(),

    type:
      req.body.type || "LOST",

    item:
      req.body.item || "Unknown",

    category:
      req.body.category || "Other",

    busNumber:
      req.body.busNumber || "",

    seat:
      req.body.seat || "",

    phone:
      req.body.phone || "",

    description:
      req.body.description || "",

    status: "PENDING"
  };

  lostFound.unshift(report);

  res.status(201).json(report);
});

// ===============================
// FEEDBACK API
// ===============================

app.get("/api/feedback", (req, res) => {
  res.json(feedback);
});

app.post("/api/feedback", (req, res) => {

  const review = {
    id: Date.now(),

    studentName:
      req.body.studentName || "Anonymous",

    busNumber:
      req.body.busNumber || "",

    rating:
      Number(req.body.rating) || 5,

    punctuality:
      Number(req.body.punctuality) || 5,

    safety:
      Number(req.body.safety) || 5,

    comment:
      req.body.comment || ""
  };

  feedback.unshift(review);

  res.status(201).json(review);
});

// ===============================
// SOCKET.IO
// ===============================

io.on("connection", socket => {

  console.log(
    "Client connected:",
    socket.id
  );

  socket.emit(
    "fleetUpdate",
    fleet
  );

  socket.on(
    "driverUpdate",
    update => {

      const bus = fleet.find(
        item => item.id === update.busId
      );

      if (!bus) return;

      if (update.speed !== undefined) {
        bus.speed =
          Number(update.speed);
      }

      if (
        update.availableSeats !== undefined
      ) {
        bus.availableSeats =
          Number(update.availableSeats);
      }

      if (update.lat !== undefined) {
        bus.lat =
          Number(update.lat);
      }

      if (update.lng !== undefined) {
        bus.lng =
          Number(update.lng);
      }

      if (update.status) {
        bus.status =
          update.status;
      }

      if (
        bus.availableSeats <= 0
      ) {
        bus.occupancyStatus = "FULL";
      } else if (
        bus.availableSeats <= 5
      ) {
        bus.occupancyStatus = "STANDING";
      } else {
        bus.occupancyStatus = "AVAILABLE";
      }

      io.emit(
        "fleetUpdate",
        fleet
      );
    }
  );

  socket.on(
    "disconnect",
    () => {
      console.log(
        "Client disconnected:",
        socket.id
      );
    }
  );
});

// ===============================
// GPS SIMULATION
// ===============================

setInterval(() => {

  fleet.forEach(bus => {

    if (bus.status !== "RUNNING") {
      return;
    }

    const direction =
      Math.random() > 0.5
        ? 1
        : -1;

    bus.lat +=
      direction * 0.00015;

    bus.lng +=
      direction * 0.00012;

    bus.speed =
      Math.max(
        15,
        Math.min(
          45,
          bus.speed +
            (Math.random() * 6 - 3)
        )
      );

    bus.eta =
      Math.max(
        1,
        bus.eta +
          (Math.random() > 0.5
            ? -1
            : 1)
      );
  });

  io.emit(
    "fleetUpdate",
    fleet
  );

}, 3000);

// ===============================
// START SERVER
// ===============================

server.listen(
  PORT,
  () => {
    console.log(
      `🚀 DaffoRide Server running at http://localhost:${PORT}`
    );
  }
);