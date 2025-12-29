// Authentication business logic
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../users/user.model";
import { UserProfile } from "../users/profile.model";
import { RegisterRequest, LoginRequest, GoogleLoginRequest, AuthResponse, JwtPayload } from "./auth.types";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRY = "7d";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export class AuthService {
  // Register new user (email/password)
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await User.create({
      name: data.name,
      email: data.email,
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
  }

  // Login user (email/password)
  static async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password exists
    if (!user.password) {
      throw new Error("This account uses Google login. Please use Google Sign-In.");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
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
        throw new Error("Missing email or name from Google");
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
      throw new Error(`Google authentication failed: ${error.message}`);
    }
  }

  // Generate JWT token
  private static generateToken(userId: string, email: string): string {
    const payload: JwtPayload = { userId, email };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  }

  // Verify token
  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
