import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    const existing = await this.prisma.tenant.findFirst({ where: { name } });
    if (existing) {
      throw new ConflictException('Tenant already exists');
    }
    return this.prisma.tenant.create({ data: { name } });
  }

  async findAll() {
    return this.prisma.tenant.findMany();
  }

  async findById(id: string) {
    return this.prisma.tenant.findUnique({ where: { id } });
  }
}
