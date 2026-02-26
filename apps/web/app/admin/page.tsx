'use client';

import { useState, useEffect } from 'react';
import { Users, Folder, Printer, Book, FileText, CreditCard, Settings, Bell, Building2, Shield } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalProjects: number;
  totalOrders: number;
  totalEbooks: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProjects: 0,
    totalOrders: 0,
    totalEbooks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [usersRes, projectsRes, ordersRes, ebooksRes] = await Promise.all([
        fetch('http://localhost:3001/admin/users', { headers }).catch(() => ({ json: () => [] })),
        fetch('http://localhost:3001/admin/projects', { headers }).catch(() => ({ json: () => [] })),
        fetch('http://localhost:3001/admin/orders', { headers }).catch(() => ({ json: () => [] })),
        fetch('http://localhost:3001/admin/ebooks', { headers }).catch(() => ({ json: () => [] })),
      ]);

      const users = await usersRes.json();
      const projects = await projectsRes.json();
      const orders = await ordersRes.json();
      const ebooks = await ebooksRes.json();

      setStats({
        totalUsers: Array.isArray(users) ? users.length : 0,
        totalProjects: Array.isArray(projects) ? projects.length : 0,
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        totalEbooks: Array.isArray(ebooks) ? ebooks.length : 0,
      });
    } catch (e) {
      console.error('Failed to fetch data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <div className="admin-page-header" style={{ marginBottom: '32px' }}>
          <div style={{ height: '32px', width: '150px', background: '#E2E8F0', borderRadius: '6px', marginBottom: '8px' }}></div>
          <div style={{ height: '20px', width: '200px', background: '#E2E8F0', borderRadius: '6px' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', animation: 'shimmer 1.5s infinite' }}>
              <div style={{ height: '48px', width: '48px', background: '#E2E8F0', borderRadius: '50%', marginBottom: '12px' }}></div>
              <div style={{ height: '32px', width: '60px', background: '#E2E8F0', borderRadius: '6px', marginBottom: '8px' }}></div>
              <div style={{ height: '16px', width: '80px', background: '#E2E8F0', borderRadius: '6px' }}></div>
            </div>
          ))}
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>
          管理后台
        </h1>
        <p style={{ color: '#718096', fontSize: '14px' }}>
          系统管理概览和数据统计
        </p>
      </div>

      {/* Stats Grid - 4 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Users */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            width: '48px', height: '48px',
            background: '#E8EAFC',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '12px',
            color: 'rgb(91, 107, 230)'
          }}><Users size={24} /></div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748', marginBottom: '4px' }}>
            {stats.totalUsers}
          </div>
          <div style={{ fontSize: '13px', color: '#718096' }}>用户总数</div>
        </div>

        {/* Projects */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            width: '48px', height: '48px',
            background: '#E8EAFC',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '12px',
            color: 'rgb(91, 107, 230)'
          }}><Folder size={24} /></div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748', marginBottom: '4px' }}>
            {stats.totalProjects}
          </div>
          <div style={{ fontSize: '13px', color: '#718096' }}>项目总数</div>
        </div>

        {/* Orders */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            width: '48px', height: '48px',
            background: '#E8EAFC',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '12px',
            color: 'rgb(91, 107, 230)'
          }}><Printer size={24} /></div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748', marginBottom: '4px' }}>
            {stats.totalOrders}
          </div>
          <div style={{ fontSize: '13px', color: '#718096' }}>订单总数</div>
        </div>

        {/* Ebooks */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            width: '48px', height: '48px',
            background: '#E8EAFC',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '12px',
            color: 'rgb(91, 107, 230)'
          }}><Book size={24} /></div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748', marginBottom: '4px' }}>
            {stats.totalEbooks}
          </div>
          <div style={{ fontSize: '13px', color: '#718096' }}>电子书</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: '#2D3748' }}>
          快捷操作
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <a className="admin-action-item" href="/admin/users" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            padding: '20px', background: '#F8FAFC', borderRadius: '12px',
            textDecoration: 'none', transition: 'all 0.2s'
          }}>
            <div style={{
              width: '48px', height: '48px', background: '#E8EAFC', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)'
            }}><Users size={24} /></div>
            <span style={{ fontSize: '14px', color: '#2D3748' }}>用户管理</span>
          </a>

          <a href="/admin/projects" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            padding: '20px', background: '#F8FAFC', borderRadius: '12px',
            textDecoration: 'none', transition: 'all 0.2s'
          }}>
            <div style={{
              width: '48px', height: '48px', background: '#E8EAFC', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)'
            }}><Folder size={24} /></div>
            <span style={{ fontSize: '14px', color: '#2D3748' }}>项目管理</span>
          </a>

          <a href="/admin/orders" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            padding: '20px', background: '#F8FAFC', borderRadius: '12px',
            textDecoration: 'none', transition: 'all 0.2s'
          }}>
            <div style={{
              width: '48px', height: '48px', background: '#E8EAFC', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)'
            }}><Printer size={24} /></div>
            <span style={{ fontSize: '14px', color: '#2D3748' }}>订单管理</span>
          </a>

          <a href="/admin/settings" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            padding: '20px', background: '#F8FAFC', borderRadius: '12px',
            textDecoration: 'none', transition: 'all 0.2s'
          }}>
            <div style={{
              width: '48px', height: '48px', background: '#E8EAFC', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)'
            }}><Settings size={24} /></div>
            <span style={{ fontSize: '14px', color: '#2D3748' }}>系统设置</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
