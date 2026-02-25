'use client';

import { useState, useEffect } from 'react';
import { Printer, Search, MoreVertical, Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface Order {
  id: string;
  projectName?: string;
  printerName?: string;
  status: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/admin/orders', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = { pending: <Clock size={16} />, processing: <Package size={16} />, shipped: <Truck size={16} />, completed: <CheckCircle size={16} /> };
    return icons[status] || <Clock size={16} />;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string; text: string }> = {
      pending: { bg: '#FEF3C7', color: '#D97706', text: '待处理' },
      processing: { bg: '#E8EAFC', color: "rgb(91, 107, 230)", text: '处理中' },
      shipped: { bg: '#DBEAFE', color: '#2563EB', text: '已发货' },
      completed: { bg: '#D1FAE5', color: '#059669', text: '已完成' },
    };
    const s = colors[status] || colors.pending;
    return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', background: s.bg, color: s.color }}>{s.text}</span>;
  };

  if (loading) return <div style={{ padding: '24px' }}><div style={{ height: '200px', background: 'white', borderRadius: '12px', animation: 'shimmer 1.5s infinite' }}></div></div>;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>订单管理</h1>
        <p style={{ color: '#718096', fontSize: '14px' }}>管理所有印刷订单</p>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8FAFC' }}>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#718096' }}>订单</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#718096' }}>印刷厂</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#718096' }}>数量</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#718096' }}>金额</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#718096' }}>状态</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#718096' }}>时间</th>
          </tr></thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} style={{ borderTop: index > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: '16px', fontSize: '14px', color: '#2D3748' }}>{order.projectName || '订单' + order.id.slice(0,8)}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#718096' }}>{order.printerName || '-'}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#2D3748' }}>{order.quantity || 0}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#2D3748', fontWeight: 500 }}>¥{order.totalPrice || 0}</td>
                <td style={{ padding: '16px' }}>{getStatusBadge(order.status)}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#718096' }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('zh-CN') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div style={{ padding: '60px', textAlign: 'center', color: '#718096' }}>暂无订单</div>}
      </div>
    </div>
  );
}
