export interface ApiResponseFormat<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

export class ApiResponse {
  static success<T>(message: string, data?: T): ApiResponseFormat<T> {
    return {
      success: true,
      message,
      ...(data !== undefined && { data }),
    };
  }

  static error(message: string, errors?: unknown[]): ApiResponseFormat<null> {
    return {
      success: false,
      message,
      ...(errors && errors.length > 0 && { errors }),
    };
  }
}
