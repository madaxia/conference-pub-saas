import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KnowledgeBaseService {
  constructor(private prisma: PrismaService) {}

  // Upload item to knowledge base
  async uploadItem(data: {
    title: string;
    description?: string;
    type: 'document' | 'image' | 'text';
    fileUrl?: string;
    content?: string;
    tags: string[];
    uploadedBy: string;
    fileSize?: number;
    mimeType?: string;
  }) {
    const item = await this.prisma.knowledgeBaseItem.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        fileUrl: data.fileUrl,
        content: data.content,
        tags: data.tags,
        status: 'pending',
        uploadedBy: data.uploadedBy,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      },
    });

    // Trigger vectorization (async)
    this.vectorizeItem(item.id).catch(console.error);

    return item;
  }

  // Get all items
  async getItems(filters?: {
    type?: string;
    status?: string;
    tag?: string;
    search?: string;
  }) {
    const where: any = {};
    
    if (filters?.type) where.type = filters.type;
    if (filters?.status) where.status = filters.status;
    if (filters?.tag) where.tags = { has: filters.tag };
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    return this.prisma.knowledgeBaseItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get single item
  async getItem(id: string) {
    const item = await this.prisma.knowledgeBaseItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('知识库条目不存在');
    return item;
  }

  // Update item
  async updateItem(id: string, data: {
    title?: string;
    description?: string;
    tags?: string[];
  }) {
    return this.prisma.knowledgeBaseItem.update({
      where: { id },
      data,
    });
  }

  // Delete item
  async deleteItem(id: string) {
    return this.prisma.knowledgeBaseItem.delete({ where: { id } });
  }

  // Get all unique tags
  async getAllTags() {
    const items = await this.prisma.knowledgeBaseItem.findMany({
      select: { tags: true },
    });
    
    const tagSet = new Set<string>();
    items.forEach(item => {
      item.tags?.forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet).sort();
  }

  // Search knowledge base (for AI)
  async searchKnowledgeBase(query: string, limit: number = 5) {
    // Simple keyword search (in production, use vector search)
    const items = await this.prisma.knowledgeBaseItem.findMany({
      where: {
        status: 'vectorized',
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { content: { contains: query } },
          { tags: { hasSome: query.split(' ') } },
        ],
      },
      take: limit,
    });

    return items;
  }

  // Vectorize item (placeholder for RAG integration)
  private async vectorizeItem(id: string) {
    try {
      // Update status to vectorizing
      await this.prisma.knowledgeBaseItem.update({
        where: { id },
        data: { status: 'vectorizing' },
      });

      // TODO: Integrate with actual RAG/embedding service
      // e.g., OpenAI Embeddings, MiniMax Embeddings, etc.
      
      // Simulate processing delay
      await new Promise(r => setTimeout(r, 1000));

      // Mark as vectorized
      await this.prisma.knowledgeBaseItem.update({
        where: { id },
        data: { status: 'vectorized' },
      });
    } catch (error) {
      await this.prisma.knowledgeBaseItem.update({
        where: { id },
        data: { 
          status: 'error',
          errorMsg: error.message 
        },
      });
    }
  }

  // Re-vectorize item
  async reVectorize(id: string) {
    await this.vectorizeItem(id);
    return this.getItem(id);
  }

  // Get knowledge base stats
  async getStats() {
    const [total, byType, byStatus, byTags] = await Promise.all([
      this.prisma.knowledgeBaseItem.count(),
      this.prisma.knowledgeBaseItem.groupBy({
        by: ['type'],
        _count: true,
      }),
      this.prisma.knowledgeBaseItem.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.getAllTags(),
    ]);

    return {
      total,
      byType: byType.reduce((acc: any, t: any) => ({ ...acc, [t.type]: t._count }), {}),
      byStatus: byStatus.reduce((acc: any, t: any) => ({ ...acc, [t.status]: t._count }), {}),
      tagCount: byTags.length,
    };
  }
}
