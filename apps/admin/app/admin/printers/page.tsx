'use client';

import { useState, useEffect } from 'react';
import { Printer, Plus, Search, Edit, Trash2, Building2, User, Phone, CheckCircle, XCircle } from 'lucide-react';

interface PrinterCompany {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  printerCount: number;
  createdAt: string;
}

interface PrinterAccount {
  id: string;
  email: string;
  name: string;
  companyName: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export default function PrintersPage() {
  const [companies, setCompanies] = useState<PrinterCompany[]>([]);
  const [accounts, setAccounts] = useState<PrinterAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'companies' | 'accounts'>('companies');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Mock companies data
    setCompanies([
      { id: '1', name: '北京印刷厂', contact: '张经理', phone: '010-12345678', address: '北京市朝阳区', status: 'active', printerCount: 5, createdAt: '2026-01-10' },
      { id: '2', name: '上海印刷公司', contact: '李总', phone: '021-87654321', address: '上海市浦东新区', status: 'active', printerCount: 3, createdAt: '2026-01-15' },
      { id: '3', name: '广州印刷厂', contact: '王生', phone: '020-11112222', address: '广州市天河区', status: 'inactive', printerCount: 0, createdAt: '2026-02-01' },
    ]);

    // Mock printer accounts data
    setAccounts([
      { id: '1', email: 'print@demo.com', name: '北京印刷厂账号', companyName: '北京印刷厂', status: 'active', lastLogin: '2026-02-26', createdAt: '2026-01-10' },
      { id: '2', email: 'shanghai@demo.com', name: '上海印刷账号', companyName: '上海印刷公司', status: 'active', lastLogin: '2026-02-25', createdAt: '2026-01-15' },
      { id: '3', email: 'guangzhou@demo.com', name: '广州印刷账号', companyName: '广州印刷厂', status: 'inactive', lastLogin: '2026-02-20', createdAt: '2026-02-01' },
    ]);
    
    setLoading(false);
  };

  const filteredCompanies = companies.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccounts = accounts.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: 24 }}><div style={{ height: 400, background: 'white', borderRadius: 12 }}></div></div>;
  }

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>印刷厂管理</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>管理印刷厂企业及账号</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          <Plus size={18} /> 添加{activeTab === 'companies' ? '印刷厂' : '账号'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('companies')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'companies' ? 'rgb(91, 107, 230)' : 'white',
            color: activeTab === 'companies' ? 'white' : '#718096',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          <Building2 size={16} style={{ marginRight: 8 }} />
          印刷厂企业 ({companies.length})
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'accounts' ? 'rgb(91, 107, 230)' : 'white',
            color: activeTab === 'accounts' ? 'white' : '#718096',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          <User size={16} style={{ marginRight: 8 }} />
          印刷厂账号 ({accounts.length})
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{companies.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>总印刷厂</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{companies.filter(p => p.status === 'active').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>已启用</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'rgb(91, 107, 230)' }}>{accounts.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>账号总数</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{accounts.filter(a => a.status === 'active').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>活跃账号</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#A0AEC0' }} />
          <input
            type="text"
            placeholder={activeTab === 'companies' ? "搜索印刷厂名称或联系人..." : "搜索账号姓名、邮箱或企业..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
        {activeTab === 'companies' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>印刷厂</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>联系人</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>联系方式</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>打印机</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>状态</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((printer, i) => (
                <tr key={printer.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: '#E8EAFC', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)' }}>
                        <Building2 size={20} />
                      </div>
                      <span style={{ fontWeight: 500, color: '#2D3748' }}>{printer.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{printer.contact}</td>
                  <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{printer.phone}</td>
                  <td style={{ padding: 16, color: '#2D3748', fontWeight: 500 }}>{printer.printerCount}</td>
                  <td style={{ padding: 16 }}>
                    <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, background: printer.status === 'active' ? '#D1FAE5' : '#FEE2E2', color: printer.status === 'active' ? '#059669' : '#F4726B' }}>
                      {printer.status === 'active' ? '已启用' : '已禁用'}
                    </span>
                  </td>
                  <td style={{ padding: 16, textAlign: 'right' }}>
                    <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button>
                    <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>账号</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>所属企业</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>最后登录</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>创建时间</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>状态</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account, i) => (
                <tr key={account.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: '#FEF3C7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                        <User size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: '#2D3748' }}>{account.name}</div>
                        <div style={{ fontSize: 12, color: '#718096' }}>{account.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{account.companyName}</td>
                  <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{account.lastLogin}</td>
                  <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{account.createdAt}</td>
                  <td style={{ padding: 16 }}>
                    <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, background: account.status === 'active' ? '#D1FAE5' : '#FEE2E2', color: account.status === 'active' ? '#059669' : '#F4726B' }}>
                      {account.status === 'active' ? '已启用' : '已禁用'}
                    </span>
                  </td>
                  <td style={{ padding: 16, textAlign: 'right' }}>
                    <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Edit size={16} /></button>
                    <button style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
