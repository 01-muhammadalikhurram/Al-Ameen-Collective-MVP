import axios from 'axios';
import { API_URL } from '../constants';

/**
 * Configured Axios instance for making API requests.
 * All requests will use the base API URL defined in constants.
 */
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor for attaching auth token (placeholder for now)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for handling global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can dispatch global error events or toast notifications here in the future.
    return Promise.reject(error);
  }
);
