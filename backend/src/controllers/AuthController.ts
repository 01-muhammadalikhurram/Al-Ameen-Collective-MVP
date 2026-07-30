import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { ApiResponse } from '../utils/ApiResponse';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = req.body as { username: string; password: string };
      const data = await this.authService.login(payload);
      res.status(200).json(ApiResponse.success('Login successful', data));
    } catch (error) {
      next(error);
    }
  };
}
