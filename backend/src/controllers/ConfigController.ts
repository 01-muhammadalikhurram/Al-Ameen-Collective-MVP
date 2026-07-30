import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '../services/ConfigService';
import { ApiResponse } from '../utils/ApiResponse';

export class ConfigController {
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }

  getPublicConfig = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.configService.getPublicConfig();
      res.status(200).json(ApiResponse.success('Configuration retrieved', data));
    } catch (error) {
      next(error);
    }
  };
}
