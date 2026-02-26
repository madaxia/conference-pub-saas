import { Controller, Get, Post, Body } from '@nestjs/common';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  // 公开端点 - 无需认证
  @Get('settings')
  async getSettings() {
    return this.aiService.getAISettings();
  }

  // 公开端点 - 无需认证
  @Post('settings')
  async updateSettings(@Body() data: { model?: string; apiKey?: string }) {
    return this.aiService.updateAISettings(data);
  }

  // 公开端点 - 无需认证
  @Post('generate-text')
  async generateText(
    @Body() data: { prompt: string; type?: 'title' | 'content' | 'description' }
  ) {
    return this.aiService.generateText(data.prompt, data.type || 'content');
  }

  // 公开端点 - 无需认证
  @Post('generate-image')
  async generateImage(
    @Body() data: { prompt: string; style?: 'realistic' | 'illustration' | 'simple' }
  ) {
    return this.aiService.generateImage(data.prompt, data.style || 'illustration');
  }
}
