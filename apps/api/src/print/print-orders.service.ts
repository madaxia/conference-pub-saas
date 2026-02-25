import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrintOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.printOrder.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  }

  async create(data: any) {
    return this.prisma.printOrder.create({ data });
  }
}
