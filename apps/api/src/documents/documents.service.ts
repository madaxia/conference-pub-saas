import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { projectId: string; title: string; content?: any }, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project) throw new NotFoundException('Project not found');
    
    return this.prisma.document.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        content: data.content || { sections: [] },
        status: 'draft',
      },
    });
  }

  async findByProject(projectId: string, tenantId: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, tenantId } });
    if (!project) throw new NotFoundException('Project not found');
    
    return this.prisma.document.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string, tenantId: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async update(id: string, data: { title?: string; content?: any; status?: string }, userId: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.content) updateData.content = data.content;
    if (data.status) updateData.status = data.status;

    return this.prisma.document.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    
    return this.prisma.document.delete({ where: { id } });
  }
}
