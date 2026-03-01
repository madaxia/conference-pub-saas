'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Printer,
  Settings,
  Search,
  Bell,
  User,
  LogOut,
  FileText,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

const portalNavItems: NavItem[] = [
  { name: '仪表盘', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { name: '订单管理', href: '/orders', icon: <Printer size={18} /> },
  { name: '打印机', href: '/printers', icon: <Printer size={18} /> },
  { name: '申请审批', href: '/applications', icon: <FileText size={18} /> },
  { name: '设置', href: '/settings', icon: <Settings size={18} /> },
];

interface PortalLayoutProps {
  children: ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('portalToken');
    router.push('/login');
  };

  return (
    <div className="portal-layout" style={{ display: 'flex', minHeight: '100vh', background: '#F5F7FB' }}>
      {/* Sidebar */}
      <aside className="portal-sidebar" style={{
        width: '260px',
        background: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100,
      }}>
        {/* Logo */}
        <div className="portal-logo-area" style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}>
          <Link href="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none'
          }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', color: 'white'
            }}>
              <Printer size={20} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#2D3748' }}>
              印刷厂平台
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="portal-nav" style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {portalNavItems.map((item) => {
            // Fix: For root-level items, only match exact
            // For sub-items like /dashboard/orders, match if starts with href + '/'
            const isExactMatch = pathname === item.href;
            const isChildMatch = item.href.split('/').length > 2 && pathname.startsWith(item.href + '/');
            const isActive = isExactMatch || isChildMatch;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  color: isActive ? '#FFFFFF' : '#718096',
                  background: isActive ? '#5B6BE6' : 'transparent',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  transition: 'all 0.2s ease',
                  fontWeight: isActive ? 500 : 400,
                  fontSize: '14px'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', color: isActive ? '#FFFFFF' : 'rgb(91, 107, 230)' }}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="portal-user-area" style={{ padding: '20px', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: '#E8EAFC',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', color: 'rgb(91, 107, 230)'
            }}>
              <Printer size={18} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#2D3748' }}>印刷厂</div>
              <div style={{ fontSize: '12px', color: '#A0AEC0' }}>printer@demo.com</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px',
              background: 'transparent',
              border: '1px solid #E2E8F0',
              borderRadius: '8px', color: 'rgb(91, 107, 230)',
              fontSize: '14px', cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <LogOut size={16} /> 退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="portal-main" style={{ flex: 1, marginLeft: '260px', minHeight: '100vh' }}>
        {/* Top Header */}
        <header className="portal-header" style={{
          height: '64px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: '#F5F7FB', padding: '8px 16px',
            borderRadius: '8px', width: '320px',
            border: '1px solid #E2E8F0'
          }}>
            <span style={{ color: 'rgb(91, 107, 230)', fontSize: '14px' }}><Search size={16} /></span>
            <input
              type="text"
              placeholder="搜索订单、打印机..."
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#2D3748', fontSize: '14px', width: '100%'
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              width: '40px', height: '40px',
              background: '#F5F7FB', border: '1px solid #E2E8F0',
              borderRadius: '8px', color: 'rgb(91, 107, 230)', fontSize: '16px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}><Bell size={18} /></button>
            <button style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)',
              border: 'none', borderRadius: '8px', color: 'white',
              fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}><Settings size={18} /></button>
          </div>
        </header>

        {/* Page Content */}
        <div className="portal-content" style={{ padding: '32px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
