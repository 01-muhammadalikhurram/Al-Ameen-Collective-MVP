import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns a consistent JSON response.
 * Never exposes stack traces or internal details to the client (Doc 05 Section 17 & 20).
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error({ err }, 'Unhandled error');

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred. Please try again later.'
        : err.message,
    errors: [],
  });
}
