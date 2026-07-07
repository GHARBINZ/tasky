import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Core middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`📩 Incoming Request: ${req.method} ${req.path}`);
  console.log("Current body:", req.body);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
// Serve uploaded files (e.g. /uploads/avatars/xyz.png)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/user", userRoutes);

// Centralized error handler (must have 4 args)
app.use((err, req, res, next) => {
  console.error("❌ الخطأ الحقيقي هو:", err);
  // Handle Multer errors with a clearer message
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err.message?.includes("Only JPEG") || err.message?.includes("images are allowed")) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
