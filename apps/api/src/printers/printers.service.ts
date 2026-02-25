import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrintersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.printer.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    const printer = await this.prisma.printer.findUnique({ where: { id } });
    if (!printer) throw new NotFoundException('Printer not found');
    return printer;
  }

  async create(data: { name: string; address?: string; contact?: string; phone?: string; email?: string }) {
    return this.prisma.printer.create({ data });
  }

  async update(id: string, data: { name?: string; address?: string; contact?: string; phone?: string; email?: string; status?: string }) {
    return this.prisma.printer.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.printer.delete({ where: { id } });
  }

  async getOrders(printerId: string) {
    return this.prisma.printOrder.findMany({
      where: { printerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async setPricing(id: string, pricing: any) {
    return this.prisma.printer.update({
      where: { id },
      data: { pricing },
    });
  }
}
