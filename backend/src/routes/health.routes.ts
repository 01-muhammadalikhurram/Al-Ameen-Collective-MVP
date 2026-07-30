import { Router } from 'express';
import { sendSuccess } from '../utils/api-response';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the API status and version information
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/health', (_req, res) => {
  sendSuccess(res, {
    status: 'healthy',
    version: '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
  }, 'Al Ameen Collective API is running');
});

export default router;
