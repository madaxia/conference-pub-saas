'use client';

import { useState, useEffect } from 'react';
import { Folder, Plus, Search, MoreVertical, Eye, Edit, Trash2, FileText } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  conferenceName?: string;
  status: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/admin/projects', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = projects.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStatusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string; text: string }> = {
      draft: { bg: '#F3F4F6', color: '#6B7280', text: '草稿' },
      review: { bg: '#FEF3C7', color: '#D97706', text: '审稿中' },
      approved: { bg: '#D1FAE5', color: '#059669', text: '已通过' },
      published: { bg: '#DBEAFE', color: '#2563EB', text: '已发布' },
    };
    const s = colors[status] || colors.draft;
    return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', background: s.bg, color: s.color }}>{s.text}</span>;
  };

  if (loading) return <div className="projects-page" style={{ padding: '24px' }}><div style={{ height: '200px', background: 'white', borderRadius: '12px', animation: 'shimmer 1.5s infinite' }}></div></div>;

  return (
    <div className="projects-page" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div><h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>项目管理</h1><p style={{ color: '#718096', fontSize: '14px' }}>管理所有会刊项目</p></div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#5B6BE6', color: 'white', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}><Plus size={18} /> 创建项目</button>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}><Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} /><input type="text" placeholder="搜索项目..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} /></div>
      </div>
      <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {filtered.map(project => (
          <div key={project.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '48px', height: '48px', background: '#E8EAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "rgb(91, 107, 230)" }}><Folder size={24} /></div>
              {getStatusBadge(project.status)}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>{project.name || '未命名项目'}</h3>
            <p style={{ fontSize: '13px', color: '#718096', marginBottom: '12px' }}>{project.conferenceName || '会议项目'}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, padding: '8px', background: '#F5F7FB', borderRadius: '6px', border: 'none', color: "rgb(91, 107, 230)", fontSize: '13px', cursor: 'pointer' }}>查看</button>
              <button style={{ padding: '8px 12px', background: '#F5F7FB', borderRadius: '6px', border: 'none', color: '#718096', cursor: 'pointer' }}><MoreVertical size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div style={{ padding: '60px', textAlign: 'center', color: '#718096' }}>暂无项目</div>}
    </div>
  );
}
