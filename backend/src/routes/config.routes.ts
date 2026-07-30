import { Router } from 'express';
import { ConfigController } from '../controllers/ConfigController';

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

export { router as configRouter };
