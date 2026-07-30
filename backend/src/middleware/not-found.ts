import { Request, Response } from 'express';

/**
 * 404 handler for undefined routes.
 */
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: 'The requested resource was not found.',
    errors: [],
  });
}
