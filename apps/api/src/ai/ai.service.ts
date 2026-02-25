import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class AIService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
  ) {}

  async getAISettings() {
    return { model: 'minimax', hasKey: false };
  }

  async updateAISettings(data: any) {
    return { success: true };
  }

  async generate(data: any) {
    // Return demo results
    return {
      results: [
        { id: 1, content: 'Demo content 1' },
        { id: 2, content: 'Demo content 2' },
        { id: 3, content: 'Demo content 3' },
      ],
      pointsSpent: 0,
      remainingPoints: 0,
    };
  }
}
