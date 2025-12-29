// Authentication business logic
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model";
import { UserProfile } from "../users/profile.model";
import { RegisterRequest, LoginRequest, AuthResponse, JwtPayload } from "./auth.types";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRY = "7d";

export class AuthService {
  // Register new user
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

  // Login user
  static async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new Error("Invalid credentials");
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
