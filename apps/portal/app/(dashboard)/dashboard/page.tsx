'use client';

import { useState, useEffect } from 'react';
import { Printer, Package, FileText, Clock, CheckCircle, Truck } from 'lucide-react';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  printers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    printers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalOrders: 24,
        pendingOrders: 5,
        completedOrders: 19,
        printers: 3,
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ height: '200px', background: 'white', borderRadius: '12px', animation: 'shimmer 1.5s infinite' }}></div>
        <style jsx>{`@keyframes shimmer { 0% { opacity: 1 } 50% { opacity: 0.5 } 100% { opacity: 1 } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>
          印刷厂仪表盘
        </h1>
        <p style={{ color: '#718096', fontSize: '14px' }}>
          欢迎回来！查看您的订单概览
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '48px', height: '48px', background: '#E8EAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: "rgb(91, 107, 230)" }}><Package size={24} /></div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748' }}>{stats.totalOrders}</div>
          <div style={{ fontSize: '13px', color: '#718096' }}>总订单</div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '48px', height: '48px', background: '#FEF3C7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: 'rgb(91, 107, 230)' }}><Clock size={24} /></div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748' }}>{stats.pendingOrders}</div>
          <div style={{ fontSize: '13px', color: '#718096' }}>待处理</div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '48px', height: '48px', background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: 'rgb(91, 107, 230)' }}><CheckCircle size={24} /></div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748' }}>{stats.completedOrders}</div>
          <div style={{ fontSize: '13px', color: '#718096' }}>已完成</div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '48px', height: '48px', background: '#E8F8F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: 'rgb(91, 107, 230)' }}><Printer size={24} /></div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748' }}>{stats.printers}</div>
          <div style={{ fontSize: '13px', color: '#718096' }}>打印机</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginBottom: '20px' }}>最近订单</h2>
        <div style={{ color: '#718096', textAlign: 'center', padding: '40px' }}>暂无最近订单</div>
      </div>
    </div>
  );
}
