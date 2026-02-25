import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnterpriseService {
  constructor(private prisma: PrismaService) {}

  async getMyEnterprise(userId: string) {
    return null;
  }

  async getAll() {
    return [];
  }
}
