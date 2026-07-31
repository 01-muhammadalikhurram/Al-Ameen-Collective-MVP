import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  // TEMPORARY BYPASS: as per user request "lets just remove the requirement of admin login"
  req.user = { userId: 'admin', username: 'admin' };
  return next();
};
