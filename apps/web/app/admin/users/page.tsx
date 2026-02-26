'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Search, MoreVertical, Edit, Trash2, Shield } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  points: number;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/admin/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { bg: string; color: string; text: string }> = {
      member: { bg: '#E8EAFC', color: "rgb(91, 107, 230)", text: '用户' },
      admin: { bg: '#FEF3C7', color: '#D97706', text: '管理员' },
      superadmin: { bg: '#FDECEC', color: '#F4726B', text: '超级管理员' },
    };
    const style = roles[role] || roles.member;
    return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', background: style.bg, color: style.color }}>{style.text}</span>;
  };

  if (loading) {
    return (
      <div className="users-page" style={{ padding: '24px' }}>
        <div style={{ height: '200px', background: 'white', borderRadius: '12px', animation: 'shimmer 1.5s infinite' }}></div>
        <style jsx>{`@keyframes shimmer { 0% { opacity: 1 } 50% { opacity: 0.5 } 100% { opacity: 1 } }`}</style>
      </div>
    );
  }

  return (
    <div className="users-page" style={{ padding: '24px' }}>
      {/* Header */}
      <div className="users-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>用户管理</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>管理系统用户和权限</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#5B6BE6', color: 'white', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
          <Plus size={18} /> 添加用户
        </button>
      </div>

      {/* Search */}
      <div className="users-search" style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
          <input
            type="text"
            placeholder="搜索用户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="users-table-container" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="users-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#718096' }}>用户</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#718096' }}>角色</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#718096' }}>积分</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#718096' }}>注册时间</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#718096' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id} style={{ borderTop: index > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#E8EAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "rgb(91, 107, 230)", fontWeight: 600 }}>{user.name?.[0] || 'U'}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#2D3748' }}>{user.name || '未设置'}</div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>{getRoleBadge(user.role)}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#2D3748' }}>{user.points || 0}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#718096' }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '-'}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: '#718096' }}>暂无用户数据</div>
        )}
      </div>
    </div>
  );
}
