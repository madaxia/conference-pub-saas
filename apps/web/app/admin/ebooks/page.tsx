'use client';

import { useState, useEffect } from 'react';
import { Book, Plus, Upload, FileText, Trash2, Edit, Eye, Download, Search, Filter } from 'lucide-react';

interface Ebook {
  id: string;
  name: string;
  projectName: string;
  status: string;
  pages: number;
  createdAt: string;
  downloads: number;
}

export default function Page() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    setLoading(true);
    // Demo data
    setTimeout(() => {
      setEbooks([
        { id: '1', name: '2026国际会议会刊', projectName: '2026国际会议', status: 'published', pages: 156, createdAt: '2026-01-15', downloads: 234 },
        { id: '2', name: '技术研讨会论文集', projectName: '技术研讨会', status: 'draft', pages: 89, createdAt: '2026-02-01', downloads: 0 },
        { id: '3', name: '产业论坛报告', projectName: '产业论坛', status: 'published', pages: 45, createdAt: '2026-02-10', downloads: 56 },
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; text: string }> = {
      published: { bg: '#D1FAE5', color: '#059669', text: '已发布' },
      draft: { bg: '#FEF3C7', color: '#D97706', text: '草稿' },
      archived: { bg: '#F3F4F6', color: '#6B7280', text: '已归档' },
    };
    const s = styles[status] || styles.draft;
    return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', background: s.bg, color: s.color }}>{s.text}</span>;
  };

  const filteredEbooks = ebooks.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ height: 400, background: 'white', borderRadius: 12 }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>电子书管理</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>管理所有电子书和出版物</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer' }}>
            <Upload size={18} style={{ color: 'rgb(91, 107, 230)' }} /> 导入PDF
          </button>
          <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
            <Plus size={18} /> 创建电子书
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
          <input
            type="text"
            placeholder="搜索电子书..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none' }}
          />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer' }}>
          <Filter size={18} style={{ color: '#718096' }} /> 筛选
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>电子书</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>关联项目</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>状态</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>页数</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>下载量</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>创建时间</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredEbooks.map((ebook, index) => (
              <tr key={ebook.id} style={{ borderTop: index > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: '#E8EAFC', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Book size={20} style={{ color: 'rgb(91, 107, 230)' }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#2D3748' }}>{ebook.name}</span>
                  </div>
                </td>
                <td style={{ padding: 16, fontSize: 14, color: '#718096' }}>{ebook.projectName}</td>
                <td style={{ padding: 16 }}>{getStatusBadge(ebook.status)}</td>
                <td style={{ padding: 16, fontSize: 14, color: '#2D3748' }}>{ebook.pages}页</td>
                <td style={{ padding: 16, fontSize: 14, color: '#2D3748' }}>{ebook.downloads}</td>
                <td style={{ padding: 16, fontSize: 14, color: '#718096' }}>{ebook.createdAt}</td>
                <td style={{ padding: 16, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Eye size={16} /></button>
                    <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Download size={16} /></button>
                    <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button>
                    <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{ebooks.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>电子书总数</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{ebooks.filter(e => e.status === 'published').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>已发布</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#D97706' }}>{ebooks.filter(e => e.status === 'draft').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>草稿</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'rgb(91, 107, 230)' }}>{ebooks.reduce((a, b) => a + b.downloads, 0)}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>总下载量</div>
        </div>
      </div>
    </div>
  );
}
