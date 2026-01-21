// ============================================
// src/app.js
// ============================================
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import petRoutes from "./routes/pet.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { ApiError } from "./utils/ApiError.js";
import { HTTP_STATUS } from "./config/constants.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/auth", limiter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Paw-fect Match API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/pet", petRoutes);

// 404 handler
app.use("*", (req, res, next) => {
  next(
    new ApiError(HTTP_STATUS.NOT_FOUND, `Route ${req.originalUrl} not found`),
  );
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
