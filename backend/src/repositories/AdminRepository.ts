import { Admin, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export class AdminRepository {
  private db = prisma;

  async findByUsername(username: string): Promise<Admin | null> {
    return this.db.admin.findUnique({ where: { username } });
  }

  async create(data: Prisma.AdminCreateInput): Promise<Admin> {
    return this.db.admin.create({ data });
  }

  async findById(id: string): Promise<Admin | null> {
    return this.db.admin.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.AdminUpdateInput): Promise<Admin> {
    return this.db.admin.update({ where: { id }, data });
  }
}
