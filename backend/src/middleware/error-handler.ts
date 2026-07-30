import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns a consistent JSON response.
 * Never exposes stack traces or internal details to the client (Doc 05 Section 17 & 20).
 */
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  logger.error(
    { err, method: req.method, url: req.url, body: req.body, query: req.query },
    'Unhandled error occurred',
  );

  if (err instanceof ApiError) {
    res.status(err.statusCode).json(ApiResponse.error(err.message, err.errors));
    return;
  }

  // Fallback for unhandled server errors
  res.status(500).json(ApiResponse.error('Internal Server Error'));
};
