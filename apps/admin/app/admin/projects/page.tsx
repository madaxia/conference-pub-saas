'use client';

import { useState, useEffect } from 'react';
import { Folder, Plus, Search, Edit, Trash2, Eye, X, Loader2, FileText } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: 'draft' | 'review' | 'published';
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'view'>('add');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'draft' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setTimeout(() => {
      setProjects([
        { id: '1', name: '2026年度大会', description: '年度总结大会会刊', owner: '张三', status: 'published', documentCount: 5, createdAt: '2026-01-10', updatedAt: '2026-02-20' },
        { id: '2', name: '技术研讨会', description: '技术交流会议资料', owner: '李四', status: 'review', documentCount: 3, createdAt: '2026-02-01', updatedAt: '2026-02-25' },
        { id: '3', name: '新产品发布会', description: '新品发布宣传材料', owner: '王五', status: 'draft', documentCount: 1, createdAt: '2026-02-15', updatedAt: '2026-02-26' },
        { id: '4', name: '培训资料', description: '员工培训手册', owner: '赵六', status: 'draft', documentCount: 0, createdAt: '2026-02-20', updatedAt: '2026-02-26' },
      ]);
      setLoading(false);
    }, 500);
  };

  const filteredProjects = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = () => {
    setModalType('add');
    setFormData({ name: '', description: '', status: 'draft' });
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEdit = (project: Project) => {
    setModalType('edit');
    setFormData({ name: project.name, description: project.description, status: project.status });
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleView = (project: Project) => {
    setModalType('view');
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDelete = (project: Project) => {
    setModalType('delete');
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (modalType === 'add') {
        const newProject: Project = {
          id: Date.now().toString(),
          ...formData,
          owner: '当前管理员',
          documentCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setProjects([...projects, newProject]);
        setSuccess('项目创建成功');
      } else if (modalType === 'edit' && selectedProject) {
        setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, ...formData, updatedAt: new Date().toISOString().split('T')[0] } : p));
        setSuccess('项目更新成功');
      } else if (modalType === 'delete' && selectedProject) {
        setProjects(projects.filter(p => p.id !== selectedProject.id));
        setSuccess('项目删除成功');
      }
      setShowModal(false);
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    draft: { bg: '#FEF3C7', text: '#D97706' },
    review: { bg: '#E8EAFC', text: 'rgb(91, 107, 230)' },
    published: { bg: '#D1FAE5', text: '#059669' },
  };

  const statusLabels: Record<string, string> = {
    draft: '草稿',
    review: '审核中',
    published: '已发布',
  };

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {success && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#059669', color: 'white', padding: '12px 20px', borderRadius: 8, zIndex: 1000 }}>
          {success}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>项目管理</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>管理所有项目</p>
        </div>
        <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          <Plus size={18} /> 创建项目
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{projects.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>总项目</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#D97706' }}>{projects.filter(p => p.status === 'draft').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>草稿</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'rgb(91, 107, 230)' }}>{projects.filter(p => p.status === 'review').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>审核中</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{projects.filter(p => p.status === 'published').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>已发布</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 300, flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#A0AEC0' }} />
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '10px 16px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}
        >
          <option value="all">全部状态</option>
          <option value="draft">草稿</option>
          <option value="review">审核中</option>
          <option value="published">已发布</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}><Loader2 className="animate-spin" size={24} />加载中...</div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#718096' }}>暂无项目</div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, background: '#E8EAFC', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)' }}>
                    <Folder size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D3748' }}>{project.name}</h3>
                    <p style={{ fontSize: 12, color: '#718096' }}>{project.owner}</p>
                  </div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, background: statusColors[project.status].bg, color: statusColors[project.status].text }}>
                  {statusLabels[project.status]}
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#718096', marginBottom: 16, lineHeight: 1.5 }}>{project.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#718096', fontSize: 13 }}>
                  <FileText size={14} /> {project.documentCount} 个文档
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleView(project)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Eye size={16} /></button>
                  <button onClick={() => handleEdit(project)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button>
                  <button onClick={() => handleDelete(project)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, width: '90%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#2D3748' }}>
                {modalType === 'add' ? '创建项目' : modalType === 'edit' ? '编辑项目' : modalType === 'view' ? '项目详情' : '删除项目'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096' }}><X size={20} /></button>
            </div>

            {modalType === 'view' && selectedProject ? (
              <div>
                <div style={{ marginBottom: 16 }}><strong>项目名称:</strong> {selectedProject.name}</div>
                <div style={{ marginBottom: 16 }}><strong>描述:</strong> {selectedProject.description}</div>
                <div style={{ marginBottom: 16 }}><strong>负责人:</strong> {selectedProject.owner}</div>
                <div style={{ marginBottom: 16 }}><strong>状态:</strong> {statusLabels[selectedProject.status]}</div>
                <div style={{ marginBottom: 16 }}><strong>文档数:</strong> {selectedProject.documentCount}</div>
                <div style={{ marginBottom: 16 }}><strong>创建时间:</strong> {selectedProject.createdAt}</div>
                <div style={{ marginBottom: 16 }}><strong>更新时间:</strong> {selectedProject.updatedAt}</div>
              </div>
            ) : modalType === 'delete' ? (
              <p style={{ color: '#718096', marginBottom: 20 }}>确定要删除项目 <strong>{selectedProject?.name}</strong> 吗？</p>
            ) : (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>项目名称</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>项目描述</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>状态</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}>
                    <option value="draft">草稿</option>
                    <option value="review">审核中</option>
                    <option value="published">已发布</option>
                  </select>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: '#F5F7FB', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#718096' }}>取消</button>
              {modalType !== 'view' && (
                <button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: 'rgb(91, 107, 230)', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {modalType === 'add' ? '创建' : modalType === 'edit' ? '保存' : '删除'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
