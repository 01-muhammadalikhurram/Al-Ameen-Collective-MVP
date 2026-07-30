import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/ProductService';
import { ApiResponse } from '../utils/ApiResponse';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        season: req.query.season as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      };

      const data = await this.productService.getProducts(filters);
      res.status(200).json(ApiResponse.success('Products retrieved', data));
    } catch (error) {
      next(error);
    }
  };

  getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = req.params.slug as string;
      const data = await this.productService.getProductBySlug(slug);
      res.status(200).json(ApiResponse.success('Product retrieved', data));
    } catch (error) {
      next(error);
    }
  };
}
