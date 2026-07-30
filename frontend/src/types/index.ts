/**
 * Shared frontend types.
 */

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'VENDOR';
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
