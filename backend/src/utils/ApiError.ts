export class ApiError extends Error {
  public statusCode: number;
  public errors?: unknown[];

  constructor(statusCode: number, message: string, errors?: unknown[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    // Capture stack trace for debugging (excluding this constructor call)
    Error.captureStackTrace(this, this.constructor);
  }
}
