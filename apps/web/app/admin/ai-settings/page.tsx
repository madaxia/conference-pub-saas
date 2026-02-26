'use client';
import { useState, useEffect } from 'react';
import { Bot, Key, Save, TestTube } from 'lucide-react';

export default function Page() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('minimax');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>AI设置</h1>
        <p style={{ color: '#718096', fontSize: 14 }}>配置AI服务</p>
      </div>
      <div style={{ background: 'white', borderRadius: 12, padding: 24, maxWidth: 600 }}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#718096', marginBottom: 8 }}>AI模型</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} style={{ width: '100%', padding: 12, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}>
            <option value="minimax">MiniMax</option>
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
          </select>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#718096', marginBottom: 8 }}>API Key</label>
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="请输入API密钥" style={{ width: '100%', padding: 12, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
        </div>
        <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          <Save size={18} /> {saving ? '保存中...' : '保存设置'}
        </button>
      </div>
    </div>
  );
}
