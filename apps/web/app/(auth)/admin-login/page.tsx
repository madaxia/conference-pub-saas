'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@system.com', password }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        window.location.href = '/admin';
      } else {
        setError(data.message || '登录失败');
      }
    } catch (err) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FB', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white' }}><Book size={28} /></div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>管理后台</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>请输入管理员密码</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#718096', marginBottom: '8px' }}>密码</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0', display: 'flex' }}><Lock size={16} /></span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码" required style={{ width: '100%', padding: '12px 16px 12px 40px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#2D3748', fontSize: '14px', outline: 'none' }} />
            </div>
          </div>
          {error && <div style={{ padding: '12px', background: '#FDECEC', borderRadius: '8px', color: '#F4726B', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#A0AEC0' : '#5B6BE6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link href="/login" style={{ color: "rgb(91, 107, 230)", fontSize: '14px', textDecoration: 'none' }}>返回用户登录</Link>
        </div>
      </div>
    </div>
  );
}
