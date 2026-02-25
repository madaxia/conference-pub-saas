'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('user1@demo.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 实时验证状态
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  
  // 验证函数
  const validateEmail = (value: string) => {
    if (!value) return '请输入邮箱';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '请输入有效的邮箱地址';
    return '';
  };
  
  const validatePassword = (value: string) => {
    if (!value) return '请输入密码';
    if (value.length < 6) return '密码至少6位';
    return '';
  };
  
  const emailError = emailTouched ? validateEmail(email) : '';
  const passwordError = passwordTouched ? validatePassword(password) : '';
  const isValid = !emailError && !passwordError && email && password;

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 提交前验证所有字段
    setEmailTouched(true);
    setPasswordTouched(true);
    
    if (!isValid) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tenantId: 'default-tenant', 
          email, 
          password 
        }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || '登录失败，请检查邮箱和密码');
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
          }}><Book size={28} /></div>
          <h1 style={{
            fontSize: '22px', fontWeight: 700, color: '#2D3748', marginBottom: '6px'
          }}>会议出版平台</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>专业的会议会刊出版服务</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 邮箱输入 */}
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
                onBlur={() => setEmailTouched(true)}
                placeholder="请输入邮箱"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  background: '#F5F7FB',
                  border: `1px solid ${emailError ? '#F4726B' : '#E2E8F0'}`,
                  borderRadius: '8px',
                  color: '#2D3748',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
            {emailError && (
              <div style={{ 
                color: '#F4726B', 
                fontSize: '12px', 
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={12} /> {emailError}
              </div>
            )}
          </div>

          {/* 密码输入 */}
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                placeholder="请输入密码"
                required
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 40px',
                  background: '#F5F7FB',
                  border: `1px solid ${passwordError ? '#F4726B' : '#E2E8F0'}`,
                  borderRadius: '8px',
                  color: '#2D3748',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#A0AEC0',
                  display: 'flex', padding: 0
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordError && (
              <div style={{ 
                color: '#F4726B', 
                fontSize: '12px', 
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={12} /> {passwordError}
              </div>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <div style={{
              padding: '12px',
              background: '#FDECEC',
              borderRadius: '8px',
              color: '#F4726B',
              fontSize: '14px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={loading || !isValid}
            style={{
              width: '100%',
              padding: '14px',
              background: loading || !isValid ? '#A0AEC0' : '#5B6BE6',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading || !isValid ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                登录中...
              </>
            ) : (
              '登 录'
            )}
          </button>
        </form>

        {/* 链接 */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E2E8F0'
        }}>
          <Link href="/register" style={{ color: '#5B6BE6', fontSize: '14px', textDecoration: 'none' }}>
            还没有账号？立即注册
          </Link>
          <Link href="/forgot-password" style={{ color: '#A0AEC0', fontSize: '14px', textDecoration: 'none' }}>
            忘记密码？
          </Link>
        </div>

        {/* 测试账号提示 */}
        <div style={{
          marginTop: '20px', padding: '14px',
          background: '#E8EAFC',
          borderRadius: '8px', textAlign: 'center'
        }}>
          <p style={{ color: '#718096', fontSize: '13px', margin: 0 }}>
            测试账号：user1@demo.com / password123
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
