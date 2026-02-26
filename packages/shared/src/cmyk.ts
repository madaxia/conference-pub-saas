/**
 * CMYK 转换工具
 * 
 * 用于将 RGB 颜色转换为 CMYK 色彩模式
 * 适用于印刷厂直接打印
 */

export class CMYKConverter {
  /**
   * 将 RGB 转换为 CMYK
   * @param r 红色 (0-255)
   * @param g 绿色 (0-255)
   * @param b 蓝色 (0-255)
   * @returns { c, m, y, k } 值 (0-1)
   */
  static rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
    // 归一化到 0-1
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    // 计算 K (黑色)
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    
    // 防止除以零
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 1 };
    }

    // 计算 C, M, Y
    const c = (1 - rNorm - k) / (1 - k);
    const m = (1 - gNorm - k) / (1 - k);
    const y = (1 - bNorm - k) / (1 - k);

    return {
      c: Math.round(c * 100) / 100,
      m: Math.round(m * 100) / 100,
      y: Math.round(y * 100) / 100,
      k: Math.round(k * 100) / 100,
    };
  }

  /**
   * 将十六进制颜色转换为 CMYK
   * @param hex 十六进制颜色 (如 #FF0000)
   * @returns { c, m, y, k } 值 (0-1)
   */
  static hexToCmyk(hex: string): { c: number; m: number; y: number; k: number } {
    // 移除 # 号
    hex = hex.replace('#', '');
    
    // 解析 RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return this.rgbToCmyk(r, g, b);
  }

  /**
   * RGB 转 CMYK 字符串 (用于 PDF)
   * @param r 红色 (0-255)
   * @param g 绿色 (0-255)
   * @param b 蓝色 (0-255)
   * @returns CMYK 颜色字符串
   */
  static rgbToCmykString(r: number, g: number, b: number): string {
    const { c, m, y, k } = this.rgbToCmyk(r, g, b);
    return `cmyk(${c}, ${m}, ${y}, ${k})`;
  }
}

/**
 * 色彩配置文件
 * 用于定义不同印刷标准的色彩配置
 */
export const ColorProfiles = {
  // 标准印刷 (Coated)
  standard: {
    name: '标准印刷',
    description: '适用于铜版纸、胶版纸印刷',
    blackGeneration: 0.35,
  },
  
  // 新闻印刷
  newsprint: {
    name: '新闻印刷',
    description: '适用于报纸、杂志印刷',
    blackGeneration: 0.25,
  },
  
  // 数字印刷
  digital: {
    name: '数字印刷',
    description: '适用于数码印刷机',
    blackGeneration: 0.30,
  },
};

/**
 * 导出选项
 */
export interface ExportOptions {
  // 页面尺寸
  pageSize: 'A4' | 'A5' | 'Letter' | 'Custom';
  width?: number;
  height?: number;
  
  // 色彩模式
  colorMode: 'RGB' | 'CMYK';
  
  // 分辨率 (DPI)
  dpi: 150 | 300 | 600;
  
  // 边距
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // 色彩配置
  colorProfile: keyof typeof ColorProfiles;
}

export const defaultExportOptions: ExportOptions = {
  pageSize: 'A4',
  colorMode: 'CMYK',
  dpi: 300,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  colorProfile: 'standard',
};
