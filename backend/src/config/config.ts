// Centralized environment configuration
import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  mongoUri: process.env.MONGO_URI || "",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "supersecretkey",
  jwtExpiry: "7d",

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",

  // Validation
  isProduction: () => process.env.NODE_ENV === "production",
  isDevelopment: () => process.env.NODE_ENV === "development",
};

// Validate critical env vars
export const validateConfig = (): void => {
  if (!config.mongoUri) {
    console.error("ERROR: MONGO_URI is not defined");
    process.exit(1);
  }

  if (!config.jwtSecret) {
    console.error("ERROR: JWT_SECRET is not defined");
    process.exit(1);
  }
};
