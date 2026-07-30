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

    if (!settings) {
      throw new ApiError(500, 'Website settings not found');
    }

    return {
      settings,
      deliveryRules,
    };
  }
}
