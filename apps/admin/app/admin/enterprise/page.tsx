'use client';

import { useState, useEffect } from 'react';
import { Building2, Search, Edit, Trash2, CheckCircle, XCircle, Plus } from 'lucide-react';

interface Enterprise {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  status: 'pending' | 'active' | 'rejected';
  employeeCount: number;
  createdAt: string;
}

export default function Page() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEnterprises();
  }, []);

  const fetchEnterprises = async () => {
    setLoading(true);
    // Mock data
    setEnterprises([
      { id: '1', name: '科技创新有限公司', contact: '张总', phone: '138-0000-0001', email: 'zhang@tech.com', status: 'active', employeeCount: 50, createdAt: '2026-01-10' },
      { id: '2', name: '教育培训集团', contact: '李老师', phone: '138-0000-0002', email: 'li@edu.com', status: 'active', employeeCount: 120, createdAt: '2026-01-15' },
      { id: '3', name: '医疗健康中心', contact: '王医生', phone: '138-0000-0003', email: 'wang@medical.com', status: 'pending', employeeCount: 30, createdAt: '2026-02-20' },
      { id: '4', name: '文化传媒公司', contact: '赵总', phone: '138-0000-0004', email: 'zhao@media.com', status: 'rejected', employeeCount: 25, createdAt: '2026-02-18' },
    ]);
    setLoading(false);
  };

  const filteredEnterprises = enterprises.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: 24 }}><div style={{ height: 400, background: 'white', borderRadius: 12 }}></div></div>;
  }

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>企业管理</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>管理企业用户</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          <Plus size={18} /> 添加企业
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{enterprises.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>企业总数</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{enterprises.filter(e => e.status === 'active').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>已通过</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#D97706' }}>{enterprises.filter(e => e.status === 'pending').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>待审核</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#F4726B' }}>{enterprises.filter(e => e.status === 'rejected').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>已拒绝</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#A0AEC0' }} />
          <input
            type="text"
            placeholder="搜索企业名称或联系人..."
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
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>企业名称</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>联系人</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>联系方式</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>员工数</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>状态</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>申请时间</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnterprises.map((enterprise, i) => (
              <tr key={enterprise.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: '#E8EAFC', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)' }}>
                      <Building2 size={20} />
                    </div>
                    <span style={{ fontWeight: 500, color: '#2D3748' }}>{enterprise.name}</span>
                  </div>
                </td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{enterprise.contact}</td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{enterprise.phone}</td>
                <td style={{ padding: 16, color: '#2D3748', fontWeight: 500 }}>{enterprise.employeeCount}</td>
                <td style={{ padding: 16 }}>
                  <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, background: enterprise.status === 'active' ? '#D1FAE5' : enterprise.status === 'pending' ? '#FEF3C7' : '#FEE2E2', color: enterprise.status === 'active' ? '#059669' : enterprise.status === 'pending' ? '#D97706' : '#F4726B' }}>
                    {enterprise.status === 'active' ? '已通过' : enterprise.status === 'pending' ? '待审核' : '已拒绝'}
                  </span>
                </td>
                <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{enterprise.createdAt}</td>
                <td style={{ padding: 16, textAlign: 'right' }}>
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
