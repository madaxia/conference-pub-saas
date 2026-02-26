'use client';

import { useState, useEffect } from 'react';
import { Printer, Package, FileText, Clock, CheckCircle, Truck, TrendingUp, DollarSign, Users } from 'lucide-react';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  printers: number;
  revenue: number;
  thisMonth: number;
}

interface RecentOrder {
  id: string;
  projectName: string;
  status: string;
  quantity: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    printers: 0,
    revenue: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalOrders: 156,
        pendingOrders: 12,
        completedOrders: 138,
        printers: 4,
        revenue: 286500,
        thisMonth: 45600,
      });
      setRecentOrders([
        { id: 'PO-001', projectName: '2026国际会议会刊', status: 'processing', quantity: 500 },
        { id: 'PO-002', projectName: '技术研讨会论文集', status: 'printing', quantity: 200 },
        { id: 'PO-003', projectName: '产业论坛报告', status: 'shipped', quantity: 1000 },
        { id: 'PO-004', projectName: '医学论坛论文集', status: 'completed', quantity: 300 },
        { id: 'PO-005', projectName: '教育研讨会会刊', status: 'pending', quantity: 150 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const statCards = [
    { title: '总订单', value: stats.totalOrders, icon: <Package size={24} />, color: 'rgb(91, 107, 230)', bg: '#E8EAFC' },
    { title: '待处理', value: stats.pendingOrders, icon: <Clock size={24} />, color: '#D97706', bg: '#FEF3C7' },
    { title: '已完成', value: stats.completedOrders, icon: <CheckCircle size={24} />, color: '#059669', bg: '#D1FAE5' },
    { title: '打印机', value: stats.printers, icon: <Printer size={24} />, color: '#4ECB71', bg: '#E8F8F0' },
  ];

  const revenueCards = [
    { title: '总收入', value: `¥${(stats.revenue / 10000).toFixed(1)}万`, icon: <DollarSign size={24} />, trend: '+12%', color: 'rgb(91, 107, 230)' },
    { title: '本月收入', value: `¥${(stats.thisMonth / 10000).toFixed(1)}万`, icon: <TrendingUp size={24} />, trend: '+8%', color: '#059669' },
    { title: '活跃客户', value: '28', icon: <Users size={24} />, trend: '+5%', color: '#9B6BF5' },
    { title: '完成率', value: `${Math.round(stats.completedOrders / stats.totalOrders * 100)}%`, icon: <CheckCircle size={24} />, trend: '+3%', color: '#FFB347' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; text: string }> = {
      pending: { bg: '#FEF3C7', color: '#D97706', text: '待处理' },
      processing: { bg: '#E8EAFC', color: 'rgb(91, 107, 230)', text: '处理中' },
      printing: { bg: '#FCE7F3', color: '#DB2777', text: '印刷中' },
      shipped: { bg: '#DBEAFE', color: '#2563EB', text: '已发货' },
      completed: { bg: '#D1FAE5', color: '#059669', text: '已完成' },
    };
    const s = styles[status] || styles.pending;
    return <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '11px', background: s.bg, color: s.color }}>{s.text}</span>;
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', background: '#F5F7FB', minHeight: '100vh' }}>
        <div style={{ height: '600px', background: 'white', borderRadius: '12px', animation: 'shimmer 1.5s infinite' }}></div>
        <style jsx>{`@keyframes shimmer { 0% { opacity: 1 } 50% { opacity: 0.5 } 100% { opacity: 1 } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#F5F7FB', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>
          印刷厂仪表盘
        </h1>
        <p style={{ color: '#718096', fontSize: '14px' }}>
          欢迎回来！查看您的业务概览
        </p>
      </div>

      {/* Order Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {statCards.map((card, index) => (
          <div key={index} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748' }}>{card.value}</div>
                <div style={{ fontSize: '13px', color: '#718096' }}>{card.title}</div>
              </div>
              <div style={{ width: '48px', height: '48px', background: card.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {revenueCards.map((card, index) => (
          <div key={index} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#F5F7FB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </div>
              <span style={{ fontSize: '12px', color: '#059669', background: '#D1FAE5', padding: '2px 8px', borderRadius: '8px' }}>{card.trend}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748' }}>{card.value}</div>
            <div style={{ fontSize: '13px', color: '#718096' }}>{card.title}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders & Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {/* Recent Orders */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginBottom: '16px' }}>最近订单</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentOrders.map((order) => (
              <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#F8FAFC', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#2D3748' }}>{order.projectName}</div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>{order.id} · {order.quantity}本</div>
                </div>
                {getStatusBadge(order.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginBottom: '16px' }}>快捷操作</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: '新建订单', icon: <Package size={18} />, href: '/orders' },
              { label: '添加打印机', icon: <Printer size={18} />, href: '/printers' },
              { label: '审核申请', icon: <FileText size={18} />, href: '/applications' },
            ].map((action, index) => (
              <a key={index} href={action.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F8FAFC', borderRadius: '8px', textDecoration: 'none', color: '#2D3748' }}>
                <span style={{ color: 'rgb(91, 107, 230)' }}>{action.icon}</span>
                <span style={{ fontSize: '14px' }}>{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
