import { prisma } from '../config/prisma';

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
}
