// Standardized auth error responses
import { AppError } from "../../utils/appError";

export class AuthError extends AppError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "AuthError";
  }
}

// Specific auth errors
export const AuthErrors = {
  INVALID_CREDENTIALS: new AuthError(401, "Invalid email or password"),
  USER_EXISTS: new AuthError(409, "User with this email already exists"),
  USER_NOT_FOUND: new AuthError(404, "User not found"),
  INVALID_EMAIL: new AuthError(400, "Invalid email format"),
  WEAK_PASSWORD: new AuthError(400, "Password does not meet security requirements"),
  INVALID_TOKEN: new AuthError(401, "Invalid or expired token"),
  MISSING_TOKEN: new AuthError(401, "Authorization token required"),
  INVALID_NAME: new AuthError(400, "Invalid name format"),
  GOOGLE_LOGIN_REQUIRED: new AuthError(401, "This account uses Google login. Please use Google Sign-In."),
  MISSING_FIELDS: new AuthError(400, "Missing required fields"),
};

export const throwAuthError = (error: AuthError): never => {
  throw error;
};
