import { Router } from 'express';
import { ConfigController } from '../controllers/ConfigController';
import { authMiddleware } from '../middleware/auth';
import { RequestHandler } from 'express';

const router = Router();
const configController = new ConfigController();

/**
 * @openapi
 * /config:
 *   get:
 *     summary: Get Public Configuration
 *     description: Retrieves the public website settings and delivery rules.
 *     tags:
 *       - Config
 *     responses:
 *       200:
 *         description: Configuration retrieved
 */
router.get('/', configController.getPublicConfig);

const auth = authMiddleware as unknown as RequestHandler;

// Protected Admin Config Routes
router.get('/admin/settings', auth, configController.getAdminSettings as unknown as RequestHandler);
router.patch('/admin/settings/website', auth, configController.updateWebsiteSettings as unknown as RequestHandler);
router.patch('/admin/settings/pricing', auth, configController.updatePricingRule as unknown as RequestHandler);

router.post('/admin/settings/delivery-rules', auth, configController.createDeliveryRule as unknown as RequestHandler);
router.delete('/admin/settings/delivery-rules/:id', auth, configController.deleteDeliveryRule as unknown as RequestHandler);

router.post('/admin/settings/announcements', auth, configController.createAnnouncement as unknown as RequestHandler);
router.patch('/admin/settings/announcements/:id', auth, configController.updateAnnouncement as unknown as RequestHandler);
router.delete('/admin/settings/announcements/:id', auth, configController.deleteAnnouncement as unknown as RequestHandler);

export { router as configRouter };
