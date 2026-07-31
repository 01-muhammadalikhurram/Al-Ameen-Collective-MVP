import { Router, RequestHandler } from 'express';
import { AdminController } from '../controllers/AdminController';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware } from '../middleware/auth';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
const adminController = new AdminController();
const productController = new ProductController();

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

/**
 * @openapi
 * /admin/products:
 *   post:
 *     summary: Create a new product with variants and images
 *     description: Creates a product. Accepts multipart/form-data with 'data' (JSON string) and 'images' (files).
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 */
router.post('/products', auth, upload.array('images', 10) as unknown as RequestHandler, productController.createProduct as unknown as RequestHandler);
router.get('/products/:id', auth, adminController.getProductById as unknown as RequestHandler);
router.put('/products/:id', auth, upload.array('images', 10) as unknown as RequestHandler, productController.updateProduct as unknown as RequestHandler);
router.get('/products', auth, adminController.getProducts as unknown as RequestHandler);
router.patch('/products/:id/status', auth, adminController.updateProductStatus as unknown as RequestHandler);
router.delete('/products/:id', auth, adminController.deleteProduct as unknown as RequestHandler);

export { router as adminRoutes };
