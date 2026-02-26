'use client';
import { Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
export default function Page() {
  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 24 }}>企业管理</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <Link href="/enterprise/apply" style={{ display: 'block', padding: 32, background: 'white', borderRadius: 12, textDecoration: 'none' }}>
          <Building2 size={32} style={{ color: '#5B6BE6', marginBottom: 12 }} />
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D3748', marginBottom: 8 }}>申请成为企业</h3>
          <p style={{ fontSize: 14, color: '#718096' }}>申请企业账号，享受更多服务</p>
        </Link>
        <Link href="/enterprise/bind" style={{ display: 'block', padding: 32, background: 'white', borderRadius: 12, textDecoration: 'none' }}>
          <Building2 size={32} style={{ color: 'rgb(91, 107, 230)', marginBottom: 12 }} />
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D3748', marginBottom: 8 }}>绑定企业</h3>
          <p style={{ fontSize: 14, color: '#718096' }}>已有企业账号？立即绑定</p>
        </Link>
      </div>
    </div>
  );
}
