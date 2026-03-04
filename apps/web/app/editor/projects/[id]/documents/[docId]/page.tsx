"use client";

import { useEffect, useRef, useState } from 'react';
import { 
  Type, Square, Circle, Triangle, Image, Download, 
  ZoomIn, ZoomOut, Undo, Redo, Trash2, Move, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Layers, Save, ChevronLeft, ChevronRight, Wand2,
  Sparkles, ImagePlus, Loader2
} from 'lucide-react';
import { jsPDF } from 'jspdf';

// 动态导入 fabric.js (客户端 Only)
let fabric: any = null;

// 可用字体列表
// 中文字体映射表 - 本地系统字体
const fonts = [
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

// 动态加载字体
// 本地字体不需要预加载
const loadFont = async (fontFamily: string) => {
  };

// AI 生成类型
type AIGenerateType = 'text' | 'image';

interface EditorElement {
  id: string;
  type: string;
  name: string;
  icon: any;
}

const components: EditorElement[] = [
  { id: 'text', type: 'text', name: '文本', icon: <Type size={18} /> },
  { id: 'rect', type: 'rect', name: '矩形', icon: <Square size={18} /> },
  { id: 'circle', type: 'circle', name: '圆形', icon: <Circle size={18} /> },
  { id: 'triangle', type: 'triangle', name: '三角形', icon: <Triangle size={18} /> },
  { id: 'image', type: 'image', name: '图片', icon: <ImagePlus size={18} /> },
];

export default function EditorContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<any[]>([]);
  const [zoom, setZoom] = useState(100);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState('A4');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [gridDensity, setGridDensity] = useState(20);
  const [gridColor, setGridColor] = useState('#CBD5E1');
  const [activeTool, setActiveTool] = useState<'move' | 'hand'>('move');
  const activeToolRef = useRef(activeTool);
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);
  
  // 页面尺寸配置
  const pageSizes: Record<string, { width: number; height: number }> = {
    'A4': { width: 595, height: 842 },
    'A5': { width: 420, height: 595 },
    'Letter': { width: 612, height: 792 },
    '自定义': { width: 600, height: 800 },
  };
  
  // AI 状态
  const [aiType, setAiType] = useState<AIGenerateType>('text');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [aiAreaMode, setAiAreaMode] = useState(false);
  const [aiCount, setAiCount] = useState(3); // 生成数量
  const aiAreaRef = useRef<any>(null);
  const aiOverlayRef = useRef<any>(null);
  
  // 问题3：AI选择模式状态
  const [aiSelectionMode, setAiSelectionMode] = useState(false);
  const [aiSelectionStart, setAiSelectionStart] = useState<{x: number, y: number} | null>(null);
  const aiSelectionRectRef = useRef<any>(null);

  // 初始化 Fabric.js
  useEffect(() => {
    // React Strict Mode fix
    if ((window as any).__fabric_init_done__) {
      setLoading(false);
      return;
    }
    (window as any).__fabric_init_done__ = true;

    const initFabric = async () => {
      try {
        const fabricModule = await import('fabric');
        fabric = fabricModule;
        
        if (canvasRef.current && containerRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;
          
          // 使用固定尺寸画布，元素可以超出到灰色背景区域
          // 使用容器尺寸作为画布尺寸
          const canvasWidth = containerRef.current?.clientWidth || 800;
          const canvasHeight = containerRef.current?.clientHeight || 600;
          
          
          const canvas = new fabric.Canvas(canvasRef.current, {
            width: 5000,
            height: 5000,
            backgroundColor: "#F5F7FB",
            selection: true,
            preserveObjectStacking: true,
          });

          // 添加网格线 - 使用已定义的canvasWidth和canvasHeight
          const gridSize = 10;
          
          for (let i = 0; i <= canvasWidth; i += gridSize) {
            const lineV = new fabric.Line([i, 0, i, canvasHeight], {
              stroke: '#E5E7EB',
              strokeWidth: 0.5,
              selectable: false,
              evented: false,
              opacity: 0.5,
            });
            canvas.add(lineV);
            gridLinesRef.current.push(lineV);
            canvas.sendObjectToBack(lineV);
          }
          
          for (let i = 0; i <= canvasHeight; i += gridSize) {
            const lineH = new fabric.Line([0, i, canvasWidth, i], {
              stroke: '#E5E7EB',
              strokeWidth: 0.5,
              selectable: false,
              evented: false,
              opacity: 0.5,
            });
            canvas.add(lineH);
            gridLinesRef.current.push(lineH);
            canvas.sendObjectToBack(lineH);
          }

          // 默认标题和副标题在artboard区域添加

          fabricRef.current = canvas;
          
          console.log('Canvas size:', canvas.width, canvas.height);
          
          // 添加白色可编辑区域（画布居中）- 居中在视口
          const artboardWidth = pageSizes[pageSize]?.width || 595;
          const artboardHeight = pageSizes[pageSize]?.height || 842;
          const artboardX = 2000 - artboardWidth / 2;  // 居中在大画布上
          const artboardY = 2000 - artboardHeight / 2;
          
          const artboard = new fabric.Rect({
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            width: artboardWidth,
            height: artboardHeight,
            fill: 'white',
            stroke: '#CBD5E1',
            strokeWidth: 2,
            strokeDashArray: [8, 4],
            selectable: false,
            evented: false,
            isArtboard: true,
          });
          canvas.add(artboard);
          canvas.sendObjectToBack(artboard);
          
          // 初始视口变换：简单居中
          canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
          
          // 添加默认标题 - 使用 Textbox 替代 IText
          const title = new fabric.Textbox('标题', {
            left: artboardX + artboardWidth / 2,
            top: artboardY + 60,
            originX: 'center',
            originY: 'center',
            width: artboardWidth - 40,
            fontSize: 32,
            fontFamily: 'SimHei, Arial',
            fill: '#333333',
            selectable: true,
            isTitle: true,
          });
          canvas.add(title);
          
          // 添加默认副标题 - 使用 Textbox 替代 IText
          const subtitle = new fabric.Textbox('副标题', {
            left: artboardX + artboardWidth / 2,
            top: artboardY + 100,
            originX: 'center',
            originY: 'center',
            width: artboardWidth - 40,
            fontSize: 18,
            fontFamily: 'SimHei, Arial',
            fill: '#666666',
            selectable: true,
            isSubtitle: true,
          });
          canvas.add(subtitle);
          
          // 监听选中事件
          canvas.on('selection:created', (e: any) => setSelectedObject(e.selected[0]));
          canvas.on('selection:updated', (e: any) => setSelectedObject(e.selected[0]));
          canvas.on('selection:cleared', () => setSelectedObject(null));
          
          // 任务1：文本和图形缩放修复 - 监听对象缩放事件
          canvas.on('object:scaling', (e: any) => {
            const obj = e.target;
            if (!obj) return;
            
            // 问题1：文本缩放 - 使用 Textbox 时保持字体大小不变，只改变宽度
            if (obj.type === 'textbox') {
              const newWidth = (obj.width || 0) * (obj.scaleX || 1);
              obj.set({
                width: newWidth,
                scaleX: 1,
                scaleY: 1,
              });
              return;
            }
            
            // 问题2：图形缩放 - 保持 strokeWidth 不变
            if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle') {
              const scaleX = obj.scaleX || 1;
              const scaleY = obj.scaleY || 1;
              
              // 保持倒角比例不变
              if (obj.type === 'rect' && obj.rx) {
                obj.set({
                  rx: (obj.rx || 0) / Math.min(scaleX, scaleY),
                  ry: (obj.ry || 0) / Math.min(scaleX, scaleY),
                });
              }
              
              // 保持 strokeWidth 不变
              obj.set({
                width: (obj.width || 0) * scaleX,
                height: (obj.height || 0) * scaleY,
                strokeWidth: (obj.strokeWidth || 0) / Math.min(scaleX, scaleY),
                scaleX: 1,
                scaleY: 1,
              });
            }
          });
          
          // 对齐网格功能
          canvas.on('object:moving', (e: any) => {
            // 只有在 move 模式下才允许移动
            if (activeTool !== 'move') return;
            
            const obj = e.target;
            if (!obj) return;
            const gridSize = gridDensity;
            
            // 对齐网格
            obj.set({
              left: Math.round(obj.left / gridSize) * gridSize,
              top: Math.round(obj.top / gridSize) * gridSize
            });
          });
          
          // 支持 Apple 触控板双指滑动
          canvas.on('mouse:wheel', (opt: any) => {
            const e = opt.e;
            const vpt = canvas.viewportTransform;
            if (vpt) {
              // 横向滚动
              if (Math.abs(e.deltaX) > 0) {
                vpt[4] += e.deltaX;
              }
              // 垂直滚动
              if (Math.abs(e.deltaY) > 0) {
                vpt[5] += e.deltaY;
              }
              canvas.setViewportTransform(vpt);
              canvas.requestRenderAll();
              e.preventDefault();
              e.stopPropagation();
            }
          });
          
          // Hand 模式：拖动画布 - 使用全局变量确保状态正确
          let isPanning = false;
          let panStartX = 0;
          let panStartY = 0;
          
          // Hand 模式下禁用选择
          if (activeToolRef.current === 'hand') {
            canvas.selection = false;
            canvas.defaultCursor = 'grab';
          }
          
          // 鼠标按下事件
          canvas.on('mouse:down', function(opt: any) {
            console.log('MD - tool:', activeToolRef.current);
            if (activeToolRef.current === 'hand') {
              isPanning = true;
              panStartX = opt.e.clientX;
              panStartY = opt.e.clientY;
              canvas.defaultCursor = 'grabbing';
              canvas.selection = false;
              opt.e.preventDefault();
            }
          });
          
          // 鼠标移动事件 - 处理拖动
          canvas.on('mouse:move', function(opt: any) {
            if (isPanning && activeToolRef.current === 'hand') {
              const e = opt.e;
              const vpt = canvas.viewportTransform;
              if (vpt) {
                vpt[4] += e.clientX - panStartX;
                vpt[5] += e.clientY - panStartY;
                panStartX = e.clientX;
                panStartY = e.clientY;
                canvas.requestRenderAll();
              }
              e.preventDefault();
            }
          });
          
          // 鼠标松开事件
          canvas.on('mouse:up', function(opt: any) {
            if (activeToolRef.current === 'hand') {
              isPanning = false;
              canvas.defaultCursor = 'grab';
            }
          });
          
          // 鼠标离开画布
          canvas.on('mouse:out', function(opt: any) {
            if (activeToolRef.current === 'hand') {
              isPanning = false;
              canvas.defaultCursor = 'grab';
            }
          });
          
          // 问题3：AI选择模式 - 监听鼠标事件实现框选
          canvas.on('mouse:down', function(opt: any) {
            // 如果不在AI选择模式，不处理
            if (!aiSelectionMode) return;
            
            const pointer = canvas.getPointer(opt.e);
            setAiSelectionStart({ x: pointer.x, y: pointer.y });
            
            // 创建虚线矩形
            const rect = new fabric.Rect({
              left: pointer.x,
              top: pointer.y,
              width: 0,
              height: 0,
              fill: 'rgba(91, 107, 230, 0.1)',
              stroke: '#5B6BE6',
              strokeDashArray: [5, 5],
              selectable: false,
              evented: false,
              isAISelection: true,
            });
            canvas.add(rect);
            aiSelectionRectRef.current = rect;
          });
          
          canvas.on('mouse:move', function(opt: any) {
            // 如果不在AI选择模式，不处理
            if (!aiSelectionMode || !aiSelectionStart || !aiSelectionRectRef.current) return;
            
            const pointer = canvas.getPointer(opt.e);
            const width = pointer.x - aiSelectionStart.x;
            const height = pointer.y - aiSelectionStart.y;
            
            aiSelectionRectRef.current.set({
              width: Math.abs(width),
              height: Math.abs(height),
              left: width > 0 ? aiSelectionStart.x : pointer.x,
              top: height > 0 ? aiSelectionStart.y : pointer.y,
            });
            canvas.renderAll();
          });
          
          canvas.on('mouse:up', function(opt: any) {
            // 如果不在AI选择模式，不处理
            if (!aiSelectionMode || !aiSelectionRectRef.current) return;
            
            // 恢复鼠标样式
            document.body.style.cursor = 'default';
            
            // 保存选择区域信息到 ref
            const rect = aiSelectionRectRef.current;
            aiAreaRef.current = {
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
            };
            
            // 清除选择矩形
            canvas.remove(rect);
            aiSelectionRectRef.current = null;
            setAiSelectionStart(null);
            
            // 退出选择模式，显示AI面板
            setAiSelectionMode(false);
            setShowAIPanel(true);
            
            // 保存到历史
            saveToHistory();
          });
          
          // 保存初始状态
          saveToHistory();
          setLoading(false);
        } else {
          // Canvas or container not ready, retry after a short delay
          console.log('Canvas or container not ready, retrying...');
          setTimeout(() => {
            initFabric();
          }, 100);
          return;
        }
      } catch (error) {
        console.error('Failed to load fabric:', error);
        setLoading(false);
      }
    };

    initFabric();

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
      }
    };
  }, []);

  // 滚轮缩放
  useEffect(() => {
    // React Strict Mode fix
    if ((window as any).__fabric_init_done__) {
      setLoading(false);
      return;
    }
    (window as any).__fabric_init_done__ = true;

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        handleZoom(delta);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [zoom]); 

  // 工具切换时更新画布状态
  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    
    if (activeToolRef.current === 'hand') {
      canvas.selection = false;
      canvas.defaultCursor = 'grab';
      canvas.discardActiveObject();
    } else {
      canvas.selection = true;
      canvas.defaultCursor = 'default';
    }
    canvas.renderAll();
  }, [activeTool]);
  
  // 键盘快捷键：V = Move工具，H = Hand工具
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 避免在输入框中触发
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'v' || e.key === 'V') {
        setActiveTool('move');
      } else if (e.key === 'h' || e.key === 'H') {
        setActiveTool('hand');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 页面尺寸变化时更新画布 - 重新创建artboard
  useEffect(() => {
    console.log('PageSize effect triggered, pageSize:', pageSize);
    if (!fabricRef.current) {
      console.log('No canvas yet');
      return;
    }
    if (!(window as any).__fabric_init_done__) {
      console.log('Fabric not initialized yet');
      return;
    }
    const canvas = fabricRef.current;
    console.log('Canvas found, current objects:', canvas.getObjects().length);
    
    // 移除现有的artboard、标题和副标题
    const objects = canvas.getObjects();
    console.log('All objects:', objects.map((o: any) => ({ type: o.type, isArtboard: o.isArtboard, isTitle: o.isTitle, isSubtitle: o.isSubtitle })));
    const toRemove = objects.filter((obj: any) => 
      obj.isArtboard || obj.isTitle || obj.isSubtitle
    );
    console.log('Removing objects:', toRemove.length);
    toRemove.forEach((obj: any) => canvas.remove(obj));
    
    // 重新创建artboard
    const artboardWidth = pageSizes[pageSize]?.width || 595;
    const artboardHeight = pageSizes[pageSize]?.height || 842;
    const artboardX = 2000 - artboardWidth / 2;
    const artboardY = 2000 - artboardHeight / 2;
    
    const artboard = new fabric.Rect({
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: 'center',
      originY: 'center',
      width: artboardWidth,
      height: artboardHeight,
      fill: 'white',
      stroke: '#CBD5E1',
      strokeWidth: 2,
      strokeDashArray: [8, 4],
      selectable: false,
      evented: false,
      isArtboard: true,
    });
    
    canvas.add(artboard);
    canvas.sendObjectToBack(artboard);
    
    // 重新添加标题 - 使用 Textbox
    const title = new fabric.Textbox('标题', {
      left: artboardX + artboardWidth / 2,
      top: artboardY + 60,
      originX: 'center',
      originY: 'center',
      width: artboardWidth - 40,
      fontSize: 32,
      fontFamily: 'SimHei, Arial',
      fill: '#333333',
      selectable: true,
      isTitle: true,
    });
    canvas.add(title);
    
    // 重新添加副标题 - 使用 Textbox
    const subtitle = new fabric.Textbox('副标题', {
      left: artboardX + artboardWidth / 2,
      top: artboardY + 100,
      originX: 'center',
      originY: 'center',
      width: artboardWidth - 40,
      fontSize: 18,
      fontFamily: 'SimHei, Arial',
      fill: '#666666',
      selectable: true,
      isSubtitle: true,
    });
    canvas.add(subtitle);
    
    // 重置视口，确保artboard可见
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.renderAll();
    console.log('Artboard recreated, viewport reset');
  }, [pageSize]);

  // 网格显示/隐藏切换
  useEffect(() => {
    if (!fabricRef.current) return;
    gridLinesRef.current.forEach((line) => {
      if (line) {
        line.visible = showGrid;
      }
    });
    fabricRef.current.renderAll();
  }, [showGrid]);

  // 同步网格位置与画布视口
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !gridRef.current) return;
    
    const updateGridPosition = () => {
      const vpt = canvas.viewportTransform;
      if (vpt && gridRef.current) {
        gridRef.current.style.transform = `translate(${vpt[4]}px, ${vpt[5]}px) scale(${vpt[0]})`;
      }
    };
    
    canvas.on('after:render', updateGridPosition);
    canvas.on('object:moving', updateGridPosition);
    canvas.on('zoom', updateGridPosition);
    
    // 初始位置
    updateGridPosition();
    
    return () => {
      canvas.off('after:render', updateGridPosition);
      canvas.off('object:moving', updateGridPosition);
      canvas.off('zoom', updateGridPosition);
    };
  }, []);

  // 保存到历史记录
  const saveToHistory = () => {
    if (!fabricRef.current) return;
    const json = JSON.stringify(fabricRef.current.toJSON());
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // 撤销
  const undo = () => {
    if (historyIndex <= 0 || !fabricRef.current) return;
    const newIndex = historyIndex - 1;
    fabricRef.current.loadFromJSON(JSON.parse(history[newIndex]), () => {
      fabricRef.current.renderAll();
      setHistoryIndex(newIndex);
    });
  };

  // 重做
  const redo = () => {
    if (historyIndex >= history.length - 1 || !fabricRef.current) return;
    const newIndex = historyIndex + 1;
    fabricRef.current.loadFromJSON(JSON.parse(history[newIndex]), () => {
      fabricRef.current.renderAll();
      setHistoryIndex(newIndex);
    });
  };

  // 添加图片 - 支持本地文件上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && fabricRef.current && fabric) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        fabric.FabricImage.fromURL(dataUrl, (img: any) => {
          // 计算缩放使图片适合画布
          const maxSize = 300;
          const scale = Math.min(maxSize / (img.width || 1), maxSize / (img.height || 1), 1);
          img.set({
            left: fabricRef.current.width! / 2 - (img.width * scale) / 2,
            top: fabricRef.current.height! / 2 - (img.height * scale) / 2,
            scaleX: scale,
            scaleY: scale,
          });
          fabricRef.current.add(img);
          fabricRef.current.setActiveObject(img);
          fabricRef.current.renderAll();
          saveToHistory();
        });
      };
      reader.readAsDataURL(file);
    }
    // 清空input以便重复选择同一文件
    e.target.value = '';
  };

  // 添加元素
  const addElement = (type: string) => {
    if (!fabricRef.current || !fabric) return;
    
    let obj: any;
    const centerX = fabricRef.current.width! / 2;
    const centerY = fabricRef.current.height! / 2;

    switch (type) {
      case 'text':
        // 问题1：使用 Textbox 替代 IText，防止缩放时字体变形
        obj = new fabric.Textbox('双击编辑文字', {
          left: centerX - 50,
          top: centerY,
          width: 200,
          fontSize: 24,
          fontFamily: 'SimHei, sans-serif',
          fill: '#2D3748',
        });
        break;
      case 'rect':
        obj = new fabric.Rect({
          left: centerX - 50,
          top: centerY - 50,
          width: 100,
          height: 100,
          fill: '#E8EAFC',
          stroke: '#5B6BE6',
          strokeWidth: 2,
          rx: 8,
          ry: 8,
        });
        break;
      case 'circle':
        obj = new fabric.Circle({
          left: centerX - 50,
          top: centerY - 50,
          radius: 50,
          fill: '#E8EAFC',
          stroke: '#5B6BE6',
          strokeWidth: 2,
        });
        break;
      case 'triangle':
        obj = new fabric.Triangle({
          left: centerX - 50,
          top: centerY - 50,
          width: 100,
          height: 100,
          fill: '#E8EAFC',
          stroke: '#5B6BE6',
          strokeWidth: 2,
        });
        break;
      // 任务2：组件库添加图片工具 - 点击时触发文件选择
      case 'image':
        document.getElementById('image-upload-input')?.click();
        return;
      default:
        return;
    }

    if (obj) {
      fabricRef.current.add(obj);
      fabricRef.current.setActiveObject(obj);
      fabricRef.current.renderAll();
      saveToHistory();
    }
  };

  // 添加图片
  const addImage = (url: string) => {
    if (!fabricRef.current || !fabric) return;
    
    fabric.FabricImage.fromURL(url, (img: any) => {
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
      });
      fabricRef.current.add(img);
      fabricRef.current.setActiveObject(img);
      fabricRef.current.renderAll();
      saveToHistory();
    });
  };

  // 删除选中
  const deleteSelected = () => {
    if (!fabricRef.current) return;
    const active = fabricRef.current.getActiveObject();
    if (active) {
      fabricRef.current.remove(active);
      fabricRef.current.renderAll();
      saveToHistory();
    }
  };

  // 缩放
  const handleZoom = (delta: number) => {
    const newZoom = Math.max(25, Math.min(200, zoom + delta));
    setZoom(newZoom);
    if (fabricRef.current) {
      fabricRef.current.setZoom(newZoom / 100);
      fabricRef.current.renderAll();
    }
  };

  // 导出 PNG
  const handleExportPNG = () => {
    if (!fabricRef.current) return;
    const dataURL = fabricRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
    const link = document.createElement('a');
    link.download = 'document.png';
    link.href = dataURL;
    link.click();
  };

  // 导出 PDF
  const handleExportPDF = async () => {
    if (!fabricRef.current) return;
    
    try {
      // jsPDF is already imported statically
      const canvas = fabricRef.current;
      const width = canvas.width || 595;
      const height = canvas.height || 842;
      
      const pdf = new jsPDF({
        orientation: height > width ? 'portrait' : 'landscape',
        unit: 'pt',
        format: 'a4',
      });
      
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
      });
      
      pdf.addImage(dataURL, 'PNG', 0, 0, width, height);
      pdf.setProperties({
        title: '会议会刊文档',
        subject: '版面设计',
        creator: '会议出版平台',
      });
      pdf.save('document-print.pdf');
    } catch (error) {
      console.error('导出 PDF 失败:', error);
    }
  };

  // 更新选中元素属性
  const updateSelected = (prop: string, value: any) => {
    if (!fabricRef.current || !selectedObject) return;
    
    // 特殊处理字体属性
    if (prop === 'fontFamily' && selectedObject.type === 'i-text') {
      selectedObject.setFontFamily(value);
    } else {
      selectedObject.set(prop, value);
    }
    
    selectedObject.dirty = true;
    fabricRef.current.renderAll();
  };

  // AI 生成 (带演示模式) - 任务3：支持选中替换和无选中区域选择
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    const canvas = fabricRef.current;
    if (!canvas) return;
    
    const activeObj = canvas.getActiveObject();
    
    // 如果有选中对象且类型匹配，直接替换
    if (activeObj) {
      if (aiType === 'text' && activeObj.type === 'i-text') {
        // 选中文字，生成后替换
        setAiLoading(true);
        setAiResults([]);
        try {
          const res = await fetch('http://localhost:3001/ai/generate-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: aiPrompt, type: 'content' }),
          });
          if (res.ok) {
            const data = await res.json();
            setAiResults(data.results || []);
          } else {
            setAiResults(getDemoResults(aiType));
          }
        } catch (error) {
          setAiResults(getDemoResults(aiType));
        } finally {
          setAiLoading(false);
        }
        return;
      } else if (aiType === 'image' && (activeObj.type === 'image' || activeObj.type === 'fabric-image')) {
        // 选中图片，生成后替换
        setAiLoading(true);
        setAiResults([]);
        try {
          const res = await fetch('http://localhost:3001/ai/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: aiPrompt, style: 'illustration' }),
          });
          if (res.ok) {
            const data = await res.json();
            setAiResults(data.results || []);
          } else {
            setAiResults(getDemoResults(aiType));
          }
        } catch (error) {
          setAiResults(getDemoResults(aiType));
        } finally {
          setAiLoading(false);
        }
        return;
      }
    }
    
    // 无选中：进入区域选择模式
    setAiAreaMode(true);
    
    // 在画布中心创建半透明矩形区域
    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;
    const areaWidth = aiType === 'text' ? 400 : 300;
    const areaHeight = aiType === 'text' ? 60 : 200;
    
    // 创建半透明遮罩
    const overlay = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvas.width,
      height: canvas.height,
      fill: 'rgba(0, 0, 0, 0.3)',
      selectable: false,
      evented: false,
      isAIOverlay: true,
    });
    canvas.add(overlay);
    canvas.sendObjectToBack(overlay);
    
    // 创建可拖拽的区域指示器
    const aiArea = new fabric.Rect({
      left: centerX - areaWidth / 2,
      top: centerY - areaHeight / 2,
      width: areaWidth,
      height: areaHeight,
      fill: 'rgba(91, 107, 230, 0.2)',
      stroke: '#5B6BE6',
      strokeWidth: 2,
      strokeDashArray: [8, 4],
      rx: 8,
      ry: 8,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      isAIArea: true,
    });
    canvas.add(aiArea);
    aiAreaRef.current = aiArea;
    aiOverlayRef.current = overlay;
    
    // 添加提示文字
    const hintText = new fabric.IText(
      aiType === 'text' ? '拖拽调整文字区域' : '拖拽调整图片区域',
      {
        left: centerX,
        top: centerY,
        originX: 'center',
        originY: 'center',
        fontSize: 14,
        fill: '#5B6BE6',
        selectable: false,
        evented: false,
        isAIHint: true,
      }
    );
    canvas.add(hintText);
    
    canvas.renderAll();
  };
  
  // 确认AI区域并生成
  const confirmAIArea = async () => {
    if (!fabricRef.current || !aiAreaRef.current) return;
    
    const canvas = fabricRef.current;
    const aiArea = aiAreaRef.current;
    
    // 获取区域位置
    const areaLeft = aiArea.left || 0;
    const areaTop = aiArea.top || 0;
    const areaWidth = (aiArea.width || 100) * (aiArea.scaleX || 1);
    const areaHeight = (aiArea.height || 100) * (aiArea.scaleY || 1);
    
    // 清理区域指示器
    const objects = canvas.getObjects();
    objects.forEach((obj: any) => {
      if (obj.isAIArea || obj.isAIOverlay || obj.isAIHint) {
        canvas.remove(obj);
      }
    });
    
    setAiAreaMode(false);
    aiAreaRef.current = null;
    aiOverlayRef.current = null;
    
    // 开始生成
    setAiLoading(true);
    setAiResults([]);
    
    try {
      const endpoint = aiType === 'text' 
        ? 'http://localhost:3001/ai/generate-text'
        : 'http://localhost:3001/ai/generate-image';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: aiPrompt,
          type: aiType === 'text' ? 'content' : undefined,
          style: aiType === 'image' ? 'illustration' : undefined,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setAiResults(data.results || []);
      } else {
        setAiResults(getDemoResults(aiType));
      }
    } catch (error) {
      setAiResults(getDemoResults(aiType));
    } finally {
      setAiLoading(false);
      canvas.renderAll();
    }
  };
  
  // 取消AI区域选择
  const cancelAIArea = () => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    const objects = canvas.getObjects();
    objects.forEach((obj: any) => {
      if (obj.isAIArea || obj.isAIOverlay || obj.isAIHint) {
        canvas.remove(obj);
      }
    });
    
    setAiAreaMode(false);
    aiAreaRef.current = null;
    aiOverlayRef.current = null;
    canvas.renderAll();
  };

  // 获取演示结果
  const getDemoResults = (type: AIGenerateType) => {
    if (type === 'text') {
      const textResults = [
        { id: 1, content: `【${aiPrompt}】- 演示模式\n\n本次大会汇聚了来自全球的行业专家，就最新技术发展趋势进行了深入探讨。与会者普遍认为，人工智能将成为推动行业创新的核心动力。` },
        { id: 2, content: `【${aiPrompt}】- 演示模式\n\n会议期间，多家企业展示了最新产品和技术解决方案，现场气氛热烈。与会者表示收获颇丰，期待明年再会。` },
        { id: 3, content: `【${aiPrompt}】- 演示模式\n\n本次论坛聚焦数字化转型与可持续发展议题，邀请了多位行业领袖分享前沿观点。会议现场互动频繁，干货满满。` },
        { id: 4, content: `【${aiPrompt}】- 演示模式\n\n大会设置了多个分论坛，涵盖技术创新、市场拓展、团队建设等热门话题。与会者可以根据自身兴趣选择参加。` },
      ];
      return textResults.slice(0, aiCount);
    } else {
      const imageResults = [
        { id: 1, url: 'https://via.placeholder.com/400x300/5B6BE6/FFFFFF?text=AI+Generated+Image', thumbnail: 'https://via.placeholder.com/200x150/5B6BE6/FFFFFF?text=Preview' },
        { id: 2, url: 'https://via.placeholder.com/400x300/9B6BF5/FFFFFF?text=AI+Artwork', thumbnail: 'https://via.placeholder.com/200x150/9B6BF5/FFFFFF?text=Preview' },
        { id: 3, url: 'https://via.placeholder.com/400x300/6BCBF5/FFFFFF?text=AI+Design', thumbnail: 'https://via.placeholder.com/200x150/6BCBF5/FFFFFF?text=Preview' },
        { id: 4, url: 'https://via.placeholder.com/400x300/F56B6B/FFFFFF?text=AI+Creative', thumbnail: 'https://via.placeholder.com/200x150/F56B6B/FFFFFF?text=Preview' },
      ];
      return imageResults.slice(0, aiCount);
    }
  };

  // 任务3：AI生成功能优化 - 选中图片/文字时替换，无选中时创建区域
  // 替换选中图片
  const replaceWithAIImage = (url: string) => {
    if (!fabricRef.current || !fabric) return;
    
    const activeObj = fabricRef.current.getActiveObject();
    
    fabric.FabricImage.fromURL(url, (img: any) => {
      if (activeObj && (activeObj.type === 'image' || activeObj.type === 'fabric-image')) {
        // 选中图片：替换选中图片
        const left = activeObj.left;
        const top = activeObj.top;
        const scaleX = activeObj.scaleX || 1;
        const scaleY = activeObj.scaleY || 1;
        
        fabricRef.current.remove(activeObj);
        img.set({ left, top, scaleX, scaleY });
        fabricRef.current.add(img);
        fabricRef.current.setActiveObject(img);
      } else {
        // 无选中：添加到画布中心
        const centerX = fabricRef.current.width! / 2;
        const centerY = fabricRef.current.height! / 2;
        img.set({
          left: centerX - 150,
          top: centerY - 100,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        fabricRef.current.add(img);
        fabricRef.current.setActiveObject(img);
      }
      fabricRef.current.renderAll();
      saveToHistory();
    });
  };

  // 替换选中文字
  const replaceWithAIText = (content: string) => {
    if (!fabricRef.current || !fabric) return;
    
    const canvas = fabricRef.current;
    const activeObj = canvas.getActiveObject();
    
    // 支持 i-text 和 textbox
    if (activeObj && (activeObj.type === 'i-text' || activeObj.type === 'textbox')) {
      // 选中文字：替换选中文字内容
      const left = activeObj.left;
      const top = activeObj.top;
      const fontSize = activeObj.fontSize || 18;
      const fontFamily = activeObj.fontFamily || 'SimHei, sans-serif';
      const fill = activeObj.fill || '#2D3748';
      
      canvas.remove(activeObj);
      // 使用 Textbox 替代 IText
      const newText = new fabric.Textbox(content, {
        left,
        top,
        width: activeObj.width || 200,
        fontSize,
        fontFamily,
        fill,
      });
      canvas.add(newText);
      canvas.setActiveObject(newText);
    } else {
      // 无选中：添加新文字到画布中心
      const centerX = canvas.width! / 2;
      const newText = new fabric.Textbox(content, {
        left: centerX - 100,
        top: canvas.height! / 2,
        width: 200,
        fontSize: 18,
        fontFamily: 'SimHei, sans-serif',
        fill: '#2D3748',
      });
      canvas.add(newText);
      canvas.setActiveObject(newText);
    }
    canvas.renderAll();
    saveToHistory();
  };

  // 使用AI生成的文本 (保留旧函数用于兼容性)
  const useAIText = (content: string) => {
    replaceWithAIText(content);
  };

  // 使用AI生成的图片 (保留旧函数用于兼容性)
  const useAIImage = (url: string) => {
    replaceWithAIImage(url);
  };
  
  // 问题3：点击AI助手按钮 - 进入选择模式
  const handleAIAssistantClick = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    
    // 隐藏AI面板，进入选择模式
    setAiSelectionMode(true);
    setShowAIPanel(false);
    
    // 改变鼠标样式
    document.body.style.cursor = 'crosshair';
    
    // 禁用画布选择
    canvas.selection = false;
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F5F7FB' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #E2E8F0', borderTopColor: '#5B6BE6', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: '#718096' }}>加载编辑器...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container" style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#F5F7FB" }}>
      {/* 顶部工具栏 */}
      <div className="editor-toolbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "white", borderBottom: "1px solid #E2E8F0", zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/projects/1/documents" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#718096', textDecoration: 'none', fontSize: '14px' }}>
            <ChevronLeft size={18} /> 返回
          </a>
          <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />
          <h1 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', margin: 0 }}>
            文档编辑器 - 示例文档
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="editor-btn-undo" onClick={undo} disabled={historyIndex <= 0} style={toolbarButtonStyle} title="撤销">
            <Undo size={18} />
          </button>
          <button className="editor-btn-redo" onClick={redo} disabled={historyIndex >= history.length - 1} style={toolbarButtonStyle} title="重做">
            <Redo size={18} />
          </button>
          
          <div style={{ width: '1px', height: '24px', background: '#E2E8F0', margin: '0 8px' }} />
          
          {/* Move/Hand 工具切换 */}
          <button 
            onClick={() => setActiveTool('move')} 
            style={{ 
              ...toolbarButtonStyle, 
              background: activeTool === 'move' ? '#E0E7FF' : 'transparent',
              border: activeTool === 'move' ? '1px solid #6366F1' : '1px solid transparent'
            }} 
            title="移动工具"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
            </svg>
          </button>
          <button 
            onClick={() => setActiveTool('hand')} 
            style={{ 
              ...toolbarButtonStyle, 
              background: activeTool === 'hand' ? '#E0E7FF' : 'transparent',
              border: activeTool === 'hand' ? '1px solid #6366F1' : '1px solid transparent'
            }} 
            title="拖动画布"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
            </svg>
          </button>
          
          <div style={{ width: '1px', height: '24px', background: '#E2E8F0', margin: '0 8px' }} />
          
          <button className="editor-btn-zoom-out" onClick={() => handleZoom(-10)} style={toolbarButtonStyle} title="缩小">
            <ZoomOut size={18} />
          </button>
          <span style={{ fontSize: '13px', color: '#718096', minWidth: '50px', textAlign: 'center' }}>{zoom}%</span>
          <button className="editor-btn-zoom-in" onClick={() => handleZoom(10)} style={toolbarButtonStyle} title="放大">
            <ZoomIn size={18} />
          </button>
          
          <div style={{ width: '1px', height: '24px', background: '#E2E8F0', margin: '0 8px' }} />
          
          <button className="editor-btn-delete" onClick={deleteSelected} disabled={!selectedObject} style={{ ...toolbarButtonStyle, opacity: selectedObject ? 1 : 0.4 }} title="删除">
            <Trash2 size={18} />
          </button>
          
          <button 
            onClick={handleAIAssistantClick}
            style={{ 
              ...toolbarButtonStyle, 
              background: showAIPanel ? '#5B6BE6' : 'transparent',
              color: showAIPanel ? 'white' : '#718096',
            }} 
            title="AI助手"
          >
            <Wand2 size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="editor-btn-grid" onClick={() => setShowGrid(!showGrid)} style={{ ...toolbarButtonStyle, background: showGrid ? "#E0E7FF" : "#F5F7FB", border: "1px solid #E2E8F0" }} title={showGrid ? "隐藏网格" : "显示网格"}>
            <Layers size={18} />
          </button>
          {showGrid && (
            <>
              <select className="editor-grid-density" value={gridDensity} onChange={(e) => setGridDensity(Number(e.target.value))} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "12px", marginLeft: "4px" }}>
                <option value={10}>10px</option>
                <option value={20}>20px</option>
                <option value={30}>30px</option>
                <option value={50}>50px</option>
              </select>
              <select className="editor-grid-color" value={gridColor} onChange={(e) => setGridColor(e.target.value)} style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "12px", marginLeft: "4px" }}>
                <option value="#F1F5F9">浅灰</option>
                <option value="#CBD5E1">中灰</option>
                <option value="#94A3B8">深灰</option>
              </select>
            </>
          )}
          <button className="editor-btn-save" onClick={saveToHistory} style={{ ...toolbarButtonStyle, background: "#F5F7FB", border: "1px solid #E2E8F0" }} title="保存">
            <Save size={18} />
          </button>
          <button className="editor-btn-export-pdf" onClick={handleExportPDF} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#5B6BE6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            <Download size={18} /> 导出 PDF
          </button>
          <button className="editor-btn-export-png" onClick={handleExportPNG} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'white', color: "rgb(91, 107, 230)", border: '1px solid #5B6BE6', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            <Download size={18} /> PNG
          </button>
        </div>
      </div>

      {/* 主编辑区域 */}
      <div ref={containerRef} className="editor-workspace" style={{ 
        display: "flex", 
        flex: 1, 
        overflow: "hidden"
      }}>
        {/* 左侧组件面板 */}
        {showLeftPanel && (
          <div className="editor-left-panel" style={{ width: "260px", background: "white", borderRight: "1px solid #E2E8F0", padding: "16px", overflowY: "auto" }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#2D3748', marginBottom: '16px' }}>组件库</h3>
            
            {/* 任务2：隐藏的文件输入 */}
            <input
              id="image-upload-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {components.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => addElement(comp.type)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    padding: '16px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0',
                    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', background: '#E8EAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)' }}>
                    {comp.icon}
                  </div>
                  <span style={{ fontSize: '13px', color: '#2D3748' }}>{comp.name}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#718096', marginBottom: '12px' }}>页面尺寸</h4>
              <select 
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                }}
                style={{ width: '100%', padding: '10px 12px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', color: '#2D3748', cursor: 'pointer' }}
              >
                <option value="A4">A4 (210 × 297mm)</option>
                <option value="A5">A5 (148 × 210mm)</option>
                <option value="Letter">Letter (8.5 × 11in)</option>
                <option value="自定义">自定义</option>
              </select>
            </div>
          </div>
        )}

        {/* 中间画布区域 - 类似Recraft.ai结构 */}
        <div className="editor-canvas-area" style={{ flex: 1, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", background: "#F5F7FB", position: 'relative' }}>
          {/* 画布包装器 */}
          <div className="editor-canvas-wrapper" style={{ 
            position: 'absolute', 
            width: '5000px', 
            height: '5000px',
            backgroundColor: 'transparent',
            zIndex: 1
          }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
            {/* 网格层 - 在画布上方，跟随画布移动 */}
            {showGrid && (
              <div ref={gridRef} style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
                backgroundSize: `${gridDensity}px ${gridDensity}px`,
                zIndex: 10,
                transformOrigin: '0 0'
              }} />
            )}
          </div>
        </div>

        {/* AI 面板 */}
        {showAIPanel && (
          <div className="editor-ai-panel" style={{ width: "320px", background: "white", borderLeft: "1px solid #E2E8F0", padding: "16px", overflowY: "auto" }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#2D3748', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: 'rgb(91, 107, 230)' }} /> AI 助手
            </h3>
            
            {/* 生成类型选择 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={() => setAiType('text')}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid',
                  background: aiType === 'text' ? '#5B6BE6' : 'white',
                  color: aiType === 'text' ? 'white' : '#718096',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                }}
              >
                生成文案
              </button>
              <button
                onClick={() => setAiType('image')}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid',
                  background: aiType === 'image' ? '#5B6BE6' : 'white',
                  color: aiType === 'image' ? 'white' : '#718096',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                }}
              >
                生成图片
              </button>
            </div>

            {/* AI设置：生成数量 */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', color: '#718096', marginBottom: '8px', display: 'block' }}>
                生成数量
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[2, 3, 4].map(n => (
                  <button
                    key={n}
                    onClick={() => setAiCount(n)}
                    style={{
                      padding: '6px 12px',
                      border: aiCount === n ? '1px solid #5B6BE6' : '1px solid #E2E8F0',
                      borderRadius: '4px',
                      background: aiCount === n ? '#EEF2FF' : 'white',
                      color: aiCount === n ? '#5B6BE6' : '#718096',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {n} 个
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: '#A0AEC0', marginTop: '8px' }}>
                预计消耗: {aiCount * 10} 积分
              </p>
            </div>
            
            {/* 输入框 */}
            <div style={{ marginBottom: '16px' }}>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={aiType === 'text' ? '描述你想生成的文案内容...\n例如：生成一段会议邀请函' : '描述你想生成的图片...\n例如：一朵红色的花朵，简约风格'}
                style={{
                  width: '100%', height: '100px', padding: '12px',
                  background: '#F5F7FB', border: '1px solid #E2E8F0',
                  borderRadius: '8px', fontSize: '14px', color: '#2D3748',
                  resize: 'none', outline: 'none',
                }}
              />
            </div>
            
            {/* 任务3：AI区域选择模式下的按钮 */}
            {aiAreaMode ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={confirmAIArea}
                  disabled={aiLoading}
                  style={{
                    flex: 1, padding: '12px', background: '#5B6BE6',
                    color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px',
                    fontWeight: 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  确认区域
                </button>
                <button
                  onClick={cancelAIArea}
                  style={{
                    flex: 1, padding: '12px', background: '#E2E8F0',
                    color: '#2D3748', border: 'none', borderRadius: '8px', fontSize: '14px',
                    fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={handleAIGenerate}
                disabled={aiLoading || !aiPrompt.trim()}
                style={{
                  width: '100%', padding: '12px', background: aiLoading ? '#A0AEC0' : '#5B6BE6',
                  color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px',
                  fontWeight: 500, cursor: aiLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                {aiLoading ? '生成中...' : '生成'}
              </button>
            )}
            
            {/* 结果展示 */}
            {aiResults.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#718096', marginBottom: '12px' }}>生成结果</h4>
                {aiResults.map((result, index) => (
                  <div key={index} style={{ marginBottom: '12px', padding: '12px', background: '#F8FAFC', borderRadius: '8px' }}>
                    {aiType === 'text' ? (
                      <div>
                        <p style={{ fontSize: '13px', color: '#2D3748', marginBottom: '8px', lineHeight: 1.6 }}>{result.content}</p>
                        <button
                          onClick={() => useAIText(result.content)}
                          style={{
                            padding: '6px 12px', background: '#5B6BE6', color: 'white',
                            border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                          }}
                        >
                          插入到画布
                        </button>
                      </div>
                    ) : (
                      <div>
                        <img src={result.thumbnail || result.url} alt="AI生成" style={{ width: '100%', borderRadius: '6px', marginBottom: '8px' }} />
                        <button
                          onClick={() => useAIImage(result.url)}
                          style={{
                            width: '100%', padding: '8px', background: '#5B6BE6', color: 'white',
                            border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                          }}
                        >
                          插入到画布
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 右侧属性面板 */}
        {showRightPanel && selectedObject && (
          <div style={{ width: '280px', background: 'white', borderLeft: '1px solid #E2E8F0', padding: '16px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#2D3748', marginBottom: '16px' }}>属性面板</h3>

            {/* 字体选择 (仅文字) */}
            {(selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && (
              <div style={{ marginBottom: '20px' }}>
                <label style={LabelStyle}>字体</label>
                <select
                  value={selectedObject?.fontFamily || 'SimHei'}
                  onChange={(e) => {
                    const newFont = e.target.value;
                    const canvas = fabricRef.current;
                    const activeObj = canvas?.getActiveObject();
                    if (activeObj) {
                      activeObj.set('fontFamily', newFont);
                      activeObj.dirty = true;
                      canvas?.renderAll();
                      // 更新React状态以同步UI
                      setSelectedObject({ ...selectedObject, fontFamily: newFont });
                    }
                  }}
                  style={{ width: '100%', padding: '10px 12px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', color: '#2D3748', cursor: 'pointer' }}
                >
                  {fonts.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 位置 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={LabelStyle}>位置</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <span style={InputLabelStyle}>X</span>
                  <input type="number" value={Math.round(selectedObject.left || 0)} onChange={(e) => updateSelected('left', parseInt(e.target.value))} style={InputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={InputLabelStyle}>Y</span>
                  <input type="number" value={Math.round(selectedObject.top || 0)} onChange={(e) => updateSelected('top', parseInt(e.target.value))} style={InputStyle} />
                </div>
              </div>
            </div>

            {/* 尺寸 */}
            {selectedObject.type !== 'i-text' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={LabelStyle}>尺寸</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={InputLabelStyle}>宽</span>
                    <input type="number" value={Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))} onChange={(e) => { const v = parseInt(e.target.value); updateSelected('scaleX', v / (selectedObject.width || 1)); }} style={InputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={InputLabelStyle}>高</span>
                    <input type="number" value={Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))} onChange={(e) => { const v = parseInt(e.target.value); updateSelected('scaleY', v / (selectedObject.height || 1)); }} style={InputStyle} />
                  </div>
                </div>
              </div>
            )}

            {/* 任务1：倒角参数设置 - 仅矩形显示 */}
            {selectedObject.type === 'rect' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={LabelStyle}>倒角半径</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={selectedObject.rx || 0} 
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      const canvas = fabricRef.current;
                      const activeObj = canvas?.getActiveObject();
                      if (activeObj) {
                        activeObj.set({ rx: v, ry: v });
                        activeObj.dirty = true;
                        canvas?.renderAll();
                        setSelectedObject({ ...selectedObject, rx: v, ry: v });
                      }
                    }} 
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '13px', color: '#718096', minWidth: '30px' }}>{selectedObject.rx || 0}</span>
                </div>
              </div>
            )}

            {/* 字体大小 (仅文字) */}
            {(selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && (
              <div style={{ marginBottom: '20px' }}>
                <label style={LabelStyle}>字体大小</label>
                <input type="number" value={selectedObject.fontSize || 24} onChange={(e) => updateSelected('fontSize', parseInt(e.target.value))} style={InputStyle} />
              </div>
            )}

            {/* 填充颜色 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={LabelStyle}>填充颜色</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={selectedObject.fill || '#ffffff'} onChange={(e) => updateSelected('fill', e.target.value)} style={{ width: '40px', height: '36px', border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'pointer' }} />
                <input type="text" value={selectedObject.fill || '#ffffff'} onChange={(e) => updateSelected('fill', e.target.value)} style={{ ...InputStyle, flex: 1 }} />
              </div>
            </div>

            {/* 边框颜色 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={LabelStyle}>边框颜色</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={selectedObject.stroke || '#000000'} onChange={(e) => updateSelected('stroke', e.target.value)} style={{ width: '40px', height: '36px', border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'pointer' }} />
                <input type="text" value={selectedObject.stroke || '#000000'} onChange={(e) => updateSelected('stroke', e.target.value)} style={{ ...InputStyle, flex: 1 }} />
              </div>
            </div>

            {/* 边框宽度 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={LabelStyle}>边框宽度</label>
              <input type="number" value={selectedObject.strokeWidth || 0} onChange={(e) => updateSelected('strokeWidth', parseInt(e.target.value))} style={InputStyle} />
            </div>

            {/* 透明度 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={LabelStyle}>透明度</label>
              <input type="range" min="0" max="1" step="0.1" value={selectedObject.opacity || 1} onChange={(e) => updateSelected('opacity', parseFloat(e.target.value))} style={{ width: '100%' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const toolbarButtonStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px',
  background: 'transparent', border: 'none', borderRadius: '8px', color: '#718096', cursor: 'pointer', transition: 'all 0.2s',
} as React.CSSProperties;

const LabelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, color: '#718096', marginBottom: '8px' } as React.CSSProperties;
const InputStyle = { width: '100%', padding: '8px 12px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', color: '#2D3748', outline: 'none' } as React.CSSProperties;
const InputLabelStyle = { display: 'block', fontSize: '12px', color: '#A0AEC0', marginBottom: '4px' } as React.CSSProperties;
