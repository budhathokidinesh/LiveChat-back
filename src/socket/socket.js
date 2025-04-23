//this is for socket.io
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = new createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
//map to track userId and socketId
const onlineUsers = new Map();

io.on("connection", (socket) => {
  //Listen for user registration
  socket.on("register-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registerd with socket ID ${socket.id}`);
  });
  socket.on("send-message", (data) => {
    const { receiverId, ...message } = data;

    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", message);
    }
  });
  //socket.on() is used to listen to the event. Can be used both on client and server side
  socket.on("disconnect", () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});
export { app, io, server, onlineUsers };
