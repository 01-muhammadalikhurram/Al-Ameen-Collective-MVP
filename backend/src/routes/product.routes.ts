import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

// Public routes
router.get('/', productController.getProducts);
router.get('/:slug', productController.getProductBySlug);

export { router as productRoutes };
