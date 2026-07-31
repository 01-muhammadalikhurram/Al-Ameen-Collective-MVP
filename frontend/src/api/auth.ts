import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export const login = async (credentials: any) => {
  const response = await apiClient.post('/auth/login', credentials);
  return (response as any).data;
};

export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return (response as any).data;
};

export const updateProfile = async (payload: { username: string; currentPassword?: string; newPassword?: string }) => {
  const response = await apiClient.patch('/auth/profile', payload);
  return (response as any).data;
};

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
};

export const useAdminUser = () => {
  const { isAuthenticated, setUser, logout } = useAuthStore();

  return useQuery({
    queryKey: ['adminUser'],
    queryFn: async () => {
      try {
        const user = await getMe();
        setUser(user);
        return user;
      } catch (error) {
        logout();
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: false,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};
