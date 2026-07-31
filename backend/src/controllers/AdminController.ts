import { Request, Response, NextFunction } from 'express';
import { AdminService, OrderFilters, AdminProductFilters } from '../services/AdminService';
import { ApiResponse } from '../utils/ApiResponse';
import { OrderStatus, ProductStatus } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

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

      res.status(200).json(ApiResponse.success('Order status updated', order));
    } catch (error) {
      next(error);
    }
  };

  // --- Admin Product Management ---

  getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: AdminProductFilters = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        status: req.query.status as ProductStatus,
        search: req.query.search as string,
        category: req.query.category as string,
      };

      const data = await this.adminService.getProducts(filters);
      res.status(200).json(ApiResponse.success('Products retrieved', data));
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const product = await this.adminService.getProductById(id);
      
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      res.status(200).json(ApiResponse.success('Product retrieved', product));
    } catch (error) {
      next(error);
    }
  };

  updateProductStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      
      if (!status || !Object.values(ProductStatus).includes(status as ProductStatus)) {
        res.status(400).json(ApiResponse.error('Invalid or missing status'));
        return;
      }

      const data = await this.adminService.updateProductStatus(id, status as ProductStatus);
      res.status(200).json(ApiResponse.success('Product status updated', data));
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const data = await this.adminService.deleteProduct(id);
      res.status(200).json(ApiResponse.success('Product archived', data));
    } catch (error) {
      next(error);
    }
  };
}
