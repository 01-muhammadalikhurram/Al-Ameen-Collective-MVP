import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/AdminService';
import { ApiResponse } from '../utils/ApiResponse';

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
}
