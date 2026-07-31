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

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
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

  async updateProfile(userId: string, payload: { username: string; currentPassword?: string; newPassword?: string }) {
    const admin = await this.adminRepo.findById(userId);
    if (!admin) {
      throw new ApiError(404, 'Admin not found');
    }

    if (payload.newPassword) {
      if (!payload.currentPassword) {
        throw new ApiError(400, 'Current password is required to set a new password');
      }
      
      const isPasswordValid = await bcrypt.compare(payload.currentPassword, admin.password_hash);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid current password');
      }
    }

    const dataToUpdate: any = {};
    if (payload.username) {
      dataToUpdate.username = payload.username;
    }

    if (payload.newPassword) {
      dataToUpdate.password_hash = await bcrypt.hash(payload.newPassword, 10);
    }

    const updatedAdmin = await this.adminRepo.update(userId, dataToUpdate);
    return {
      id: updatedAdmin.id,
      username: updatedAdmin.username,
    };
  }
}
