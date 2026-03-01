'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userRole', 'admin');
        window.location.href = 'http://localhost:3002/admin/users';
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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#F5F7FB',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        background: 'white', 
        borderRadius: '16px', 
        padding: '40px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px', 
            color: 'white' 
          }}>
            <Shield size={28} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>
            管理后台登录
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            仅限管理员账号登录
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#718096', marginBottom: '8px' }}>
              管理员邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入管理员邮箱"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#F5F7FB',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#718096', marginBottom: '8px' }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#F5F7FB',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{ 
              padding: '12px', 
              background: '#FDECEC', 
              borderRadius: '8px', 
              color: '#F4726B', 
              fontSize: '14px', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#A0AEC0' : '#5B6BE6',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a 
            href="http://localhost:3000/login" 
            style={{ color: '#5B6BE6', fontSize: '14px', textDecoration: 'none' }}
          >
            返回用户登录
          </a>
        </div>
      </div>
    </div>
  );
}
