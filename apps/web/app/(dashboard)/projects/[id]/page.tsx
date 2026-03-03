'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Plus, FileText, Settings, Trash2, 
  Edit, Copy, Download, MoreVertical, Calendar,
  Users, Clock, AlertCircle
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectDetail {
  id: string;
  name: string;
  conferenceName: string;
  issueDate: string;
  status: string;
  projectType: string;
  createdAt: string;
  updatedAt: string;
  owner: { id: string; name: string; email: string };
  documents: Document[];
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateDoc, setShowCreateDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/projects/${projectId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to load project');
      const data = await res.json();
      setProject(data);
    } catch (e: any) {
      setError(e.message || '加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          projectId,
          title: newDocTitle,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to create document');
      
      const doc = await res.json();
      setShowCreateDoc(false);
      setNewDocTitle('');
      
      // Navigate to the new document editor
      router.push(`/projects/${projectId}/documents/${doc.id}/editor`);
    } catch (e: any) {
      setError(e.message || '创建文档失败');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/projects/${projectId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!res.ok) throw new Error('Failed to delete project');
      
      router.push('/projects');
    } catch (e: any) {
      setError(e.message || '删除项目失败');
    }
  };

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

  const getDocStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      draft: { bg: '#F3F4F6', text: '#6B7280' },
      editing: { bg: '#DBEAFE', text: '#2563EB' },
      review: { bg: '#FEF3C7', text: '#D97706' },
      completed: { bg: '#D1FAE5', text: '#059669' },
    };
    return colors[status] || colors.draft;
  };

  const getDocStatusText = (status: string) => {
    const texts: Record<string, string> = {
      draft: '草稿',
      editing: '编辑中',
      review: '审稿中',
      completed: '已完成',
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ height: '200px', background: '#E2E8F0', borderRadius: '12px', animation: 'shimmer 1.5s infinite' }}></div>
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

  if (error && !project) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ 
          padding: '24px', 
          background: '#FDECEC', 
          borderRadius: '12px', 
          color: '#F4726B',
          textAlign: 'center'
        }}>
          <AlertCircle size={48} style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>加载失败</h3>
          <p>{error}</p>
          <Link href="/projects" style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            marginTop: '16px', padding: '10px 20px', 
            background: '#5B6BE6', color: 'white',
            borderRadius: '8px', textDecoration: 'none'
          }}>
            <ArrowLeft size={18} /> 返回项目列表
          </Link>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const statusStyle = getStatusColor(project.status);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
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
          <ArrowLeft size={18} /> 返回项目列表
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748', margin: 0 }}>
                {project.name}
              </h1>
              <span style={{
                padding: '4px 12px', borderRadius: '12px', fontSize: '13px',
                background: statusStyle.bg, color: statusStyle.text, fontWeight: 500
              }}>
                {getStatusText(project.status)}
              </span>
            </div>
            <p style={{ color: '#718096', fontSize: '15px', margin: 0 }}>
              {project.conferenceName} · {project.owner?.name || '未知'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link 
              href={`/projects/${projectId}/settings`}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 16px', background: 'white', 
                border: '1px solid #E2E8F0', borderRadius: '8px',
                color: '#718096', textDecoration: 'none', fontSize: '14px'
              }}
            >
              <Settings size={18} /> 设置
            </Link>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 16px', background: 'white', 
                border: '1px solid #FECACA', borderRadius: '8px',
                color: '#F4726B', fontSize: '14px', cursor: 'pointer'
              }}
            >
              <Trash2 size={18} /> 删除
            </button>
          </div>
        </div>
      </div>

      {/* Project Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', background: '#E8EAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} style={{ color: 'rgb(91, 107, 230)' }} />
            </div>
            <span style={{ color: '#718096', fontSize: '14px' }}>发行日期</span>
          </div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', margin: 0 }}>
            {project.issueDate ? new Date(project.issueDate).toLocaleDateString('zh-CN') : '未设置'}
          </p>
        </div>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', background: '#E8EAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} style={{ color: 'rgb(91, 107, 230)' }} />
            </div>
            <span style={{ color: '#718096', fontSize: '14px' }}>文档数量</span>
          </div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', margin: 0 }}>
            {project.documents?.length || 0} 个
          </p>
        </div>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', background: '#E8EAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} style={{ color: 'rgb(91, 107, 230)' }} />
            </div>
            <span style={{ color: '#718096', fontSize: '14px' }}>创建时间</span>
          </div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', margin: 0 }}>
            {project.createdAt ? new Date(project.createdAt).toLocaleDateString('zh-CN') : '-'}
          </p>
        </div>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', background: '#E8EAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} style={{ color: 'rgb(91, 107, 230)' }} />
            </div>
            <span style={{ color: '#718096', fontSize: '14px' }}>项目类型</span>
          </div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', margin: 0 }}>
            {project.projectType === 'personal' ? '个人' : '企业'}
          </p>
        </div>
      </div>

      {/* Documents Section */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', margin: 0 }}>
            文档列表
          </h2>
          <button 
            onClick={() => setShowCreateDoc(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', background: '#5B6BE6',
              border: 'none', borderRadius: '8px',
              color: 'white', fontSize: '14px', fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Plus size={18} /> 新建文档
          </button>
        </div>

        {project.documents && project.documents.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {project.documents.map((doc) => {
              const docStatusStyle = getDocStatusColor(doc.status);
              return (
                <Link 
                  key={doc.id} 
                  href={`/projects/${projectId}/documents/${doc.id}/editor`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: '#F8FAFC', borderRadius: '12px', padding: '20px',
                    border: '1px solid #E2E8F0', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                    (e.target as HTMLElement).style.borderColor = '#5B6BE6';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLElement).style.boxShadow = 'none';
                    (e.target as HTMLElement).style.borderColor = '#E2E8F0';
                  }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{
                        width: '44px', height: '44px', background: 'white', 
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <FileText size={22} style={{ color: 'rgb(91, 107, 230)' }} />
                      </div>
                      <span style={{
                        padding: '3px 8px', borderRadius: '8px', fontSize: '11px',
                        background: docStatusStyle.bg, color: docStatusStyle.text, fontWeight: 500
                      }}>
                        {getDocStatusText(doc.status)}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>
                      {doc.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#A0AEC0', margin: 0 }}>
                      更新于 {new Date(doc.updatedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <FileText size={48} style={{ color: '#CBD5E0', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>
              暂无文档
            </h3>
            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '20px' }}>
              创建您的第一个文档开始编辑
            </p>
            <button 
              onClick={() => setShowCreateDoc(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '12px 24px', background: '#5B6BE6',
                border: 'none', borderRadius: '8px',
                color: 'white', fontSize: '14px', fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <Plus size={18} /> 创建文档
            </button>
          </div>
        )}
      </div>

      {/* Create Document Modal */}
      {showCreateDoc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            width: '100%', maxWidth: '440px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', marginBottom: '20px' }}>
              新建文档
            </h3>
            <form onSubmit={handleCreateDocument}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#4A5568', marginBottom: '8px' }}>
                  文档标题
                </label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="请输入文档标题"
                  style={{
                    width: '100%', padding: '12px',
                    border: '1px solid #E2E8F0', borderRadius: '8px',
                    fontSize: '14px', outline: 'none'
                  }}
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateDoc(false)}
                  style={{
                    padding: '10px 20px', background: 'white',
                    border: '1px solid #E2E8F0', borderRadius: '8px',
                    color: '#718096', fontSize: '14px', cursor: 'pointer'
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={creating || !newDocTitle.trim()}
                  style={{
                    padding: '10px 20px', background: creating ? '#A0AEC0' : '#5B6BE6',
                    border: 'none', borderRadius: '8px',
                    color: 'white', fontSize: '14px', fontWeight: 500,
                    cursor: creating ? 'not-allowed' : 'pointer'
                  }}
                >
                  {creating ? '创建中...' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            width: '100%', maxWidth: '400px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '60px', height: '60px', background: '#FEE2E2', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
              }}>
                <Trash2 size={28} style={{ color: '#F4726B' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>
                确认删除项目
              </h3>
              <p style={{ fontSize: '14px', color: '#718096' }}>
                此操作将永久删除项目"{project.name}"及其所有文档，无法恢复。
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1, padding: '12px',
                  background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px',
                  color: '#718096', fontSize: '14px', cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={handleDeleteProject}
                style={{
                  flex: 1, padding: '12px',
                  background: '#F4726B', border: 'none', borderRadius: '8px',
                  color: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
                }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
