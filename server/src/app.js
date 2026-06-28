import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

// Core middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });
});

// Centralized error handler (must have 4 args)
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
