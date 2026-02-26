'use client';

import Link from 'next/link';
import { Book, Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ background: '#F5F7FB', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '40px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: "rgb(91, 107, 230)", marginBottom: '24px' }}>
          <Book size={20} /> 返回首页
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748', marginBottom: '24px' }}>隐私政策</h1>
        <div style={{ fontSize: '15px', color: '#718096', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '16px' }}>我们重视您的隐私。本政策说明了我们如何收集、使用和保护您的个人信息。</p>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginTop: '24px', marginBottom: '12px' }}>信息收集</h3>
          <p style={{ marginBottom: '16px' }}>我们收集您提供的信息，包括姓名、邮箱、项目数据等。</p>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginTop: '24px', marginBottom: '12px' }}>信息安全</h3>
          <p style={{ marginBottom: '16px' }}>我们采用行业标准的安全措施保护您的数据。</p>
        </div>
      </div>
    </div>
  );
}
