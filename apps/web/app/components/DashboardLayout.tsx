'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Folder,
  Book,
  DollarSign,
  Bell,
  Building2,
  User,
  Printer,
  Settings,
  Search,
  LogOut,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

const userNavItems: NavItem[] = [
  { name: '仪表盘', href: '/dashboard', icon: <LayoutDashboard size={18} color="rgb(91, 107, 230)" /> },
  { name: '项目', href: '/projects', icon: <Folder size={18} color="rgb(91, 107, 230)" /> },
  { name: '电子书', href: '/ebooks', icon: <Book size={18} color="rgb(91, 107, 230)" /> },
  { name: '积分', href: '/points', icon: <DollarSign size={18} color="rgb(91, 107, 230)" /> },
  { name: '通知', href: '/notifications', icon: <Bell size={18} color="rgb(91, 107, 230)" /> },
  { name: '企业', href: '/enterprise', icon: <Building2 size={18} color="rgb(91, 107, 230)" /> },
];

const adminNavItems: NavItem[] = [
  { name: '仪表盘', href: '/admin', icon: <LayoutDashboard size={18} color="rgb(91, 107, 230)" /> },
  { name: '用户', href: '/admin/users', icon: <User size={18} color="rgb(91, 107, 230)" /> },
  { name: '项目', href: '/admin/projects', icon: <Folder size={18} color="rgb(91, 107, 230)" /> },
  { name: '订单', href: '/admin/orders', icon: <Printer size={18} color="rgb(91, 107, 230)" /> },
  { name: '电子书', href: '/admin/ebooks', icon: <Book size={18} color="rgb(91, 107, 230)" /> },
  { name: '字体', href: '/admin/fonts', icon: <Settings size={18} color="rgb(91, 107, 230)" /> },
  { name: '分组', href: '/admin/groups', icon: <User size={18} color="rgb(91, 107, 230)" /> },
  { name: '通知', href: '/admin/notifications', icon: <Bell size={18} color="rgb(91, 107, 230)" /> },
  { name: '印刷厂', href: '/admin/printers', icon: <Printer size={18} color="rgb(91, 107, 230)" /> },
  { name: 'AI设置', href: '/admin/ai-settings', icon: <Settings size={18} color="rgb(91, 107, 230)" /> },
  { name: '设置', href: '/admin/settings', icon: <Settings size={18} color="rgb(91, 107, 230)" /> },
  { name: '企业', href: '/admin/enterprise', icon: <Building2 size={18} color="rgb(91, 107, 230)" /> },
];

interface DashboardLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export default function DashboardLayout({ children, isAdmin = false }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F7FB' }}>
      {/* Sidebar */}
      <aside style={{
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
        <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}>
          <Link href={isAdmin ? '/admin' : '/dashboard'} style={{
            display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none'
          }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', color: 'white'
            }}>
              <Book size={20} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#2D3748' }}>
              {isAdmin ? '管理后台' : '会议出版'}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            // Fix: Only match exact path or direct child (with trailing slash)
            // /admin should NOT match /admin/users
            const isExactMatch = pathname === item.href || pathname === item.href + '/';
            const isChildMatch = item.href !== '/' && pathname.startsWith(item.href + '/') && pathname.charAt(item.href.length) === '/';
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
                <span style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div style={{ padding: '20px', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: '#E8EAFC',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', color: '#5B6BE6'
            }}>
              <User size={18} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#2D3748' }}>用户</div>
              <div style={{ fontSize: '12px', color: '#A0AEC0' }}>user@demo.com</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px',
              background: 'transparent',
              border: '1px solid #E2E8F0',
              borderRadius: '8px', color: '#718096',
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
      <main style={{ flex: 1, marginLeft: '260px', minHeight: '100vh' }}>
        {/* Top Header */}
        <header style={{
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
            <span style={{ color: '#A0AEC0', fontSize: '14px' }}><Search size={16} /></span>
            <input
              type="text"
              placeholder="搜索项目、文档..."
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
              borderRadius: '8px', color: '#718096', fontSize: '16px',
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
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
