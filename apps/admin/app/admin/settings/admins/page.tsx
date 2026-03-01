'use client';

import { useState, useEffect } from 'react';
import { Shield, Plus, Search, Edit, Trash2, Key } from 'lucide-react';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
  lastLogin: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/admin/users?role=admin', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.filter((u: Admin) => u.role === 'admin' || u.role === 'superadmin'));
      }
    } catch (err) {
      // Mock data
      setAdmins([
        { id: '1', email: 'admin@demo.com', name: '系统管理员', role: 'superadmin', createdAt: '2026-01-01', lastLogin: '2026-02-26' },
        { id: '2', email: 'manager@demo.com', name: '运营管理员', role: 'admin', createdAt: '2026-01-15', lastLogin: '2026-02-25' },
      ]);
    }
    setLoading(false);
  };

  const filteredAdmins = admins.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>管理员管理</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>管理系统管理员账号 (在设置页面)</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          <Plus size={18} /> 添加管理员
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{admins.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>管理员总数</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#D97706' }}>{admins.filter(a => a.role === 'superadmin').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>超级管理员</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#A0AEC0' }} />
          <input
            type="text"
            placeholder="搜索管理员姓名或邮箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}
          />
        </div>
      </div>

      {/* Admin Table */}
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>管理员</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>角色</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>创建时间</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>最后登录</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin, i) => (
              <tr key={admin.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: '#FEF3C7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                      <Shield size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: '#2D3748' }}>{admin.name}</div>
                      <div style={{ fontSize: 12, color: '#718096' }}>{admin.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: 16 }}>
                  <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, background: admin.role === 'superadmin' ? '#FEE2E2' : '#E8EAFC', color: admin.role === 'superadmin' ? '#DC2626' : 'rgb(91, 107, 230)' }}>
                    {admin.role === 'superadmin' ? '超级管理员' : '管理员'}
                  </span>
                </td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{admin.createdAt}</td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{admin.lastLogin}</td>
                <td style={{ padding: 16, textAlign: 'right' }}>
                  <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Key size={16} /></button>
                  <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button>
                  <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
