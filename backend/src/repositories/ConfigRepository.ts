import { WebsiteSetting, PricingRule, DeliveryRule, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export class ConfigRepository {
  private db = prisma;

  // Website Settings
  async getWebsiteSettings(): Promise<WebsiteSetting | null> {
    return this.db.websiteSetting.findFirst();
  }

  async updateWebsiteSettings(id: string, data: Prisma.WebsiteSettingUpdateInput): Promise<WebsiteSetting> {
    return this.db.websiteSetting.update({ where: { id }, data });
  }

  // Pricing Rule
  async getGlobalPricingRule(): Promise<PricingRule | null> {
    return this.db.pricingRule.findFirst();
  }

  async updatePricingRule(id: string, data: Prisma.PricingRuleUpdateInput): Promise<PricingRule> {
    return this.db.pricingRule.update({ where: { id }, data });
  }

  // Delivery Rules
  async getDeliveryRules(): Promise<DeliveryRule[]> {
    return this.db.deliveryRule.findMany({
      orderBy: { minimum_order: 'asc' },
    });
  }

  async createDeliveryRule(data: Prisma.DeliveryRuleCreateInput): Promise<DeliveryRule> {
    return this.db.deliveryRule.create({ data });
  }

  async deleteDeliveryRule(id: string): Promise<DeliveryRule> {
    return this.db.deliveryRule.delete({ where: { id } });
  }
}
