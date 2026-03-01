'use client';
import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Edit, Trash2, Eye, X, Loader2 } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'view'>('add');
  const [selected, setSelected] = useState<Article | null>(null);
  const [formData, setFormData] = useState({ title: '', category: '', status: 'draft' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setArticles([
        { id: '1', title: '如何创建项目', category: '使用指南', views: 1250, status: 'published', updatedAt: '2026-02-20' },
        { id: '2', title: '印刷品规格说明', category: '产品介绍', views: 890, status: 'published', updatedAt: '2026-02-18' },
        { id: '3', title: '常见问题FAQ', category: '帮助中心', views: 2100, status: 'published', updatedAt: '2026-02-15' },
        { id: '4', title: '新功能介绍', category: '产品更新', views: 0, status: 'draft', updatedAt: '2026-02-26' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.category.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = () => { setModalType('add'); setFormData({ title: '', category: '', status: 'draft' }); setShowModal(true); };
  const handleEdit = (a: Article) => { setModalType('edit'); setFormData({ title: a.title, category: a.category, status: a.status }); setSelected(a); setShowModal(true); };
  const handleView = (a: Article) => { setModalType('view'); setSelected(a); setShowModal(true); };
  const handleDelete = (a: Article) => { setModalType('delete'); setSelected(a); setShowModal(true); };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (modalType === 'add') {
        setArticles([{ id: Date.now().toString(), ...formData, views: 0, updatedAt: new Date().toISOString().split('T')[0] }, ...articles]);
        setSuccess('文章创建成功');
      } else if (modalType === 'edit' && selected) {
        setArticles(articles.map(a => a.id === selected.id ? { ...a, ...formData, updatedAt: new Date().toISOString().split('T')[0] } : a));
        setSuccess('文章更新成功');
      } else {
        setArticles(articles.filter(a => a.id !== selected?.id));
        setSuccess('文章删除成功');
      }
      setShowModal(false); setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {success && <div style={{ position: 'fixed', top: 80, right: 24, background: '#059669', color: 'white', padding: '12px 20px', borderRadius: 8, zIndex: 1000 }}>{success}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>知识库</h1><p style={{ color: '#718096', fontSize: 14 }}>管理帮助文档</p></div>
        <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}><Plus size={18} /> 新建文章</button>
      </div>
      <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 16 }}><div style={{ position: 'relative', maxWidth: 400 }}><Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#A0AEC0' }} /><input type="text" placeholder="搜索文章..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 40px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} /></div></div>
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8FAFC' }}><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>标题</th><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>分类</th><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>浏览</th><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>状态</th><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>更新时间</th><th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center' }}><Loader2 className="animate-spin" size={24} /></td></tr> : filteredArticles.map((a, i) => (
              <tr key={a.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: 16 }}><FileText size={18} style={{ color: 'rgb(91, 107, 230)', marginRight: 8 }} /><span style={{ fontWeight: 500, color: '#2D3748' }}>{a.title}</span></td>
                <td style={{ padding: 16, color: '#718096' }}>{a.category}</td>
                <td style={{ padding: 16, color: '#718096' }}>{a.views}</td>
                <td style={{ padding: 16 }}><span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, background: a.status === 'published' ? '#D1FAE5' : '#FEF3C7', color: a.status === 'published' ? '#059669' : '#D97706' }}>{a.status === 'published' ? '已发布' : '草稿'}</span></td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{a.updatedAt}</td>
                <td style={{ padding: 16, textAlign: 'right' }}><button onClick={() => handleView(a)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Eye size={16} /></button><button onClick={() => handleEdit(a)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button><button onClick={() => handleDelete(a)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, width: '90%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h3 style={{ fontSize: 18, fontWeight: 600, color: '#2D3748' }}>{modalType === 'add' ? '新建文章' : modalType === 'edit' ? '编辑文章' : modalType === 'view' ? '文章详情' : '删除文章'}</h3><button onClick={() => setShowModal(false)}><X size={20} color="#718096" /></button></div>
            {modalType === 'view' && selected ? <div><div style={{ marginBottom: 12 }}><strong>标题:</strong> {selected.title}</div><div style={{ marginBottom: 12 }}><strong>分类:</strong> {selected.category}</div><div style={{ marginBottom: 12 }}><strong>浏览:</strong> {selected.views}</div><div style={{ marginBottom: 12 }}><strong>状态:</strong> {selected.status === 'published' ? '已发布' : '草稿'}</div></div> : modalType === 'delete' ? <p style={{ color: '#718096', marginBottom: 20 }}>确定删除文章 <strong>{selected?.title}</strong>？</p> : (
              <div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>标题</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>分类</label><input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>状态</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}><option value="draft">草稿</option><option value="published">已发布</option></select></div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}><button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: '#F5F7FB', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#718096' }}>取消</button>{modalType !== 'view' && <button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: 'rgb(91, 107, 230)', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'white' }}>{modalType === 'add' ? '创建' : modalType === 'edit' ? '保存' : '删除'}</button>}</div>
          </div>
        </div>
      )}
    </div>
  );
}
