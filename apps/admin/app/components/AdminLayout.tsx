'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Folder,
  Book,
  Bell,
  Building2,
  User,
  Printer,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield,
  Type,
  Users,
  Megaphone,
  Bot,
  CreditCard,
  BellRing,
  Search,
} from 'lucide-react';

interface NavItem {
  name: string;
  href?: string;
  icon: ReactNode;
  children?: NavItem[];
}

const adminNavItems: NavItem[] = [
  { name: '仪表盘', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { 
    name: '用户管理', icon: <User size={18} />,
    children: [{ name: '用户列表', href: '/admin/users', icon: <Users size={16} /> }]
  },
  { 
    name: '内容管理', icon: <Folder size={18} />,
    children: [
      { name: '项目管理', href: '/admin/projects', icon: <Folder size={16} /> },
      { name: '电子书', href: '/admin/ebooks', icon: <Book size={16} /> },
      { name: '订单管理', href: '/admin/orders', icon: <Printer size={16} /> },
    ]
  },
  { 
    name: '运营管理', icon: <Megaphone size={18} />,
    children: [
      { name: '通知管理', href: '/admin/notifications', icon: <Bell size={16} /> },
      { name: '知识库', href: '/admin/knowledge-base', icon: <Book size={16} /> },
    ]
  },
  { 
    name: '资源管理', icon: <Settings size={18} />,
    children: [
      { name: '字体管理', href: '/admin/fonts', icon: <Type size={16} /> },
      { name: '分组管理', href: '/admin/groups', icon: <Users size={16} /> },
      { name: '积分配置', href: '/admin/points-config', icon: <CreditCard size={16} /> },
    ]
  },
  { name: '印刷厂', href: '/admin/printers', icon: <Printer size={18} /> },
  { name: 'AI设置', href: '/admin/ai-settings', icon: <Bot size={18} /> },
  { 
    name: '系统设置', icon: <Settings size={18} />,
    children: [
      { name: '基本设置', href: '/admin/settings', icon: <Settings size={16} /> },
      { name: '管理员', href: '/admin/settings/admins', icon: <Shield size={16} /> },
      { name: '邮箱设置', href: '/admin/settings/email', icon: <Bell size={16} /> },
    ]
  },
  { name: '企业管理', href: '/admin/enterprise', icon: <Building2 size={18} /> },
];

interface AdminLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export default function AdminLayout({ children, isAdmin = true }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [adminName] = useState('管理员');

  useEffect(() => {
    const newExpanded: Record<string, boolean> = {};
    adminNavItems.forEach(item => {
      if (item.children) {
        const isActive = item.children.some(child => pathname === child.href || pathname.startsWith(child.href || ''));
        newExpanded[item.name] = isActive;
      }
    });
    setExpandedMenus(newExpanded);
  }, [pathname]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const isChildActive = (item: NavItem): boolean => {
    if (!item.children) return false;
    return item.children.some(child => pathname === child.href);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F7FB', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{
        height: '60px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
          }}>
            <LayoutDashboard size={20} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#2D3748' }}>管理后台</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
            <input
              type="text"
              placeholder="搜索..."
              style={{
                width: '200px',
                padding: '8px 12px 8px 36px',
                background: '#F5F7FB',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {/* Notifications */}
          <button style={{
            width: '36px',
            height: '36px',
            background: '#F5F7FB',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#718096',
            position: 'relative',
          }}>
            <BellRing size={18} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              background: '#F4726B',
              borderRadius: '50%',
            }}></span>
          </button>

          {/* Admin Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#F5F7FB', borderRadius: '8px' }}>
            <div style={{ width: '28px', height: '28px', background: '#5B6BE6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 600, }}>
              管
            </div>
            <span style={{ fontSize: '13px', color: '#2D3748', fontWeight: 500 }}>{adminName}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 12px',
              background: 'transparent',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#718096',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <LogOut size={14} />
            退出
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', marginTop: '60px' }}>
        {/* Sidebar */}
        <aside style={{
          width: '260px',
          background: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: 'calc(100vh - 60px)',
          zIndex: 100,
        }}>
          <nav style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
            {adminNavItems.map((item, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: isChildActive(item) ? '#E8EAFC' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: isChildActive(item) ? 'rgb(91, 107, 230)' : '#4A5568',
                        fontSize: '14px',
                        fontWeight: isChildActive(item) ? 600 : 500,
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: isChildActive(item) ? 'rgb(91, 107, 230)' : '#718096' }}>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      <span style={{ color: '#A0AEC0' }}>
                        {expandedMenus[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    </button>
                    {expandedMenus[item.name] && (
                      <div style={{ paddingLeft: '20px', marginTop: '4px' }}>
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.href || '#'}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              background: pathname === child.href ? '#E8EAFC' : 'transparent',
                              borderRadius: '6px',
                              textDecoration: 'none',
                              color: pathname === child.href ? 'rgb(91, 107, 230)' : '#718096',
                              fontSize: '13px',
                              fontWeight: pathname === child.href ? 600 : 400,
                              marginBottom: '2px',
                            }}
                          >
                            <span style={{ color: pathname === child.href ? 'rgb(91, 107, 230)' : '#A0AEC0' }}>{child.icon}</span>
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href || '#'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: pathname === item.href ? '#E8EAFC' : 'transparent',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: pathname === item.href ? 'rgb(91, 107, 230)' : '#4A5568',
                      fontSize: '14px',
                      fontWeight: pathname === item.href ? 600 : 500,
                    }}
                  >
                    <span style={{ color: pathname === item.href ? 'rgb(91, 107, 230)' : '#718096' }}>{item.icon}</span>
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, marginLeft: '260px', minHeight: 'calc(100vh - 60px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
