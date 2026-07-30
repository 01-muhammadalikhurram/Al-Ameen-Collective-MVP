import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export interface WebsiteSetting {
  id: string;
  default_delivery_charge: string;
  cart_expiry_days: number;
  whatsapp_number: string | null;
  business_name: string | null;
  announcement_text?: string | null;
  show_announcement_bar?: boolean | string;
}

export interface ConfigResponse {
  settings: WebsiteSetting;
}

export const fetchConfig = async (): Promise<ConfigResponse> => {
  const response = await apiClient.get('/config');
  return (response as any).data as ConfigResponse;
};

export const useConfig = () => {
  return useQuery({
    queryKey: ['config'],
    queryFn: fetchConfig,
  });
};

// Helper hook to get a specific setting by key
export const useSetting = (key: keyof WebsiteSetting) => {
  const { data, ...rest } = useConfig();
  const value = data?.settings?.[key] ?? null;
  return { value, ...rest };
};
