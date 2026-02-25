'use client';
import { Package } from 'lucide-react';
export default function Page() {
  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 24 }}>订单管理</h1>
      <div style={{ background: 'white', borderRadius: 16, padding: 32, textAlign: 'center' }}>
        <Package size={48} style={{ color: '#5B6BE6', marginBottom: 16 }} />
        <div style={{ fontSize: 14, color: '#718096' }}>暂无订单</div>
      </div>
    </div>
  );
}
