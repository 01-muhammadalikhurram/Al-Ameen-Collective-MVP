import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface ProductFilters {
  search?: string;
  category?: string;
  season?: string;
  page?: number;
  limit?: number;
}

export class ProductRepository {
  private db = prisma;

  async getActiveProducts(filters: ProductFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
    };

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.season) {
      where.season = filters.season;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: {
            where: { status: 'ACTIVE' },
            include: { media: true },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.db.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductBySlug(slug: string) {
    return this.db.product.findFirst({
      where: {
        slug,
        status: 'ACTIVE',
      },
      include: {
        items: {
          where: { status: 'ACTIVE' },
          include: { media: true },
        },
      },
    });
  }

  async getProductItemById(id: string) {
    return this.db.productItem.findUnique({
      where: { id },
      include: { product: true },
    });
  }

  async createProduct(productData: Omit<Prisma.ProductCreateInput, 'items'>, itemsData: any[]) {
    return this.db.$transaction(async (tx) => {
      // 1. Create the main product
      const product = await tx.product.create({
        data: productData,
      });

      // 2. Create the variants and their associated media
      for (const item of itemsData) {
        let mediaId = undefined;

        // If the item has media URL, create Media record first
        if (item.mediaUrl) {
          const media = await tx.media.create({
            data: {
              url: item.mediaUrl,
              file_name: item.mediaFileName || 'uploaded_image',
            },
          });
          mediaId = media.id;
        }

        // Create the product item
        await tx.productItem.create({
          data: {
            product_id: product.id,
            product_code: item.product_code,
            color: item.color,
            wholesale_price: item.wholesale_price,
            additional_profit: item.additional_profit,
            media_id: mediaId,
          },
        });
      }

      return product;
    });
  }
}
