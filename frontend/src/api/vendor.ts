import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export interface VendorOrderProductItem {
  product_code: string;
  color: string;
  product: {
    name: string;
  };
  media: {
    url: string;
  } | null;
}

export interface VendorOrderItem {
  id: string;
  quantity: number;
  wholesale_price: number;
  productItem: VendorOrderProductItem;
}

export interface VendorOrder {
  id: string;
  public_order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string | null;
  delivery_charge: number;
  default_delivery_charge: number;
  delivery_discount: number;
  total_commission: number;
  net_profit: number;
  subtotal: number;
  wholesale_subtotal: number;
  retail_total: number;
  status: string;
  created_at: string;
  items: VendorOrderItem[];
}

export const getVendorOrder = async (token: string): Promise<VendorOrder> => {
  const response = await apiClient.get(`/vendor/orders/${token}`);
  return (response as any).data;
};

export const useVendorOrder = (token: string) => {
  return useQuery({
    queryKey: ['vendorOrder', token],
    queryFn: () => getVendorOrder(token),
    enabled: !!token,
    retry: false, // Don't retry if 404/400 to avoid infinite loops on invalid tokens
  });
};
