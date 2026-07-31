/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

  getAdminSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.configService.getAdminSettings();
      res.status(200).json(ApiResponse.success('Admin settings retrieved', data));
    } catch (error) {
      next(error);
    }
  };

  updateWebsiteSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.configService.updateWebsiteSettings(req.body);
      res.status(200).json(ApiResponse.success('Website settings updated', data));
    } catch (error) {
      next(error);
    }
  };

  updatePricingRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.configService.updatePricingRule(req.body);
      res.status(200).json(ApiResponse.success('Pricing rule updated', data));
    } catch (error) {
      next(error);
    }
  };

  createDeliveryRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.configService.createDeliveryRule(req.body);
      res.status(201).json(ApiResponse.success('Delivery rule created', data));
    } catch (error) {
      next(error);
    }
  };

  deleteDeliveryRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.configService.deleteDeliveryRule(req.params.id as string);
      res.status(200).json(ApiResponse.success('Delivery rule deleted'));
    } catch (error) {
      next(error);
    }
  };

  createAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.configService.createAnnouncement(req.body);
      res.status(201).json(ApiResponse.success('Announcement created', data));
    } catch (error) {
      next(error);
    }
  };

  updateAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.configService.updateAnnouncement(req.params.id as string, req.body);
      res.status(200).json(ApiResponse.success('Announcement updated', data));
    } catch (error) {
      next(error);
    }
  };

  deleteAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.configService.deleteAnnouncement(req.params.id as string);
      res.status(200).json(ApiResponse.success('Announcement deleted'));
    } catch (error) {
      next(error);
    }
  };
}
