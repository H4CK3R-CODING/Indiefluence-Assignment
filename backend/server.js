// ============================================
// src/server.js
// ============================================
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { unhandledRejectionHandler } from "./middleware/error.middleware.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
// 
if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  // process.exit(1);
}

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Connect to database
await connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`                                      
  Environment: ${NODE_ENV.padEnd(23)} 
 Port:        ${String(PORT).padEnd(23)}
 Status:      Running              
  `);
});

// Handle unhandled promise rejections
unhandledRejectionHandler(server);

// Handle SIGTERM
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("💤 Process terminated");
  });
});
