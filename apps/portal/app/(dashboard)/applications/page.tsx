'use client';

import { useState, useEffect } from 'react';
import { FileText, Search, Check, X, Eye, Clock, Building2, Mail, Phone, Calendar } from 'lucide-react';

interface Application {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  businessLicense: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  notes?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    setLoading(true);
    setTimeout(() => {
      setApplications([
        {
          id: 'PA-001',
          companyName: '北京精印刷业有限公司',
          contactName: '张经理',
          email: 'zhang@jingyinshua.com',
          phone: '138-0000-0001',
          businessLicense: '91110000xxxxx',
          description: '专注高端印刷20年，拥有海德堡等进口印刷设备。',
          status: 'pending',
          appliedAt: '2026-02-20',
        },
        {
          id: 'PA-002',
          companyName: '上海彩印包装有限公司',
          contactName: '李总监',
          email: 'li@shanghaicaiyin.com',
          phone: '138-0000-0002',
          businessLicense: '91310000xxxxx',
          description: '专业从事彩色印刷和包装业务。',
          status: 'pending',
          appliedAt: '2026-02-21',
        },
        {
          id: 'PA-003',
          companyName: '广州数码印刷中心',
          contactName: '王老板',
          email: 'wang@guangzhoushuma.com',
          phone: '138-0000-0003',
          businessLicense: '91440000xxxxx',
          description: '数字印刷先行者，小批量定制专家。',
          status: 'approved',
          appliedAt: '2026-02-15',
          reviewedAt: '2026-02-18',
          notes: '资质审核通过，欢迎加入平台。',
        },
        {
          id: 'PA-004',
          companyName: '深圳快速印刷店',
          contactName: '陈店长',
          email: 'chen@szkuaisu.com',
          phone: '138-0000-0004',
          businessLicense: '91440000xxxxx',
          description: '24小时快速交货，品质保证。',
          status: 'rejected',
          appliedAt: '2026-02-10',
          reviewedAt: '2026-02-12',
          notes: '抱歉，您的资质暂不符合要求。',
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; text: string }> = {
      pending: { bg: '#FEF3C7', color: '#D97706', text: '待审核' },
      approved: { bg: '#D1FAE5', color: '#059669', text: '已通过' },
      rejected: { bg: '#FEE2E2', color: '#F4726B', text: '已拒绝' },
    };
    const s = styles[status] || styles.pending;
    return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', background: s.bg, color: s.color }}>{s.text}</span>;
  };

  const handleApprove = (id: string) => {
    setApplications(applications.map(a => 
      a.id === id ? { ...a, status: 'approved', reviewedAt: new Date().toISOString().split('T')[0] } : a
    ));
    setSelectedApp(null);
  };

  const handleReject = (id: string) => {
    setApplications(applications.map(a => 
      a.id === id ? { ...a, status: 'rejected', reviewedAt: new Date().toISOString().split('T')[0] } : a
    ));
    setSelectedApp(null);
  };

  const filteredApps = applications.filter(a => {
    const matchSearch = a.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return <div style={{ padding: 24 }}><div style={{ height: 400, background: 'white', borderRadius: 12 }}></div></div>;
  }

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>申请审批</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>审核印刷厂入驻申请</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{applications.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>总申请数</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#D97706' }}>{applications.filter(a => a.status === 'pending').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>待审核</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{applications.filter(a => a.status === 'approved').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>已通过</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
          <input type="text" placeholder="搜索申请..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px 16px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
          <option value="all">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>

      {/* Applications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredApps.map((app) => (
          <div key={app.id} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 16, flex: 1 }}>
                <div style={{ width: 48, height: 48, background: '#E8EAFC', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={24} style={{ color: 'rgb(91, 107, 230)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D3748' }}>{app.companyName}</h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <p style={{ fontSize: 13, color: '#718096', marginBottom: 12 }}>{app.description}</p>
                  <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#718096' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={14} /> {app.email}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={14} /> {app.phone}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> 申请于 {app.appliedAt}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setSelectedApp(app)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#718096' }}>
                  <Eye size={14} /> 详情
                </button>
                {app.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(app.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px', background: '#D1FAE5', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#059669' }}>
                      <Check size={14} /> 通过
                    </button>
                    <button onClick={() => handleReject(app.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px', background: '#FEE2E2', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#F4726B' }}>
                      <X size={14} /> 拒绝
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
