import { Request, Response, NextFunction } from 'express';
import { AdminService, OrderFilters } from '../services/AdminService';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { OrderStatus } from '@prisma/client';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  getMetrics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.adminService.getMetrics();
      res.status(200).json(ApiResponse.success('Metrics retrieved successfully', data));
    } catch (error) {
      next(error);
    }
  };

  getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const status = req.query.status as OrderStatus | undefined;
      const search = req.query.search as string | undefined;

      // Validate status if provided
      if (status && !Object.values(OrderStatus).includes(status)) {
        throw new ApiError(400, `Invalid status: ${status}`);
      }

      const filters: OrderFilters = { page, limit, status, search };
      const data = await this.adminService.getOrders(filters);
      res.status(200).json(ApiResponse.success('Orders retrieved successfully', data));
    } catch (error) {
      next(error);
    }
  };

  updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = req.params.orderId as string;
      const body = req.body as { status: string; notes?: string };

      if (!body.status) {
        throw new ApiError(400, 'Status is required');
      }

      if (!Object.values(OrderStatus).includes(body.status as OrderStatus)) {
        throw new ApiError(400, `Invalid status: ${body.status}`);
      }

      const order = await this.adminService.updateOrderStatus(
        orderId,
        body.status as OrderStatus,
        body.notes
      );

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      res.status(200).json(ApiResponse.success('Order status updated successfully', order));
    } catch (error) {
      next(error);
    }
  };
}
