'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, Plus, ExternalLink, Clock, CreditCard, FileText, Eye } from 'lucide-react';

interface Ebook {
  id: string;
  name: string;
  projectId: string;
  projectName?: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  viewUrl?: string;
}

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userPoints, setUserPoints] = useState(2500);

  useEffect(() => {
    fetchEbooks();
    fetchUserPoints();
  }, []);

  const fetchEbooks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/ebooks', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setEbooks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('加载电子书失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/ebooks/points', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.points) setUserPoints(data.points);
    } catch (e) {
      console.error('Failed to fetch points');
    }
  };

  const isExpired = (expiresAt: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getStatusBadge = (ebook: Ebook) => {
    if (isExpired(ebook.expiresAt)) {
      return { text: '已过期', bg: '#FDECEC', color: '#F4726B' };
    }
    if (ebook.status === 'active') {
      return { text: '有效', bg: '#D1FAE5', color: '#059669' };
    }
    return { text: '待激活', bg: '#FEF3C7', color: '#D97706' };
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ height: '32px', width: '120px', background: '#E2E8F0', borderRadius: '6px', marginBottom: '8px' }}></div>
          <div style={{ height: '20px', width: '200px', background: '#E2E8F0', borderRadius: '6px' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', animation: 'shimmer 1.5s infinite' }}>
              <div style={{ height: '24px', width: '60%', background: '#E2E8F0', borderRadius: '6px', marginBottom: '12px' }}></div>
              <div style={{ height: '16px', width: '40%', background: '#E2E8F0', borderRadius: '6px' }}></div>
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
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>
            我的电子书
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            管理您的电子书和出版物
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px', background: '#FFF3E6', borderRadius: '8px'
          }}>
            <CreditCard size={18} style={{ color: '#FFB347' }} />
            <span style={{ color: '#2D3748', fontWeight: 600 }}>{userPoints}</span>
            <span style={{ color: '#718096', fontSize: '13px' }}>积分</span>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', background: '#5B6BE6', color: 'white',
            borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
          }}>
            <Plus size={18} /> 生成电子书
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div style={{ padding: '12px', background: '#FDECEC', borderRadius: '8px', color: '#F4726B', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* ebooks Grid */}
      {ebooks.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {ebooks.map((ebook) => {
            const badge = getStatusBadge(ebook);
            return (
              <div key={ebook.id} style={{
                background: 'white', borderRadius: '12px', padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', background: '#F3EEFF', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9B6BF5'
                  }}>
                    <Book size={24} />
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                    background: badge.bg, color: badge.color, fontWeight: 500
                  }}>
                    {badge.text}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>
                  {ebook.name || '未命名电子书'}
                </h3>
                
                <p style={{ fontSize: '13px', color: '#718096', marginBottom: '12px' }}>
                  {ebook.projectName || '关联项目'}
                </p>

                {ebook.expiresAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#A0AEC0', marginBottom: '16px' }}>
                    <Clock size={14} />
                    {isExpired(ebook.expiresAt) 
                      ? `已于 ${new Date(ebook.expiresAt).toLocaleDateString('zh-CN')} 过期`
                      : `有效期至 ${new Date(ebook.expiresAt).toLocaleDateString('zh-CN')}`
                    }
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    flex: 1, padding: '10px', background: '#F5F7FB', border: 'none', borderRadius: '8px',
                    color: '#5B6BE6', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}>
                    <Eye size={14} /> 查看
                  </button>
                  {isExpired(ebook.expiresAt) && (
                    <button style={{
                      padding: '10px 14px', background: '#5B6BE6', border: 'none', borderRadius: '8px',
                      color: 'white', fontSize: '13px', fontWeight: 500, cursor: 'pointer'
                    }}>
                      续期
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          textAlign: 'center', padding: '80px 20px', background: 'white',
          borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>
            暂无电子书
          </h3>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            从项目文档生成电子书，提供在线阅读版本，支持翻书模式和PDF模式
          </p>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', background: '#5B6BE6', color: 'white',
            borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
          }}>
            <Plus size={18} /> 生成电子书
          </button>
        </div>
      )}

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
