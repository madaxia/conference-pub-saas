// Free copyright-safe fonts for the platform
// Includes open source and Google Fonts

export const fonts = {
  // English/Sans-serif fonts
  sans: [
    {
      name: 'Inter',
      family: "'Inter', sans-serif",
      source: 'Google Fonts (OFL)',
      category: 'sans-serif',
      styles: ['normal', 'italic'],
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    {
      name: 'Roboto',
      family: "'Roboto', sans-serif",
      source: 'Google Fonts (Apache 2.0)',
      category: 'sans-serif',
      styles: ['normal', 'italic'],
      weights: [100, 300, 400, 500, 700, 900],
    },
    {
      name: 'Open Sans',
      family: "'Open Sans', sans-serif",
      source: 'Google Fonts (OFL)',
      category: 'sans-serif',
      styles: ['normal', 'italic'],
      weights: [300, 400, 500, 600, 700, 800],
    },
    {
      name: 'Lato',
      family: "'Lato', sans-serif",
      source: 'Google Fonts (OFL)',
      category: 'sans-serif',
      styles: ['normal', 'italic'],
      weights: [100, 300, 400, 700, 900],
    },
    {
      name: 'Poppins',
      family: "'Poppins', sans-serif",
      source: 'Google Fonts (OFL)',
      category: 'sans-serif',
      styles: ['normal', 'italic'],
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    {
      name: 'Montserrat',
      family: "'Montserrat', sans-serif",
      source: 'Google Fonts (OFL)',
      category: 'sans-serif',
      styles: ['normal', 'italic'],
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    {
      name: 'Source Sans Pro',
      family: "'Source Sans Pro', sans-serif",
      source: 'Google Fonts (OFL)',
      category: 'sans-serif',
      styles: ['normal', 'italic'],
      weights: [200, 300, 400, 600, 700, 900],
    },
    {
      name: 'Nunito',
      family: "'Nunito', sans-serif",
      source: 'Google Fonts (OFL)',
      category: 'sans-serif',
      styles: ['normal', 'italic'],
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
    },
  ],
  
  // Serif fonts
  serif: [
    {
      name: 'Merriweather',
      family: "'Merriweather', serif",
      source: 'Google Fonts (OFL)',
      category: 'serif',
      styles: ['normal', 'italic'],
      weights: [300, 400, 700, 900],
    },
    {
      name: 'Playfair Display',
      family: "'Playfair Display', serif",
      source: 'Google Fonts (OFL)',
      category: 'serif',
      styles: ['normal', 'italic'],
      weights: [400, 500, 600, 700, 800, 900],
    },
    {
      name: 'Lora',
      family: "'Lora', serif",
      source: 'Google Fonts (OFL)',
      category: 'serif',
      styles: ['normal', 'italic'],
      weights: [400, 500, 600, 700],
    },
    {
      name: 'PT Serif',
      family: "'PT Serif', serif",
      source: 'Google Fonts (OFL)',
      category: 'serif',
      styles: ['normal', 'italic'],
      weights: [400, 700],
    },
    {
      name: 'Noto Serif',
      family: "'Noto Serif', serif",
      source: 'Google Fonts (OFL)',
      category: 'serif',
      styles: ['normal', 'italic'],
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  ],
  
  // Chinese fonts (all from Google Fonts or open source)
  chinese: [
    // 思源字体系列
    {
      name: '思源黑体 Regular',
      family: "'Noto Sans SC', 'Source Han Sans CN', sans-serif",
      source: 'Google Fonts + Adobe (OFL)',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    {
      name: '思源黑体 Medium',
      family: "'Noto Sans SC', 'Source Han Sans CN', sans-serif",
      source: 'Google Fonts + Adobe (OFL)',
      category: 'chinese',
      styles: ['normal'],
      weights: [500],
    },
    {
      name: '思源黑体 Bold',
      family: "'Noto Sans SC', 'Source Han Sans CN', sans-serif",
      source: 'Google Fonts + Adobe (OFL)',
      category: 'chinese',
      styles: ['normal'],
      weights: [700],
    },
    // 思源宋体
    {
      name: '思源宋体',
      family: "'Noto Serif SC', 'Source Han Serif CN', serif",
      source: 'Google Fonts + Adobe (OFL)',
      category: 'chinese',
      styles: ['normal'],
      weights: [400, 700],
    },
    // 站酷字体系列
    {
      name: '站酷高端黑',
      family: "'ZCOOL QingKe HuangYou', 'ZCOOL QingKe', sans-serif",
      source: '站酷 (ZCOOL) - 免费商用',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    {
      name: '站酷小薇体',
      family: "'ZCOOL XiaoWei', serif",
      source: '站酷 (ZCOOL) - 免费商用',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    {
      name: '站酷快乐体',
      family: "'ZCOOL KuaiLe', cursive",
      source: '站酷 (ZCOOL) - 免费商用',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    {
      name: '站酷庆科黄黑体',
      family: "'ZCOOL QingKe HuangHe', sans-serif",
      source: '站酷 (ZCOOL) - 免费商用',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    // 毛笔/书法字体
    {
      name: '马善政毛笔',
      family: "'Ma Shan Zheng', cursive",
      source: 'Google Fonts (OFL)',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    {
      name: '刘艳玲毛笔',
      family: "'Liu Yan Ling Maobi', cursive",
      source: '免费商用 - Calligraphy',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    // 简体繁体
    {
      name: '思源黑体 简体',
      family: "'Noto Sans SC', sans-serif",
      source: 'Google Fonts (OFL)',
      category: 'chinese',
      styles: ['normal'],
      weights: [100, 300, 400, 500, 700, 900],
    },
    {
      name: '思源黑体 繁体',
      family: "'Noto Sans TC', 'Noto Sans HK', sans-serif",
      source: 'Google Fonts (OFL)',
      category: 'chinese',
      styles: ['normal'],
      weights: [100, 300, 400, 500, 700, 900],
    },
    {
      name: '思源宋体 简体',
      family: "'Noto Serif SC', serif",
      source: 'Google Fonts (OFL)',
      category: 'chinese',
      styles: ['normal'],
      weights: [200, 300, 400, 500, 600, 700, 900],
    },
    {
      name: '思源宋体 繁体',
      family: "'Noto Serif TC', 'Noto Serif HK', serif",
      source: 'Google Fonts (OFL)',
      category: 'chinese',
      styles: ['normal'],
      weights: [200, 300, 400, 500, 600, 700, 900],
    },
    // 阿里字体系列
    {
      name: '阿里巴巴普惠体',
      family: "'Alibaba PuHuiTi', 'Alibaba Sans', sans-serif",
      source: '阿里巴巴 - 免费商用',
      category: 'chinese',
      styles: ['normal'],
      weights: [300, 400, 500, 700],
    },
    {
      name: '阿里巴巴普惠体 精简',
      family: "'Alibaba PuHuiTi Light', sans-serif",
      source: '阿里巴巴 - 免费商用',
      category: 'chinese',
      styles: ['normal'],
      weights: [300],
    },
    {
      name: '阿里巴巴智慧体',
      family: "'Alibaba Smart Sans', sans-serif",
      source: '阿里巴巴 - 免费商用',
      category: 'chinese',
      styles: ['normal'],
      weights: [400, 700],
    },
    // 方正字体 (部分免费)
    {
      name: '方正书宋',
      family: "'FangZheng ShuSong', serif",
      source: '方正字库 - 免费商用 (需申请)',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    {
      name: '方正楷体',
      family: "'FangZheng KaiTi', cursive",
      source: '方正字库 - 免费商用 (需申请)',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    // 其他免费商用字体
    {
      name: 'OPPO Sans',
      family: "'OPPO Sans', sans-serif",
      source: 'OPPO - 免费商用',
      category: 'chinese',
      styles: ['normal'],
      weights: [300, 400, 500, 700],
    },
    {
      name: '小米兰亭',
      family: "'MiLanTing', sans-serif",
      source: '小米 - 免费商用',
      category: 'chinese',
      styles: ['normal'],
      weights: [300, 400, 500, 700],
    },
    {
      name: '霞鹜文楷',
      family: "'XiaWu Wen Kai', 'KaiTi', cursive",
      source: '开源 (OFL) - 霞鹜文楷',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    {
      name: '更纱黑体',
      family: "'Sarasa Gothic', 'Noto Sans SC', sans-serif",
      source: '开源 (OFL) - 更纱黑体',
      category: 'chinese',
      styles: ['normal'],
      weights: [400, 700],
    },
    {
      name: '未来熵火',
      family: "'WeiLai ShangHuo', sans-serif",
      source: '免费商用 - 未来熵火',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    {
      name: '庞门正道标题体',
      family: "'PangMen ZhengDao Title', sans-serif",
      source: '免费商用 - 庞门正道',
      category: 'chinese',
      styles: ['normal'],
      weights: [400, 700],
    },
    {
      name: '庞门正道粗体',
      family: "'PangMen ZhengDao Bold', sans-serif",
      source: '免费商用 - 庞门正道',
      category: 'chinese',
      styles: ['normal'],
      weights: [700],
    },
    {
      name: '濑户字体',
      family: "'Seto Font', sans-serif",
      source: '免费商用 - 濑户mix',
      category: 'chinese',
      styles: ['normal'],
      weights: [400],
    },
    {
      name: 'Resource Han Rounded',
      family: "'Resource Han Rounded', sans-serif",
      source: 'Adobe - 免费商用',
      category: 'chinese',
      styles: ['normal'],
      weights: [400, 500, 600, 700],
    },
  ],
  
  // Monospace fonts
  mono: [
    {
      name: 'Roboto Mono',
      family: "'Roboto Mono', monospace",
      source: 'Google Fonts (OFL)',
      category: 'monospace',
      styles: ['normal', 'italic'],
      weights: [100, 200, 300, 400, 500, 600, 700],
    },
    {
      name: 'Fira Code',
      family: "'Fira Code', monospace",
      source: 'Google Fonts (OFL)',
      category: 'monospace',
      styles: ['normal'],
      weights: [300, 400, 500, 600, 700],
    },
    {
      name: 'Source Code Pro',
      family: "'Source Code Pro', monospace",
      source: 'Google Fonts (OFL)',
      category: 'monospace',
      styles: ['normal', 'italic'],
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
    },
  ],
  
  // Display/Creative fonts
  display: [
    {
      name: 'Bebas Neue',
      family: "'Bebas Neue', cursive",
      source: 'Google Fonts (OFL)',
      category: 'display',
      styles: ['normal'],
      weights: [400],
    },
    {
      name: 'Oswald',
      family: "'Oswald', sans-serif",
      source: 'Google Fonts (OFL)',
      category: 'display',
      styles: ['normal'],
      weights: [200, 300, 400, 500, 600, 700],
    },
    {
      name: 'Bitter',
      family: "'Bitter', serif",
      source: 'Google Fonts (OFL)',
      category: 'display',
      styles: ['normal', 'italic'],
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    {
      name: 'Comfortaa',
      family: "'Comfortaa', cursive",
      source: 'Google Fonts (OFL)',
      category: 'display',
      styles: ['normal'],
      weights: [300, 400, 500, 600, 700],
    },
  ],
};

// Flatten all fonts into one list
export const allFonts = [
  ...fonts.sans,
  ...fonts.serif,
  ...fonts.chinese,
  ...fonts.mono,
  ...fonts.display,
];

// Default text styles
export const defaultTextStyle = {
  fontFamily: "'Noto Sans SC', 'Inter', sans-serif",
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.6,
  letterSpacing: 0,
  color: '#000000',
  textAlign: 'left',
  textDecoration: 'none',
  textTransform: 'none',
};

// Available font sizes
export const fontSizes = [
  { label: '12px (小)', value: 12 },
  { label: '14px (正文小)', value: 14 },
  { label: '16px (正文)', value: 16 },
  { label: '18px (副标题)', value: 18 },
  { label: '20px (小标题)', value: 20 },
  { label: '24px (标题)', value: 24 },
  { label: '28px (大标题)', value: 28 },
  { label: '32px (_section_标题)', value: 32 },
  { label: '36px (页面标题)', value: 36 },
  { label: '48px (封面标题)', value: 48 },
  { label: '64px (特大)', value: 64 },
  { label: '72px (巨幅)', value: 72 },
];

// Available font weights
export const fontWeights = [
  { label: '100 - Thin', value: 100 },
  { label: '200 - Extra Light', value: 200 },
  { label: '300 - Light', value: 300 },
  { label: '400 - Regular', value: 400 },
  { label: '500 - Medium', value: 500 },
  { label: '600 - Semi Bold', value: 600 },
  { label: '700 - Bold', value: 700 },
  { label: '800 - Extra Bold', value: 800 },
  { label: '900 - Black', value: 900 },
];

// Available line heights
export const lineHeights = [
  { label: '1.0 (紧凑)', value: 1.0 },
  { label: '1.2 (较密)', value: 1.2 },
  { label: '1.4 (标准)', value: 1.4 },
  { label: '1.5 (默认)', value: 1.5 },
  { label: '1.6 (舒适)', value: 1.6 },
  { label: '1.8 (宽松)', value: 1.8 },
  { label: '2.0 (段落)', value: 2.0 },
  { label: '2.5 (大间距)', value: 2.5 },
];

// Available letter spacings
export const letterSpacings = [
  { label: '-2px', value: -2 },
  { label: '-1px', value: -1 },
  { label: '-0.5px', value: -0.5 },
  { label: '0 (默认)', value: 0 },
  { label: '0.5px', value: 0.5 },
  { label: '1px', value: 1 },
  { label: '2px', value: 2 },
  { label: '3px', value: 3 },
  { label: '4px', value: 4 },
];

// Text alignment options
export const textAligns = [
  { label: '左对齐', value: 'left', icon: '↰' },
  { label: '居中', value: 'center', icon: '↔' },
  { label: '右对齐', value: 'right', icon: '↲' },
  { label: '两端对齐', value: 'justify', icon: '↔↕' },
];

// Google Fonts URL for loading fonts
export const googleFontsUrl = allFonts
  .filter(f => f.source.includes('Google'))
  .map(f => f.name.replace(/ /g, '+') + ':wght@' + f.weights.join(';'))
  .join('&family=');

// Export CSS for fonts
export const fontsCSS = `
  @import url('https://fonts.googleapis.com/css2?family=${googleFontsUrl}&display=swap');
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
`;
