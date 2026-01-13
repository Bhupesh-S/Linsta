// Global error handling middleware
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { config } from "../config/config";

interface ErrorResponse {
  status: "error";
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  stack?: string;
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();

  let statusCode = 500;
  let message = "Internal Server Error";

  // Handle custom AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Handle Mongoose validation errors
  else if (error.name === "ValidationError") {
    statusCode = 400;
    message = error.message;
  }
  // Handle Mongoose duplicate key errors
  else if (error.name === "MongoServerError" && (error as any).code === 11000) {
    statusCode = 409;
    message = "Duplicate field value entered";
  }
  // Handle JWT errors
  else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }
  // Generic errors
  else {
    message = error.message || "Internal Server Error";
  }

  const errorResponse: ErrorResponse = {
    status: "error",
    message,
    statusCode,
    timestamp,
    path: req.path,
  };

  // Add stack trace in development
  if (config.isDevelopment() && !(error instanceof AppError)) {
    errorResponse.stack = error.stack;
  }

  // Log error
  console.error(`[${timestamp}] ${statusCode} - ${message}`, {
    path: req.path,
    method: req.method,
    ...(config.isDevelopment() && { stack: error.stack }),
  });

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 handler - should be last middleware
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(404, `Route ${req.path} not found`);
  next(error);
};
