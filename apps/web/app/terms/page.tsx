'use client';

import Link from 'next/link';
import { Book } from 'lucide-react';

export default function TermsPage() {
  return (
    <div style={{ background: '#F5F7FB', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '40px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#5B6BE6', marginBottom: '24px' }}>
          <Book size={20} /> 返回首页
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748', marginBottom: '24px' }}>服务条款</h1>
        <div style={{ fontSize: '15px', color: '#718096', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '16px' }}>使用我们的服务即表示您同意以下条款。</p>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginTop: '24px', marginBottom: '12px' }}>服务使用</h3>
          <p style={{ marginBottom: '16px' }}>您同意仅按照合法目的使用本平台。</p>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginTop: '24px', marginBottom: '12px' }}>账户责任</h3>
          <p style={{ marginBottom: '16px' }}>您对账户下的所有活动负责。</p>
        </div>
      </div>
    </div>
  );
}
