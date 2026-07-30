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
}
