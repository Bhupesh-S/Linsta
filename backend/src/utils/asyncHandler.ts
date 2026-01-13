// Async error wrapper for controllers
import { Request, Response, NextFunction } from "express";

/**
 * Wraps async controller functions to catch errors
 * Usage: router.get('/path', asyncHandler(controllerMethod))
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
