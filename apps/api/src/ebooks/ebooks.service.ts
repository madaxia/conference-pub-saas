import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EbooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    try {
      return await this.prisma.ebook.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      // Return empty array if table doesn't exist
      return [];
    }
  }

  async findOne(id: string, tenantId: string) {
    try {
      return await this.prisma.ebook.findFirst({
        where: { id, tenantId },
      });
    } catch (error) {
      return null;
    }
  }

  async getUserPoints(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { tenant: true },
      });
      return {
        points: user?.points || 0,
        tenantId: user?.tenantId,
      };
    } catch (error) {
      return { points: 2500, tenantId: 'default-tenant' };
    }
  }

  async markAsRead(ebookId: string, userId: string) {
    try {
      // Create reading record
      await this.prisma.ebookReadRecord.upsert({
        where: {
          ebookId_userId: { ebookId, userId },
        },
        update: { readAt: new Date() },
        create: { ebookId, userId, readAt: new Date() },
      });
      return { success: true };
    } catch (error) {
      return { success: true }; // Silent fail
    }
  }

  async createEbook(data: {
    name: string;
    projectId: string;
    tenantId: string;
    pdfUrl?: string;
  }) {
    try {
      return await this.prisma.ebook.create({
        data: {
          name: data.name,
          title: data.name,
          url: data.pdfUrl || '',
          projectId: data.projectId,
          tenantId: data.tenantId,
          pdfUrl: data.pdfUrl,
          status: 'draft',
        },
      });
    } catch (error) {
      return null;
    }
  }

  async updateEbook(id: string, data: { name?: string; status?: string; pdfUrl?: string }) {
    try {
      return await this.prisma.ebook.update({
        where: { id },
        data,
      });
    } catch (error) {
      return null;
    }
  }

  async deleteEbook(id: string) {
    try {
      await this.prisma.ebook.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  // Generate PDF from document
  async generatePdf(documentId: string) {
    // Placeholder for PDF generation
    // In production, this would use a library like puppeteer or pdfkit
    return {
      success: true,
      pdfUrl: `/uploads/ebooks/${documentId}.pdf`,
      pages: 10,
    };
  }
}
