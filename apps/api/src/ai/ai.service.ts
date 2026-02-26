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
    const apiKey = await this.settingsService.get('ai.apiKey');
    const model = await this.settingsService.get('ai.model') || 'minimax';
    return { 
      model, 
      hasKey: !!apiKey,
      // Don't expose the actual key
    };
  }

  async updateAISettings(data: { model?: string; apiKey?: string }) {
    if (data.model) {
      await this.settingsService.set('ai.model', data.model);
    }
    if (data.apiKey) {
      await this.settingsService.set('ai.apiKey', data.apiKey);
    }
    return { success: true };
  }

  /**
   * 生成文案
   */
  async generateText(prompt: string, type: 'title' | 'content' | 'description' = 'content') {
    const apiKey = await this.settingsService.get('ai.apiKey');
    const model = await this.settingsService.get('ai.model') || 'minimax';
    
    if (!apiKey) {
      // Return demo content when no API key
      return this.getDemoContent(type);
    }

    try {
      // Call AI API (example with OpenAI-compatible API)
      const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: '你是一个专业的会议出版助手，帮助用户生成高质量的文案。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        return {
          results: [{ id: 1, content: data.choices[0].message.content }],
          pointsSpent: 10,
          remainingPoints: 990,
        };
      }
      
      return this.getDemoContent(type);
    } catch (error) {
      console.error('AI API Error:', error);
      return this.getDemoContent(type);
    }
  }

  /**
   * 生成图片 (调用 AI 绘图 API)
   */
  async generateImage(prompt: string, style: 'realistic' | 'illustration' | 'simple' = 'illustration') {
    const apiKey = await this.settingsService.get('ai.apiKey');
    
    if (!apiKey) {
      // Return demo image
      return {
        results: [{
          id: 1,
          url: 'https://via.placeholder.com/400x300/5B6BE6/FFFFFF?text=AI+Generated+Image',
          thumbnail: 'https://via.placeholder.com/200x150/5B6BE6/FFFFFF?text=AI+Image',
        }],
        pointsSpent: 50,
        remainingPoints: 950,
      };
    }

    try {
      // Call AI image generation API (example)
      // This would typically call Stable Diffusion, Midjourney, or similar
      return {
        results: [{
          id: 1,
          url: 'https://via.placeholder.com/400x300/5B6BE6/FFFFFF?text=AI+Generated',
          thumbnail: 'https://via.placeholder.com/200x150/5B6BE6/FFFFFF?text=AI',
        }],
        pointsSpent: 50,
        remainingPoints: 950,
      };
    } catch (error) {
      console.error('AI Image Error:', error);
      return this.getDemoImage();
    }
  }

  /**
   * 获取演示内容
   */
  private getDemoContent(type: string) {
    const demos: Record<string, string[]> = {
      title: [
        '2026国际会议圆满落幕',
        '创新技术驱动未来发展',
        '行业领袖齐聚一堂',
      ],
      content: [
        '本次大会汇聚了来自全球的行业专家，就最新技术发展趋势进行了深入探讨。与会者普遍认为，人工智能将成为推动行业创新的核心动力。',
        '会议期间，多家企业展示了最新产品和技术解决方案，现场气氛热烈。与会者表示收获颇丰，期待明年再会。',
      ],
      description: [
        '本会议涵盖技术创新、产业发展、政策解读等热点话题，邀请国内外知名专家进行主题演讲。',
      ],
    };
    
    const items = demos[type] || demos.content;
    return {
      results: items.map((content, i) => ({ id: i + 1, content })),
      pointsSpent: 0,
      remainingPoints: 1000,
    };
  }

  private getDemoImage() {
    return {
      results: [{
        id: 1,
        url: 'https://via.placeholder.com/400x300/5B6BE6/FFFFFF?text=AI+Image',
        thumbnail: 'https://via.placeholder.com/200x150/5B6BE6/FFFFFF?text=AI',
      }],
      pointsSpent: 0,
      remainingPoints: 1000,
    };
  }
}
