// Auth API controllers
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterRequest, LoginRequest, GoogleLoginRequest, LinkedinLoginRequest } from "./auth.types";
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

  // GET /api/auth/linkedin
  // Returns LinkedIn OAuth authorization URL
  static async getLinkedinAuth(req: Request, res: Response): Promise<void> {
    try {
      const authUrl = AuthService.getLinkedinAuthUrl();
      res.status(200).json({ authUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to generate LinkedIn auth URL" });
    }
  }

  // GET /api/auth/linkedin/callback
  // Receives authorization code from LinkedIn and exchanges for JWT token
  static async linkedinCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.query as { code?: string };

      if (!code) {
        res.status(400).json({ error: "Authorization code is required" });
        return;
      }

      const result = await AuthService.linkedinLogin({ code });
      
      // Return token and user info
      res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "LinkedIn login failed" });
      }
    }
  }
}
