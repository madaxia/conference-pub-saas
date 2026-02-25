'use client';
import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
export default function Page() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);
  if (loading) return <div style={{ padding: 24 }}><div style={{ height: 200, background: 'white', borderRadius: 12 }}></div></div>;
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>知识库</h1>
        <p style={{ color: '#718096', fontSize: 14 }}>管理知识库内容</p>
      </div>
      <div style={{ background: 'white', borderRadius: 12, padding: 60, textAlign: 'center', color: '#718096' }}>
        <FileText size={48} style={{ color: '#9B6BF5', marginBottom: 16 }} />
        <div>暂无知识库内容</div>
      </div>
    </div>
  );
}
