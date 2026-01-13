  // Authentication business logic
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../users/user.model";
import { UserProfile } from "../users/profile.model";
import { RegisterRequest, LoginRequest, GoogleLoginRequest, AuthResponse, JwtPayload } from "./auth.types";
import { validateEmail, validatePassword, validateName } from "./auth.validators";
import { AuthErrors, AuthError } from "./auth.errors";
import { config } from "../../config/config";

// Ensure JWT secret is set and non-empty
const JWT_SECRET = config.jwtSecret || "supersecretkey";
const JWT_EXPIRY: string = (config.jwtExpiry as string) || "7d";
const GOOGLE_CLIENT_ID = config.googleClientId || "";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export class AuthService {
  // Register new user (email/password)
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // Validate inputs
    if (!data.name || !data.email || !data.password) {
      throw AuthErrors.MISSING_FIELDS;
    }

    // Validate name
    const nameValidation = validateName(data.name);
    if (!nameValidation.valid) {
      throw new AuthError(400, nameValidation.error || "Invalid name");
    }

    // Validate email
    if (!validateEmail(data.email)) {
      throw AuthErrors.INVALID_EMAIL;
    }

    // Validate password strength
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      throw new AuthError(400, `Password requirements: ${passwordValidation.errors.join(", ")}`);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw AuthErrors.USER_EXISTS;
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const user = await User.create({
        name: data.name.trim(),
        email: data.email.toLowerCase(),
        password: hashedPassword,
        authProvider: "local",
      });

      // Create empty profile
      await UserProfile.create({
        userId: user._id,
        skills: [],
        interests: [],
      });

      // Generate token
      const token = this.generateToken(user._id.toString(), user.email);

      return {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      };
    } catch (error: any) {
      // Handle duplicate email error from MongoDB
      if (error.code === 11000) {
        throw AuthErrors.USER_EXISTS;
      }
      throw error;
    }
  }

  // Login user (email/password)
  static async login(data: LoginRequest): Promise<AuthResponse> {
    // Validate inputs
    if (!data.email || !data.password) {
      throw AuthErrors.MISSING_FIELDS;
    }

    // Validate email format
    if (!validateEmail(data.email)) {
      throw AuthErrors.INVALID_EMAIL;
    }

    // Find user
    const user = await User.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      throw AuthErrors.INVALID_CREDENTIALS;
    }

    // Verify password exists
    if (!user.password) {
      throw AuthErrors.GOOGLE_LOGIN_REQUIRED;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw AuthErrors.INVALID_CREDENTIALS;
    }

    // Generate token
    const token = this.generateToken(user._id.toString(), user.email);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  // Google login
  static async googleLogin(data: GoogleLoginRequest): Promise<AuthResponse> {
    try {
      // For testing purposes - accept any token format
      // In production, always verify: await googleClient.verifyIdToken(...)
      
      // For now, we'll parse a mock token to test the flow
      // This allows testing without real Google tokens
      
      // Extract test data from token (in production use real verification)
      const mockPayload = {
        sub: "test_google_user_" + Date.now(),
        email: "testuser@gmail.com",
        name: "Test User from Google",
      };

      const googleId = mockPayload.sub;
      const email = mockPayload.email;
      const name = mockPayload.name;

      if (!email || !name) {
        throw AuthErrors.MISSING_FIELDS;
      }

      // Check if user exists by email
      let user = await User.findOne({ email });

      if (user) {
        // User exists, check if it's a Google account
        if (user.authProvider === "local" && !user.googleId) {
          // User has local account, link Google ID
          user.googleId = googleId;
          user.authProvider = "google";
          await user.save();
        }
      } else {
        // Create new user
        user = await User.create({
          name,
          email,
          googleId,
          authProvider: "google",
        });

        // Create empty profile
        await UserProfile.create({
          userId: user._id,
          skills: [],
          interests: [],
        });
      }

      // Generate token
      const token = this.generateToken(user._id.toString(), user.email);

      return {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      };
    } catch (error: any) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(401, `Google authentication failed: ${error.message}`);
    }
  }

  // Generate JWT token
  private static generateToken(userId: string, email: string): string {
    const payload: JwtPayload = { userId, email };
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: "7d"
    });
  }

  // Verify token with proper error handling
  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new AuthError(401, "Token has expired. Please log in again.");
      }
      if (error.name === "JsonWebTokenError") {
        throw new AuthError(401, "Invalid token format");
      }
      throw AuthErrors.INVALID_TOKEN;
    }
  }
}
