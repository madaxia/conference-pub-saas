'use client';
import Link from 'next/link';
import { Printer, ArrowRight } from 'lucide-react';
export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'white' }}><Printer size={40} /></div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#2D3748', marginBottom: 12 }}>印刷厂管理平台</h1>
        <p style={{ color: '#718096', marginBottom: 32 }}>专业印刷订单管理平台</p>
        <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#5B6BE6', color: 'white', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontSize: 16, fontWeight: 600 }}>
          立即登录 <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
