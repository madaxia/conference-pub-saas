'use client';

import Link from 'next/link';
import { Book, Check, ArrowRight, Star } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: '免费版',
      price: '¥0',
      period: '永久免费',
      desc: '适合个人用户',
      features: ['3个项目', '100M存储', '基础模板', '邮件支持'],
      cta: '免费注册',
      popular: false,
    },
    {
      name: '高级版',
      price: '¥199',
      period: '/月',
      desc: '适合小型团队',
      features: ['无限项目', '10G存储', '高级模板', '优先支持', '印刷折扣'],
      cta: '立即订阅',
      popular: true,
    },
    {
      name: '企业版',
      price: '¥599',
      period: '/月',
      desc: '适合大型组织',
      features: ['专属客服', 'API接入', '定制开发', 'SLA保障', '所有功能'],
      cta: '联系我们',
      popular: false,
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
          <Link href="/features" style={{ color: '#718096' }}>功能介绍</Link>
          <Link href="/pricing" style={{ color: "rgb(91, 107, 230)", fontWeight: 500 }}>价格方案</Link>
          <Link href="/login" style={{ 
            background: '#5B6BE6', color: 'white', padding: '8px 16px', 
            borderRadius: '8px', textDecoration: 'none', fontSize: '14px' 
          }}>登录</Link>
        </div>
      </header>

      {/* Pricing */}
      <section style={{ padding: '80px 48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 700, color: '#2D3748', marginBottom: '16px' }}>
          简单透明的定价
        </h1>
        <p style={{ fontSize: '18px', color: '#718096', marginBottom: '48px' }}>
          选择适合您的方案
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
          {plans.map((plan, index) => (
            <div key={index} style={{
              padding: '32px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: plan.popular ? '0 4px 20px rgba(91, 107, 230, 0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
              border: plan.popular ? '2px solid #5B6BE6' : '1px solid #E2E8F0',
              position: 'relative',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: '#5B6BE6', color: 'white', padding: '4px 16px',
                  borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                }}>
                  最受欢迎
                </div>
              )}
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>
                {plan.name}
              </h3>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '36px', fontWeight: 700, color: '#2D3748' }}>{plan.price}</span>
                <span style={{ fontSize: '14px', color: '#718096' }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px' }}>{plan.desc}</p>
              
              <ul style={{ textAlign: 'left', marginBottom: '24px', listStyle: 'none', padding: 0 }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px', color: '#2D3748' }}>
                    <Check size={16} style={{ color: '#4ECB71' }} /> {feature}
                  </li>
                ))}
              </ul>
              
              <Link href="/register" style={{
                display: 'block',
                padding: '14px',
                background: plan.popular ? '#5B6BE6' : '#F5F7FB',
                color: plan.popular ? 'white' : '#5B6BE6',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ placeholder */}
      <section style={{ padding: '60px 48px', background: 'white' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748', textAlign: 'center', marginBottom: '32px' }}>
          常见问题
        </h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {[
            { q: '可以随时取消订阅吗？', a: '是的，您可以随时取消订阅，取消后服务将继续到月底。' },
            { q: '支持哪些支付方式？', a: '支持支付宝、微信支付、银行卡等多种支付方式。' },
            { q: '可以开具发票吗？', a: '是的，我们提供正规发票，可用于报销。' },
          ].map((item, index) => (
            <div key={index} style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>{item.q}</h4>
              <p style={{ fontSize: '14px', color: '#718096' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
