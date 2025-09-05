import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

// Define allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? ["https://chatkie.netlify.app", "https://chatkie.onrender.com"] 
  : ["http://localhost:3000"];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Use to store online users
const userSocketMap = {}; // key:userId, value:socketId
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on('connection', (socket) => {
  console.log('New client connected: ', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  // io.emit use to send that all are online
  io.emit('getOnlineUsers', Object.keys(userSocketMap)); 

  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);
    // remove from userSocketMap
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); 
  });
});

export { io, app, server };