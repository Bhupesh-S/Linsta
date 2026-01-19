// Health check endpoint
import { Router, Request, Response } from "express";
import { config } from "../config/config";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Backend is running",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    uptime: process.uptime(),
  });
});

// GET /api/health for compatibility
router.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Backend is running",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    uptime: process.uptime(),
  });
});

export default router;
