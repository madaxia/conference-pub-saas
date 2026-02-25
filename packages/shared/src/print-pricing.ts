// Print pricing configuration

export const PRINT_CATEGORIES = {
  conference_program: {
    label: '会议日程',
    paperTypes: ['铜版纸', '哑粉纸', '双胶纸', '书写纸'],
    paperWeights: ['80g', '100g', '120g', '157g', '200g'],
    paperSizes: ['A4', 'A5', '16K', '8K'],
    printSides: ['单面', '双面'],
    printColors: ['黑白', '单色', '双彩', '全彩'],
    bindings: ['胶装', '骑马订', '线圈装', '索线胶装', '无装订'],
    finishes: ['覆哑膜', '覆光膜', '烫金', 'UV', '压纹'],
  },
  abstract_book: {
    label: '论文摘要集',
    paperTypes: ['铜版纸', '哑粉纸', '双胶纸'],
    paperWeights: ['80g', '100g', '128g', '157g'],
    paperSizes: ['A4', 'A5', '16K'],
    printSides: ['单面', '双面'],
    printColors: ['黑白', '单色', '全彩'],
    bindings: ['胶装', '骑马订', '索线胶装'],
    finishes: ['覆哑膜', '覆光膜'],
  },
  poster: {
    label: '海报',
    paperTypes: ['铜版纸', '哑光纸', '背胶纸', '相纸', 'PP纸', 'PVC板'],
    paperWeights: ['120g', '150g', '200g', '250g', '300g'],
    paperSizes: ['A2', 'A1', 'A0', '610mm*914mm', '787mm*1092mm'],
    printSides: ['单面'],
    printColors: ['单色', '双彩', '全彩'],
    bindings: ['无', '覆膜', '打孔', '卷轴'],
    finishes: ['覆哑膜', '覆光膜', '冷裱', '硬裱'],
  },
  flyer: {
    label: '宣传单',
    paperTypes: ['铜版纸', '哑粉纸', '双胶纸', '特种纸'],
    paperWeights: ['105g', '128g', '157g', '200g', '250g'],
    paperSizes: ['A4', 'A5', '16K', 'DL'],
    printSides: ['单面', '双面'],
    printColors: ['黑白', '单色', '双彩', '全彩'],
    bindings: ['折页', '无'],
    finishes: ['覆哑膜', '覆光膜', '烫金', '压纹'],
  },
  brochure: {
    label: '宣传册',
    paperTypes: ['铜版纸', '哑粉纸', '双胶纸', '特种纸'],
    paperWeights: ['105g', '128g', '157g', '200g', '250g'],
    paperSizes: ['A4', 'A5', '210mm*210mm'],
    printSides: ['单面', '双面'],
    printColors: ['黑白', '单色', '双彩', '全彩'],
    bindings: ['胶装', '骑马订', '线圈装', '索线胶装'],
    finishes: ['覆哑膜', '覆光膜', '烫金', 'UV', '压纹'],
  },
  banner: {
    label: '横幅',
    paperTypes: ['车贴', '旗帜布', '油画布', '网格布', '棉布'],
    paperWeights: ['280g', '320g', '360g'],
    paperSizes: ['0.6m*3m', '0.8m*3m', '1m*3m', '1.2m*3m', '定制'],
    printSides: ['单面'],
    printColors: ['单色', '双彩', '全彩'],
    bindings: ['无', '打孔', '穿绳', '旗杆'],
    finishes: ['防水', '防晒', '抗风'],
  },
  business_card: {
    label: '名片',
    paperTypes: ['铜版纸', '哑粉纸', '特种纸', 'PVC', '金属纸'],
    paperWeights: ['250g', '300g', '350g', '400g'],
    paperSizes: ['90mm*54mm', '90mm*50mm', '85mm*54mm'],
    printSides: ['单面', '双面'],
    printColors: ['单色', '双彩', '全彩'],
    bindings: ['无', '圆角', '压线'],
    finishes: ['覆哑膜', '覆光膜', '烫金', '击凸', 'UV'],
  },
  magazine: {
    label: '杂志',
    paperTypes: ['铜版纸', '哑粉纸', '双胶纸'],
    paperWeights: ['60g', '70g', '80g', '105g', '128g'],
    paperSizes: ['A4', '16K', '210mm*285mm'],
    printSides: ['单面', '双面'],
    printColors: ['黑白', '单色', '全彩'],
    bindings: ['胶装', '骑马订', '索线胶装'],
    finishes: ['覆哑膜', '覆光膜'],
  },
  book: {
    label: '书籍',
    paperTypes: ['双胶纸', '轻型纸', '道林纸', '书写纸'],
    paperWeights: ['50g', '60g', '70g', '80g', '100g'],
    paperSizes: ['A4', 'A5', '32K', '16K'],
    printSides: ['单面', '双面'],
    printColors: ['黑白', '单色', '全彩'],
    bindings: ['胶装', '锁线胶装', 'PUR胶装', '硬壳精装'],
    finishes: ['覆膜', '烫金', '压纹', '书腰'],
  },
  custom: {
    label: '自定义',
    paperTypes: ['铜版纸', '哑粉纸', '双胶纸', '特种纸'],
    paperWeights: ['80g', '100g', '128g', '157g', '200g'],
    paperSizes: ['A4', 'A3', 'A5', '16K', '自定义'],
    printSides: ['单面', '双面'],
    printColors: ['黑白', '单色', '双彩', '全彩'],
    bindings: ['胶装', '骑马订', '线圈装', '无'],
    finishes: ['覆膜', '烫金', 'UV'],
  },
};

// Base prices per page (元)
const BASE_PRICES = {
  // Per page based on paper and color
  paper: {
    // 纸张类型加成
    '铜版纸': 0.5,
    '哑粉纸': 0.6,
    '双胶纸': 0.4,
    '书写纸': 0.35,
    '特种纸': 1.2,
    'PVC': 2.0,
    '金属纸': 3.0,
  },
  // 纸张克重加成
  weight: {
    '50g': 0.1,
    '60g': 0.15,
    '70g': 0.2,
    '80g': 0.25,
    '100g': 0.3,
    '105g': 0.35,
    '120g': 0.4,
    '128g': 0.45,
    '157g': 0.5,
    '200g': 0.6,
    '250g': 0.7,
    '300g': 0.8,
    '350g': 0.9,
    '400g': 1.0,
  },
  // 颜色加成
  color: {
    '黑白': 0,
    '单色': 0.3,
    '双彩': 0.8,
    '全彩': 1.5,
  },
  // 尺寸加成
  size: {
    'A0': 5.0,
    'A1': 3.0,
    'A2': 1.5,
    'A4': 1.0,
    'A5': 0.6,
    '16K': 0.5,
    '8K': 1.2,
    '32K': 0.3,
    'DL': 0.4,
    '90mm*54mm': 0.15,
  },
  // 装订加成
  binding: {
    '无': 0,
    '无装订': 0,
    '折页': 0.2,
    '胶装': 1.5,
    '骑马订': 0.8,
    '线圈装': 1.2,
    '索线胶装': 2.0,
    '锁线胶装': 3.0,
    'PUR胶装': 3.5,
    '硬壳精装': 5.0,
    '圆角': 0.3,
    '压线': 0.1,
    '打孔': 0.2,
    '穿绳': 0.3,
    '旗杆': 1.0,
  },
  // 后道工艺加成
  finish: {
    '无': 0,
    '覆哑膜': 0.5,
    '覆光膜': 0.5,
    '冷裱': 1.0,
    '硬裱': 1.5,
    '烫金': 2.0,
    'UV': 1.5,
    '压纹': 1.0,
    '击凸': 1.2,
    '防水': 0.3,
    '防晒': 0.3,
    '抗风': 0.3,
    '打孔': 0.2,
    '卷轴': 0.5,
    '覆膜': 0.5,
  },
};

export function calculatePrintPrice(options: {
  category: string;
  paperType: string;
  paperWeight: string;
  paperSize: string;
  printSides: string;
  printColor: string;
  pageCount: number;
  quantity: number;
  binding?: string;
  finish?: string;
}): {
  unitPrice: number;
  totalPrice: number;
  breakdown: string[];
} {
  const breakdown: string[] = [];
  
  // Base price per page
  let price = BASE_PRICES.paper[options.paperType as keyof typeof BASE_PRICES.paper] || 0.5;
  breakdown.push(`纸张: ¥${price.toFixed(2)}`);
  
  // Paper weight
  price += BASE_PRICES.weight[options.paperWeight as keyof typeof BASE_PRICES.weight] || 0.2;
  
  // Color
  price += BASE_PRICES.color[options.printColor as keyof typeof BASE_PRICES.color] || 0;
  
  // Size multiplier
  const sizeMultiplier = BASE_PRICES.size[options.paperSize as keyof typeof BASE_PRICES.size] || 1.0;
  
  // Sides (double sided = 2x)
  const sidesMultiplier = options.printSides === '双面' ? 1.8 : 1.0;
  
  // Page count
  const pagePrice = price * sizeMultiplier * sidesMultiplier;
  const pageTotal = pagePrice * options.pageCount;
  
  // Binding
  const bindingPrice = options.binding ? (BASE_PRICES.binding[options.binding as keyof typeof BASE_PRICES.binding] || 0) : 0;
  
  // Finish
  const finishPrice = options.finish ? (BASE_PRICES.finish[options.finish as keyof typeof BASE_PRICES.finish] || 0) : 0;
  
  // Total unit price
  const unitPrice = pageTotal + bindingPrice + finishPrice;
  
  // Quantity discount
  let discount = 1.0;
  if (options.quantity >= 1000) discount = 0.7;
  else if (options.quantity >= 500) discount = 0.8;
  else if (options.quantity >= 100) discount = 0.9;
  
  const finalUnitPrice = unitPrice * discount;
  const totalPrice = finalUnitPrice * options.quantity;
  
  if (discount < 1.0) {
    breakdown.push(`数量折扣 (${Math.round((1-discount)*100)}%): -¥${(unitPrice - finalUnitPrice).toFixed(2)}`);
  }
  
  breakdown.push(`装订: ¥${bindingPrice.toFixed(2)}`);
  breakdown.push(`后工艺: ¥${finishPrice.toFixed(2)}`);
  breakdown.push(`数量: ${options.quantity}本`);
  
  return {
    unitPrice: Math.round(finalUnitPrice * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
    breakdown,
  };
}

export function getCategoryOptions(category: string) {
  return PRINT_CATEGORIES[category as keyof typeof PRINT_CATEGORIES] || PRINT_CATEGORIES.custom;
}
