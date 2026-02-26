'use client';

import Link from 'next/link';
import { Book, Mail, Phone, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page" style={{ background: '#F5F7FB', minHeight: '100vh' }}>
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
          <Link href="/features" style={{ color: '#718096' }}>功能介绍</Link>
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
          关于我们
        </h1>
        <p style={{ fontSize: '18px', color: '#718096', maxWidth: '600px', margin: '0 auto' }}>
          我们致力于为会议组织方提供一站式的会刊出版解决方案
        </p>
      </section>

      {/* Company Info */}
      <section style={{ padding: '40px 48px 80px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#2D3748', marginBottom: '24px' }}>
            公司简介
          </h2>
          <p style={{ fontSize: '15px', color: '#718096', lineHeight: 1.8, marginBottom: '24px' }}>
            会议出版平台成立于2026年，专注于为会议组织方提供专业的会刊出版服务。我们提供从文档编辑、审稿到印刷出版的全流程解决方案，让会刊制作变得简单高效。
          </p>
          <p style={{ fontSize: '15px', color: '#718096', lineHeight: 1.8, marginBottom: '32px' }}>
            平台支持多种印刷品类，包括会议日程、论文摘要集、赞助商手册等，满足不同类型会议的需求。同时提供电子书服务，支持在线阅读和响应式展示。
          </p>

          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#2D3748', marginBottom: '24px' }}>
            联系我们
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={20} style={{ color: "rgb(91, 107, 230)" }} />
              <span style={{ color: '#718096' }}>contact@conferencepub.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Phone size={20} style={{ color: "rgb(91, 107, 230)" }} />
              <span style={{ color: '#718096' }}>400-888-8888</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={20} style={{ color: "rgb(91, 107, 230)" }} />
              <span style={{ color: '#718096' }}>北京市朝阳区建国路88号</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 48px', background: 'white', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#718096' }}>
          © 2026 会议出版平台. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
