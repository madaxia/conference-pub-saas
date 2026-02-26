'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, Plus, ExternalLink, Clock, CreditCard, FileText, Eye, Download, Trash2, Edit } from 'lucide-react';

interface Ebook {
  id: string;
  name: string;
  projectId: string;
  projectName?: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  viewUrl?: string;
  coverUrl?: string;
  pages?: number;
}

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(2500);

  useEffect(() => {
    fetchEbooks();
    fetchUserPoints();
  }, []);

  const fetchEbooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/ebooks');
      const data = await res.json();
      // Demo data if empty
      if (!data || data.length === 0) {
        setEbooks([
          {
            id: '1',
            name: '2026国际会议会刊',
            projectId: '1',
            projectName: '2026国际会议',
            status: 'published',
            expiresAt: '2027-12-31',
            createdAt: '2026-01-15',
            viewUrl: '/ebooks/1/read',
            coverUrl: 'https://via.placeholder.com/200x280/5B6BE6/FFFFFF?text=会刊',
            pages: 156,
          },
          {
            id: '2',
            name: '技术研讨会论文集',
            projectId: '2',
            projectName: '技术研讨会',
            status: 'published',
            expiresAt: '2027-06-30',
            createdAt: '2026-02-01',
            viewUrl: '/ebooks/2/read',
            coverUrl: 'https://via.placeholder.com/200x280/9B6BF5/FFFFFF?text=论文集',
            pages: 89,
          },
        ]);
      } else {
        setEbooks(data);
      }
    } catch (e) {
      console.error('Failed to fetch ebooks:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const res = await fetch('http://localhost:3001/ebooks/points/my');
      if (res.ok) {
        const data = await res.json();
        setUserPoints(data.points || 2500);
      }
    } catch (e) {
      console.error('Failed to fetch points:', e);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; text: string }> = {
      published: { bg: '#D1FAE5', color: '#059669', text: '已发布' },
      draft: { bg: '#FEF3C7', color: '#D97706', text: '草稿' },
      archived: { bg: '#F3F4F6', color: '#6B7280', text: '已归档' },
    };
    const s = styles[status] || styles.draft;
    return <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', background: s.bg, color: s.color }}>{s.text}</span>;
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', background: '#F5F7FB', minHeight: '100vh' }}>
        <div style={{ height: '400px', background: 'white', borderRadius: '12px', animation: 'shimmer 1.5s infinite' }}></div>
        <style jsx>{`@keyframes shimmer { 0% { opacity: 1 } 50% { opacity: 0.5 } 100% { opacity: 1 } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#F5F7FB', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>我的电子书</h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>管理和阅读您的电子书</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <CreditCard size={18} style={{ color: 'rgb(91, 107, 230)' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#2D3748' }}>{userPoints}</span>
            <span style={{ fontSize: '12px', color: '#718096' }}>积分</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#E8EAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)' }}>
              <Book size={24} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748' }}>{ebooks.length}</div>
              <div style={{ fontSize: '13px', color: '#718096' }}>电子书总数</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#D1FAE5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <Eye size={24} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748' }}>{ebooks.filter(e => e.status === 'published').length}</div>
              <div style={{ fontSize: '13px', color: '#718096' }}>已发布</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#FFF3E6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFB347' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748' }}>2</div>
              <div style={{ fontSize: '13px', color: '#718096' }}>最近阅读</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ebook Grid */}
      {ebooks.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {ebooks.map((ebook) => (
            <div key={ebook.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}>
              {/* Cover */}
              <div style={{ height: '180px', background: ebook.coverUrl || '#E8EAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {ebook.coverUrl ? (
                  <img src={ebook.coverUrl} alt={ebook.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Book size={48} style={{ color: 'rgb(91, 107, 230)' }} />
                )}
              </div>
              
              {/* Info */}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#2D3748', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ebook.name}</h3>
                  {getStatusBadge(ebook.status)}
                </div>
                <p style={{ fontSize: '12px', color: '#718096', marginBottom: '12px' }}>{ebook.projectName || '未关联项目'}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: '#A0AEC0' }}>{ebook.pages || 0}页</span>
                  <Link href={`/ebooks/${ebook.id}/read`} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: 'rgb(91, 107, 230)', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '12px' }}>
                    <Eye size={14} /> 阅读
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
          <Book size={64} style={{ color: 'rgb(91, 107, 230)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>暂无电子书</h3>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px' }}>创建项目后，系统会自动生成电子书</p>
          <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgb(91, 107, 230)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            <Plus size={18} /> 创建项目
          </Link>
        </div>
      )}
    </div>
  );
}
