  // Authentication business logic
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { User } from "../users/user.model";
import { UserProfile } from "../users/profile.model";
import { RegisterRequest, LoginRequest, GoogleLoginRequest, LinkedinLoginRequest, AuthResponse, JwtPayload } from "./auth.types";
import { validateEmail, validatePassword, validateName } from "./auth.validators";
import { AuthErrors, AuthError } from "./auth.errors";
import { config } from "../../config/config";

// Ensure JWT secret is set and non-empty
const JWT_SECRET = config.jwtSecret || "supersecretkey";
const JWT_EXPIRY: string = (config.jwtExpiry as string) || "7d";
const GOOGLE_CLIENT_ID = config.googleClientId || "";

// LinkedIn OAuth constants
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "";
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "";
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || "http://localhost:5000/api/auth/linkedin/callback";
const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_PROFILE_URL = "https://api.linkedin.com/v2/me";
const LINKEDIN_EMAIL_URL = "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))";

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

  // LinkedIn OAuth - Step 1: Get authorization URL (called on frontend)
  static getLinkedinAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: LINKEDIN_CLIENT_ID,
      redirect_uri: LINKEDIN_REDIRECT_URI,
      scope: "openid profile email",
    });
    return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
  }

  // LinkedIn OAuth - Step 2: Exchange code for token and fetch user profile
  static async linkedinLogin(data: LinkedinLoginRequest): Promise<AuthResponse> {
    try {
      if (!data.code) {
        throw AuthErrors.MISSING_FIELDS;
      }

      // Exchange authorization code for access token
      const tokenResponse = await axios.post(LINKEDIN_TOKEN_URL, null, {
        params: {
          grant_type: "authorization_code",
          code: data.code,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
          redirect_uri: LINKEDIN_REDIRECT_URI,
        },
      });

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
        throw new AuthError(401, "Failed to obtain access token from LinkedIn");
      }

      // Fetch user profile
      const profileResponse = await axios.get(LINKEDIN_PROFILE_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202401",
        },
      });

      const linkedinProfile = profileResponse.data;
      const linkedinId = linkedinProfile.id;
      const firstName = linkedinProfile.localizedFirstName || "";
      const lastName = linkedinProfile.localizedLastName || "";
      const name = `${firstName} ${lastName}`.trim();

      // Fetch email address
      let email = "";
      try {
        const emailResponse = await axios.get(LINKEDIN_EMAIL_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "LinkedIn-Version": "202401",
          },
        });

        if (emailResponse.data.elements && emailResponse.data.elements.length > 0) {
          email = emailResponse.data.elements[0]["handle~"]?.emailAddress || "";
        }
      } catch (emailError) {
        // Email might not be accessible - handle gracefully
        console.warn("Could not fetch email from LinkedIn profile");
      }

      // Handle missing email
      if (!email) {
        throw new AuthError(400, "Could not retrieve email from LinkedIn. Please allow email access and try again.");
      }

      // Validate email format
      if (!validateEmail(email)) {
        throw new AuthError(400, "Invalid email format from LinkedIn");
      }

      // Validate name
      if (!name) {
        throw new AuthError(400, "Could not retrieve name from LinkedIn profile");
      }

      // Check if user exists by email
      let user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        // User exists, check if LinkedIn is linked
        if (!user.linkedinId) {
          user.linkedinId = linkedinId;
          if (user.authProvider === "local") {
            user.authProvider = "linkedin";
          }
          await user.save();
        }
      } else {
        // Create new user
        user = await User.create({
          name,
          email: email.toLowerCase(),
          linkedinId,
          authProvider: "linkedin",
        });

        // Create empty profile
        await UserProfile.create({
          userId: user._id,
          skills: [],
          interests: [],
        });
      }

      // Generate JWT token (do NOT store LinkedIn access token)
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
      if (error.response?.status === 401) {
        throw new AuthError(401, "LinkedIn authorization failed. Code may be invalid or expired.");
      }
      throw new AuthError(401, `LinkedIn authentication failed: ${error.message}`);
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
