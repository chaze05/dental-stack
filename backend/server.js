// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const patientRoutes = require("./routes/patientRoutes");


// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use("/api/patients", patientRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express"); 
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io"); // Import socket.io
const http = require('http');
// const createDefaultUsers = require("./;utils/defaultUser");

const userRoutes = require("./routes/userRoutes");
const patientRecords = require("./routes/patientRecordRoutes");
const authRoutes = require("./routes/auth"); // Adjust path if needed
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
app.use(express.json());
const server = http.createServer(app); // Create HTTP server for WebSockets

// Enable CORS
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from your Next.js frontend
  credentials: true, // Allow cookies & authentication headers
}));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Connection Error ❌:", error.message);
    process.exit(1); // Stop server on failure
  }
};

connectDB();
app.use((req, res, next) => {
  console.log(`🔥 Incoming request: ${req.method} ${req.url}`);
  next();
});


app.use("/api/auth", authRoutes);

// Routes
app.use("/users", userRoutes);
app.use("/patient-record", patientRecords);
app.use("/appointments",appointmentRoutes)


// WebSocket setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust based on your frontend
    credentials:true,
    methods: ["GET", "POST"],
  },
});

const patientRoutes = require("./routes/patientRoutes")(io);
app.use("/patients", patientRoutes);


io.on("connection", (socket) => {
  console.log(`🟢 A user connected: ${socket.id}`);

  // Example: Listening for events
  socket.on("new-patient", (data) => {
    console.log("📢 New patient added:", data);
    io.emit("update-patients", data); // Broadcast update to all clients
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});




app.listen(5000, () => console.log("🚀 Server running on port 5000"));
