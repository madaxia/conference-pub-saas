'use client';
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
export default function Page() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);
  if (loading) return <div style={{ padding: 24 }}><div style={{ height: 200, background: 'white', borderRadius: 12 }}></div></div>;
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>通知管理</h1>
        <p style={{ color: '#718096', fontSize: 14 }}>发送系统通知</p>
      </div>
      <div style={{ background: 'white', borderRadius: 12, padding: 60, textAlign: 'center', color: '#718096' }}>
        <Bell size={48} style={{ color: '#FFB347', marginBottom: 16 }} />
        <div>通知管理内容</div>
      </div>
    </div>
  );
}
