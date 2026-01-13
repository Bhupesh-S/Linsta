// Auth API controllers
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterRequest, LoginRequest, GoogleLoginRequest } from "./auth.types";
import { AuthError, AuthErrors } from "./auth.errors";

export class AuthController {
  // POST /api/auth/register
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body as RegisterRequest;

      const result = await AuthService.register({ name, email, password });
      res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Registration failed" });
      }
    }
  }

  // POST /api/auth/login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as LoginRequest;

      const result = await AuthService.login({ email, password });
      res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Login failed" });
      }
    }
  }

  // POST /api/auth/google
  static async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body as GoogleLoginRequest;

      if (!idToken) {
        res.status(400).json({ error: AuthErrors.MISSING_FIELDS.message });
        return;
      }

      const result = await AuthService.googleLogin({ idToken });
      res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Google login failed" });
      }
    }
  }
}
