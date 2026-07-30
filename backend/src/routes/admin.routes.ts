import { Router, RequestHandler } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const adminController = new AdminController();

/**
 * @openapi
 * /admin/metrics:
 *   get:
 *     summary: Get Dashboard Metrics
 *     description: Returns the total sales and active orders.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 */
router.get('/metrics', authMiddleware as unknown as RequestHandler, adminController.getMetrics as unknown as RequestHandler);

export { router as adminRoutes };
