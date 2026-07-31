import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/ProductService';
import { ApiResponse } from '../utils/ApiResponse';
import { StorageService } from '../services/StorageService';
import { createProductSchema } from '../validators/product.validator';

export class ProductController {
  private productService: ProductService;
  private storageService: StorageService;

  constructor() {
    this.productService = new ProductService();
    this.storageService = new StorageService();
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

  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Parse JSON data from FormData string
      const rawData = req.body.data;
      if (!rawData) {
        throw new Error('Missing product data payload');
      }
      
      const payload = JSON.parse(rawData);

      // 2. Validate payload using Zod
      const validated = createProductSchema.parse({ body: payload });
      const productData = validated.body;

      // 3. Upload images for each variant if they exist
      const files = req.files as Express.Multer.File[] || [];
      const itemsWithMedia = await Promise.all(
        productData.items.map(async (item) => {
          let mediaUrl: string | undefined;
          let mediaFileName: string | undefined;

          // Check if a file was uploaded for this item using fileIndex
          if (typeof item.fileIndex === 'number' && files[item.fileIndex]) {
            const file = files[item.fileIndex];
            mediaUrl = await this.storageService.uploadImage(file.buffer, file.originalname);
            mediaFileName = file.originalname;
          }

          return { ...item, mediaUrl, mediaFileName };
        })
      );

      // 4. Save to Database
      // We mutate productData.items to include the media URLs so ProductService can save them
      productData.items = itemsWithMedia as any;
      const newProduct = await this.productService.createProduct(productData);

      res.status(201).json(ApiResponse.success('Product created successfully', newProduct));
    } catch (error) {
      next(error);
    }
  };
}
