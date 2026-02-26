import { Controller, Get, Post, Body } from '@nestjs/common';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Get('settings')
  async getSettings() {
    return this.aiService.getAISettings();
  }

  @Post('settings')
  async updateSettings(@Body() data: { model?: string; apiKey?: string }) {
    return this.aiService.updateAISettings(data);
  }

  @Post('generate-text')
  async generateText(
    @Body() data: { prompt: string; type?: 'title' | 'content' | 'description' }
  ) {
    return this.aiService.generateText(data.prompt, data.type || 'content');
  }

  @Post('generate-image')
  async generateImage(
    @Body() data: { prompt: string; style?: 'realistic' | 'illustration' | 'simple' }
  ) {
    return this.aiService.generateImage(data.prompt, data.style || 'illustration');
  }
}
