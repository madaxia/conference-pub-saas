import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AIService } from './ai.service';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AIController {
  constructor(private ai: AIService) {}

  @Get('settings')
  getSettings() {
    return this.ai.getAISettings();
  }

  @Post('settings')
  updateSettings(@Body() data: any) {
    return this.ai.updateAISettings(data);
  }

  @Post('generate')
  generate(@Body() data: any) {
    return this.ai.generate(data);
  }
}
