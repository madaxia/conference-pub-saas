'use client';
import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, UserPlus, X, Loader2 } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

export default function Page() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setGroups([
        { id: '1', name: 'VIP会员', description: '高级会员用户组', memberCount: 156, createdAt: '2026-01-01' },
        { id: '2', name: '企业用户', description: '企业账号用户组', memberCount: 42, createdAt: '2026-01-15' },
        { id: '3', name: '普通用户', description: '注册用户默认组', memberCount: 892, createdAt: '2026-01-01' },
        { id: '4', name: '测试用户', description: '测试账号用户组', memberCount: 12, createdAt: '2026-02-01' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = () => { setModalType('add'); setFormData({ name: '', description: '' }); setShowModal(true); };
  const handleEdit = (g: Group) => { setModalType('edit'); setFormData({ name: g.name, description: g.description }); setSelectedGroup(g); setShowModal(true); };
  const handleDelete = (g: Group) => { setModalType('delete'); setSelectedGroup(g); setShowModal(true); };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (modalType === 'add') {
        setGroups([...groups, { id: Date.now().toString(), ...formData, memberCount: 0, createdAt: new Date().toISOString().split('T')[0] }]);
        setSuccess('分组创建成功');
      } else if (modalType === 'edit' && selectedGroup) {
        setGroups(groups.map(g => g.id === selectedGroup.id ? { ...g, ...formData } : g));
        setSuccess('分组更新成功');
      } else if (modalType === 'delete') {
        setGroups(groups.filter(g => g.id !== selectedGroup?.id));
        setSuccess('分组删除成功');
      }
      setShowModal(false); setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {success && <div style={{ position: 'fixed', top: 80, right: 24, background: '#059669', color: 'white', padding: '12px 20px', borderRadius: 8, zIndex: 1000 }}>{success}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>分组管理</h1><p style={{ color: '#718096', fontSize: 14 }}>管理用户分组</p></div>
        <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}><Plus size={18} /> 新建分组</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}><div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{groups.length}</div><div style={{ fontSize: 13, color: '#718096' }}>总分组</div></div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}><div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{groups.reduce((a, b) => a + b.memberCount, 0)}</div><div style={{ fontSize: 13, color: '#718096' }}>总成员</div></div>
      </div>
      <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 16 }}><div style={{ position: 'relative', maxWidth: 400 }}><Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#A0AEC0' }} /><input type="text" placeholder="搜索分组..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 40px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} /></div></div>
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8FAFC' }}><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>分组名称</th><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>描述</th><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>成员数</th><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>创建时间</th><th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center' }}><Loader2 className="animate-spin" size={24} /></td></tr> : filteredGroups.map((g, i) => (
              <tr key={g.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: 16 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 40, height: 40, background: '#E8EAFC', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)' }}><Users size={20} /></div><span style={{ fontWeight: 500, color: '#2D3748' }}>{g.name}</span></div></td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{g.description}</td>
                <td style={{ padding: 16, color: '#2D3748', fontWeight: 500 }}>{g.memberCount}</td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{g.createdAt}</td>
                <td style={{ padding: 16, textAlign: 'right' }}><button onClick={() => handleEdit(g)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button><button onClick={() => handleDelete(g)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, width: '90%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h3 style={{ fontSize: 18, fontWeight: 600, color: '#2D3748' }}>{modalType === 'add' ? '新建分组' : modalType === 'edit' ? '编辑分组' : '删除分组'}</h3><button onClick={() => setShowModal(false)}><X size={20} color="#718096" /></button></div>
            {modalType === 'delete' ? <p style={{ color: '#718096', marginBottom: 20 }}>确定删除分组 <strong>{selectedGroup?.name}</strong>？</p> : (
              <div><div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>分组名称</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} /></div>
              <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>描述</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} /></div></div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}><button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: '#F5F7FB', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#718096' }}>取消</button><button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: 'rgb(91, 107, 230)', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'white' }}>{modalType === 'add' ? '创建' : modalType === 'edit' ? '保存' : '删除'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
