'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    conferenceName: '',
    issueDate: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadProjects();
  }, [router]);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;

    try {
      await api.createProject({ ...formData, tenantId });
      await loadProjects();
      setShowForm(false);
      setFormData({ name: '', conferenceName: '', issueDate: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const statusMap: Record<string, { label: string; class: string }> = {
    draft: { label: '草稿', class: 'draft' },
    editing: { label: '编辑中', class: 'editing' },
    reviewing: { label: '审稿中', class: 'editing' },
    finalizing: { label: '定稿中', class: 'editing' },
    printing: { label: '印刷中', class: 'completed' },
    completed: { label: '已完成', class: 'completed' },
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        加载中...
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">项目</h1>
        <p className="page-subtitle">管理您的会议会刊项目</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <button className="btn-accent" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '+ 新建项目'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="create-form fade-in">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">项目名称</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="2026年度大会"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">会议名称</label>
              <input
                type="text"
                className="form-input"
                value={formData.conferenceName}
                onChange={(e) => setFormData({ ...formData, conferenceName: e.target.value })}
                placeholder="技术大会2026"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">发行日期</label>
            <input
              type="date"
              className="form-input"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-accent">创建项目</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>取消</button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3 className="empty-title">暂无项目</h3>
          <p className="empty-text">点击上方按钮创建您的第一个会刊项目</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
              <div className="project-card">
                <div className="project-card-header">
                  <div className="project-icon">📄</div>
                  <span className={`project-status ${statusMap[project.status]?.class || 'draft'}`}>
                    {statusMap[project.status]?.label || project.status}
                  </span>
                </div>
                <h3 className="project-name">{project.name}</h3>
                <p className="project-conference">{project.conferenceName}</p>
                <div className="project-meta">
                  <span className="project-date">
                    📅 {new Date(project.issueDate).toLocaleDateString('zh-CN')}
                  </span>
                  <span className="project-docs">
                    {project._count?.documents || 0} 文档 →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
