// Server startup
// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server - Listen on all network interfaces (0.0.0.0) to allow connections from emulator/devices
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Accessible at http://localhost:${PORT}`);
      console.log(`✓ Accessible at http://10.46.192.61:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
