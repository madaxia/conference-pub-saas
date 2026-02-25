import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EbooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.ebook.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  }

  async create(data: any) {
    return this.prisma.ebook.create({ data });
  }
}
