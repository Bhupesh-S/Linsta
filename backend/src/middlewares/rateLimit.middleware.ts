import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: {
    requests: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10); // 15 minutes default
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10); // 100 requests default

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis
 */
export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  // Initialize or reset if window expired
  if (!store[ip] || store[ip].resetTime < now) {
    store[ip] = {
      requests: 1,
      resetTime: now + WINDOW_MS,
    };
    next();
    return;
  }

  // Increment request count
  store[ip].requests++;

  // Check if limit exceeded
  if (store[ip].requests > MAX_REQUESTS) {
    res.status(429).json({
      error: "Too many requests, please try again later",
      retryAfter: Math.ceil((store[ip].resetTime - now) / 1000),
    });
    return;
  }

  // Set retry-after header
  res.setHeader(
    "X-RateLimit-Remaining",
    Math.max(0, MAX_REQUESTS - store[ip].requests)
  );
  res.setHeader("X-RateLimit-Reset", store[ip].resetTime);

  next();
};

/**
 * Cleanup old entries periodically (every hour)
 */
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((ip) => {
    if (store[ip].resetTime < now) {
      delete store[ip];
    }
  });
}, 3600000);
