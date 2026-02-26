'use client';
import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  views: number;
  status: 'published' | 'draft';
  updatedAt: string;
}

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setArticles([
        { id: '1', title: '如何创建项目', category: '使用指南', views: 1250, status: 'published', updatedAt: '2026-02-20' },
        { id: '2', title: '印刷品规格说明', category: '产品介绍', views: 890, status: 'published', updatedAt: '2026-02-18' },
        { id: '3', title: '常见问题FAQ', category: '帮助中心', views: 2100, status: 'published', updatedAt: '2026-02-15' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div style={{ padding: 24 }}><div style={{ height: 400, background: 'white', borderRadius: 12 }}></div></div>;

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>知识库</h1><p style={{ color: '#718096', fontSize: 14 }}>管理帮助文档</p></div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}><Plus size={18} /> 新建文章</button>
      </div>
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8FAFC' }}>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>标题</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>分类</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>浏览</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>状态</th>
            <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th>
          </tr></thead>
          <tbody>
            {articles.map((a, i) => (
              <tr key={a.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: 16 }}><FileText size={18} style={{ color: 'rgb(91, 107, 230)', marginRight: 8 }} /><span style={{ fontWeight: 500, color: '#2D3748' }}>{a.title}</span></td>
                <td style={{ padding: 16, color: '#718096' }}>{a.category}</td>
                <td style={{ padding: 16, color: '#718096' }}>{a.views}</td>
                <td style={{ padding: 16 }}><span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, background: '#D1FAE5', color: '#059669' }}>已发布</span></td>
                <td style={{ padding: 16, textAlign: 'right' }}><button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Eye size={16} /></button><button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button><button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
