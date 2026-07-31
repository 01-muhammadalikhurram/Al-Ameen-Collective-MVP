import { OrderRepository } from '../repositories/OrderRepository';
import { ApiError } from '../utils/ApiError';

export class VendorService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async getVendorOrder(token: string) {
    const order = await this.orderRepository.getOrderByVendorToken(token);

    if (!order) {
      throw new ApiError(404, 'Order not found or token invalid');
    }

    if (order.status === 'CANCELLED') {
      throw new ApiError(400, 'This order has been cancelled. No shipment is required.');
    }

    // Return the safe payload excluding selling_price and profit
    return {
      id: order.id,
      public_order_id: order.public_order_id,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address,
      notes: order.notes,
      delivery_charge: Number(order.delivery_charge),
      subtotal: Number(order.subtotal),
      // We send the Customer's Grand Total as per requirement (total = subtotal + delivery_charge, where subtotal is selling_price based)
      // Wait, vendor sees Wholesale Total + Delivery Charge = Vendor's view of Total
      // Let's recalculate the Vendor's Grand Total since order.total is the Retail Total!
      
      // Calculate Vendor Total
      wholesale_subtotal: order.items.reduce((acc, item) => acc + (Number(item.wholesale_price) * item.quantity), 0),
      retail_total: Number(order.total),
      
      status: order.status,
      created_at: order.created_at,
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        wholesale_price: Number(item.wholesale_price),
        productItem: {
          product_code: item.productItem.product_code,
          color: item.productItem.color,
          product: {
            name: item.productItem.product.name,
          },
          media: item.productItem.media ? { url: item.productItem.media.url } : null,
        }
      }))
    };
  }
}
