import { prisma } from '../config/prisma';
import { OrderStatus, Prisma } from '@prisma/client';

export interface OrderFilters {
  page: number;
  limit: number;
  status?: OrderStatus;
  search?: string;
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
      orders,
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
}
