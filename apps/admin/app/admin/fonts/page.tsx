'use client';
import { useState, useEffect } from 'react';
import { Type, Upload, Trash2, Edit, X, Loader2 } from 'lucide-react';

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
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'upload' | 'delete'>('upload');
  const [selected, setSelected] = useState<Font | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setFonts([
        { id: '1', name: '思源黑体', family: 'Source Han Sans SC', style: 'Regular', status: 'active', uploadedAt: '2026-01-15' },
        { id: '2', name: '思源宋体', family: 'Source Han Serif SC', style: 'Regular', status: 'active', uploadedAt: '2026-01-15' },
        { id: '3', name: 'Noto Sans SC', family: 'Noto Sans SC', style: 'Bold', status: 'active', uploadedAt: '2026-02-01' },
        { id: '4', name: '站酷高端黑', family: 'ZCOOL KuaiLe', style: 'Regular', status: 'pending', uploadedAt: '2026-02-20' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleUpload = () => { setModalType('upload'); setShowModal(true); };
  const handleDelete = (f: Font) => { setModalType('delete'); setSelected(f); setShowModal(true); };
  const handleToggle = (f: Font) => {
    setSaving(true);
    setTimeout(() => {
      setFonts(fonts.map(font => font.id === f.id ? { ...font, status: font.status === 'active' ? 'pending' : 'active' } : font));
      setSuccess(f.status === 'active' ? '字体已禁用' : '字体已启用');
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 300);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (modalType === 'upload') {
        setFonts([{ id: Date.now().toString(), name: '新字体', family: 'New Font', style: 'Regular', status: 'pending', uploadedAt: new Date().toISOString().split('T')[0] }, ...fonts]);
        setSuccess('字体上传成功');
      } else {
        setFonts(fonts.filter(f => f.id !== selected?.id));
        setSuccess('字体删除成功');
      }
      setShowModal(false); setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {success && <div style={{ position: 'fixed', top: 80, right: 24, background: '#059669', color: 'white', padding: '12px 20px', borderRadius: 8, zIndex: 1000 }}>{success}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>字体管理</h1><p style={{ color: '#718096', fontSize: 14 }}>管理用户上传的字体文件</p></div>
        <button onClick={handleUpload} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}><Upload size={18} /> 上传字体</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}><div style={{ fontSize: 28, fontWeight: 700, color: '#2D3748' }}>{fonts.length}</div><div style={{ fontSize: 13, color: '#718096' }}>总字体</div></div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}><div style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{fonts.filter(f => f.status === 'active').length}</div><div style={{ fontSize: 13, color: '#718096' }}>已启用</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {loading ? <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}><Loader2 className="animate-spin" size={24} /></div> : fonts.map((font) => (
          <div key={font.id} style={{ padding: 24, background: 'white', borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <Type size={40} style={{ color: 'rgb(91, 107, 230)', marginBottom: 16 }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D3748', marginBottom: 4 }}>{font.name}</h3>
            <p style={{ fontSize: 13, color: '#718096', marginBottom: 8 }}>{font.family}</p>
            <span style={{ padding: '2px 8px', background: font.status === 'active' ? '#D1FAE5' : '#FEF3C7', color: font.status === 'active' ? '#059669' : '#D97706', borderRadius: 6, fontSize: 11 }}>{font.status === 'active' ? '已启用' : '待审核'}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid #E2E8F0' }}>
              <button onClick={() => handleToggle(font)} style={{ padding: '6px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: font.status === 'active' ? '#F4726B' : '#059669', fontSize: 12 }}>{font.status === 'active' ? '禁用' : '启用'}</button>
              <button onClick={() => handleDelete(font)} style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: '#F4726B' }}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, width: '90%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h3 style={{ fontSize: 18, fontWeight: 600, color: '#2D3748' }}>{modalType === 'upload' ? '上传字体' : '删除字体'}</h3><button onClick={() => setShowModal(false)}><X size={20} color="#718096" /></button></div>
            {modalType === 'upload' ? (
              <div style={{ border: '2px dashed #E2E8F0', borderRadius: 12, padding: 40, textAlign: 'center', marginBottom: 16 }}>
                <Upload size={32} style={{ color: '#A0AEC0', marginBottom: 12 }} />
                <p style={{ color: '#718096' }}>点击或拖拽字体文件到此处上传</p>
                <p style={{ fontSize: 12, color: '#A0AEC0', marginTop: 8 }}>支持 .ttf, .otf, .woff 格式</p>
              </div>
            ) : <p style={{ color: '#718096', marginBottom: 20 }}>确定删除字体 <strong>{selected?.name}</strong>？</p>}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}><button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: '#F5F7FB', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#718096' }}>取消</button><button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: 'rgb(91, 107, 230)', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'white' }}>{modalType === 'upload' ? '上传' : '删除'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
