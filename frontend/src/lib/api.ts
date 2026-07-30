import axios from 'axios';

// Ensure the API url is pulled from environment or defaults to the vite proxy
export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for attaching auth tokens (we'll use this later for Admin routes)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Generic response data extractor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // We can handle global 401s or network errors here
    return Promise.reject(error.response?.data || error);
  }
);
