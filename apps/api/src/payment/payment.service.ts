import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async getPoints(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return { points: user?.points || 0 };
  }

  async getPackages() {
    return [{ points: 100, price: 10 }, { points: 200, price: 18 }, { points: 500, price: 40 }, { points: 1000, price: 75 }];
  }
}
