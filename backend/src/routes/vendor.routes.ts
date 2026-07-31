import { Router } from 'express';
import { VendorController } from '../controllers/VendorController';

const router = Router();
const vendorController = new VendorController();

router.get('/orders/:token', vendorController.getVendorOrder as any);

export { router as vendorRoutes };
