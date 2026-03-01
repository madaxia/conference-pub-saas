'use client';

import { useState, useEffect } from 'react';
import { FileText, Search, Eye, Download, X, Loader2, Package } from 'lucide-react';

interface Order {
  id: string;
  orderNo: string;
  customer: string;
  project: string;
  amount: number;
  status: 'pending' | 'processing' | 'printing' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setTimeout(() => {
      setOrders([
        { id: '1', orderNo: 'ORD20260226001', customer: '张三', project: '2026年度大会', amount: 1500, status: 'completed', createdAt: '2026-02-20' },
        { id: '2', orderNo: 'ORD20260226002', customer: '李四', project: '技术研讨会', amount: 800, status: 'printing', createdAt: '2026-02-22' },
        { id: '3', orderNo: 'ORD20260226003', customer: '王五', project: '新产品发布会', amount: 2200, status: 'pending', createdAt: '2026-02-25' },
        { id: '4', orderNo: 'ORD20260226004', customer: '赵六', project: '培训资料', amount: 500, status: 'processing', createdAt: '2026-02-26' },
        { id: '5', orderNo: 'ORD20260226005', customer: '钱七', project: '年度总结', amount: 1800, status: 'shipped', createdAt: '2026-02-18' },
        { id: '6', orderNo: 'ORD20260226006', customer: '孙八', project: '产品手册', amount: 0, status: 'cancelled', createdAt: '2026-02-15' },
      ]);
      setLoading(false);
    }, 500);
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || o.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleUpdateStatus = (order: Order, newStatus: string) => {
    setSaving(true);
    setTimeout(() => {
      setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus as Order['status'] } : o));
      setSuccess('订单状态已更新');
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#FEF3C7', text: '#D97706' },
    processing: { bg: '#E8EAFC', text: 'rgb(91, 107, 230)' },
    printing: { bg: '#E8EAFC', text: 'rgb(91, 107, 230)' },
    shipped: { bg: '#D1FAE5', text: '#059669' },
    completed: { bg: '#D1FAE5', text: '#059669' },
    cancelled: { bg: '#FEE2E2', text: '#F4726B' },
  };

  const statusLabels: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    printing: '印刷中',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  };

  const totalAmount = orders.filter(o => o.status !== 'cancelled').reduce((a, b) => a + b.amount, 0);

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {success && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: '#059669', color: 'white', padding: '12px 20px', borderRadius: 8, zIndex: 1000 }}>
          {success}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>订单管理</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>管理所有印刷订单</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{orders.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>总订单</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#D97706' }}>{orders.filter(o => o.status === 'pending').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>待处理</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'rgb(91, 107, 230)' }}>{orders.filter(o => ['processing', 'printing'].includes(o.status)).length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>处理中</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{orders.filter(o => ['shipped', 'completed'].includes(o.status)).length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>已完成</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>¥{totalAmount}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>总金额</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 300, flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#A0AEC0' }} />
          <input type="text" placeholder="搜索订单号、客户、项目..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px 16px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}>
          <option value="all">全部状态</option>
          <option value="pending">待处理</option>
          <option value="processing">处理中</option>
          <option value="printing">印刷中</option>
          <option value="shipped">已发货</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>订单号</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>客户</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>项目</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>金额</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>状态</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#718096' }}>创建时间</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#718096' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center' }}><Loader2 className="animate-spin" size={24} />加载中...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#718096' }}>暂无订单</td></tr>
            ) : (
              filteredOrders.map((order, i) => (
                <tr key={order.id} style={{ borderTop: i > 0 ? '1px solid #E2E8F0' : 'none' }}>
                  <td style={{ padding: 16, fontFamily: 'monospace', color: '#2D3748', fontWeight: 500 }}>{order.orderNo}</td>
                  <td style={{ padding: 16, color: '#718096' }}>{order.customer}</td>
                  <td style={{ padding: 16, color: '#2D3748' }}>{order.project}</td>
                  <td style={{ padding: 16, color: '#059669', fontWeight: 600 }}>¥{order.amount}</td>
                  <td style={{ padding: 16 }}>
                    <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, background: statusColors[order.status].bg, color: statusColors[order.status].text }}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td style={{ padding: 16, color: '#718096', fontSize: 14 }}>{order.createdAt}</td>
                  <td style={{ padding: 16, textAlign: 'right' }}>
                    <button onClick={() => handleView(order)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}><Eye size={16} /></button>
                    {order.status === 'pending' && (
                      <button onClick={() => handleUpdateStatus(order, 'processing')} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgb(91, 107, 230)' }} title="开始处理">▶</button>
                    )}
                    {order.status === 'processing' && (
                      <button onClick={() => handleUpdateStatus(order, 'printing')} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgb(91, 107, 230)' }} title="开始印刷">🖨</button>
                    )}
                    {order.status === 'printing' && (
                      <button onClick={() => handleUpdateStatus(order, 'shipped')} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#059669' }} title="标记发货">📦</button>
                    )}
                    {order.status === 'shipped' && (
                      <button onClick={() => handleUpdateStatus(order, 'completed')} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#059669' }} title="确认完成">✓</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, width: '90%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#2D3748' }}>订单详情</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096' }}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: 12 }}><strong>订单号:</strong> {selectedOrder.orderNo}</div>
            <div style={{ marginBottom: 12 }}><strong>客户:</strong> {selectedOrder.customer}</div>
            <div style={{ marginBottom: 12 }}><strong>项目:</strong> {selectedOrder.project}</div>
            <div style={{ marginBottom: 12 }}><strong>金额:</strong> ¥{selectedOrder.amount}</div>
            <div style={{ marginBottom: 12 }}><strong>状态:</strong> {statusLabels[selectedOrder.status]}</div>
            <div style={{ marginBottom: 12 }}><strong>创建时间:</strong> {selectedOrder.createdAt}</div>
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #E2E8F0' }}>
              <p style={{ fontSize: 14, color: '#718096', marginBottom: 12 }}>更新订单状态:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['pending', 'processing', 'printing', 'shipped', 'completed', 'cancelled'].map(s => (
                  <button key={s} onClick={() => { handleUpdateStatus(selectedOrder, s); setShowModal(false); }} disabled={saving || selectedOrder.status === s} style={{ padding: '8px 12px', background: selectedOrder.status === s ? 'rgb(91, 107, 230)' : '#F5F7FB', color: selectedOrder.status === s ? 'white' : '#718096', border: 'none', borderRadius: 6, cursor: selectedOrder.status === s ? 'default' : 'pointer', fontSize: 13 }}>
                    {statusLabels[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
