import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, userId: string) {
    return this.prisma.project.findMany({
      where: { tenantId },
      include: { owner: { select: { id: true, name: true, email: true } }, Document: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string, tenantId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, tenantId },
      include: { owner: { select: { id: true, name: true, email: true } }, Document: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(data: { tenantId: string; name: string; conferenceName: string; issueDate: string; projectType?: string }, userId: string) {
    return this.prisma.project.create({
      data: {
        tenantId: data.tenantId,
        ownerId: userId,
        name: data.name,
        conferenceName: data.conferenceName,
        issueDate: new Date(data.issueDate),
        status: 'draft',
        projectType: data.projectType || 'personal',
      },
      include: { owner: { select: { id: true, name: true, email: true } }, Document: true },
    });
  }

  async update(id: string, data: { name?: string; conferenceName?: string; issueDate?: string; status?: string }, userId: string, tenantId: string) {
    const project = await this.prisma.project.findFirst({ where: { id, tenantId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.ownerId !== userId) throw new ForbiddenException('No permission');

    return this.prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        conferenceName: data.conferenceName,
        issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
        status: data.status as any,
      },
    });
  }

  async delete(id: string, userId: string, tenantId: string) {
    const project = await this.prisma.project.findFirst({ where: { id, tenantId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.ownerId !== userId) throw new ForbiddenException('No permission');

    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }
}
