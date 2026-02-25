'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Book, ArrowRight, Check, Star, Users, FileText, Printer, Shield } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: <FileText size={24} />, title: '项目管理', desc: '轻松创建和管理会刊项目' },
    { icon: <Printer size={24} />, title: '印刷服务', desc: '一键下单，专业印刷' },
    { icon: <Book size={24} />, title: '电子书', desc: '在线阅读，响应式展示' },
    { icon: <Shield size={24} />, title: '安全可靠', desc: '数据安全有保障' },
  ];

  return (
    <div style={{ background: '#F5F7FB', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '12px 48px' : '20px 48px',
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid #E2E8F0' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/features" style={{ color: '#718096', textDecoration: 'none', fontSize: '14px' }}>功能介绍</Link>
          <Link href="/pricing" style={{ color: '#718096', textDecoration: 'none', fontSize: '14px' }}>价格方案</Link>
          <Link href="/about" style={{ color: '#718096', textDecoration: 'none', fontSize: '14px' }}>关于我们</Link>
          <Link href="/login" style={{ 
            background: '#5B6BE6', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '8px',
            textDecoration: 'none', 
            fontSize: '14px',
            fontWeight: 500
          }}>
            立即体验
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '180px 48px 100px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 700,
          color: '#2D3748',
          marginBottom: '20px',
          lineHeight: 1.2,
        }}>
          专业的会议会刊<br />出版SaaS平台
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#718096',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px',
        }}>
          從文档编辑到印刷出版，一站式解决方案。支持多人协作、智能审稿、在线预览，让会刊制作更高效。
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/register" style={{
            background: '#5B6BE6',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            免费注册 <ArrowRight size={18} />
          </Link>
          <Link href="/features" style={{
            background: 'white',
            color: "rgb(91, 107, 230)",
            padding: '14px 32px',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 500,
          }}>
            了解更多
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '80px 48px',
        background: 'white',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#2D3748',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            核心功能
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#718096',
            textAlign: 'center',
            marginBottom: '48px',
          }}>
            满足会刊出版全流程需求
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                padding: '32px 24px',
                background: '#F8FAFC',
                borderRadius: '16px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '64px', height: '64px',
                  background: '#E8EAFC',
                  borderRadius: '16px',
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
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '100px 48px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#2D3748',
          marginBottom: '16px',
        }}>
          立即开始使用
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          marginBottom: '32px',
        }}>
          免费注册账号，开启会刊出版之旅
        </p>
        <Link href="/register" style={{
          background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)',
          color: 'white',
          padding: '16px 40px',
          borderRadius: '12px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          立即注册 <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 48px',
        background: 'white',
        borderTop: '1px solid #E2E8F0',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', color: '#718096' }}>
          © 2026 会议出版平台. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
