'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, Key, X, Check, Loader2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  points: number;
  status: 'active' | 'disabled';
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'reset'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', points: 0 });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

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
      if (res.ok) {
        const data = await res.json();
        setUsers(data.filter((u: User) => u.role === 'member'));
      }
    } catch (err) {
      setUsers([
        { id: '1', email: 'user1@demo.com', name: '张三', role: 'member', points: 500, status: 'active', createdAt: '2026-01-15' },
        { id: '2', email: 'user2@demo.com', name: '李四', role: 'member', points: 300, status: 'active', createdAt: '2026-01-20' },
        { id: '3', email: 'wangwu@demo.com', name: '王五', role: 'member', points: 1000, status: 'active', createdAt: '2026-02-01' },
        { id: '4', email: 'zhaoliu@demo.com', name: '赵六', role: 'member', points: 0, status: 'disabled', createdAt: '2026-02-10' },
      ]);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setModalType('add');
    setFormData({ name: '', email: '', points: 0 });
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setModalType('edit');
    setFormData({ name: user.name, email: user.email, points: user.points });
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = (user: User) => {
    setModalType('delete');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleResetPassword = (user: User) => {
    setModalType('reset');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    setSaving(true);
    
    // API call would go here
    setTimeout(() => {
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      setSuccess(`用户已${newStatus === 'active' ? '启用' : '禁用'}`);
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      if (modalType === 'add') {
        const newUser: User = {
          id: Date.now().toString(),
          email: formData.email,
          name: formData.name,
          role: 'member',
          points: formData.points,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
        setSuccess('用户创建成功');
      } else if (modalType === 'edit' && selectedUser) {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
        setSuccess('用户更新成功');
      } else if (modalType === 'delete' && selectedUser) {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setSuccess('用户删除成功');
      } else if (modalType === 'reset' && selectedUser) {
        setSuccess('密码已重置为: password123');
      }
      
      setShowModal(false);
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {/* Success Message */}
      {success && (
        <div style={{ 
          position: 'fixed', top: 80, right: 24, 
          background: '#059669', color: 'white', 
          padding: '12px 20px', borderRadius: 8, 
          zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
        }}>
          {success}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>用户管理</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>管理普通用户账号</p>
        </div>
        <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          <Plus size={18} /> 添加用户
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{users.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>总用户数</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{users.filter(u => u.status === 'active').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>活跃用户</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#F4726B' }}>{users.filter(u => u.status === 'disabled').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>已禁用</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#A0AEC0' }} />
          <input
            type="text"
            placeholder="搜索用户姓名或邮箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>用户</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>邮箱</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>积分</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>状态</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>注册时间</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#718096' }}><Loader2 className="animate-spin" size={24} />加载中...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#718096' }}>暂无数据</td></tr>
            ) : (
              filteredUsers.map((user, i) => (
                <tr key={user.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: '#E8EAFC', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)' }}>
                        <Users size={20} />
                      </div>
                      <span style={{ fontWeight: 500, color: '#2D3748' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{user.email}</td>
                  <td style={{ padding: 16, color: '#059669', fontWeight: 500 }}>{user.points}</td>
                  <td style={{ padding: 16 }}>
                    <button 
                      onClick={() => handleToggleStatus(user)}
                      disabled={saving}
                      style={{ 
                        padding: '4px 10px', borderRadius: 12, fontSize: 12, 
                        background: user.status === 'active' ? '#D1FAE5' : '#FEE2E2', 
                        color: user.status === 'active' ? '#059669' : '#F4726B',
                        border: 'none', cursor: 'pointer' 
                      }}>
                      {user.status === 'active' ? '已启用' : '已禁用'}
                    </button>
                  </td>
                  <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{user.createdAt}</td>
                  <td style={{ padding: 16, textAlign: 'right' }}>
                    <button onClick={() => handleEdit(user)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button>
                    <button onClick={() => handleResetPassword(user)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#D97706' }}><Key size={16} /></button>
                    <button onClick={() => handleDelete(user)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
        }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, width: '90%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#2D3748' }}>
                {modalType === 'add' ? '添加用户' : modalType === 'edit' ? '编辑用户' : modalType === 'delete' ? '删除用户' : '重置密码'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096' }}><X size={20} /></button>
            </div>

            {modalType === 'delete' ? (
              <div>
                <p style={{ color: '#718096', marginBottom: 20 }}>确定要删除用户 <strong>{selectedUser?.name}</strong> 吗？此操作不可恢复。</p>
              </div>
            ) : modalType === 'reset' ? (
              <div>
                <p style={{ color: '#718096', marginBottom: 20 }}>确定要重置用户 <strong>{selectedUser?.name}</strong> 的密码吗？</p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>姓名</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>邮箱</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#718096', marginBottom: 6 }}>初始积分</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', padding: 10, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: '#F5F7FB', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#718096' }}>取消</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: 'rgb(91, 107, 230)', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                {saving && <Loader2 size={16} className="animate-spin" />}
                {modalType === 'add' ? '创建' : modalType === 'edit' ? '保存' : modalType === 'delete' ? '删除' : '重置'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
