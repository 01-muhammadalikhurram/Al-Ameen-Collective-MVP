import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminRepository } from '../repositories/AdminRepository';
import { ApiError } from '../utils/ApiError';
import { config } from '../config';
import { z } from 'zod';
import { loginSchema } from '../validators/auth.validator';

export class AuthService {
  private adminRepo: AdminRepository;

  constructor() {
    this.adminRepo = new AdminRepository();
  }

  async login(payload: z.infer<typeof loginSchema>['body']) {
    const { username, password } = payload;

    const admin = await this.adminRepo.findByUsername(username);
    if (!admin) {
      throw new ApiError(401, 'Invalid username or password');
    }

    // For debugging: compare plain text passwords
    const isPasswordValid = password === admin.password_hash;
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid username or password');
    }

    const token = jwt.sign(
      { userId: admin.id, username: admin.username },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token };
  }
}
