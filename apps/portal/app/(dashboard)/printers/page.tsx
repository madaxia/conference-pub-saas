'use client';

import { useState, useEffect } from 'react';
import { Printer, Plus, Search, Edit, Trash2, Eye, Power, Settings, Upload, Download } from 'lucide-react';

interface Printer {
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'busy';
  location: string;
  capabilities: string[];
  paperTypes: string[];
  createdAt: string;
}

export default function PrintersPage() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPrinters();
  }, []);

  const fetchPrinters = () => {
    setLoading(true);
    // Demo data
    setTimeout(() => {
      setPrinters([
        {
          id: '1',
          name: 'HP Indigo 7900',
          model: 'HP Indigo Digital Press',
          status: 'online',
          location: '印刷车间A区',
          capabilities: ['彩色印刷', '双面印刷', '可变数据'],
          paperTypes: ['铜版纸', '哑光纸', '特种纸'],
          createdAt: '2025-06-15',
        },
        {
          id: '2',
          name: 'Xerox Iridesse',
          model: 'Xerox Iridesse Production Press',
          status: 'online',
          location: '印刷车间B区',
          capabilities: ['6色印刷', '金属色', '荧光色'],
          paperTypes: ['铜版纸', '卡纸', ' vinyl'],
          createdAt: '2025-08-20',
        },
        {
          id: '3',
          name: 'Canon imagePRESS',
          model: 'Canon imagePRESS V1350',
          status: 'busy',
          location: '印刷车间A区',
          capabilities: ['彩色印刷', '高速输出'],
          paperTypes: ['铜版纸', '书写纸'],
          createdAt: '2025-10-10',
        },
        {
          id: '4',
          name: 'Konica Minolta',
          model: 'Konica Minolta C14000',
          status: 'offline',
          location: '印刷车间C区',
          capabilities: ['彩色印刷', '大幅面'],
          paperTypes: ['卷筒纸', '单张纸'],
          createdAt: '2025-11-05',
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; text: string }> = {
      online: { bg: '#D1FAE5', color: '#059669', text: '在线' },
      busy: { bg: '#FEF3C7', color: '#D97706', text: '工作中' },
      offline: { bg: '#FEE2E2', color: '#F4726B', text: '离线' },
    };
    const s = styles[status] || styles.offline;
    return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', background: s.bg, color: s.color }}>{s.text}</span>;
  };

  const filteredPrinters = printers.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
        <div style={{ height: 400, background: 'white', borderRadius: 12 }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>打印机管理</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>管理印刷厂打印机设备</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
          <Plus size={18} /> 添加打印机
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{printers.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>打印机总数</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{printers.filter(p => p.status === 'online').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>在线</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#D97706' }}>{printers.filter(p => p.status === 'busy').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>工作中</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#F4726B' }}>{printers.filter(p => p.status === 'offline').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>离线</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
          <input
            type="text"
            placeholder="搜索打印机..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none' }}
          />
        </div>
      </div>

      {/* Printer Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {filteredPrinters.map((printer) => (
          <div key={printer.id} style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, background: '#E8EAFC', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Printer size={24} style={{ color: 'rgb(91, 107, 230)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D3748' }}>{printer.name}</h3>
                  <p style={{ fontSize: 13, color: '#718096' }}>{printer.model}</p>
                </div>
              </div>
              {getStatusBadge(printer.status)}
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#718096', marginBottom: 4 }}>位置: {printer.location}</div>
              <div style={{ fontSize: 13, color: '#718096', marginBottom: 8 }}>功能: {printer.capabilities.join(', ')}</div>
              <div style={{ fontSize: 13, color: '#718096' }}>纸张: {printer.paperTypes.join(', ')}</div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 8, background: '#F5F7FB', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#718096' }}>
                <Eye size={14} /> 查看
              </button>
              <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 8, background: '#F5F7FB', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#718096' }}>
                <Settings size={14} /> 配置
              </button>
              <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 8, background: printer.status === 'online' ? '#FEE2E2' : '#D1FAE5', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: printer.status === 'online' ? '#F4726B' : '#059669' }}>
                <Power size={14} /> {printer.status === 'online' ? '关机' : '开机'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
