import { OrderRepository } from '../repositories/OrderRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { ConfigRepository } from '../repositories/ConfigRepository';
import { ApiError } from '../utils/ApiError';
import crypto from 'crypto';

export interface OrderCheckoutPayload {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes?: string;
  items: {
    item_id: string;
    quantity: number;
  }[];
}

export class OrderService {
  private orderRepo: OrderRepository;
  private productRepo: ProductRepository;
  private configRepo: ConfigRepository;

  constructor() {
    this.orderRepo = new OrderRepository();
    this.productRepo = new ProductRepository();
    this.configRepo = new ConfigRepository();
  }

  // Generate a random 6-character alphanumeric ID (e.g., ORD-A7X9B2)
  private generatePublicOrderId(): string {
    const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `ORD-${randomChars}`;
  }

  async createOrder(payload: OrderCheckoutPayload) {
    if (!payload.items || payload.items.length === 0) {
      throw new ApiError(400, 'Order must contain at least one item');
    }

    // 1. Fetch Global Pricing Rule
    const globalProfitRule = await this.configRepo.getGlobalPricingRule();
    const globalProfit = globalProfitRule ? Number(globalProfitRule.global_profit) : 0;

    // 2. Process Items and Recalculate Prices
    let calculatedSubtotal = 0;
    const orderItems = [];

    for (const orderItem of payload.items) {
      // Fetch the actual item from the DB
      const dbItem = await this.productRepo.getProductItemById(orderItem.item_id);
      
      if (!dbItem) {
        throw new ApiError(404, `Item not found: ${orderItem.item_id}`);
      }

      if (dbItem.status !== 'ACTIVE') {
        throw new ApiError(400, `Item is not available: ${dbItem.product_code}`);
      }

      const wholesale = Number(dbItem.wholesale_price);
      const itemAdditionalProfit = Number(dbItem.additional_profit);
      
      // Compute profit and selling price exactly as we do in ProductService
      const appliedProfit = itemAdditionalProfit > 0 ? itemAdditionalProfit : globalProfit;
      const sellingPrice = wholesale + appliedProfit;
      
      calculatedSubtotal += sellingPrice * orderItem.quantity;

      orderItems.push({
        item_id: orderItem.item_id,
        quantity: orderItem.quantity,
        wholesale_price: wholesale,
        selling_price: sellingPrice,
        profit: appliedProfit,
      });
    }

    // 3. Fetch Settings and Delivery Rules to compute shipping
    const settings = await this.configRepo.getWebsiteSettings();
    if (!settings) {
      throw new ApiError(500, 'Website settings not found');
    }
    const defaultDeliveryCharge = Number(settings.default_delivery_charge);
    const deliveryRules = await this.configRepo.getDeliveryRules();

    let deliveryCharge = defaultDeliveryCharge;

    if (deliveryRules && deliveryRules.length > 0) {
      // Rules are already sorted by minimum_order ASC from repo, 
      // but we need to find the HIGHEST threshold that the subtotal meets.
      // So let's reverse them or iterate backwards.
      const sortedRules = [...deliveryRules].sort((a, b) => Number(b.minimum_order) - Number(a.minimum_order));
      const applicableRule = sortedRules.find((rule) => calculatedSubtotal >= Number(rule.minimum_order));
      
      if (applicableRule) {
        // delivery_charge = default_delivery_charge * (1 - discount_percentage / 100)
        const discountPercentage = Number(applicableRule.discount_percentage);
        const discountMultiplier = Math.max(0, 1 - (discountPercentage / 100)); // prevent negative delivery charge
        deliveryCharge = defaultDeliveryCharge * discountMultiplier;
      }
    }

    // 4. Calculate Final Total
    const calculatedTotal = calculatedSubtotal + deliveryCharge;

    // 5. Generate Public Order ID
    let publicOrderId = this.generatePublicOrderId();
    
    // Ensure uniqueness (in a real app, use a retry loop, but collision probability is low)
    const existing = await this.orderRepo.getOrderByPublicId(publicOrderId);
    if (existing) {
      publicOrderId = this.generatePublicOrderId();
    }

    // 6. Create the Order securely in the database
    const order = await this.orderRepo.createOrder({
      public_order_id: publicOrderId,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_address: payload.customer_address,
      notes: payload.notes,
      subtotal: calculatedSubtotal,
      delivery_charge: deliveryCharge,
      total: calculatedTotal,
      items: orderItems,
    });

    return order;
  }

  async getOrderByPublicId(publicOrderId: string) {
    const order = await this.orderRepo.getOrderByPublicId(publicOrderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  }

  async getOrderByVendorToken(vendorToken: string) {
    const order = await this.orderRepo.getOrderByVendorToken(vendorToken);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Since the vendor page needs wholesale price and profit (per user feedback), 
    // we can return the entire order which contains these fields.
    // Let's explicitly format it to make sure we don't accidentally leak anything else.
    const settings = await this.configRepo.getSettings();
    const defaultDeliveryCharge = Number(settings.default_delivery_charge);
    const orderDeliveryCharge = Number(order.delivery_charge);
    const deliveryDiscount = Math.max(0, defaultDeliveryCharge - orderDeliveryCharge);

    let totalProfit = 0;
    const items = order.items.map((item) => {
      totalProfit += Number(item.profit);
      return {
        id: item.id,
        quantity: item.quantity,
        wholesale_price: item.wholesale_price,
        selling_price: item.selling_price,
        profit: item.profit,
        productItem: item.productItem
      };
    });

    const netProfit = totalProfit - deliveryDiscount;

    return {
      public_order_id: order.public_order_id,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address,
      notes: order.notes,
      delivery_charge: order.delivery_charge,
      default_delivery_charge: defaultDeliveryCharge,
      delivery_discount: deliveryDiscount,
      total_commission: totalProfit,
      net_profit: netProfit,
      subtotal: order.subtotal,
      total: order.total,
      status: order.status,
      created_at: order.created_at,
      items
    };
  }
}
