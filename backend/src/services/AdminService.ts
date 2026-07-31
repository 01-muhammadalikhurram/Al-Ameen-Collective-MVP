import { prisma } from '../config/prisma';
import { OrderStatus, ProductStatus, Prisma } from '@prisma/client';

export interface OrderFilters {
  page: number;
  limit: number;
  status?: OrderStatus;
  search?: string;
}

export interface AdminProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: ProductStatus;
}

export class AdminService {
  private db = prisma;

  async getMetrics() {
    const orders = await this.db.order.findMany({
      select: {
        status: true,
        total: true,
      }
    });

    let deliveredTotal = 0;
    let confirmedTotal = 0;
    let pendingTotal = 0;
    let cancelledTotal = 0;

    let deliveredCount = 0;
    let confirmedCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;

    for (const order of orders) {
      const amount = Number(order.total);
      if (order.status === 'DELIVERED') {
        deliveredTotal += amount;
        deliveredCount++;
      } else if (order.status === 'CONFIRMED') {
        confirmedTotal += amount;
        confirmedCount++;
      } else if (order.status === 'PENDING') {
        pendingTotal += amount;
        pendingCount++;
      } else if (order.status === 'CANCELLED') {
        cancelledTotal += amount;
        cancelledCount++;
      }
    }

    return {
      delivered: {
        total: deliveredTotal,
        count: deliveredCount,
      },
      confirmed: {
        total: confirmedTotal,
        count: confirmedCount,
      },
      pending: {
        total: pendingTotal,
        count: pendingCount,
      },
      cancelled: {
        total: cancelledTotal,
        count: cancelledCount,
      }
    };
  }

  async getOrders(filters: OrderFilters) {
    const { page, limit, status, search } = filters;
    const skip = (page - 1) * limit;

    // Build the where clause
    const where: Prisma.OrderWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { public_order_id: { contains: search, mode: 'insensitive' } },
        { customer_name: { contains: search, mode: 'insensitive' } },
        { customer_phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.db.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          items: {
            include: {
              productItem: {
                include: {
                  product: {
                    select: { name: true }
                  },
                  media: {
                    select: { url: true }
                  }
                }
              }
            }
          },
          history: {
            orderBy: { created_at: 'desc' }
          }
        }
      }),
      this.db.order.count({ where }),
    ]);

    return {
      orders: orders.map(order => ({
        ...order,
        vendor_token: order.vendorTokens[0]?.token || null,
        vendorTokens: undefined // remove the array from the payload to keep it clean
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async getOrderById(orderId: string) {
    const order = await this.db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            productItem: {
              include: {
                product: { select: { name: true } },
                media: true
              }
            }
          }
        },
        history: {
          orderBy: { created_at: 'desc' }
        },
        vendorTokens: {
          where: { is_active: true },
          take: 1
        }
      }
    });

    return order;
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus, notes?: string) {
    // Verify the order exists
    const existing = await this.db.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true }
    });

    if (!existing) {
      return null;
    }

    // Free transitions allowed per user requirement
    const updatedOrder = await this.db.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
        include: {
          items: {
            include: {
              productItem: {
                include: {
                  product: {
                    select: { name: true }
                  },
                  media: {
                    select: { url: true }
                  }
                }
              }
            }
          },
          history: {
            orderBy: { created_at: 'desc' }
          }
        }
      });

      await tx.orderHistory.create({
        data: {
          order_id: orderId,
          status: newStatus,
          notes: notes || `Status changed to ${newStatus}`,
        }
      });

      return order;
    });

    return updatedOrder;
  }

  // --- Admin Product Management ---

  async getProducts(filters: AdminProductFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          items: {
            include: { media: true },
          },
        },
      }),
      this.db.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    return this.db.product.findUnique({
      where: { id },
      include: {
        items: {
          include: { media: true }
        }
      }
    });
  }

  async updateProductStatus(id: string, status: ProductStatus) {
    return this.db.product.update({
      where: { id },
      data: { status },
    });
  }

  async deleteProduct(id: string) {
    // Delete product and its items. Because of Cascade, deleting product deletes ProductItem and OrderItem if cascade is set, wait!
    // orderItem is Restrict on ProductItem, so we cannot hard delete if it's in an order.
    // Therefore, we use soft-delete by setting status to ARCHIVED.
    return this.db.product.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }
}
