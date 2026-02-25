import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // Get a setting value
  async get(key: string): Promise<string | null> {
    const setting = await this.prisma.systemSetting.findUnique({ where: { key } });
    return setting?.value || null;
  }

  // Get parsed JSON setting
  async getJson<T>(key: string, defaultValue: T): Promise<T> {
    const value = await this.get(key);
    if (!value) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  }

  // Get number setting
  async getNumber(key: string, defaultValue: number = 0): Promise<number> {
    const value = await this.get(key);
    if (!value) return defaultValue;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  }

  // Set a setting value
  async set(key: string, value: string, description?: string): Promise<void> {
    await this.prisma.systemSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }

  // Set JSON setting
  async setJson(key: string, value: any, description?: string): Promise<void> {
    await this.set(key, JSON.stringify(value), description);
  }

  // Set number setting
  async setNumber(key: string, value: number, description?: string): Promise<void> {
    await this.set(key, value.toString(), description);
  }

  // Delete a setting
  async delete(key: string): Promise<void> {
    await this.prisma.systemSetting.delete({ where: { key } }).catch(() => {});
  }

  // Get all settings
  async getAll(): Promise<Record<string, string>> {
    const settings = await this.prisma.systemSetting.findMany();
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  }

  // ===== 常用设置快捷方法 =====

  // 获取平台加价百分比 (默认15%)
  async getPlatformMarkup(): Promise<number> {
    return this.getNumber('platform_markup', 1.15);
  }

  // 设置平台加价百分比
  async setPlatformMarkup(value: number): Promise<void> {
    // 存储为倍数 (如 1.15 表示加价15%)
    await this.setNumber('platform_markup', value, '印刷订单平台加价百分比');
  }
}
