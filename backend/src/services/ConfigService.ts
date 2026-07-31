import { ConfigRepository } from '../repositories/ConfigRepository';
import { ApiError } from '../utils/ApiError';

export class ConfigService {
  private configRepo: ConfigRepository;

  constructor() {
    this.configRepo = new ConfigRepository();
  }

  async getPublicConfig() {
    const settings = await this.configRepo.getWebsiteSettings();
    const deliveryRules = await this.configRepo.getDeliveryRules();
    const announcements = await this.configRepo.getPublicAnnouncements();

    if (!settings) {
      throw new ApiError(500, 'Website settings not found');
    }

    return {
      settings,
      deliveryRules,
      announcements,
    };
  }

  // Admin Methods

  async getAdminSettings() {
    const settings = await this.configRepo.getWebsiteSettings();
    const deliveryRules = await this.configRepo.getDeliveryRules();
    const pricingRule = await this.configRepo.getGlobalPricingRule();
    const announcements = await this.configRepo.getAnnouncements();

    return {
      settings,
      deliveryRules,
      pricingRule,
      announcements,
    };
  }

  async updateWebsiteSettings(data: { business_name?: string; whatsapp_number?: string; default_delivery_charge?: number }) {
    const settings = await this.configRepo.getWebsiteSettings();
    if (!settings) throw new ApiError(500, 'Website settings not initialized');
    return this.configRepo.updateWebsiteSettings(settings.id, data);
  }

  async updatePricingRule(data: { global_profit: number }) {
    const rule = await this.configRepo.getGlobalPricingRule();
    if (!rule) throw new ApiError(500, 'Pricing rule not initialized');
    return this.configRepo.updatePricingRule(rule.id, data);
  }

  async createDeliveryRule(data: { minimum_order: number; discount_percentage: number }) {
    return this.configRepo.createDeliveryRule(data);
  }

  async deleteDeliveryRule(id: string) {
    return this.configRepo.deleteDeliveryRule(id);
  }

  async createAnnouncement(data: { message: string; active?: boolean; display_order?: number }) {
    return this.configRepo.createAnnouncement(data);
  }

  async updateAnnouncement(id: string, data: { message?: string; active?: boolean; display_order?: number }) {
    return this.configRepo.updateAnnouncement(id, data);
  }

  async deleteAnnouncement(id: string) {
    return this.configRepo.deleteAnnouncement(id);
  }
}
