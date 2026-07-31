import { Request, Response, NextFunction } from 'express';
import { VendorService } from '../services/VendorService';
import { ApiResponse } from '../utils/ApiResponse';

export class VendorController {
  private vendorService: VendorService;

  constructor() {
    this.vendorService = new VendorService();
  }

  getVendorOrder = async (req: Request<{ token: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params;
      const orderData = await this.vendorService.getVendorOrder(token);
      res.status(200).json(ApiResponse.success('Vendor order retrieved successfully', orderData));
    } catch (error) {
      next(error);
    }
  };
}
