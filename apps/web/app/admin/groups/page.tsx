'use client';
import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, UserPlus } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  description: string;
  createdAt: string;
}

export default function Page() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setGroups([
        { id: '1', name: 'VIP会员', memberCount: 156, description: '高级会员用户组', createdAt: '2026-01-01' },
        { id: '2', name: '企业用户', memberCount: 42, description: '企业账号用户组', createdAt: '2026-01-15' },
        { id: '3', name: '普通用户', memberCount: 892, description: '注册用户默认组', createdAt: '2026-01-01' },
        { id: '4', name: '测试用户', memberCount: 12, description: '测试账号用户组', createdAt: '2026-02-01' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div style={{ padding: 24 }}><div style={{ height: 400, background: 'white', borderRadius: 12 }}></div></div>;

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>分组管理</h1><p style={{ color: '#718096', fontSize: 14 }}>管理用户分组</p></div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}><Plus size={18} /> 新建分组</button>
      </div>
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8FAFC' }}>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>分组名称</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>描述</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>成员数</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>创建时间</th>
            <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th>
          </tr></thead>
          <tbody>
            {groups.map((group, i) => (
              <tr key={group.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: 16 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 40, height: 40, background: '#E8EAFC', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} style={{ color: 'rgb(91, 107, 230)' }} /></div><span style={{ fontWeight: 500, color: '#2D3748' }}>{group.name}</span></div></td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{group.description}</td>
                <td style={{ padding: 16, color: '#2D3748', fontWeight: 500 }}>{group.memberCount}</td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{group.createdAt}</td>
                <td style={{ padding: 16, textAlign: 'right' }}><button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button><button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
