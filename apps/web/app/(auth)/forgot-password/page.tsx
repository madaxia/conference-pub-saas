'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError('发送失败，请重试');
      }
    } catch (err) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FB', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#059669' }}>
              <Mail size={28} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#2D3748', marginBottom: '8px' }}>发送成功</h1>
            <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>请检查您的邮箱获取重置链接</p>
            <Link href="/login" style={{ color: "rgb(91, 107, 230)", fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              返回登录 <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white' }}><Book size={28} /></div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>找回密码</h1>
              <p style={{ color: '#718096', fontSize: '14px' }}>输入您的注册邮箱</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#718096', marginBottom: '8px' }}>邮箱</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0', display: 'flex' }}><Mail size={16} /></span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="请输入邮箱" required style={{ width: '100%', padding: '12px 16px 12px 40px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#2D3748', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
              {error && <div style={{ padding: '12px', background: '#FDECEC', borderRadius: '8px', color: '#F4726B', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#A0AEC0' : '#5B6BE6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? '发送中...' : '发送重置链接'}
              </button>
            </form>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link href="/login" style={{ color: "rgb(91, 107, 230)", fontSize: '14px', textDecoration: 'none' }}>返回登录</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
