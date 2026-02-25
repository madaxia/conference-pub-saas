import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { documentId: string; reviewerId: string }) {
    return this.prisma.review.create({
      data: {
        documentId: data.documentId,
        reviewerId: data.reviewerId,
        status: 'pending',
      },
    });
  }

  async findByDocument(documentId: string) {
    return this.prisma.review.findMany({
      where: { documentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string, decision?: string) {
    return this.prisma.review.update({
      where: { id },
      data: { status, decision },
    });
  }

  async addComment(data: { reviewId: string; userId: string; content: string }) {
    return this.prisma.reviewComment.create({
      data: {
        reviewId: data.reviewId,
        userId: data.userId,
        content: data.content,
      },
    });
  }
}
