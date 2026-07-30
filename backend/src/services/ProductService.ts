/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
import { ProductRepository, ProductFilters } from '../repositories/ProductRepository';
import { ConfigRepository } from '../repositories/ConfigRepository';
import { ApiError } from '../utils/ApiError';

export class ProductService {
  private productRepo: ProductRepository;
  private configRepo: ConfigRepository;

  constructor() {
    this.productRepo = new ProductRepository();
    this.configRepo = new ConfigRepository();
  }

  /**
   * Helper method to map backend product to public DTO
   * Calculates the public selling price while hiding wholesale prices.
   */
  private mapToPublicProduct(product: any, globalProfit: number) {
    const items = product.items.map((item: any) => {
      const wholesale = Number(item.wholesale_price);
      const additional = Number(item.additional_profit);
      
      // If item has a specific additional profit > 0, it overrides the global profit margin.
      // Otherwise use the global profit margin.
      const profitToUse = additional > 0 ? additional : globalProfit;
      const sellingPrice = wholesale + profitToUse;

      return {
        id: item.id,
        product_code: item.product_code,
        color: item.color,
        selling_price: sellingPrice.toFixed(2), // Format as decimal string
        media: item.media ? {
          url: item.media.url,
          alt_text: item.media.alt_text,
        } : null
      };
    });

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      fabric: product.fabric,
      category: product.category,
      season: product.season,
      items,
    };
  }

  async getProducts(filters: ProductFilters) {
    const [productsResult, globalProfitRule] = await Promise.all([
      this.productRepo.getActiveProducts(filters),
      this.configRepo.getGlobalPricingRule(),
    ]);

    const globalProfit = globalProfitRule ? Number(globalProfitRule.global_profit) : 0;

    const formattedProducts = productsResult.products.map((p: any) => 
      this.mapToPublicProduct(p, globalProfit)
    );

    return {
      products: formattedProducts,
      pagination: productsResult.pagination,
    };
  }

  async getProductBySlug(slug: string) {
    const [product, globalProfitRule] = await Promise.all([
      this.productRepo.getProductBySlug(slug),
      this.configRepo.getGlobalPricingRule(),
    ]);

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const globalProfit = globalProfitRule ? Number(globalProfitRule.global_profit) : 0;
    
    return this.mapToPublicProduct(product, globalProfit);
  }
}
