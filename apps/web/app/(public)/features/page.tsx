'use client';

import Link from 'next/link';
import { Book, ArrowRight, Check, FileText, Users, CreditCard, Headphones, Globe } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    { 
      icon: <FileText size={24} />, 
      title: '项目管理', 
      desc: '创建和管理会刊项目，支持多人协作，版本控制' 
    },
    { 
      icon: <Users size={24} />, 
      title: '团队协作', 
      desc: '多人同时编辑，实时预览，评论审稿' 
    },
    { 
      icon: <Book size={24} />, 
      title: '模板系统', 
      desc: '多种精美模板，快速创建会刊' 
    },
    { 
      icon: <CreditCard size={24} />, 
      title: '印刷服务', 
      desc: '一键下单，专业印刷配送' 
    },
    { 
      icon: <Globe size={24} />, 
      title: '电子书', 
      desc: '在线阅读，响应式展示' 
    },
    { 
      icon: <Headphones size={24} />, 
      title: '客服支持', 
      desc: '7x24小时客服支持' 
    },
  ];

  return (
    <div style={{ background: '#F5F7FB', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        padding: '20px 48px',
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white'
          }}>
            <Book size={20} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#2D3748' }}>会议出版平台</span>
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/features" style={{ color: "rgb(91, 107, 230)", fontWeight: 500 }}>功能介绍</Link>
          <Link href="/pricing" style={{ color: '#718096' }}>价格方案</Link>
          <Link href="/login" style={{ 
            background: '#5B6BE6', color: 'white', padding: '8px 16px', 
            borderRadius: '8px', textDecoration: 'none', fontSize: '14px' 
          }}>登录</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '80px 48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 700, color: '#2D3748', marginBottom: '16px' }}>
          强大的功能，满足您的需求
        </h1>
        <p style={{ fontSize: '18px', color: '#718096', marginBottom: '48px' }}>
          一站式会刊出版解决方案
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              padding: '32px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: '56px', height: '56px',
                background: '#E8EAFC',
                borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                color: "rgb(91, 107, 230)",
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#718096' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 48px', textAlign: 'center', background: 'white' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748', marginBottom: '16px' }}>
          准备好开始了吗？
        </h2>
        <Link href="/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#5B6BE6', color: 'white', padding: '14px 32px',
          borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 600,
        }}>
          立即注册 <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
