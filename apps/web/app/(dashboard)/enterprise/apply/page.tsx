'use client';
import { useState } from 'react';
import { Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
export default function Page() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => setLoading(false), 1000); };
  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <Link href="/enterprise" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5B6BE6', marginBottom: 24, textDecoration: 'none' }}><ArrowLeft size={18} /> 返回</Link>
      <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', borderRadius: 16, padding: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2D3748', marginBottom: 8 }}>申请成为企业</h1>
        <p style={{ color: '#718096', marginBottom: 24 }}>填写企业信息提交申请</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#718096', marginBottom: 8 }}>企业名称</label>
            <input type="text" required style={{ width: '100%', padding: 12, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#718096', marginBottom: 8 }}>联系人</label>
            <input type="text" required style={{ width: '100%', padding: 12, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#718096', marginBottom: 8 }}>联系方式</label>
            <input type="text" required style={{ width: '100%', padding: 12, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: loading ? '#A0AEC0' : '#5B6BE6', border: 'none', borderRadius: 8, color: 'white', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? '提交中...' : '提交申请'}</button>
        </form>
      </div>
    </div>
  );
}
