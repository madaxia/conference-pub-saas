'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Type, Square, Circle, Triangle, Image, Download, 
  ZoomIn, ZoomOut, Undo, Redo, Trash2, Move, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Layers, Save, ChevronLeft, ChevronRight, Wand2,
  Sparkles, ImagePlus, Loader2
} from 'lucide-react';

// 动态导入 fabric.js (客户端 Only)
let fabric: any = null;

// 可用字体列表
const fonts = [
  { value: 'SimHei', label: '黑体' },
  { value: 'SimSun', label: '宋体' },
  { value: 'Microsoft YaHei', label: '微软雅黑' },
  { value: 'KaiTi', label: '楷体' },
  { value: 'FangSong', label: '仿宋' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
];

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

export default function EditorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  
  // AI 状态
  const [aiType, setAiType] = useState<AIGenerateType>('text');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<any[]>([]);

  // 初始化 Fabric.js
  useEffect(() => {
    const initFabric = async () => {
      try {
        const fabricModule = await import('fabric');
        fabric = fabricModule.fabric;
        
        if (canvasRef.current && containerRef.current) {
          const containerWidth = containerRef.current.clientWidth - (showLeftPanel ? 280 : 0) - (showRightPanel ? 280 : 0);
          const canvas = new fabric.Canvas(canvasRef.current, {
            width: Math.max(600, containerWidth - 48),
            height: 800,
            backgroundColor: '#FFFFFF',
            selection: true,
            preserveObjectStacking: true,
          });

          // 添加网格线
          for (let i = 0; i < 800; i += 50) {
            const lineH = new fabric.Line([0, i, 2000, i], {
              stroke: '#E5E7EB',
              strokeWidth: 1,
              selectable: false,
              evented: false,
            });
            const lineV = new fabric.Line([i, 0, i, 1200], {
              stroke: '#E5E7EB',
              strokeWidth: 1,
              selectable: false,
              evented: false,
            });
            canvas.add(lineH, lineV);
            canvas.sendObjectToBack(lineH);
            canvas.sendObjectToBack(lineV);
          }

          // 添加示例文字
          const title = new fabric.IText('标题文字', {
            left: 100,
            top: 80,
            fontSize: 32,
            fontFamily: 'SimHei, sans-serif',
            fill: '#2D3748',
            fontWeight: 'bold',
          });
          canvas.add(title);

          const subtitle = new fabric.IText('副标题内容示例', {
            left: 100,
            top: 140,
            fontSize: 18,
            fontFamily: 'SimHei, sans-serif',
            fill: '#718096',
          });
          canvas.add(subtitle);

          fabricRef.current = canvas;
          
          // 监听选中事件
          canvas.on('selection:created', (e: any) => setSelectedObject(e.selected[0]));
          canvas.on('selection:updated', (e: any) => setSelectedObject(e.selected[0]));
          canvas.on('selection:cleared', () => setSelectedObject(null));
          
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
    
    fabric.Image.fromURL(url, (img: any) => {
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
      const { jsPDF } = await import('jspdf');
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
    selectedObject.set(prop, value);
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
      
      if (res.ok) {
        const data = await res.json();
        setAiResults(data.results || []);
      } if (true) { // Force demo mode
        // Demo mode when API fails
        setAiResults(getDemoResults(aiType));
      }
    } catch (error) {
      console.error('AI生成失败,使用演示模式:', error);
      // Demo mode fallback
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
    } if (true) { // Force demo mode
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
          <div style={{ width: 40, height: 40, border: '3px solid #E2E8F0', borderTopColor: '#5B6BE6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#718096' }}>加载编辑器...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F5F7FB' }}>
      {/* 顶部工具栏 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'white', borderBottom: '1px solid #E2E8F0', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/projects" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#718096', textDecoration: 'none', fontSize: '14px' }}>
            <ChevronLeft size={18} /> 返回
          </a>
          <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />
          <h1 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', margin: 0 }}>
            文档编辑器 - 示例文档
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={undo} disabled={historyIndex <= 0} style={toolbarButtonStyle} title="撤销">
            <Undo size={18} />
          </button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} style={toolbarButtonStyle} title="重做">
            <Redo size={18} />
          </button>
          
          <div style={{ width: '1px', height: '24px', background: '#E2E8F0', margin: '0 8px' }} />
          
          <button onClick={() => handleZoom(-10)} style={toolbarButtonStyle} title="缩小">
            <ZoomOut size={18} />
          </button>
          <span style={{ fontSize: '13px', color: '#718096', minWidth: '50px', textAlign: 'center' }}>{zoom}%</span>
          <button onClick={() => handleZoom(10)} style={toolbarButtonStyle} title="放大">
            <ZoomIn size={18} />
          </button>
          
          <div style={{ width: '1px', height: '24px', background: '#E2E8F0', margin: '0 8px' }} />
          
          <button onClick={deleteSelected} disabled={!selectedObject} style={{ ...toolbarButtonStyle, opacity: selectedObject ? 1 : 0.4 }} title="删除">
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
          <button onClick={saveToHistory} style={{ ...toolbarButtonStyle, background: '#F5F7FB', border: '1px solid #E2E8F0' }} title="保存">
            <Save size={18} />
          </button>
          <button onClick={handleExportPDF} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#5B6BE6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            <Download size={18} /> 导出 PDF
          </button>
          <button onClick={handleExportPNG} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'white', color: '#5B6BE6', border: '1px solid #5B6BE6', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            <Download size={18} /> PNG
          </button>
        </div>
      </div>

      {/* 主编辑区域 */}
      <div ref={containerRef} style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左侧组件面板 */}
        {showLeftPanel && (
          <div style={{ width: '260px', background: 'white', borderRight: '1px solid #E2E8F0', padding: '16px', overflowY: 'auto' }}>
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
              <select style={{ width: '100%', padding: '10px 12px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', color: '#2D3748', cursor: 'pointer' }}>
                <option>A4 (210 × 297mm)</option>
                <option>A5 (148 × 210mm)</option>
                <option>Letter (8.5 × 11in)</option>
                <option>自定义</option>
              </select>
            </div>
          </div>
        )}

        {/* 中间画布区域 */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px', background: '#F5F7FB', display: 'flex', justifyContent: 'center' }}>
          <div style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* AI 面板 */}
        {showAIPanel && (
          <div style={{ width: '320px', background: 'white', borderLeft: '1px solid #E2E8F0', padding: '16px', overflowY: 'auto' }}>
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
                  value={selectedObject.fontFamily?.split(',')[0] || 'SimHei'}
                  onChange={(e) => updateSelected('fontFamily', e.target.value)}
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
