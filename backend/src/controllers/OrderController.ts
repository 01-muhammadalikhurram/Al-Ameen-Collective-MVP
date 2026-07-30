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
      const { customer_name, customer_phone, customer_address, notes, items } = req.body;
      
      if (!customer_name || !customer_phone || !customer_address || !items) {
        throw new ApiError(400, 'Missing required fields for checkout');
      }

      const order = await this.orderService.createOrder({
        customer_name,
        customer_phone,
        customer_address,
        notes,
        items
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
}
