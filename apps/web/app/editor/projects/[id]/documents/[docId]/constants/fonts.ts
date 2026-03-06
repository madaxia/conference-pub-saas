// 可用字体列表
// 中文字体映射表 - 本地系统字体

export interface FontOption {
  value: string;
  label: string;
}

export const fonts: FontOption[] = [
  { value: 'SimHei', label: '黑体' },
  { value: 'SimSun', label: '宋体' },
  { value: 'Microsoft YaHei', label: '微软雅黑' },
  { value: 'KaiTi', label: '楷体' },
  { value: 'FangSong', label: '仿宋' },
  { value: 'YouYuan', label: '幼圆' },
  { value: 'STSong', label: '华文宋体' },
  { value: 'STKaiti', label: '华文楷体' },
  { value: 'STHeiti', label: '华文黑体' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
];
