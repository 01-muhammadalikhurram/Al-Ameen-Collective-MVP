import { Router, RequestHandler } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const adminController = new AdminController();

// Cast middleware/handlers to avoid Express typing conflicts
const auth = authMiddleware as unknown as RequestHandler;

/**
 * @openapi
 * /admin/metrics:
 *   get:
 *     summary: Get Dashboard Metrics
 *     description: Returns separated order metrics (delivered, confirmed, pending, cancelled).
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 */
router.get('/metrics', auth, adminController.getMetrics as unknown as RequestHandler);

/**
 * @openapi
 * /admin/orders:
 *   get:
 *     summary: List All Orders (Admin)
 *     description: Returns paginated orders with optional status filter and search.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, DELIVERED, CANCELLED]
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 */
router.get('/orders', auth, adminController.getOrders as unknown as RequestHandler);

/**
 * @openapi
 * /admin/orders/{orderId}/status:
 *   patch:
 *     summary: Update Order Status
 *     description: Changes the status of an order. Free transitions are allowed.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, DELIVERED, CANCELLED]
 *               notes:
 *                 type: string
 */
router.patch('/orders/:orderId/status', auth, adminController.updateOrderStatus as unknown as RequestHandler);

export { router as adminRoutes };
