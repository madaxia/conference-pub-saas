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
          
          // 添加默认标题 - 相对于artboard定位
          const title = new fabric.IText('标题', {
            left: artboardX + artboardWidth / 2,
            top: artboardY + 60,
            originX: 'center',
            originY: 'center',
            fontSize: 32,
            fontFamily: 'SimHei, Arial',
            fill: '#333333',
            selectable: true,
            isTitle: true,
          });
          canvas.add(title);
          
          // 添加默认副标题 - 相对于artboard定位
          const subtitle = new fabric.IText('副标题', {
            left: artboardX + artboardWidth / 2,
            top: artboardY + 100,
            originX: 'center',
            originY: 'center',
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
          
          // 保存初始状态
          saveToHistory();
          setLoading(false);
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
    
    // 重新添加标题
    const title = new fabric.IText('标题', {
      left: artboardX + artboardWidth / 2,
      top: artboardY + 60,
      originX: 'center',
      originY: 'center',
      fontSize: 32,
      fontFamily: 'SimHei, Arial',
      fill: '#333333',
      selectable: true,
      isTitle: true,
    });
    canvas.add(title);
    
    // 重新添加副标题
    const subtitle = new fabric.IText('副标题', {
      left: artboardX + artboardWidth / 2,
      top: artboardY + 100,
      originX: 'center',
      originY: 'center',
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

  // 添加元素
  const addElement = (type: string) => {
    if (!fabricRef.current || !fabric) return;
    
    let obj: any;
    const centerX = fabricRef.current.width! / 2;
    const centerY = fabricRef.current.height! / 2;

    switch (type) {
      case 'text':
        obj = new fabric.IText('双击编辑文字', {
          left: centerX - 50,
          top: centerY,
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

  // AI 生成 (带演示模式)
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
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
      
      // 优先使用真实API
      if (res.ok) {
        const data = await res.json();
        setAiResults(data.results || []);
      } else {
        // API失败时使用演示模式
        console.log('API返回失败，使用演示模式');
        setAiResults(getDemoResults(aiType));
      }
    } catch (error) {
      console.error('AI生成失败,使用演示模式:', error);
      // 演示模式 fallback
      setAiResults(getDemoResults(aiType));
    } finally {
      setAiLoading(false);
    }
  };

  // 获取演示结果
  const getDemoResults = (type: AIGenerateType) => {
    if (type === 'text') {
      return [
        { id: 1, content: `【${aiPrompt}】- 演示模式\n\n本次大会汇聚了来自全球的行业专家，就最新技术发展趋势进行了深入探讨。与会者普遍认为，人工智能将成为推动行业创新的核心动力。` },
        { id: 2, content: `【${aiPrompt}】- 演示模式\n\n会议期间，多家企业展示了最新产品和技术解决方案，现场气氛热烈。与会者表示收获颇丰，期待明年再会。` },
      ];
    } else {
      return [
        { id: 1, url: 'https://via.placeholder.com/400x300/5B6BE6/FFFFFF?text=AI+Generated+Image', thumbnail: 'https://via.placeholder.com/200x150/5B6BE6/FFFFFF?text=Preview' },
        { id: 2, url: 'https://via.placeholder.com/400x300/9B6BF5/FFFFFF?text=AI+Artwork', thumbnail: 'https://via.placeholder.com/200x150/9B6BF5/FFFFFF?text=Preview' },
      ];
    }
  };

  // 使用AI生成的文本
  const useAIText = (content: string) => {
    if (!fabricRef.current || !fabric) return;
    
    const obj = new fabric.IText(content, {
      left: 100,
      top: 100,
      fontSize: 18,
      fontFamily: 'SimHei, sans-serif',
      fill: '#2D3748',
    });
    
    fabricRef.current.add(obj);
    fabricRef.current.setActiveObject(obj);
    fabricRef.current.renderAll();
    saveToHistory();
  };

  // 使用AI生成的图片
  const useAIImage = (url: string) => {
    addImage(url);
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
            onClick={() => setShowAIPanel(!showAIPanel)}
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
            {selectedObject.type === 'i-text' && (
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
                      canvas?.renderAll();
                      // 不需要更新React状态，canvas已经渲染了新字体
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

            {/* 字体大小 (仅文字) */}
            {selectedObject.type === 'i-text' && (
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
