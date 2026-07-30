import { Request, Response, NextFunction } from 'express';

/**
 * Shared request/response types for the backend.
 * Feature-specific types will be added in their respective modules.
 */

/** Typed request with validated body */
export interface TypedRequest<T> extends Request {
  body: T;
}

/** Typed request with validated params */
export interface TypedRequestParams<T extends Record<string, string>> extends Request {
  params: T;
}

/** Typed request with validated query */
export interface TypedRequestQuery<T extends Record<string, string | undefined>> extends Request {
  query: T;
}

/** Express async handler wrapper to catch promise rejections */
export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/** Order status enum matching database ENUM */
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}

/** Product status enum matching database ENUM */
export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  HIDDEN = 'HIDDEN',
  ARCHIVED = 'ARCHIVED',
}
