import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export interface VendorOrder {
  public_order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string | null;
  delivery_charge: string | number;
  subtotal: string | number;
  total: string | number;
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  created_at: string;
  items: {
    id: string;
    quantity: number;
    wholesale_price: string | number;
    selling_price: string | number;
    profit: string | number;
    productItem: {
      product_code: string;
      color: string;
      product: { name: string };
      media: { url: string } | null;
    };
  }[];
}

export const getVendorOrder = async (token: string): Promise<VendorOrder> => {
  const response = await apiClient.get(`/orders/vendor/${token}`);
  return (response as any).data;
};

export const useVendorOrder = (token: string) => {
  return useQuery({
    queryKey: ['vendorOrder', token],
    queryFn: () => getVendorOrder(token),
    enabled: !!token,
    retry: false, // Don't retry on 404s
  });
};
