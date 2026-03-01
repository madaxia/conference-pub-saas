'use client';
import { useState, useEffect } from 'react';
import { Bell, Send, Users, Search, Edit, Trash2, X, Loader2, SendHorizontal } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'all' | 'vip' | 'enterprise';
  sentCount: number;
  createdAt: string;
}

export default function Page() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'send' | 'delete'>('send');
  const [selected, setSelected] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', type: 'all' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        { id: '1', title: '系统升级通知', content: '系统将于今晚22:00进行升级维护', type: 'all', sentCount: 1090, createdAt: '2026-02-25' },
        { id: '2', title: '新功能上线', content: 'AI智能排版功能已上线', type: 'all', sentCount: 1090, createdAt: '2026-02-20' },
        { id: '3', title: 'VIP优惠活动', content: 'VIP用户专享8折优惠', type: 'vip', sentCount: 156, createdAt: '2026-02-15' },
        { id: '4', title: '企业版更新', content: '企业功能全面升级', type: 'enterprise', sentCount: 42, createdAt: '2026-02-10' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSend = () => { setModalType('send'); setFormData({ title: '', content: '', type: 'all' }); setShowModal(true); };
  const handleDelete = (n: Notification) => { setModalType('delete'); setSelected(n); setShowModal(true); };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (modalType === 'send') {
        const count = formData.type === 'all' ? 1090 : formData.type === 'vip' ? 156 : 42;
        setNotifications([{ id: Date.now().toString(), ...formData, sentCount: count, createdAt: new Date().toISOString().split('T')[0] }, ...notifications]);
        setSuccess('通知发送成功');
      } else {
        setNotifications(notifications.filter(n => n.id !== selected?.id));
        setSuccess('通知删除成功');
      }
      setShowModal(false); setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const typeLabels: Record<string, string> = { all: '全量', vip: 'VIP', enterprise: '企业' };

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {success && <div style={{ position: 'fixed', top: 80, right: 24, background: '#059669', color: 'white', padding: '12px 20px', borderRadius: 8, zIndex: 1000 }}>{success}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>通知管理</h1><p style={{ color: '#718096', fontSize: 14 }}>发送系统通知给用户</p></div>
        <button onClick={handleSend} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}><SendHorizontal size={18} /> 发送通知</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}><div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{notifications.length}</div><div style={{ fontSize: 13, color: '#718096' }}>总通知</div></div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}><div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{notifications.reduce((a, b) => a + b.sentCount, 0)}</div><div style={{ fontSize: 13, color: '#718096' }}>总发送量</div></div>
      </div>
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8FAFC' }}><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>标题</th><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>范围</th><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>发送量</th><th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>时间</th><th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center' }}><Loader2 className="animate-spin" size={24} /></td></tr> : notifications.map((n, i) => (
              <tr key={n.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: 16 }}><div style={{ fontWeight: 500, color: '#2D3748' }}>{n.title}</div><div style={{ fontSize: 13, color: '#718096' }}>{n.content}</div></td>
                <td style={{ padding: 16 }}><span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, background: n.type === 'all' ? '#E8EAFC' : n.type === 'vip' ? '#FEF3C7' : '#D1FAE5', color: n.type === 'all' ? 'rgb(91, 107, 230)' : n.type === 'vip' ? '#D97706' : '#059669' }}>{typeLabels[n.type]}</span></td>
                <td style={{ padding: 16, color: '#2D3748', fontWeight: 500 }}>{n.sentCount}</td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{n.createdAt}</td>
                <td style={{ padding: 16, textAlign: 'right' }}><button onClick={() => handleDelete(n)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, width: '90%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h3 style={{ fontSize: 18, fontWeight: 600, color: '#2D3748' }}>{modalType === 'send' ? '发送通知' : '删除通知'}</h3><button onClick={() => setShowModal(false)}><X size={20} color="#718096" /></button></div>
            {modalType === 'delete' ? <p style={{ color: '#718096', marginBottom: 20 }}>确定删除此通知？</p> : (
              <div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>标题</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>内容</label><textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={3} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} /></div>
                <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>发送范围</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}><option value="all">全部用户</option><option value="vip">VIP用户</option><option value="enterprise">企业用户</option></select></div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}><button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: '#F5F7FB', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#718096' }}>取消</button><button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: 'rgb(91, 107, 230)', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'white' }}>{modalType === 'send' ? '发送' : '删除'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
