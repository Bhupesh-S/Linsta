// Custom error class for API errors
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

// Helper to throw errors
export const throwError = (statusCode: number, message: string): never => {
  throw new AppError(statusCode, message);
};
