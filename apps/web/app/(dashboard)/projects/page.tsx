'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Folder, Plus, FileText, Calendar, Search, X, Layout, Upload } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  conferenceName: string;
  issueDate: string;
  status: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/projects', {
        headers: token ? { Authorization: 'Bearer ' + token } : {},
      });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromTemplate = async () => {
    if (!newProjectName.trim()) return;
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
        body: JSON.stringify({ name: newProjectName }),
      });
      const project = await res.json();
      setShowCreateModal(false);
      setNewProjectName('');
      router.push('/projects/' + project.id + '/templates');
    } catch (e) {
      setError('创建项目失败');
    } finally {
      setCreating(false);
    }
  };

  const handleImportPDF = async () => {
    if (!newProjectName.trim()) return;
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
        body: JSON.stringify({ name: newProjectName }),
      });
      const project = await res.json();
      setShowCreateModal(false);
      setNewProjectName('');
      router.push('/projects/' + project.id + '/import');
    } catch (e) {
      setError('创建项目失败');
    } finally {
      setCreating(false);
    }
  };

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

  if (loading) {
    return (
      <div className="projects-page" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ height: '32px', width: '120px', background: '#E2E8F0', borderRadius: '6px', marginBottom: '8px' }}></div>
          <div style={{ height: '20px', width: '200px', background: '#E2E8F0', borderRadius: '6px' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
              <div style={{ height: '20px', width: '60%', background: '#E2E8F0', borderRadius: '6px', marginBottom: '12px' }}></div>
              <div style={{ height: '16px', width: '40%', background: '#E2E8F0', borderRadius: '6px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>项目管理</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>管理您的会刊项目</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', background: '#5B6BE6', color: 'white',
            border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
          }}
        >
          <Plus size={18} /> 创建项目
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px', background: '#FDECEC', borderRadius: '8px', color: '#F4726B', marginBottom: '16px' }}>
          {error}
        </div>
      )}

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
      </div>

      {filteredProjects.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {filteredProjects.map((project) => {
            const statusStyle = getStatusColor(project.status);
            return (
              <div key={project.id} className="project-card" style={{
                background: 'white', borderRadius: '12px', padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: 'pointer'
              }}
              onClick={() => router.push('/projects/' + project.id)}
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
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '16px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📁</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>
            {searchTerm ? '未找到匹配项目' : '暂无项目'}
          </h3>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px' }}>
            {searchTerm ? '尝试使用其他搜索词' : '创建您的第一个会刊项目'}
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', background: '#5B6BE6', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
            }}
          >
            <Plus size={18} /> 创建项目
          </button>
        </div>
      )}

      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2D3748', margin: 0 }}>创建新项目</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#4A5568', marginBottom: '8px' }}>
                项目名称
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="请输入项目名称"
                style={{
                  width: '100%', padding: '12px',
                  border: '1px solid #E2E8F0', borderRadius: '8px',
                  fontSize: '14px', outline: 'none'
                }}
                autoFocus
              />
            </div>

            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '16px' }}>选择创建方式：</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button
                onClick={handleCreateFromTemplate}
                disabled={creating || !newProjectName.trim()}
                style={{
                  padding: '24px', background: '#F8FAFC', border: '2px solid #E2E8F0',
                  borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                  opacity: creating || !newProjectName.trim() ? 0.5 : 1
                }}
              >
                <div style={{ width: '48px', height: '48px', background: '#E8EAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Layout size={24} style={{ color: '#5B6BE6' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginBottom: '4px' }}>从模板创建</h3>
                <p style={{ fontSize: '13px', color: '#718096', margin: 0 }}>选择预设模板开始设计</p>
              </button>

              <button
                onClick={handleImportPDF}
                disabled={creating || !newProjectName.trim()}
                style={{
                  padding: '24px', background: '#F8FAFC', border: '2px solid #E2E8F0',
                  borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                  opacity: creating || !newProjectName.trim() ? 0.5 : 1
                }}
              >
                <div style={{ width: '48px', height: '48px', background: '#E8EAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Upload size={24} style={{ color: '#5B6BE6' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginBottom: '4px' }}>导入 PDF</h3>
                <p style={{ fontSize: '13px', color: '#718096', margin: 0 }}>上传PDF文件自动分页编辑</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
