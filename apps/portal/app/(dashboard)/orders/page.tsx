'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Filter, Eye, Truck, CheckCircle, Clock, XCircle, MoreVertical, Download, Printer, Calendar } from 'lucide-react';

interface Order {
  id: string;
  projectName: string;
  customerName: string;
  quantity: number;
  pages: number;
  paperType: string;
  binding: string;
  status: 'pending' | 'processing' | 'printing' | 'shipped' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    setTimeout(() => {
      setOrders([
        {
          id: 'PO-20260201',
          projectName: '2026国际会议会刊',
          customerName: '张三',
          quantity: 500,
          pages: 156,
          paperType: '铜版纸157g',
          binding: '无线胶装',
          status: 'processing',
          totalPrice: 8500,
          createdAt: '2026-02-20',
          updatedAt: '2026-02-22',
        },
        {
          id: 'PO-20260202',
          projectName: '技术研讨会论文集',
          customerName: '李四',
          quantity: 200,
          pages: 89,
          paperType: '哑光纸120g',
          binding: '锁线胶装',
          status: 'printing',
          totalPrice: 4200,
          createdAt: '2026-02-18',
          updatedAt: '2026-02-24',
        },
        {
          id: 'PO-20260203',
          projectName: '产业论坛报告',
          customerName: '王五',
          quantity: 1000,
          pages: 45,
          paperType: '书写纸80g',
          binding: '骑马钉',
          status: 'shipped',
          totalPrice: 3200,
          createdAt: '2026-02-15',
          updatedAt: '2026-02-23',
          deliveryDate: '2026-02-26',
        },
        {
          id: 'PO-20260204',
          projectName: '医学论坛论文集',
          customerName: '赵六',
          quantity: 300,
          pages: 234,
          paperType: '特种纸',
          binding: '精装',
          status: 'completed',
          totalPrice: 12000,
          createdAt: '2026-02-10',
          updatedAt: '2026-02-20',
          deliveryDate: '2026-02-22',
        },
        {
          id: 'PO-20260205',
          projectName: '教育研讨会会刊',
          customerName: '孙七',
          quantity: 150,
          pages: 67,
          paperType: '铜版纸128g',
          binding: '无线胶装',
          status: 'pending',
          totalPrice: 2800,
          createdAt: '2026-02-25',
          updatedAt: '2026-02-25',
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; text: string; icon: any }> = {
      pending: { bg: '#FEF3C7', color: '#D97706', text: '待处理', icon: <Clock size={14} /> },
      processing: { bg: '#E8EAFC', color: 'rgb(91, 107, 230)', text: '处理中', icon: <Package size={14} /> },
      printing: { bg: '#FCE7F3', color: '#DB2777', text: '印刷中', icon: <Printer size={14} /> },
      shipped: { bg: '#DBEAFE', color: '#2563EB', text: '已发货', icon: <Truck size={14} /> },
      completed: { bg: '#D1FAE5', color: '#059669', text: '已完成', icon: <CheckCircle size={14} /> },
      cancelled: { bg: '#FEE2E2', color: '#F4726B', text: '已取消', icon: <XCircle size={14} /> },
    };
    const s = styles[status] || styles.pending;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', background: s.bg, color: s.color }}>
        {s.icon} {s.text}
      </span>
    );
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any, updatedAt: new Date().toISOString().split('T')[0] } : o));
  };

  if (loading) {
    return <div style={{ padding: 24 }}><div style={{ height: 400, background: 'white', borderRadius: 12 }}></div></div>;
  }

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>订单管理</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>管理所有印刷订单</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
          <Package size={18} /> 新建订单
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '总订单', value: orders.length, color: '#2D3748' },
          { label: '待处理', value: orders.filter(o => o.status === 'pending').length, color: '#D97706' },
          { label: '处理中', value: orders.filter(o => o.status === 'processing').length, color: 'rgb(91, 107, 230)' },
          { label: '印刷中', value: orders.filter(o => o.status === 'printing').length, color: '#DB2777' },
          { label: '已发货', value: orders.filter(o => o.status === 'shipped').length, color: '#2563EB' },
          { label: '已完成', value: orders.filter(o => o.status === 'completed').length, color: '#059669' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#718096' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
          <input type="text" placeholder="搜索订单..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px 16px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
          <option value="all">全部状态</option>
          <option value="pending">待处理</option>
          <option value="processing">处理中</option>
          <option value="printing">印刷中</option>
          <option value="shipped">已发货</option>
          <option value="completed">已完成</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>订单号</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>项目</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>客户</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>规格</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>数量</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>金额</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>状态</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>创建时间</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id} style={{ borderTop: index > 0 ? '1px solid #E2E8F0' : 'none' }}>
                <td style={{ padding: 16, fontSize: 13, fontWeight: 600, color: 'rgb(91, 107, 230)' }}>{order.id}</td>
                <td style={{ padding: 16, fontSize: 14, color: '#2D3748' }}>{order.projectName}</td>
                <td style={{ padding: 16, fontSize: 14, color: '#718096' }}>{order.customerName}</td>
                <td style={{ padding: 16, fontSize: 13, color: '#718096' }}>{order.pages}页/{order.paperType}/{order.binding}</td>
                <td style={{ padding: 16, fontSize: 14, color: '#2D3748' }}>{order.quantity}本</td>
                <td style={{ padding: 16, fontSize: 14, fontWeight: 600, color: '#2D3748' }}>¥{order.totalPrice.toLocaleString()}</td>
                <td style={{ padding: 16 }}>{getStatusBadge(order.status)}</td>
                <td style={{ padding: 16, fontSize: 13, color: '#718096' }}>{order.createdAt}</td>
                <td style={{ padding: 16, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    <button onClick={() => setSelectedOrder(order)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Eye size={16} /></button>
                    {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'processing')} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgb(91, 107, 230)' }}><Package size={16} /></button>}
                    {order.status === 'processing' && <button onClick={() => updateOrderStatus(order.id, 'printing')} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#DB2777' }}><Printer size={16} /></button>}
                    {order.status === 'printing' && <button onClick={() => updateOrderStatus(order.id, 'shipped')} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#2563EB' }}><Truck size={16} /></button>}
                    {order.status === 'shipped' && <button onClick={() => updateOrderStatus(order.id, 'completed')} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#059669' }}><CheckCircle size={16} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
