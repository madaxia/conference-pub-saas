'use client';
import { useState, useEffect } from 'react';
import { Type, Upload, Trash2, Download, Search, Eye } from 'lucide-react';

interface Font {
  id: string;
  name: string;
  family: string;
  style: string;
  status: 'active' | 'pending';
  uploadedAt: string;
}

export default function Page() {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFonts();
  }, []);

  const fetchFonts = () => {
    setLoading(true);
    setTimeout(() => {
      setFonts([
        { id: '1', name: '思源黑体', family: 'Source Han Sans SC', style: 'Regular', status: 'active', uploadedAt: '2026-01-15' },
        { id: '2', name: '思源宋体', family: 'Source Han Serif SC', style: 'Regular', status: 'active', uploadedAt: '2026-01-15' },
        { id: '3', name: 'Noto Sans SC', family: 'Noto Sans SC', style: 'Bold', status: 'active', uploadedAt: '2026-02-01' },
      ]);
      setLoading(false);
    }, 500);
  };

  if (loading) return <div style={{ padding: 24 }}><div style={{ height: 400, background: 'white', borderRadius: 12 }}></div></div>;

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>字体管理</h1>
          <p style={{ color: '#718096', fontSize: 14 }}>管理用户上传的字体文件</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          <Upload size={18} /> 上传字体
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{fonts.length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>总字体</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{fonts.filter(f => f.status === 'active').length}</div>
          <div style={{ fontSize: 13, color: '#718096' }}>已启用</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {fonts.map((font) => (
            <div key={font.id} style={{ padding: 20, background: '#F8FAFC', borderRadius: 12 }}>
              <Type size={32} style={{ color: 'rgb(91, 107, 230)', marginBottom: 12 }} />
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#2D3748', marginBottom: 4 }}>{font.name}</h3>
              <p style={{ fontSize: 12, color: '#718096', marginBottom: 8 }}>{font.family}</p>
              <span style={{ padding: '2px 8px', background: '#D1FAE5', color: '#059669', borderRadius: 6, fontSize: 11 }}>已启用</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
