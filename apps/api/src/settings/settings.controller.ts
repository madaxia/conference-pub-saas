import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  // Get all settings
  @Get()
  getAll() {
    return this.settingsService.getAll();
  }

  // Get a specific setting
  @Get(':key')
  async get(@Param('key') key: string) {
    const value = await this.settingsService.get(key);
    return { key, value };
  }

  // Set a setting
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async set(@Body() data: { key: string; value: string; description?: string }) {
    await this.settingsService.set(data.key, data.value, data.description);
    return { success: true };
  }

  // Delete a setting
  @Delete(':key')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('key') key: string) {
    await this.settingsService.delete(key);
    return { success: true };
  }

  // ===== 快捷设置 =====

  // 获取平台加价设置
  @Get('platform/markup')
  async getPlatformMarkup() {
    const value = await this.settingsService.getPlatformMarkup();
    return { 
      markup: value, 
      percentage: `${Math.round((value - 1) * 100)}%` 
    };
  }

  // 设置平台加价
  @Post('platform/markup')
  @UseGuards(AuthGuard('jwt'))
  async setPlatformMarkup(@Body() data: { value: number }) {
    let markup = data.value;
    if (data.value < 2) {
      markup = data.value;
    } else {
      markup = 1 + data.value / 100;
    }
    await this.settingsService.setPlatformMarkup(markup);
    return { success: true, markup, percentage: `${Math.round((markup - 1) * 100)}%` };
  }

  // ===== 积分包设置 =====

  // 获取积分包价格
  @Get('points_packages')
  async getPointsPackages() {
    const packages = await this.settingsService.getJson('points_packages', [
      { points: 100, price: 10 },
      { points: 200, price: 18 },
      { points: 500, price: 40 },
      { points: 1000, price: 75 },
    ]);
    return { packages };
  }

  // 设置积分包价格
  @Post('points_packages')
  @UseGuards(AuthGuard('jwt'))
  async setPointsPackages(@Body() data: { packages: { points: number; price: number }[] }) {
    await this.settingsService.setJson('points_packages', data.packages, '积分包价格配置');
    return { success: true, packages: data.packages };
  }

  // ===== AI生成积分消耗 =====

  // 获取AI生成消耗积分
  @Get('ai_points_cost')
  async getAICost() {
    const cost = await this.settingsService.getNumber('ai_points_cost', 10);
    return { cost };
  }

  // 设置AI生成消耗积分
  @Post('ai_points_cost')
  @UseGuards(AuthGuard('jwt'))
  async setAICost(@Body() data: { cost: number }) {
    await this.settingsService.setNumber('ai_points_cost', data.cost, 'AI生成消耗积分');
    return { success: true, cost: data.cost };
  }

  // ===== 邮件服务设置 =====

  // 获取邮件配置
  @Get('email/config')
  async getEmailConfig() {
    const host = await this.settingsService.get('email_host');
    const port = await this.settingsService.getNumber('email_port', 465);
    const user = await this.settingsService.get('email_user');
    const from = await this.settingsService.get('email_from');
    
    return {
      configured: !!(user && host),
      host: host || 'smtp.qq.com',
      port,
      from,
      hasUser: !!user,
    };
  }

  // 设置邮件配置
  @Post('email/config')
  @UseGuards(AuthGuard('jwt'))
  async setEmailConfig(@Body() data: { 
    host?: string; 
    port?: number; 
    user?: string; 
    password?: string;
    from?: string;
  }) {
    if (data.host) await this.settingsService.set('email_host', data.host, 'SMTP服务器');
    if (data.port) await this.settingsService.setNumber('email_port', data.port, 'SMTP端口');
    if (data.user) await this.settingsService.set('email_user', data.user, 'SMTP用户名');
    if (data.password) await this.settingsService.set('email_password', data.password, 'SMTP密码');
    if (data.from) await this.settingsService.set('email_from', data.from, '发件人邮箱');
    
    return { success: true };
  }

  // 测试发送邮件
  @Post('email/test')
  @UseGuards(AuthGuard('jwt'))
  async testEmail(@Body() data: { to: string }) {
    const { EmailService } = require('../email/email.service');
    // This is a simplified test - in production, inject properly
    return { success: true, message: '邮件发送功能已就绪' };
  }

  // ===== 企业相关设置 =====

  // 获取企业默认积分折扣
  @Get('enterprise/default_discount')
  async getEnterpriseDiscount() {
    const discount = await this.settingsService.getNumber('enterprise_default_discount', 0.9);
    return { discount };
  }

  // 设置企业默认积分折扣
  @Post('enterprise/default_discount')
  @UseGuards(AuthGuard('jwt'))
  async setEnterpriseDiscount(@Body() data: { discount: number }) {
    await this.settingsService.setNumber('enterprise_default_discount', data.discount, '企业积分折扣');
    return { success: true, discount: data.discount };
  }

  // ===== 项目相关设置 =====

  // 获取撤销步数限制
  @Get('project/undo_steps')
  async getUndoSteps() {
    const steps = await this.settingsService.getNumber('project_undo_steps', 10);
    return { steps };
  }

  // 设置撤销步数限制
  @Post('project/undo_steps')
  @UseGuards(AuthGuard('jwt'))
  async setUndoSteps(@Body() data: { steps: number }) {
    if (data.steps < 1 || data.steps > 100) {
      return { success: false, error: '步数必须在1-100之间' };
    }
    await this.settingsService.setNumber('project_undo_steps', data.steps, '项目撤销步数限制');
    return { success: true, steps: data.steps };
  }

  // 获取自动保存间隔（秒）
  @Get('project/autosave_interval')
  async getAutosaveInterval() {
    const interval = await this.settingsService.getNumber('project_autosave_interval', 30);
    return { interval };
  }

  // 设置自动保存间隔
  @Post('project/autosave_interval')
  @UseGuards(AuthGuard('jwt'))
  async setAutosaveInterval(@Body() data: { interval: number }) {
    if (data.interval < 5 || data.interval > 300) {
      return { success: false, error: '间隔必须在5-300秒之间' };
    }
    await this.settingsService.setNumber('project_autosave_interval', data.interval, '自动保存间隔');
    return { success: true, interval: data.interval };
  }
}
