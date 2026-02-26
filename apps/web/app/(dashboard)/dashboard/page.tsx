'use client';

import { useState, useEffect } from 'react';
import { Folder, Printer, Book, DollarSign, Plus, FileText, Calendar, Users } from 'lucide-react';

interface Stats {
  totalProjects: number;
  totalOrders: number;
  totalEbooks: number;
  totalPoints: number;
  recentProjects: any[];
  recentOrders: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalOrders: 0,
    totalEbooks: 0,
    totalPoints: 0,
    recentProjects: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 并行请求多个API
      const [projectsRes, ordersRes, ebooksRes] = await Promise.all([
        fetch('http://localhost:3001/projects', { headers }).catch(() => ({ json: () => [] })),
        fetch('http://localhost:3001/print-orders', { headers }).catch(() => ({ json: () => [] })),
        fetch('http://localhost:3001/ebooks', { headers }).catch(() => ({ json: () => [] })),
      ]);

      const projects = await projectsRes.json();
      const orders = await ordersRes.json();
      const ebooks = await ebooksRes.json();

      setStats({
        totalProjects: Array.isArray(projects) ? projects.length : 0,
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        totalEbooks: Array.isArray(ebooks) ? ebooks.length : 0,
        totalPoints: 2500,
        recentProjects: Array.isArray(projects) ? projects.slice(0, 5) : [],
        recentOrders: Array.isArray(orders) ? orders.slice(0, 5) : [],
      });
    } catch (e) {
      console.error('Failed to fetch data:', e);
      setError('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ 
            height: '32px', width: '120px', background: '#E2E8F0', 
            borderRadius: '6px', animation: 'shimmer 1.5s infinite',
            marginBottom: '8px'
          }}></div>
          <div style={{ height: '20px', width: '200px', background: '#E2E8F0', borderRadius: '6px' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              background: '#FFFFFF', borderRadius: '12px', padding: '20px',
              animation: 'shimmer 1.5s infinite'
            }}>
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
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>
          仪表盘
        </h1>
        <p style={{ color: '#718096', fontSize: '14px' }}>
          欢迎回来！查看您的统计数据概览
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          padding: '12px', background: '#FDECEC', borderRadius: '8px',
          color: '#F4726B', marginBottom: '24px'
        }}>
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Projects */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            width: '48px', height: '48px',
            background: '#E3F2FD',
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
            background: '#E8F8F0',
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
            background: '#F3EEFF',
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

        {/* Points */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            width: '48px', height: '48px',
            background: '#FFF3E6',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '12px',
            color: 'rgb(91, 107, 230)'
          }}><DollarSign size={24} /></div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#2D3748', marginBottom: '4px' }}>
            {stats.totalPoints}
          </div>
          <div style={{ fontSize: '13px', color: '#718096' }}>积分</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748' }}>
            最近项目
          </h2>
          <a href="/projects" style={{ 
            color: "rgb(91, 107, 230)", fontSize: '14px', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            查看全部 →
          </a>
        </div>
        
        {stats.recentProjects.length > 0 ? (
          <div>
            {stats.recentProjects.map((project: any, index: number) => (
              <div key={project.id || index} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 0',
                borderBottom: index < stats.recentProjects.length - 1 ? '1px solid #E2E8F0' : 'none'
              }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: '#E8EAFC', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: "rgb(91, 107, 230)"
                }}><FileText size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#2D3748' }}>
                    {project.name || '未命名项目'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>
                    {new Date(project.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                  background: project.status === 'completed' ? '#E8F8F0' : '#FFF3E6',
                  color: project.status === 'completed' ? '#4ECB71' : '#FFB347'
                }}>
                  {project.status || '进行中'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
            <h3 style={{ fontSize: '16px', color: '#2D3748', marginBottom: '8px' }}>
              暂无项目
            </h3>
            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '20px' }}>
              创建您的第一个会刊项目
            </p>
            <a href="/projects" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: '#5B6BE6', color: 'white',
              borderRadius: '8px', textDecoration: 'none', fontSize: '14px',
              fontWeight: 500
            }}>
              <Plus size={16} /> 创建项目
            </a>
          </div>
        )}
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
