/**
 * 编辑器工具函数
 * 注意：这些函数的完整实现需要 fabric 实例
 * 当前作为占位符，后续可以完善
 */

// 网格配置
export const GRID_DEFAULTS = {
  SIZE: 10,
  COLOR: '#E5E7EB',
  OPACITY: 0.5,
};

// Artboard 配置
export const ARTBOARD_DEFAULTS = {
  STROKE_COLOR: '#CBD5E1',
  STROKE_WIDTH: 2,
  STROKE_DASH: [8, 4],
  TITLE_OFFSET_Y: 60,
  SUBTITLE_OFFSET_Y: 100,
  TITLE_FONT_SIZE: 32,
  SUBTITLE_FONT_SIZE: 18,
  TITLE_COLOR: '#333333',
  SUBTITLE_COLOR: '#666666',
};

/**
 * 计算居中的 artboard 位置
 */
export function calculateArtboardPosition(
  canvasWidth: number,
  canvasHeight: number,
  artboardWidth: number,
  artboardHeight: number
): { x: number; y: number } {
  return {
    x: canvasWidth / 2 - artboardWidth / 2,
    y: canvasHeight / 2 - artboardHeight / 2,
  };
}

/**
 * 计算元素缩放比例以适应目标区域
 */
export function calculateFitScale(
  targetWidth: number,
  targetHeight: number,
  elementWidth: number,
  elementHeight: number
): number {
  if (!elementWidth || !elementHeight) return 1;
  return Math.min(targetWidth / elementWidth, targetHeight / elementHeight, 1);
}
