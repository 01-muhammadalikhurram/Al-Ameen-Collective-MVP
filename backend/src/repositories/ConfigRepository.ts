import { WebsiteSetting, PricingRule, DeliveryRule, Announcement, Prisma } from '@prisma/client';
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

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return this.db.announcement.findMany({
      orderBy: { display_order: 'asc' },
    });
  }

  async getPublicAnnouncements(): Promise<Announcement[]> {
    return this.db.announcement.findMany({
      where: { active: true },
      orderBy: { display_order: 'asc' },
    });
  }

  async createAnnouncement(data: Prisma.AnnouncementCreateInput): Promise<Announcement> {
    return this.db.announcement.create({ data });
  }

  async updateAnnouncement(id: string, data: Prisma.AnnouncementUpdateInput): Promise<Announcement> {
    return this.db.announcement.update({ where: { id }, data });
  }

  async deleteAnnouncement(id: string): Promise<Announcement> {
    return this.db.announcement.delete({ where: { id } });
  }
}
