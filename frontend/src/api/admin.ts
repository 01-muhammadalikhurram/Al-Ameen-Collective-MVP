import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export interface AdminMetrics {
  delivered: {
    total: number;
    count: number;
  };
  confirmed: {
    total: number;
    count: number;
  };
  pending: {
    total: number;
    count: number;
  };
  cancelled: {
    total: number;
    count: number;
  };
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
