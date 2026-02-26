import { Injectable } from '@nestjs/common';

@Injectable()
export class ExportService {
  async exportToPdf(canvasData: any, options: any = {}) {
    return {
      success: true,
      options,
      message: '导出配置已准备就绪',
    };
  }

  validateExportOptions(options: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!options.pageSize) errors.push('缺少页面尺寸');
    if (!options.colorMode) errors.push('缺少色彩模式');
    return { valid: errors.length === 0, errors };
  }
}
