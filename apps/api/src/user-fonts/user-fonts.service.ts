import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserFontsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.userFontUpload.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    fontName: string;
    fontFamily: string;
    fileName: string;
    fileSize: number;
    url: string;
    copyrightConfirmed: boolean;
  }, userId: string, tenantId: string) {
    return this.prisma.userFontUpload.create({
      data: {
        userId,
        name: data.fontName,
        family: data.fontFamily,
        url: data.url,
        status: 'pending',
      },
    });
  }

  async approve(id: string) {
    return this.prisma.userFontUpload.update({
      where: { id },
      data: { status: 'approved' },
    });
  }

  async reject(id: string, note: string) {
    return this.prisma.userFontUpload.update({
      where: { id },
      data: { status: 'rejected' },
    });
  }

  async findPending() {
    return this.prisma.userFontUpload.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
    });
  }
}
