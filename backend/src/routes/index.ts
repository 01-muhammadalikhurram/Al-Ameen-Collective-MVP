import { Router } from 'express';
import { API_VERSION } from '../constants';
import healthRoutes from './health.routes';

/**
 * Root route aggregator.
 * All feature routes will be mounted here under /api/v1.
 * Doc 09 Section 7 mandates API versioning from day one.
 */
const router = Router();

// System routes
router.use(healthRoutes);

// Feature routes will be added here as development progresses:
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);
// router.use('/admin', adminRoutes);
// router.use('/vendor', vendorRoutes);
// router.use('/pricing', pricingRoutes);
// router.use('/delivery', deliveryRoutes);
// router.use('/announcements', announcementRoutes);

export { router as apiRouter, API_VERSION };
