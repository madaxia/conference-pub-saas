'use client';
import { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit, Trash2, Gift, X, Loader2 } from 'lucide-react';

interface Rule {
  id: string;
  name: string;
  points: number;
  type: 'earn' | 'spend';
  description: string;
  enabled: boolean;
}

export default function Page() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete'>('add');
  const [selected, setSelected] = useState<Rule | null>(null);
  const [formData, setFormData] = useState({ name: '', points: 0, type: 'earn' as 'earn' | 'spend', description: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setRules([
        { id: '1', name: '每日签到', points: 100, type: 'earn', description: '每日签到奖励', enabled: true },
        { id: '2', name: '邀请好友', points: 200, type: 'earn', description: '成功邀请一位好友', enabled: true },
        { id: '3', name: '阅读电子书', points: 50, type: 'spend', description: '阅读一本电子书', enabled: true },
        { id: '4', name: '下载资料', points: 100, type: 'spend', description: '下载一份资料', enabled: true },
        { id: '5', name: '完善资料', points: 50, type: 'earn', description: '完善个人资料奖励', enabled: false },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleAdd = () => { setModalType('add'); setFormData({ name: '', points: 0, type: 'earn', description: '' }); setShowModal(true); };
  const handleEdit = (r: Rule) => { setModalType('edit'); setFormData({ name: r.name, points: r.points, type: r.type, description: r.description }); setSelected(r); setShowModal(true); };
  const handleDelete = (r: Rule) => { setModalType('delete'); setSelected(r); setShowModal(true); };
  const handleToggle = (r: Rule) => {
    setSaving(true);
    setTimeout(() => {
      setRules(rules.map(rule => rule.id === r.id ? { ...rule, enabled: !rule.enabled } : rule));
      setSuccess(r.enabled ? '规则已禁用' : '规则已启用');
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 300);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (modalType === 'add') {
        setRules([{ id: Date.now().toString(), ...formData, enabled: true }, ...rules]);
        setSuccess('规则创建成功');
      } else if (modalType === 'edit' && selected) {
        setRules(rules.map(r => r.id === selected.id ? { ...r, ...formData } : r));
        setSuccess('规则更新成功');
      } else {
        setRules(rules.filter(r => r.id !== selected?.id));
        setSuccess('规则删除成功');
      }
      setShowModal(false); setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {success && <div style={{ position: 'fixed', top: 80, right: 24, background: '#059669', color: 'white', padding: '12px 20px', borderRadius: 8, zIndex: 1000 }}>{success}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>积分配置</h1><p style={{ color: '#718096', fontSize: 14 }}>管理积分规则</p></div>
        <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}><Plus size={18} /> 新建规则</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}><div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{rules.length}</div><div style={{ fontSize: 13, color: '#718096' }}>总规则</div></div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}><div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{rules.filter(r => r.enabled).length}</div><div style={{ fontSize: 13, color: '#718096' }}>已启用</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {loading ? <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}><Loader2 className="animate-spin" size={24} /></div> : rules.map((rule) => (
          <div key={rule.id} style={{ background: 'white', borderRadius: 12, padding: 20, opacity: rule.enabled ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: rule.type === 'earn' ? '#D1FAE5' : '#FEE2E2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rule.type === 'earn' ? '#059669' : '#F4726B' }}><Gift size={20} /></div>
                <div><h3 style={{ fontSize: 15, fontWeight: 600, color: '#2D3748' }}>{rule.name}</h3><p style={{ fontSize: 13, color: '#718096' }}>{rule.description}</p></div>
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: rule.type === 'earn' ? '#059669' : '#F4726B' }}>{rule.type === 'earn' ? '+' : '-'}{rule.points}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid #E2E8F0' }}>
              <button onClick={() => handleToggle(rule)} style={{ padding: '6px 12px', background: rule.enabled ? '#FEF3C7' : '#D1FAE5', color: rule.enabled ? '#D97706' : '#059669', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>{rule.enabled ? '禁用' : '启用'}</button>
              <div style={{ display: 'flex', gap: 8 }}><button onClick={() => handleEdit(rule)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button><button onClick={() => handleDelete(rule)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button></div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, width: '90%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h3 style={{ fontSize: 18, fontWeight: 600, color: '#2D3748' }}>{modalType === 'add' ? '新建规则' : modalType === 'edit' ? '编辑规则' : '删除规则'}</h3><button onClick={() => setShowModal(false)}><X size={20} color="#718096" /></button></div>
            {modalType === 'delete' ? <p style={{ color: '#718096', marginBottom: 20 }}>确定删除规则 <strong>{selected?.name}</strong>？</p> : (
              <div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>规则名称</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>积分值</label><input type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>类型</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'earn' | 'spend' })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}><option value="earn">获得积分</option><option value="spend">消费积分</option></select></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>描述</label><input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} /></div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}><button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: '#F5F7FB', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#718096' }}>取消</button><button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: 'rgb(91, 107, 230)', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'white' }}>{modalType === 'add' ? '创建' : modalType === 'edit' ? '保存' : '删除'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
