/**
 * 文档导出服务
 * 
 * 将 Fabric.js 画布转换为 CMYK PDF
 * 支持印刷厂直接打印
 */

import { Injectable } from '@nestjs/common';
import { CMYKConverter, defaultExportOptions } from '@conference-sb/shared';

@Injectable()
export class ExportService {
  /**
   * 将画布数据导出为 PDF
   * 
   * @param canvasData Fabric.js 画布 JSON 数据
   * @param options 导出选项
   */
  async exportToPdf(canvasData: any, options: Partial<typeof defaultExportOptions> = {}) {
    const exportOptions = { ...defaultExportOptions, ...options };
    
    // 这里返回前端需要的配置
    // 实际 PDF 生成可以在前端使用 jsPDF 库
    return {
      success: true,
      options: exportOptions,
      message: '导出配置已准备就绪',
    };
  }

  /**
   * 转换颜色为 CMYK
   */
  convertToCmyk(hexColor: string): { c: number; m: number; y: number; k: number } {
    return CMYKConverter.hexToCmyk(hexColor);
  }

  /**
   * 验证导出配置
   */
  validateExportOptions(options: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!options.pageSize) {
      errors.push('缺少页面尺寸');
    }
    
    if (!options.colorMode) {
      errors.push('缺少色彩模式');
    }
    
    if (!options.dpi || ![150, 300, 600].includes(options.dpi)) {
      errors.push('无效的 DPI 值');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
