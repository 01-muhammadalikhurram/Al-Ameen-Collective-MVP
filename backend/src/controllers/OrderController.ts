import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/OrderService';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as {
        customer_name: string;
        customer_phone: string;
        customer_address: string;
        notes?: string;
        items: { item_id: string; quantity: number }[];
      };
      
      if (!body.customer_name || !body.customer_phone || !body.customer_address || !body.items) {
        throw new ApiError(400, 'Missing required fields for checkout');
      }

      const order = await this.orderService.createOrder({
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_address: body.customer_address,
        notes: body.notes,
        items: body.items
      });

      res.status(201).json(ApiResponse.success('Order placed successfully', order));
    } catch (error) {
      next(error);
    }
  };

  getOrderByPublicId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const publicId = req.params.publicId as string;
      const order = await this.orderService.getOrderByPublicId(publicId);
      res.status(200).json(ApiResponse.success('Order retrieved', order));
    } catch (error) {
      next(error);
    }
  };

  getOrderByVendorToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.params.token as string;
      const order = await this.orderService.getOrderByVendorToken(token);
      res.status(200).json(ApiResponse.success('Vendor order retrieved', order));
    } catch (error) {
      next(error);
    }
  };
}
