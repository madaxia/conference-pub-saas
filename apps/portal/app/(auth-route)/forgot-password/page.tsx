'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Book, Mail, AlertCircle } from 'lucide-react';
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setSent(true); }, 1000); };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FB', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400, background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#059669' }}><Mail size={28} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2D3748', marginBottom: 8 }}>发送成功</h1>
            <p style={{ color: '#718096', fontSize: 14 }}>请检查邮箱</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white' }}><Book size={28} /></div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>找回密码</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="请输入邮箱" required style={{ width: '100%', padding: 12, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, marginBottom: 16 }} />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: loading ? '#A0AEC0' : '#5B6BE6', border: 'none', borderRadius: 8, color: 'white', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? '发送中...' : '发送重置链接'}</button>
            </form>
            <div style={{ marginTop: 20, textAlign: 'center' }}><Link href="/login" style={{ color: '#5B6BE6', fontSize: 14, textDecoration: 'none' }}>返回登录</Link></div>
          </>
        )}
      </div>
    </div>
  );
}
