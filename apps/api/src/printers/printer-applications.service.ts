import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrinterApplicationsService {
  constructor(private prisma: PrismaService) {}

  async apply(data: { name: string; address: string; contact: string; phone: string; email: string }) {
    return this.prisma.printerApplication.create({ data });
  }

  async findAll(status?: string) {
    const where = status ? { status } : {};
    return this.prisma.printerApplication.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async approve(id: string) {
    const app = await this.prisma.printerApplication.findUnique({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');

    const printer = await this.prisma.printer.create({
      data: {
        name: app.name,
        address: app.address,
        contact: app.contact,
        phone: app.phone,
        email: app.email,
        status: 'active',
      },
    });

    await this.prisma.printerApplication.update({
      where: { id },
      data: { status: 'approved' },
    });

    return printer;
  }

  async reject(id: string) {
    return this.prisma.printerApplication.update({
      where: { id },
      data: { status: 'rejected' },
    });
  }
}
