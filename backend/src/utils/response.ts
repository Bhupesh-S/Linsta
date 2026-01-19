/**
 * Standardized Response Utilities
 * Ensures consistent API response format across all endpoints
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | Record<string, any>;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

/**
 * Success response
 */
export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString(),
});

/**
 * Paginated success response
 */
export const paginatedSuccessResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): PaginatedResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString(),
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  },
});

/**
 * Error response
 */
export const errorResponse = (
  error: string | Record<string, any>
): ApiResponse => ({
  success: false,
  error,
  timestamp: new Date().toISOString(),
});

/**
 * HTTP Status codes reference
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
