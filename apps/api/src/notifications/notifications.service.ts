import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return [];
  }

  async create(data: any) {
    return { success: true };
  }

  async markAsRead(id: string) {
    return { success: true };
  }
}
