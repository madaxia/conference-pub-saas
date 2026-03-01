'use client';
import { Mail } from 'lucide-react';
export default function Page() {
  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 24 }}>邮件设置</h1>
      <div style={{ background: 'white', borderRadius: 16, padding: 32, textAlign: 'center' }}>
        <Mail size={48} style={{ color: 'rgb(91, 107, 230)', marginBottom: 16 }} />
        <div style={{ fontSize: 14, color: '#718096' }}>邮件配置内容</div>
      </div>
    </div>
  );
}
