const { Server } = require("socket.io");
const userModel = require("../models/userModel");
const driverModel = require("../models/driverModel");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // 🚨 Replace with frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ New socket connected:", socket.id);

    // Save socket id when user/driver joins
    socket.on("join", async (data) => {
      const { userId, userType } = data;

      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, {
          $set: { socket_id: socket.id },
        });
      } else if (userType === "driver") {
        await driverModel.findByIdAndUpdate(userId, {
          $set: { socket_id: socket.id },
        });
      }
    });

    // Update driver’s location
    socket.on("driver-location-update", async (data) => {
      const { driverId, latitude, longitude } = data;

      await driverModel.findByIdAndUpdate(driverId, {
        $set: { location: { latitude, longitude } },
      });
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("❌ Socket.io not initialized");
  }
  return io;
}

function sendMessage(socket_id, message) {
  if (io) {
    io.to(socket_id).emit(message.event, message.data);
  } else {
    console.log("❌ Socket not initialized");
  }
}

module.exports = { initSocket, getIO, sendMessage };
