import { Response } from 'express';

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors: string[];
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Send a successful API response.
 * Follows the consistent response format defined in Doc 05 Section 22.
 */
export function sendSuccess<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
}

/**
 * Send an error API response.
 * Follows the consistent response format defined in Doc 05 Section 22.
 */
export function sendError(res: Response, message: string, statusCode = 400, errors: string[] = []) {
  const response: ApiErrorResponse = {
    success: false,
    message,
    errors,
  };
  res.status(statusCode).json(response);
}

export type { ApiResponse, ApiSuccessResponse, ApiErrorResponse };
