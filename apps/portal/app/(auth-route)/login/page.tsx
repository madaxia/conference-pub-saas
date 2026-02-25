'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Printer, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('printer@demo.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (email && password) {
        localStorage.setItem('portalToken', 'demo-token');
        router.push('/dashboard');
      } else {
        setError('请输入邮箱和密码');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
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
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'white'
          }}><Printer size={28} /></div>
          <h1 style={{
            fontSize: '22px', fontWeight: 700, color: '#2D3748', marginBottom: '6px'
          }}>印刷厂平台</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>管理您的印刷订单和打印机</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{
              display: 'block', fontSize: '14px', fontWeight: 500,
              color: '#718096', marginBottom: '8px'
            }}>邮箱</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', color: '#A0AEC0', display: 'flex'
              }}><Mail size={16} /></span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  background: '#F5F7FB',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  color: '#2D3748',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block', fontSize: '14px', fontWeight: 500,
              color: '#718096', marginBottom: '8px'
            }}>密码</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', color: '#A0AEC0', display: 'flex'
              }}><Lock size={16} /></span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  background: '#F5F7FB',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  color: '#2D3748',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: '#FDECEC',
              borderRadius: '8px',
              color: '#F4726B',
              fontSize: '14px',
              textAlign: 'center'
            }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#5B6BE6',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>

        <div style={{
          marginTop: '20px', padding: '14px',
          background: '#E8EAFC',
          borderRadius: '8px', textAlign: 'center'
        }}>
          <p style={{ color: '#718096', fontSize: '13px', margin: 0 }}>
            测试账号：printer@demo.com / password123
          </p>
        </div>
      </div>
    </div>
  );
}
