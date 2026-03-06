// 编辑器常量配置

// Canvas 配置
export const CANVAS_CONFIG = {
  WIDTH: 5000,
  HEIGHT: 5000,
  DEFAULT_BACKGROUND_COLOR: '#F5F7FB',
};

// 虚拟画布中心偏移（用于在大画布上居中）
export const CANVAS_CENTER_OFFSET = 2000;

// 画布默认尺寸（容器）
export const CANVAS_DEFAULT_SIZE = {
  WIDTH: 800,
  HEIGHT: 600,
};

// Artboard 默认位置偏移
export const ARTBOARD_OFFSET = {
  TITLE: 60,
  SUBTITLE: 100,
};

// 网格配置
export const GRID_CONFIG = {
  DEFAULT_SIZE: 10,
  DEFAULT_DENSITY: 20,
  DEFAULT_COLOR: '#CBD5E1',
  OPACITY: 0.5,
};

// 默认元素尺寸
export const ELEMENT_SIZES = {
  TEXT_WIDTH: 200,
  TEXT_HEIGHT: 100,
  RECT_SIZE: 100,
  CIRCLE_RADIUS: 50,
  IMAGE_MAX_SIZE: 300,
};

// 缩放配置
export const ZOOM_CONFIG = {
  DEFAULT: 100,
  MIN: 25,
  MAX: 200,
  STEP: 10,
};

// AI 配置
export const AI_CONFIG = {
  DEFAULT_COUNT: 3,
  TEXT_AREA_WIDTH: 400,
  TEXT_AREA_HEIGHT: 60,
  IMAGE_AREA_WIDTH: 300,
  IMAGE_AREA_HEIGHT: 200,
};

// 样式配置
export const STYLE_CONFIG = {
  STROKE_DASH_ARRAY: [8, 4],
  CORNER_STYLE: 'circle' as const,
  CORNER_SIZE: 10,
  CORNER_COLOR: '#5B6BE6',
  BORDER_COLOR: '#5B6BE6',
};

// 边框样式
export const STROKE_CONFIG = {
  DEFAULT_WIDTH: 2,
  RECT_RADIUS: 8,
};
