'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Book, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Menu, X, Home, ChevronDown, Search } from 'lucide-react';

interface Page {
  id: number;
  content: string;
  imageUrl?: string;
}

export default function EbookReaderPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);
  const [zoom, setZoom] = useState(100);
  const [showToc, setShowToc] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Demo pages
  const pages: Page[] = [
    { id: 1, content: '封面' },
    { id: 2, content: '目录' },
    { id: 3, content: '前言' },
    { id: 4, content: '第一章：会议概述' },
    { id: 5, content: '第二章：主题演讲' },
    { id: 6, content: '第三章：技术研讨' },
    { id: 7, content: '第四章：产业论坛' },
    { id: 8, content: '第五章：圆桌对话' },
    { id: 9, content: '第六章：展览展示' },
    { id: 10, content: '第七章：总结与展望' },
    { id: 11, content: '附录' },
    { id: 12, content: '后记' },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(150, zoom + 25));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(50, zoom - 25));
  };

  const toc = [
    { title: '封面', page: 1 },
    { title: '目录', page: 2 },
    { title: '前言', page: 3 },
    { title: '第一章：会议概述', page: 4 },
    { title: '第二章：主题演讲', page: 5 },
    { title: '第三章：技术研讨', page: 6 },
    { title: '第四章：产业论坛', page: 7 },
    { title: '第五章：圆桌对话', page: 8 },
    { title: '第六章：展览展示', page: 9 },
    { title: '第七章：总结与展望', page: 10 },
    { title: '附录', page: 11 },
    { title: '后记', page: 12 },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F5F7FB' }}>
        <div style={{ textAlign: 'center' }}>
          <Book size={48} style={{ color: 'rgb(91, 107, 230)', marginBottom: 16 }} />
          <p style={{ color: '#718096' }}>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F5F7FB' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'white', borderBottom: '1px solid #E2E8F0', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/ebooks" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#718096', textDecoration: 'none', fontSize: '14px' }}>
            <ChevronLeft size={18} /> 返回
          </Link>
          <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />
          <h1 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748' }}>2026国际会议会刊</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={handleZoomOut} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer' }}>
            <ZoomOut size={18} style={{ color: '#718096' }} />
          </button>
          <span style={{ fontSize: '13px', color: '#718096', minWidth: '45px', textAlign: 'center' }}>{zoom}%</span>
          <button onClick={handleZoomIn} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer' }}>
            <ZoomIn size={18} style={{ color: '#718096' }} />
          </button>
          
          <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />
          
          <button onClick={() => setShowToc(!showToc)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', background: showToc ? 'rgb(91, 107, 230)' : '#F5F7FB', color: showToc ? 'white' : '#718096', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <Menu size={16} /> 目录
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* TOC Sidebar */}
        {showToc && (
          <div style={{ width: '280px', background: 'white', borderRight: '1px solid #E2E8F0', overflowY: 'auto', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#2D3748', marginBottom: '16px' }}>目录</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {toc.map((item, index) => (
                <button
                  key={index}
                  onClick={() => { setCurrentPage(item.page); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: currentPage === item.page ? '#E8EAFC' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '13px', color: currentPage === item.page ? 'rgb(91, 107, 230)' : '#2D3748', fontWeight: currentPage === item.page ? 500 : 400 }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: '12px', color: '#A0AEC0' }}>{item.page}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reader Area */}
        <div ref={containerRef} style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: `${(595 * zoom) / 100}px`, 
            height: `${(842 * zoom) / 100}px`,
            maxWidth: '100%',
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Page Content */}
            <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Book size={80} style={{ color: 'rgb(91, 107, 230)', marginBottom: '24px' }} />
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '16px' }}>
                {pages[currentPage - 1]?.content || '第 ' + currentPage + ' 页'}
              </h2>
              <p style={{ fontSize: '14px', color: '#718096', textAlign: 'center', maxWidth: '400px' }}>
                这是电子书阅读器的演示页面。实际使用时，这里会显示文档的实际内容。
              </p>
            </div>
            
            {/* Page Number */}
            <div style={{ padding: '12px', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#A0AEC0' }}>第 {currentPage} 页 / 共 {totalPages} 页</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', background: 'white', borderTop: '1px solid #E2E8F0', gap: '16px' }}>
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '8px 16px', 
            background: currentPage === 1 ? '#F3F4F6' : 'rgb(91, 107, 230)',
            color: currentPage === 1 ? '#A0AEC0' : 'white',
            border: 'none', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          <ChevronLeft size={18} /> 上一页
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="number" 
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) setCurrentPage(page);
            }}
            style={{ width: '50px', padding: '6px', textAlign: 'center', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px' }}
          />
          <span style={{ fontSize: '14px', color: '#718096' }}>/ {totalPages}</span>
        </div>
        
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '8px 16px', 
            background: currentPage === totalPages ? '#F3F4F6' : 'rgb(91, 107, 230)',
            color: currentPage === totalPages ? '#A0AEC0' : 'white',
            border: 'none', borderRadius: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          下一页 <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
