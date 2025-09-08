import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// Define allowed origins based on environment or from env var
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : (process.env.NODE_ENV === "production"
      ? ["https://chatkie.netlify.app", "https://chatkie.onrender.com", "https://chatky.onrender.com"]
      : ["http://localhost:3000", "http://localhost:5173"]);

console.log('CORS allowed origins:', allowedOrigins);

app.use(express.json({limit: '10mb'}));
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      console.log('Request origin:', origin);
      
      // More flexible origin checking - allow any that contain the core domains
      const isAllowed = 
        // Exact match in the allowed origins list
        allowedOrigins.includes(origin) ||
        // Check if origin contains any of our known domains (chatkie/chatky/localhost)
        /chatk(ie|y)\./.test(origin) || 
        /localhost/.test(origin) ||
        // In development, be more permissive
        process.env.NODE_ENV !== "production";
        
      if (!isAllowed) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        console.warn(`CORS blocked origin: ${origin}`);
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Content-Length", "X-Requested-With"]
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  // Serve static files with explicit error handling
  app.use(express.static(path.join(__dirname, "../frontend/dist"), {
    fallthrough: true,  // Continue to next middleware if file not found
    index: false        // Disable automatic directory index resolution
  }));

  // Catch-all route for SPA (Express 5: avoid bare "*")
  app.get(/.*/, (req, res, next) => {
    // Handle HTML requests with the SPA index
    if (req.accepts('html')) {
      res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"), err => {
        if (err) {
          console.error('Error serving index.html:', err);
          next(err);
        }
      });
    } else {
      next(); // Let other middleware handle non-HTML requests
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  
  // Detailed logging for debugging
  console.error(`Request path: ${req.path}`);
  console.error(`Request method: ${req.method}`);
  console.error(`Error stack: ${err.stack}`);
  
  // Send appropriate error response based on content type expected
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.status(500).json({ error: 'Server error', message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  } else {
    res.status(500).send("Something went wrong on the server. Please try again later.");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB().catch((err) => console.error("Database connection error:", err));
});