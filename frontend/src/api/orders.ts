import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes?: string;
  items: {
    item_id: string;
    quantity: number;
  }[];
}

export interface OrderResponse {
  id: string;
  public_order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string | null;
  delivery_charge: string;
  subtotal: string;
  total: string;
  status: string;
  created_at: string;
}

export const createOrder = async (payload: CreateOrderPayload): Promise<OrderResponse> => {
  const response = await apiClient.post('/orders', payload);
  return (response as any).data as OrderResponse;
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder,
  });
};
