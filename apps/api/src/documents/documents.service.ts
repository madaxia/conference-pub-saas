import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { projectId: string; title: string; content?: any; templateId?: string }, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project) throw new NotFoundException('Project not found');
    
    let content: any = data.content || { sections: [], pages: [] };
    
    // If templateId is provided, get template config and use it
    if (data.templateId) {
      const template = await this.prisma.template.findUnique({ where: { id: data.templateId } });
      if (template && template.config) {
        const templateConfig = template.config as any;
        content = {
          ...templateConfig,
          templateId: data.templateId,
          templateName: template.name,
        };
      }
    }
    
    // Ensure pages array exists
    if (!content.pages) {
      content.pages = [{ pageNumber: 1, elements: [] }];
    }
    
    return this.prisma.document.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        content,
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

  async update(id: string, data: { title?: string; content?: any; status?: string; pages?: any[] }, userId: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.content) {
      // Merge pages if provided
      if (data.pages && Array.isArray(data.pages)) {
        const docContent = doc.content as any || {};
        updateData.content = {
          ...docContent,
          pages: data.pages,
        };
      } else {
        updateData.content = data.content;
      }
    }
    if (data.status) updateData.status = data.status;

    return this.prisma.document.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });// 继续修复剩余的编译错误，并测试API端点。

if (!doc) throw new NotFoundException('Document not found');
    
    return this.prisma.document.delete({ where: { id } });
  }
}
