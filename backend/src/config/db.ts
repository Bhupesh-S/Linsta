import mongoose from "mongoose";
import { config } from "./config";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = config.mongoUri;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error);
    process.exit(1);
  }
};
