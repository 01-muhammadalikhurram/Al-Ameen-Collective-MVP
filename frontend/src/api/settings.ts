import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export interface WebsiteSetting {
  id: string;
  default_delivery_charge: string | number;
  cart_expiry_days: number;
  whatsapp_number: string;
  business_name: string;
}

export interface PricingRule {
  id: string;
  global_profit: string | number;
}

export interface DeliveryRule {
  id: string;
  minimum_order: string | number;
  discount_percentage: string | number;
}

export interface Announcement {
  id: string;
  message: string;
  active: boolean;
  display_order: number;
}

export interface AdminSettingsResponse {
  settings: WebsiteSetting;
  pricingRule: PricingRule;
  deliveryRules: DeliveryRule[];
  announcements: Announcement[];
}

// Fetch Admin Settings
export const getAdminSettings = async (): Promise<AdminSettingsResponse> => {
  const response = await apiClient.get('/config/admin/settings');
  return (response as any).data;
};

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['adminSettings'],
    queryFn: getAdminSettings,
  });
};

// Update Website Settings
export const useUpdateWebsiteSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<WebsiteSetting>) => {
      const response = await apiClient.patch('/config/admin/settings/website', data);
      return (response as any).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });
};

// Update Pricing Rule
export const useUpdatePricingRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { global_profit: number }) => {
      const response = await apiClient.patch('/config/admin/settings/pricing', data);
      return (response as any).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });
};

// Delivery Rules CRUD
export const useCreateDeliveryRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<DeliveryRule, 'id'>) => {
      const response = await apiClient.post('/config/admin/settings/delivery-rules', data);
      return (response as any).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });
};

export const useDeleteDeliveryRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/config/admin/settings/delivery-rules/${id}`);
      return (response as any).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });
};

// Announcements CRUD
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Announcement, 'id'>) => {
      const response = await apiClient.post('/config/admin/settings/announcements', data);
      return (response as any).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Announcement> & { id: string }) => {
      const response = await apiClient.patch(`/config/admin/settings/announcements/${id}`, data);
      return (response as any).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/config/admin/settings/announcements/${id}`);
      return (response as any).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });
};
