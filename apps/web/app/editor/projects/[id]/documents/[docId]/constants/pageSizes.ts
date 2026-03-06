// 页面尺寸配置

export interface PageSizeConfig {
  width: number;
  height: number;
}

export const pageSizes: Record<string, PageSizeConfig> = {
  'A4': { width: 595, height: 842 },
  'A5': { width: 420, height: 595 },
  'Letter': { width: 612, height: 792 },
  '自定义': { width: 600, height: 800 },
};

export const DEFAULT_PAGE_SIZE = 'A4';
