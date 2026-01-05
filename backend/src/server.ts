// Server startup
import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { initializeSocket } from "./socket/socket";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

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
