import { Order, OrderStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes?: string;
  delivery_charge: number;
  subtotal: number;
  total: number;
  public_order_id: string;
  items: {
    item_id: string;
    quantity: number;
    wholesale_price: number;
    selling_price: number;
    profit: number;
  }[];
}

export class OrderRepository {
  private db = prisma;

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    return this.db.$transaction(async (tx) => {
      // 1. Create the Order
      const order = await tx.order.create({
        data: {
          public_order_id: payload.public_order_id,
          customer_name: payload.customer_name,
          customer_phone: payload.customer_phone,
          customer_address: payload.customer_address,
          notes: payload.notes || null,
          delivery_charge: payload.delivery_charge,
          subtotal: payload.subtotal,
          total: payload.total,
          status: OrderStatus.PENDING,
          // 2. Create the related OrderItems
          items: {
            create: payload.items.map(item => ({
              item_id: item.item_id,
              quantity: item.quantity,
              wholesale_price: item.wholesale_price,
              selling_price: item.selling_price,
              profit: item.profit,
            }))
          },
          // 3. Create the initial OrderHistory entry
          history: {
            create: {
              status: OrderStatus.PENDING,
              notes: 'Order placed by customer',
            }
          }
        },
        include: {
          items: true,
        }
      });

      return order;
    });
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            productItem: {
              include: {
                product: true,
                media: true,
              }
            }
          }
        },
        history: {
          orderBy: { created_at: 'desc' }
        }
      }
    });
  }

  async getOrderByPublicId(publicOrderId: string): Promise<Order | null> {
    return this.db.order.findUnique({
      where: { public_order_id: publicOrderId },
      include: {
        items: {
          include: {
            productItem: {
              include: {
                product: true,
                media: true,
              }
            }
          }
        }
      }
    });
  }

  async getOrderByVendorToken(vendorToken: string) {
    const tokenRecord = await this.db.vendorAccessToken.findUnique({
      where: { token: vendorToken, is_active: true },
      include: {
        order: {
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
                    },
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!tokenRecord) return null;
    return tokenRecord.order;
  }

  async updateOrderStatus(id: string, status: OrderStatus, notes?: string): Promise<Order> {
    return this.db.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: { status },
      });

      await tx.orderHistory.create({
        data: {
          order_id: id,
          status,
          notes,
        }
      });

      if (status === OrderStatus.CONFIRMED) {
        const existingToken = await tx.vendorAccessToken.findFirst({
          where: { order_id: id, is_active: true }
        });
        if (!existingToken) {
          await tx.vendorAccessToken.create({
            data: { order_id: id }
          });
        }
      }

      return order;
    });
  }
}
