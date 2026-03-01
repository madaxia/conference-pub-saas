'use client';

import { useState, useEffect } from 'react';
import { Book, Plus, Search, Edit, Trash2, Eye, X, Loader2, Download, Upload } from 'lucide-react';

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  price: number;
  status: 'draft' | 'published' | 'archived';
  downloadCount: number;
  createdAt: string;
}

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'view'>('add');
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [formData, setFormData] = useState({ title: '', author: '', description: '', price: 0, status: 'draft' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    setLoading(true);
    setTimeout(() => {
      setEbooks([
        { id: '1', title: '会议组织完全指南', author: '张明', description: '详细介绍各类会议的组织策划流程', cover: '', price: 99, status: 'published', downloadCount: 1250, createdAt: '2026-01-10' },
        { id: '2', title: '印刷工艺实战手册', author: '李华', description: '印刷行业从业者必读', cover: '', price: 199, status: 'published', downloadCount: 890, createdAt: '2026-01-20' },
        { id: '3', title: '会刊设计模板集', author: '王芳', description: '50套精美会刊设计模板', cover: '', price: 299, status: 'draft', downloadCount: 0, createdAt: '2026-02-01' },
        { id: '4', title: '会议摄影技巧', author: '赵强', description: '会议活动摄影全攻略', cover: '', price: 0, status: 'published', downloadCount: 2100, createdAt: '2026-02-10' },
      ]);
      setLoading(false);
    }, 500);
  };

  const filteredEbooks = ebooks.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.author.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = () => {
    setModalType('add');
    setFormData({ title: '', author: '', description: '', price: 0, status: 'draft' });
    setSelectedEbook(null);
    setShowModal(true);
  };

  const handleEdit = (ebook: Ebook) => {
    setModalType('edit');
    setFormData({ title: ebook.title, author: ebook.author, description: ebook.description, price: ebook.price, status: ebook.status });
    setSelectedEbook(ebook);
    setShowModal(true);
  };

  const handleView = (ebook: Ebook) => {
    setModalType('view');
    setSelectedEbook(ebook);
    setShowModal(true);
  };

  const handleDelete = (ebook: Ebook) => {
    setModalType('delete');
    setSelectedEbook(ebook);
    setShowModal(true);
  };

  const handleTogglePublish = (ebook: Ebook) => {
    setSaving(true);
    setTimeout(() => {
      const newStatus = ebook.status === 'published' ? 'draft' : 'published';
      setEbooks(ebooks.map(e => e.id === ebook.id ? { ...e, status: newStatus } : e));
      setSuccess(newStatus === 'published' ? '电子书已发布' : '电子书已下架');
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (modalType === 'add') {
        const newEbook: Ebook = {
          id: Date.now().toString(),
          ...formData,
          cover: '',
          downloadCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setEbooks([...ebooks, newEbook]);
        setSuccess('电子书创建成功');
      } else if (modalType === 'edit' && selectedEbook) {
        setEbooks(ebooks.map(e => e.id === selectedEbook.id ? { ...e, ...formData } : e));
        setSuccess('电子书更新成功');
      } else if (modalType === 'delete' && selectedEbook) {
        setEbooks(ebooks.filter(e => e.id !== selectedEbook.id));
        setSuccess('电子书删除成功');
      }
      setShowModal(false);
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    draft: { bg: '#FEF3C7', text: '#D97706' },
    published: { bg: '#D1FAE5', text: '#059669' },
    archived: { bg: '#FEE2E2', text: '#F4726B' },
  };

  const statusLabels: Record<string, string> = { draft: '草稿', published: '已发布', archived: '已归档' };

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {success && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#059669', color: 'white', padding: '12px 20px', borderRadius: 8, zIndex: 1000 }}>
          {success}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>电子书管理</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>管理电子书资源</p>
        </div>
        <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          <Plus size={18} /> 添加电子书
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{ebooks.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>总电子书</div>
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
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{ebooks.reduce((a, b) => a + b.downloadCount, 0)}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>总下载</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#A0AEC0' }} />
          <input type="text" placeholder="搜索电子书标题或作者..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 40px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}><Loader2 className="animate-spin" size={24} />加载中...</div>
        ) : filteredEbooks.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#718096' }}>暂无电子书</div>
        ) : (
          filteredEbooks.map((ebook) => (
            <div key={ebook.id} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <div style={{ height: 140, background: 'linear-gradient(135deg, #E8EAFC 0%, #F5F7FB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)' }}>
                <Book size={48} />
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D3748', flex: 1 }}>{ebook.title}</h3>
                  <span style={{ padding: '2px 8px', borderRadius: 8, fontSize: 11, background: statusColors[ebook.status].bg, color: statusColors[ebook.status].text }}>{statusLabels[ebook.status]}</span>
                </div>
                <p style={{ fontSize: 13, color: '#718096', marginBottom: 8 }}>{ebook.author}</p>
                <p style={{ fontSize: 12, color: '#A0AEC0', marginBottom: 12, lineHeight: 1.4 }}>{ebook.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#718096', fontSize: 13 }}>
                    <Download size={14} /> {ebook.downloadCount}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => handleView(ebook)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Eye size={16} /></button>
                    <button onClick={() => handleEdit(ebook)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(ebook)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button>
                  </div>
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
                {modalType === 'add' ? '添加电子书' : modalType === 'edit' ? '编辑电子书' : modalType === 'view' ? '电子书详情' : '删除电子书'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096' }}><X size={20} /></button>
            </div>

            {modalType === 'view' && selectedEbook ? (
              <div>
                <div style={{ marginBottom: 12 }}><strong>标题:</strong> {selectedEbook.title}</div>
                <div style={{ marginBottom: 12 }}><strong>作者:</strong> {selectedEbook.author}</div>
                <div style={{ marginBottom: 12 }}><strong>描述:</strong> {selectedEbook.description}</div>
                <div style={{ marginBottom: 12 }}><strong>价格:</strong> {selectedEbook.price === 0 ? '免费' : `¥${selectedEbook.price}`}</div>
                <div style={{ marginBottom: 12 }}><strong>状态:</strong> {statusLabels[selectedEbook.status]}</div>
                <div style={{ marginBottom: 12 }}><strong>下载量:</strong> {selectedEbook.downloadCount}</div>
                <div style={{ marginBottom: 12 }}><strong>创建时间:</strong> {selectedEbook.createdAt}</div>
                <button onClick={() => handleTogglePublish(selectedEbook)} style={{ marginTop: 12, padding: '10px 20px', background: selectedEbook.status === 'published' ? '#FEF3C7' : '#D1FAE5', color: selectedEbook.status === 'published' ? '#D97706' : '#059669', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                  {selectedEbook.status === 'published' ? '下架' : '发布'}
                </button>
              </div>
            ) : modalType === 'delete' ? (
              <p style={{ color: '#718096', marginBottom: 20 }}>确定要删除电子书 <strong>{selectedEbook?.title}</strong> 吗？</p>
            ) : (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>标题</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>作者</label>
                  <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>描述</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>价格 (0=免费)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>状态</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}>
                    <option value="draft">草稿</option>
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
