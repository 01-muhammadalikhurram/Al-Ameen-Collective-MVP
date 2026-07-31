import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

// ─── Metrics ────────────────────────────────────────────────────────────────

export interface AdminMetrics {
  delivered: { total: number; count: number };
  confirmed: { total: number; count: number };
  pending: { total: number; count: number };
  cancelled: { total: number; count: number };
}

export const getAdminMetrics = async (): Promise<AdminMetrics> => {
  const response = await apiClient.get('/admin/metrics');
  return (response as any).data as AdminMetrics;
};

export const useAdminMetrics = () => {
  return useQuery({
    queryKey: ['adminMetrics'],
    queryFn: getAdminMetrics,
  });
};

// ─── Orders ─────────────────────────────────────────────────────────────────

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  item_id: string;
  quantity: number;
  wholesale_price: string;
  selling_price: string;
  profit: string;
  productItem: {
    product_code: string;
    color: string;
    product: { name: string };
    media: { url: string } | null;
  };
}

export interface OrderHistoryEntry {
  id: string;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
}

export interface AdminOrder {
  id: string;
  public_order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string | null;
  delivery_charge: string;
  subtotal: string;
  total: string;
  status: OrderStatus;
  vendor_token: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  history: OrderHistoryEntry[];
}

export interface OrdersResponse {
  orders: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}

export const getAdminOrders = async (params: OrdersQueryParams): Promise<OrdersResponse> => {
  const response = await apiClient.get('/admin/orders', { params });
  return (response as any).data as OrdersResponse;
};

export const useAdminOrders = (params: OrdersQueryParams) => {
  return useQuery({
    queryKey: ['adminOrders', params],
    queryFn: () => getAdminOrders(params),
    placeholderData: (prev) => prev,
  });
};

// ─── Update Order Status ────────────────────────────────────────────────────

export interface UpdateOrderStatusPayload {
  orderId: string;
  status: OrderStatus;
  notes?: string;
}

export const updateOrderStatus = async (payload: UpdateOrderStatusPayload) => {
  const response = await apiClient.patch(`/admin/orders/${payload.orderId}/status`, {
    status: payload.status,
    notes: payload.notes,
  });
  return (response as any).data;
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      // Invalidate orders list and metrics to reflect the change
      void queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      void queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
    },
  });
};

// --- Products ---------------------------------------------------------------

export type ProductStatus = 'ACTIVE' | 'OUT_OF_STOCK' | 'HIDDEN' | 'ARCHIVED';

export interface AdminProductFilters {
  page?: number;
  limit?: number;
  status?: ProductStatus;
  search?: string;
  category?: string;
}

export const getAdminProducts = async (params: AdminProductFilters) => {
  const response = await apiClient.get('/admin/products', { params });
  return (response as any).data;
};

export const useAdminProducts = (params: AdminProductFilters) => {
  return useQuery({
    queryKey: ['adminProducts', params],
    queryFn: () => getAdminProducts(params),
    placeholderData: (prev) => prev,
  });
};

export const updateProductStatus = async ({ id, status }: { id: string; status: ProductStatus }) => {
  const response = await apiClient.patch(`/admin/products/${id}/status`, { status });
  return (response as any).data;
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProductStatus,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });
};

export const deleteProduct = async (id: string) => {
  const response = await apiClient.delete(`/admin/products/${id}`);
  return (response as any).data;
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });
};

export const getAdminProductById = async (id: string) => {
  const response = await apiClient.get(`/admin/products/${id}`);
  return (response as any).data;
};

export const useAdminProduct = (id: string) => {
  return useQuery({
    queryKey: ['adminProduct', id],
    queryFn: () => getAdminProductById(id),
    enabled: !!id,
  });
};
