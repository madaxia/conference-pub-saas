import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    tenantId?: string;
    name: string;
    description: string;
    category: string;
    config?: any;
    thumbnailUrl?: string;
    previewUrl?: string;
    aiFileUrl?: string;
    pdfFileUrl?: string;
    isPremium?: boolean;
    points?: number;
    isPublic?: boolean;
  }) {
    return this.prisma.template.create({
      data: {
        tenantId: data.tenantId || null,
        name: data.name,
        description: data.description,
        category: data.category as any,
        config: data.config || {},
        thumbnailUrl: data.thumbnailUrl || null,
        previewUrl: data.previewUrl || null,
        aiFileUrl: data.aiFileUrl || null,
        pdfFileUrl: data.pdfFileUrl || null,
        isPremium: data.isPremium || false,
        points: data.points || 0,
        isPublic: data.isPublic || false,
      },
    });
  }

  async findAll(tenantId?: string) {
    return this.prisma.template.findMany({
      where: tenantId ? { OR: [{ tenantId }, { isPublic: true }] } : { isPublic: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async delete(id: string, tenantId: string) {
    const template = await this.prisma.template.findFirst({ where: { id, OR: [{ tenantId }, { isPublic: true }] } });
    if (!template) throw new NotFoundException('Template not found');
    await this.prisma.template.delete({ where: { id } });
    return { success: true };
  }

  // Redeem template with points
  async redeem(templateId: string, userId: string) {
    const template = await this.prisma.template.findUnique({ where: { id: templateId } });
    if (!template) throw new NotFoundException('Template not found');

    // Check if already purchased
    const existingPurchase = await this.prisma.templatePurchase.findFirst({
      where: { userId, templateId },
    });
    if (existingPurchase) {
      throw new BadRequestException('You have already redeemed this template');
    }

    // Check if user has enough points
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const pointsRequired = template.points || 0;

    // Free templates don't need points
    if (pointsRequired === 0) {
      await this.prisma.templatePurchase.create({
        data: { userId, templateId, points: 0 },
      });
      return { success: true, message: 'Template redeemed successfully', points: 0 };
    }

    // Check points
    if (user.points < pointsRequired) {
      throw new BadRequestException(`Insufficient points. Need ${pointsRequired}, you have ${user.points}`);
    }

    // Deduct points and create purchase
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { points: { decrement: pointsRequired } },
      }),
      this.prisma.templatePurchase.create({
        data: { userId, templateId, points: pointsRequired },
      }),
    ]);

    return { success: true, message: 'Template redeemed successfully', points: pointsRequired };
  }

  // Check if user has purchased/redeemed template
  async hasPurchased(templateId: string, userId: string) {
    const purchase = await this.prisma.templatePurchase.findFirst({
      where: { userId, templateId },
    });
    return !!purchase;
  }

  // Get user's points
  async getUserPoints(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return { points: user.points };
  }

  // Add points to user (admin function)
  async addPoints(userId: string, points: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });
  }

  // Get user's purchased templates
  async getUserPurchases(userId: string) {
    return this.prisma.templatePurchase.findMany({
      where: { userId },
      include: { template: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
