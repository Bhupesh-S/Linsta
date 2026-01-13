// Request logging middleware
import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";

interface RequestLog {
  timestamp: string;
  method: string;
  path: string;
  statusCode?: number;
  responseTime: number;
  ip: string;
}

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  // Capture response when it's sent
  res.on("finish", () => {
    const responseTime = Date.now() - startTime;

    const logData: RequestLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      ip,
    };

    // Log based on environment
    if (config.isDevelopment()) {
      const statusColor =
        res.statusCode >= 400 ? "\x1b[31m" : "\x1b[32m"; // Red for errors, green for success
      const reset = "\x1b[0m";

      console.log(
        `${statusColor}[${logData.statusCode}]${reset} ${logData.method} ${logData.path} - ${logData.responseTime}ms (${logData.ip})`
      );
    } else {
      console.log(JSON.stringify(logData));
    }
  });

  next();
};
