// ============================================
// src/middleware/error.middleware.js
// ============================================
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../config/constants.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    error = new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field} already exists`;
    error = new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || "Internal Server Error";

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Handle unhandled promise rejections
export const unhandledRejectionHandler = (server) => {
  process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};
