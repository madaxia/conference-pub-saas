'use client';

import Link from 'next/link';
import { FileText, Edit, ArrowLeft } from 'lucide-react';

export default function Page() {
  return (
    <div className="document-detail-page" style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {/* 返回按钮 */}
      <Link 
        href="/projects" 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '4px',
          color: '#718096', 
          textDecoration: 'none',
          fontSize: '14px',
          marginBottom: '16px'
        }}
      >
        <ArrowLeft size={18} /> 返回项目
      </Link>

      <h1 className="document-title" style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 24 }}>文档详情</h1>
      
      <div className="document-card" style={{ background: 'white', borderRadius: 16, padding: 32, marginBottom: 24 }}>
        <div className="document-icon" style={{ textAlign: 'center', marginBottom: 16 }}>
          <FileText size={64} style={{ color: 'rgb(91, 107, 230)' }} />
        </div>
        <h2 className="document-name" style={{ fontSize: 18, fontWeight: 600, color: '#2D3748', textAlign: 'center', marginBottom: 8 }}>
          示例文档
        </h2>
        <p className="document-desc" style={{ fontSize: 14, color: '#718096', textAlign: 'center', marginBottom: 24 }}>
          点击下方按钮进入版面编辑器
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <Link 
            href="/projects/1/documents/1/editor"
            className="editor-btn"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '12px 24px',
              background: '#5B6BE6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <Edit size={18} /> 进入编辑器
          </Link>
        </div>
      </div>

      {/* 文档信息 */}
      <div className="document-info" style={{ background: 'white', borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D3748', marginBottom: 16 }}>文档信息</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: '#A0AEC0', marginBottom: 4 }}>文档名称</div>
            <div style={{ fontSize: 14, color: '#2D3748' }}>示例文档</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#A0AEC0', marginBottom: 4 }}>创建时间</div>
            <div style={{ fontSize: 14, color: '#2D3748' }}>2026-01-01</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#A0AEC0', marginBottom: 4 }}>最后编辑</div>
            <div style={{ fontSize: 14, color: '#2D3748' }}>2026-02-25</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#A0AEC0', marginBottom: 4 }}>状态</div>
            <div style={{ 
              display: 'inline-block',
              padding: '4px 10px',
              background: '#D1FAE5',
              color: '#059669',
              borderRadius: 12,
              fontSize: 12,
            }}>
              已保存
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
