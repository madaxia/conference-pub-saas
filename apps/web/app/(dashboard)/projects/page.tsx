'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Folder, Plus, FileText, Calendar, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  conferenceName: string;
  issueDate: string;
  status: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/projects', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  // Filter projects by search
  const filteredProjects = projects.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.conferenceName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      draft: { bg: '#F3F4F6', text: '#6B7280' },
      review: { bg: '#FEF3C7', text: '#D97706' },
      approved: { bg: '#D1FAE5', text: '#059669' },
      published: { bg: '#DBEAFE', text: '#2563EB' },
      archived: { bg: '#F3F4F6', text: '#6B7280' },
    };
    return colors[status] || colors.draft;
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      draft: '草稿',
      review: '审稿中',
      approved: '已通过',
      published: '已发布',
      archived: '已归档',
    };
    return texts[status] || status;
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ height: '32px', width: '120px', background: '#E2E8F0', borderRadius: '6px', marginBottom: '8px' }}></div>
          <div style={{ height: '20px', width: '200px', background: '#E2E8F0', borderRadius: '6px' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', animation: 'shimmer 1.5s infinite' }}>
              <div style={{ height: '20px', width: '60%', background: '#E2E8F0', borderRadius: '6px', marginBottom: '12px' }}></div>
              <div style={{ height: '16px', width: '40%', background: '#E2E8F0', borderRadius: '6px' }}></div>
            </div>
          ))}
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>
            项目管理
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            管理您的会刊项目
          </p>
        </div>
        <Link href="/projects/new" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px 20px', background: '#5B6BE6', color: 'white',
          borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500
        }}>
          <Plus size={18} /> 创建项目
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div style={{ padding: '12px', background: '#FDECEC', borderRadius: '8px', color: '#F4726B', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '12px 12px 12px 40px',
              background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px',
              fontSize: '14px', outline: 'none'
            }}
          />
        </div>
        <button style={{
          padding: '12px 16px', background: 'white', border: '1px solid #E2E8F0',
          borderRadius: '8px', color: '#718096', fontSize: '14px',
          display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
        }}>
          <Filter size={18} /> 筛选
        </button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {filteredProjects.map((project) => {
            const statusStyle = getStatusColor(project.status);
            return (
              <div key={project.id} style={{
                background: 'white', borderRadius: '12px', padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    width: '48px', height: '48px', background: '#E8EAFC', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: "rgb(91, 107, 230)"
                  }}>
                    <Folder size={24} />
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                    background: statusStyle.bg, color: statusStyle.text, fontWeight: 500
                  }}>
                    {getStatusText(project.status)}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>
                  {project.name || '未命名项目'}
                </h3>
                
                <p style={{ fontSize: '13px', color: '#718096', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> {project.issueDate ? new Date(project.issueDate).toLocaleDateString('zh-CN') : '未设置日期'}
                </p>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={`/projects/${project.id}`} style={{
                    flex: 1, padding: '8px', background: '#F5F7FB', borderRadius: '6px',
                    color: "rgb(91, 107, 230)", fontSize: '13px', textAlign: 'center', textDecoration: 'none'
                  }}>
                    查看
                  </Link>
                  <button style={{
                    padding: '8px 12px', background: '#F5F7FB', border: 'none', borderRadius: '6px',
                    color: '#718096', cursor: 'pointer'
                  }}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          textAlign: 'center', padding: '80px 20px', background: 'white',
          borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📁</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>
            {searchTerm ? '未找到匹配项目' : '暂无项目'}
          </h3>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px' }}>
            {searchTerm ? '尝试使用其他搜索词' : '创建您的第一个会刊项目'}
          </p>
          <Link href="/projects/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', background: '#5B6BE6', color: 'white',
            borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500
          }}>
            <Plus size={18} /> 创建项目
          </Link>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
