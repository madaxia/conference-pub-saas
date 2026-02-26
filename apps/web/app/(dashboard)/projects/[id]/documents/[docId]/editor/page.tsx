'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Type, Square, Circle, Triangle, Image, Download, 
  ZoomIn, ZoomOut, Undo, Redo, Trash2, Move, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Layers, Save, ChevronLeft, ChevronRight
} from 'lucide-react';

// 动态导入 fabric.js (客户端 Only)
let fabric: any = null;

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

  // RGB 转 CMYK (简化版)
  const rgbToCmyk = (r: number, g: number, b: number) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 1 };
    const c = (1 - rNorm - k) / (1 - k);
    const m = (1 - gNorm - k) / (1 - k);
    const y = (1 - bNorm - k) / (1 - k);
    return { c: Math.round(c * 100) / 100, m: Math.round(m * 100) / 100, y: Math.round(y * 100) / 100, k: Math.round(k * 100) / 100 };
  };

  // 导出 PNG (RGB)
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

  // 导出 PDF (CMYK - 印刷用)
  const handleExportPDF = async () => {
    if (!fabricRef.current) return;
    
    try {
      // 动态导入 jsPDF
      const { jsPDF } = await import('jspdf');
      
      // 获取画布数据
      const canvas = fabricRef.current;
      const width = canvas.width || 595;
      const height = canvas.height || 842;
      
      // 创建 PDF (A4: 595 x 842 points)
      const pdf = new jsPDF({
        orientation: height > width ? 'portrait' : 'landscape',
        unit: 'pt',
        format: 'a4',
      });
      
      // 获取画布图像
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2, // 2x 分辨率 for 印刷
      });
      
      // 添加图像到 PDF
      pdf.addImage(dataURL, 'PNG', 0, 0, width, height);
      
      // 添加元数据 (用于印刷)
      pdf.setProperties({
        title: '会议会刊文档',
        subject: '版面设计',
        creator: '会议出版平台',
        keywords: 'conference, publication, print',
      });
      
      // 添加色彩模式标记
      pdf.setFontSize(8);
      pdf.setTextColor(128);
      pdf.text('色彩模式: RGB (建议印刷前转换为 CMYK)', 10, 10);
      
      // 下载
      pdf.save('document-print.pdf');
      
      alert('PDF 已导出！建议印刷厂使用 CMYK 色彩模式进行打印。');
    } catch (error) {
      console.error('导出 PDF 失败:', error);
      alert('导出失败，请重试');
    }
  };

  // 导出按钮点击
  const handleExport = (format: 'png' | 'pdf' = 'png') => {
    if (format === 'pdf') {
      handleExportPDF();
    } else {
      handleExportPNG();
    }
  };

  // 更新选中元素属性
  const updateSelected = (prop: string, value: any) => {
    if (!fabricRef.current || !selectedObject) return;
    selectedObject.set(prop, value);
    fabricRef.current.renderAll();
  };

  if (loading) {
    return (
      <div className="editor-loading" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#F5F7FB'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{
            width: 40, height: 40,
            border: '3px solid #E2E8F0',
            borderTopColor: '#5B6BE6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#718096' }}>加载编辑器...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-editor" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      background: '#F5F7FB'
    }}>
      {/* 顶部工具栏 */}
      <div className="editor-toolbar" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
        zIndex: 100,
      }}>
        {/* 左侧 - 返回和标题 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/projects" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            color: '#718096', 
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            <ChevronLeft size={18} /> 返回
          </a>
          <div style={{ 
            width: '1px', 
            height: '24px', 
            background: '#E2E8F0' 
          }} />
          <h1 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: '#2D3748',
            margin: 0
          }}>
            文档编辑器 - 示例文档
          </h1>
        </div>

        {/* 中间 - 操作按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={undo}
            disabled={historyIndex <= 0}
            style={toolbarButtonStyle}
            title="撤销"
          >
            <Undo size={18} />
          </button>
          <button 
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            style={toolbarButtonStyle}
            title="重做"
          >
            <Redo size={18} />
          </button>
          
          <div style={{ width: '1px', height: '24px', background: '#E2E8F0', margin: '0 8px' }} />
          
          <button 
            onClick={() => handleZoom(-25)}
            style={toolbarButtonStyle}
            title="缩小"
          >
            <ZoomOut size={18} />
          </button>
          <span style={{ 
            fontSize: '13px', 
            color: '#718096',
            minWidth: '50px',
            textAlign: 'center'
          }}>
            {zoom}%
          </span>
          <button 
            onClick={() => handleZoom(25)}
            style={toolbarButtonStyle}
            title="放大"
          >
            <ZoomIn size={18} />
          </button>
          
          <div style={{ width: '1px', height: '24px', background: '#E2E8F0', margin: '0 8px' }} />
          
          <button 
            onClick={deleteSelected}
            disabled={!selectedObject}
            style={{
              ...toolbarButtonStyle,
              opacity: selectedObject ? 1 : 0.4,
            }}
            title="删除"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* 右侧 - 导出按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={saveToHistory}
            style={{
              ...toolbarButtonStyle,
              background: '#F5F7FB',
              border: '1px solid #E2E8F0',
            }}
            title="保存"
          >
            <Save size={18} />
          </button>
          
          {/* 导出菜单 */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => handleExport('pdf')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: '#5B6BE6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Download size={18} /> 导出 PDF
            </button>
          </div>
          
          <button 
            onClick={() => handleExport('png')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'white',
              color: '#5B6BE6',
              border: '1px solid #5B6BE6',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Download size={18} /> PNG
          </button>
        </div>
      </div>

      {/* 主编辑区域 */}
      <div 
        ref={containerRef}
        className="editor-container"
        style={{ 
          display: 'flex', 
          flex: 1, 
          overflow: 'hidden' 
        }}
      >
        {/* 左侧组件面板 */}
        {showLeftPanel && (
          <div className="editor-left-panel" style={{
            width: '260px',
            background: 'white',
            borderRight: '1px solid #E2E8F0',
            padding: '16px',
            overflowY: 'auto',
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              color: '#2D3748',
              marginBottom: '16px'
            }}>
              组件库
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {components.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => addElement(comp.type)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px 12px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: '#E8EAFC',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgb(91, 107, 230)',
                  }}>
                    {comp.icon}
                  </div>
                  <span style={{ fontSize: '13px', color: '#2D3748' }}>
                    {comp.name}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ 
                fontSize: '13px', 
                fontWeight: 600, 
                color: '#718096',
                marginBottom: '12px'
              }}>
                页面尺寸
              </h4>
              <select style={{
                width: '100%',
                padding: '10px 12px',
                background: '#F5F7FB',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#2D3748',
                cursor: 'pointer',
              }}>
                <option>A4 (210 × 297mm)</option>
                <option>A5 (148 × 210mm)</option>
                <option>Letter (8.5 × 11in)</option>
                <option>自定义</option>
              </select>
            </div>
          </div>
        )}

        {/* 中间画布区域 */}
        <div className="editor-canvas-area" style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          background: '#F5F7FB',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* 右侧属性面板 */}
        {showRightPanel && selectedObject && (
          <div className="editor-right-panel" style={{
            width: '280px',
            background: 'white',
            borderLeft: '1px solid #E2E8F0',
            padding: '16px',
            overflowY: 'auto',
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              color: '#2D3748',
              marginBottom: '16px'
            }}>
              属性面板
            </h3>

            {/* 位置 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>位置</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <span style={inputLabelStyle}>X</span>
                  <input 
                    type="number"
                    value={Math.round(selectedObject.left || 0)}
                    onChange={(e) => updateSelected('left', parseInt(e.target.value))}
                    style={inputStyle 
                    }
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={inputLabelStyle}>Y</span>
                  <input 
                    type="number"
                    value={Math.round(selectedObject.top || 0)}
                    onChange={(e) => updateSelected('top', parseInt(e.target.value))}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* 尺寸 */}
            {selectedObject.type !== 'i-text' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>尺寸</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={inputLabelStyle}>宽</span>
                    <input 
                      type="number"
                      value={Math.round(selectedObject.width || 0)}
                      onChange={(e) => updateSelected('width', parseInt(e.target.value))}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={inputLabelStyle}>高</span>
                    <input 
                      type="number"
                      value={Math.round(selectedObject.height || 0)}
                      onChange={(e) => updateSelected('height', parseInt(e.target.value))}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 字体大小 (仅文字) */}
            {selectedObject.type === 'i-text' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>字体大小</label>
                <input 
                  type="number"
                  value={selectedObject.fontSize || 24}
                  onChange={(e) => updateSelected('fontSize', parseInt(e.target.value))}
                  style={inputStyle}
                />
              </div>
            )}

            {/* 填充颜色 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>填充颜色</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="color"
                  value={selectedObject.fill || '#ffffff'}
                  onChange={(e) => updateSelected('fill', e.target.value)}
                  style={{ 
                    width: '40px', 
                    height: '36px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                />
                <input 
                  type="text"
                  value={selectedObject.fill || '#ffffff'}
                  onChange={(e) => updateSelected('fill', e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            </div>

            {/* 边框颜色 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>边框颜色</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="color"
                  value={selectedObject.stroke || '#000000'}
                  onChange={(e) => updateSelected('stroke', e.target.value)}
                  style={{ 
                    width: '40px', 
                    height: '36px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                />
                <input 
                  type="text"
                  value={selectedObject.stroke || '#000000'}
                  onChange={(e) => updateSelected('stroke', e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            </div>

            {/* 边框宽度 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>边框宽度</label>
              <input 
                type="number"
                value={selectedObject.strokeWidth || 0}
                onChange={(e) => updateSelected('strokeWidth', parseInt(e.target.value))}
                style={inputStyle}
              />
            </div>

            {/* 透明度 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>透明度</label>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedObject.opacity || 1}
                onChange={(e) => updateSelected('opacity', parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .document-editor :global(.canvas-container) {
          margin: 0 auto !important;
        }
      `}</style>
    </div>
  );
}

const toolbarButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  background: 'transparent',
  border: 'none',
  borderRadius: '8px',
  color: '#718096',
  cursor: 'pointer',
  transition: 'all 0.2s',
} as React.CSSProperties;

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#718096',
  marginBottom: '8px',
} as React.CSSProperties;

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  background: '#F5F7FB',
  border: '1px solid #E2E8F0',
  borderRadius: '6px',
  fontSize: '13px',
  color: '#2D3748',
  outline: 'none',
} as React.CSSProperties;

const inputLabelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#A0AEC0',
  marginBottom: '4px',
} as React.CSSProperties;
