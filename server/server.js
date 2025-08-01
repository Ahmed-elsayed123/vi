const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://vi-c9vtshqik-ahmed-elsayeds-projects-1fd4a803.vercel.app",
            "https://vi-c9vtshqik-ahmed-elsayeds-projects-1fd4a803.vercel.app:443",
            "https://vi-three-eosin.vercel.app",
            "https://vi-three-eosin.vercel.app:443",
            "https://vi-ijuv.onrender.com",
            "https://vi-ijuv.onrender.com:443",
          ]
        : "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active rooms and their participants
const rooms = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    const room = rooms.get(roomId);
    room.add(socket.id);

    console.log(`User ${socket.id} joined room ${roomId}`);
    console.log(`Room ${roomId} has ${room.size} participants`);

    // Notify other users in the room about the new participant
    socket.to(roomId).emit("user-joined", socket.id);

    // Send current room participants to the new user
    const participants = Array.from(room).filter((id) => id !== socket.id);
    socket.emit("room-participants", participants);
  });

  // Handle WebRTC signaling
  socket.on("offer", (data) => {
    socket.to(data.target).emit("offer", {
      offer: data.offer,
      from: socket.id,
    });
  });

  socket.on("answer", (data) => {
    socket.to(data.target).emit("answer", {
      answer: data.answer,
      from: socket.id,
    });
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.target).emit("ice-candidate", {
      candidate: data.candidate,
      from: socket.id,
    });
  });

  // Handle user leaving
  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);

    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.delete(socket.id);

      // Remove room if empty
      if (room.size === 0) {
        rooms.delete(roomId);
      }

      // Notify other users
      socket.to(roomId).emit("user-left", socket.id);
    }

    console.log(`User ${socket.id} left room ${roomId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove user from all rooms
    for (const [roomId, room] of rooms.entries()) {
      if (room.has(socket.id)) {
        room.delete(socket.id);
        socket.to(roomId).emit("user-left", socket.id);

        // Remove room if empty
        if (room.size === 0) {
          rooms.delete(roomId);
        }
      }
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    activeRooms: rooms.size,
    totalConnections: io.engine.clientsCount,
  });
});

// Get active rooms
app.get("/rooms", (req, res) => {
  const roomInfo = Array.from(rooms.entries()).map(
    ([roomId, participants]) => ({
      roomId,
      participantCount: participants.size,
    })
  );
  res.json(roomInfo);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Active rooms: http://localhost:${PORT}/rooms`);
});
