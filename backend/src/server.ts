// Server startup
import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { initializeSocket } from "./socket/socket";
import { config, validateConfig } from "./config/config";

// Validate critical environment variables
validateConfig();

const PORT = config.port;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    initializeSocket(server);

    // Start server
    server.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
