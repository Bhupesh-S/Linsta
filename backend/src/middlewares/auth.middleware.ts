// JWT authentication middleware
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../modules/auth/auth.service";
import { AuthError, AuthErrors } from "../modules/auth/auth.errors";

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      email?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: AuthErrors.MISSING_TOKEN.message });
      return;
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = AuthService.verifyToken(token);
    req.userId = payload.userId;
    req.email = payload.email;

    next();
  } catch (error: any) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(401).json({ error: AuthErrors.INVALID_TOKEN.message });
    }
  }
};
