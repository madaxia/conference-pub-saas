'use client';

import { useState, useEffect } from 'react';
import { Settings, Shield, Mail, Key } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <div style={{ padding: 24 }}><div style={{ height: 200, background: 'white', borderRadius: 12 }}></div></div>;

  const settingsItems = [
    {
      title: '管理员管理',
      description: '管理系统管理员账号',
      icon: Shield,
      href: '/admin/settings/admins',
      color: '#D97706',
      bg: '#FEF3C7',
    },
    {
      title: '邮箱设置',
      description: '配置邮件发送服务',
      icon: Mail,
      href: '/admin/settings/email',
      color: 'rgb(91, 107, 230)',
      bg: '#E8EAFC',
    },
    {
      title: 'API密钥',
      description: '管理第三方API密钥',
      icon: Key,
      href: '#',
      color: '#059669',
      bg: '#D1FAE5',
    },
  ];

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>系统设置</h1>
        <p style={{ color: '#718096', fontSize: 14 }}>配置系统参数</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {settingsItems.map((item, i) => (
          <Link 
            key={i} 
            href={item.href}
            style={{ 
              display: 'block',
              background: 'white', 
              borderRadius: 12, 
              padding: 24, 
              textDecoration: 'none',
              border: '1px solid #E2E8F0',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                background: item.bg, 
                borderRadius: 12, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: item.color,
                flexShrink: 0,
              }}>
                <item.icon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D3748', marginBottom: 4 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#718096' }}>{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
