'use client';

import { useState, useEffect, useRef } from 'react';

interface AIAssistantProps {
  onGenerate?: (prompt: string, type: 'text' | 'image', options?: any) => void;
  points?: number;
}

export default function AIAssistant({ onGenerate, points = 0 }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 200 });
  const [tool, setTool] = useState<'select' | 'input'>('select');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  
  // Image options
  const [imgWidth, setImgWidth] = useState(800);
  const [imgHeight, setImgHeight] = useState(600);
  const [imgZoom, setImgZoom] = useState(100);
  
  // Text options
  const [fontFamily, setFontFamily] = useState('思源黑体');
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState('normal');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  
  const dragRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - startPos.current.x,
        y: Math.max(0, e.clientY - startPos.current.y)
      });
    };
    
    const handleMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setResults([]);
    setSelectedResult(null);
    
    // Simulate AI generation (2-4 results)
    await new Promise(r => setTimeout(r, 2000));
    
    const demoResults = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, i) => ({
      id: i,
      type: tool === 'select' ? 'image' : 'text',
      content: tool === 'select' 
        ? `https://picsum.photos/${imgWidth}/${imgHeight}?random=${Date.now()}${i}`
        : `这是AI生成的第${i+1}个文案方案${prompt.slice(0, 10)}...`,
      textOptions: tool === 'input' ? {
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight,
        letterSpacing,
      } : undefined,
    }));
    
    setResults(demoResults);
    setGenerating(false);
  };

  const handleApply = () => {
    if (selectedResult === null || !onGenerate) return;
    const result = results[selectedResult];
    onGenerate(prompt, tool === 'select' ? 'image' : 'text', {
      ...result,
      imgWidth: imgWidth * imgZoom / 100,
      imgHeight: imgHeight * imgZoom / 100,
      textOptions: result.textOptions,
    });
    setIsOpen(false);
    setPrompt('');
    setResults([]);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        ref={dragRef}
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          right: position.x,
          top: position.y,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #A259FF 0%, #7B61FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          cursor: isDragging ? 'grabbing' : 'grab',
          boxShadow: '0 8px 32px rgba(162, 89, 255, 0.4)',
          zIndex: 1000,
          userSelect: 'none',
          transition: isDragging ? 'none' : 'transform 0.2s',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
        }}
        title="AI助手"
      >
        🤖
        {points > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#FF5252',
            color: 'white',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '10px',
          }}>
            {points}
          </span>
        )}
      </div>

      {/* Side Panel */}
      <div style={{
        position: 'fixed',
        right: isOpen ? 0 : '-400px',
        top: 0,
        width: '400px',
        height: '100vh',
        background: '#161616',
        boxShadow: '-4px 0 32px rgba(0,0,0,0.5)',
        transition: 'right 0.3s ease',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #2A2A2A',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>🤖 AI排版助手</h2>
          <button onClick={() => setIsOpen(false)} style={{
            background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer',
          }}>✕</button>
        </div>

        {/* Tool Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #2A2A2A' }}>
          <button
            onClick={() => setTool('select')}
            style={{
              flex: 1, padding: '14px', background: 'none', border: 'none',
              color: tool === 'select' ? '#A259FF' : '#888',
              borderBottom: tool === 'select' ? '2px solid #A259FF' : '2px solid transparent',
              cursor: 'pointer', fontSize: '14px',
            }}
          >
            🎯 选择工具
          </button>
          <button
            onClick={() => setTool('input')}
            style={{
              flex: 1, padding: '14px', background: 'none', border: 'none',
              color: tool === 'input' ? '#A259FF' : '#888',
              borderBottom: tool === 'input' ? '2px solid #A259FF' : '2px solid transparent',
              cursor: 'pointer', fontSize: '14px',
            }}
          >
            ✏️ 输入工具
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {/* Image Options (when select tool) */}
          {tool === 'select' && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '12px' }}>🖼️ 图片设置</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ color: '#888', fontSize: '12px' }}>宽度 (px)</label>
                  <input
                    type="number"
                    value={imgWidth}
                    onChange={(e) => setImgWidth(Number(e.target.value))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '12px' }}>高度 (px)</label>
                  <input
                    type="number"
                    value={imgHeight}
                    onChange={(e) => setImgHeight(Number(e.target.value))}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <label style={{ color: '#888', fontSize: '12px' }}>缩放: {imgZoom}%</label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={imgZoom}
                  onChange={(e) => setImgZoom(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>
            </div>
          )}

          {/* Text Options (when input tool) */}
          {tool === 'input' && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '12px' }}>📝 文字设置</h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ color: '#888', fontSize: '12px' }}>字体</label>
                  <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={inputStyle}>
                    <option value="思源黑体">思源黑体</option>
                    <option value="思源宋体">思源宋体</option>
                    <option value="站酷高端黑">站酷高端黑</option>
                    <option value="阿里巴巴普惠体">阿里巴巴普惠体</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ color: '#888', fontSize: '12px' }}>字号</label>
                    <input
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: '12px' }}>字重</label>
                    <select value={fontWeight} onChange={(e) => setFontWeight(e.target.value)} style={inputStyle}>
                      <option value="normal">正常</option>
                      <option value="bold">粗体</option>
                      <option value="lighter">细体</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ color: '#888', fontSize: '12px' }}>行距</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lineHeight}
                      onChange={(e) => setLineHeight(Number(e.target.value))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#888', fontSize: '12px' }}>字间距</label>
                    <input
                      type="number"
                      value={letterSpacing}
                      onChange={(e) => setLetterSpacing(Number(e.target.value))}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Prompt Input */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '12px' }}>
              💡 {tool === 'select' ? '描述你想要的图片' : '描述你想要的内容'}
            </h4>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={tool === 'select' 
                ? '例如：科技感会议背景，现代简约风格...' 
                : '例如：生成一段会议开场白...'}
              style={{
                width: '100%', height: '120px', padding: '12px',
                background: '#1A1A1A', border: '1px solid #333',
                borderRadius: '8px', color: '#fff', fontSize: '14px',
                resize: 'none', outline: 'none',
              }}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            style={{
              width: '100%', padding: '14px',
              background: generating ? '#444' : 'linear-gradient(135deg, #A259FF 0%, #7B61FF 100%)',
              border: 'none', borderRadius: '8px',
              color: '#fff', fontSize: '15px', fontWeight: 600,
              cursor: generating ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
            }}
          >
            {generating ? '🤔 AI生成中...' : '🚀 生成 (消耗10积分)'}
          </button>

          {/* Results */}
          {results.length > 0 && (
            <div>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '12px' }}>
                📋 选择结果 (点击选择一个)
              </h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                {results.map((result, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedResult(i)}
                    style={{
                      padding: '12px',
                      background: selectedResult === i ? 'rgba(162, 89, 255, 0.2)' : '#1A1A1A',
                      border: selectedResult === i ? '2px solid #A259FF' : '1px solid #333',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {result.type === 'image' ? (
                      <img
                        src={result.content}
                        alt={`Option ${i + 1}`}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <p style={{ color: '#fff', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
                        {result.content}
                      </p>
                    )}
                    <div style={{ color: '#A259FF', fontSize: '12px', marginTop: '8px' }}>
                      选项 {i + 1}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleApply}
                disabled={selectedResult === null}
                style={{
                  width: '100%', padding: '14px', marginTop: '16px',
                  background: selectedResult === null ? '#444' : '#4CAF50',
                  border: 'none', borderRadius: '8px',
                  color: '#fff', fontSize: '15px', fontWeight: 600,
                  cursor: selectedResult === null ? 'not-allowed' : 'pointer',
                }}
              >
                ✅ 应用所选结果
              </button>
            </div>
          )}
        </div>

        {/* Points Info */}
        <div style={{
          padding: '16px', borderTop: '1px solid #2A2A2A',
          color: '#888', fontSize: '13px', textAlign: 'center',
        }}>
          💰 当前积分: <span style={{ color: '#A259FF' }}>{points}</span>
        </div>
      </div>

      <style jsx>{`
        * { box-sizing: border-box; }
      `}</style>
    </>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: '#1A1A1A',
  border: '1px solid #333',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
} as React.CSSProperties;
