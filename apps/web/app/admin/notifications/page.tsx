'use client';
import { useState, useEffect } from 'react';
import { Bell, Send, Users, Filter, Search, Edit, Trash2 } from 'lucide-react';

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

  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        { id: '1', title: '系统升级通知', content: '系统将于今晚22:00进行升级维护', type: 'all', sentCount: 1090, createdAt: '2026-02-25' },
        { id: '2', title: '新功能上线', content: 'AI智能排版功能已上线', type: 'all', sentCount: 1090, createdAt: '2026-02-20' },
        { id: '3', title: 'VIP优惠活动', content: 'VIP用户专享8折优惠', type: 'vip', sentCount: 156, createdAt: '2026-02-15' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div style={{ padding: 24 }}><div style={{ height: 400, background: 'white', borderRadius: 12 }}></div></div>;

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>通知管理</h1><p style={{ color: '#718096', fontSize: 14 }}>发送系统通知给用户</p></div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}><Send size={18} /> 发送通知</button>
      </div>
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8FAFC' }}>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>通知标题</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>范围</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>发送量</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>时间</th>
            <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th>
          </tr></thead>
          <tbody>
            {notifications.map((n, i) => (
              <tr key={n.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: 16 }}><div style={{ fontWeight: 500, color: '#2D3748' }}>{n.title}</div><div style={{ fontSize: 13, color: '#718096' }}>{n.content}</div></td>
                <td style={{ padding: 16 }}><span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, background: n.type === 'all' ? '#E8EAFC' : n.type === 'vip' ? '#FEF3C7' : '#D1FAE5', color: n.type === 'all' ? 'rgb(91, 107, 230)' : n.type === 'vip' ? '#D97706' : '#059669' }}>{n.type === 'all' ? '全量' : n.type === 'vip' ? 'VIP' : '企业'}</span></td>
                <td style={{ padding: 16, color: '#2D3748' }}>{n.sentCount}</td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{n.createdAt}</td>
                <td style={{ padding: 16, textAlign: 'right' }}><button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button><button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
