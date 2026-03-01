'use client';
import { useState } from 'react';
import { Bot, Key, Save, TestTube, Loader2 } from 'lucide-react';

export default function Page() {
  const [apiKey, setApiKey] = useState('sk-********************************');
  const [model, setModel] = useState('minimax');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess('AI设置已保存');
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  const handleTest = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess('API连接测试成功');
      setTimeout(() => setSuccess(''), 3000);
    }, 1500);
  };

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {success && <div style={{ position: 'fixed', top: 80, right: 24, background: '#059669', color: 'white', padding: '12px 20px', borderRadius: 8, zIndex: 1000 }}>{success}</div>}
      <div style={{ marginBottom: 24 }}><h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>AI设置</h1><p style={{ color: '#718096', fontSize: 14 }}>配置AI服务</p></div>
      <div style={{ background: 'white', borderRadius: 12, padding: 24, maxWidth: 600, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ width: 48, height: 48, background: '#E8EAFC', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(91, 107, 230)' }}><Bot size={24} /></div>
          <div><h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D3748' }}>AI模型配置</h3><p style={{ fontSize: 13, color: '#718096' }}>选择AI服务提供商</p></div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#718096', marginBottom: 8 }}>AI模型</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} style={{ width: '100%', padding: 12, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }}>
            <option value="minimax">MiniMax</option>
            <option value="openai">OpenAI GPT-4</option>
            <option value="claude">Claude 3</option>
            <option value="gemini">Google Gemini</option>
          </select>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#718096', marginBottom: 8 }}>API Key</label>
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="请输入API密钥" style={{ width: '100%', padding: 12, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#718096', marginBottom: 8 }}>Temperature</label>
            <input type="number" step="0.1" min="0" max="1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} style={{ width: '100%', padding: 12, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#718096', marginBottom: 8 }}>Max Tokens</label>
            <input type="number" value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))} style={{ width: '100%', padding: 12, background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleTest} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#F5F7FB', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer', color: '#718096' }}><TestTube size={18} />{saving ? '测试中...' : '测试连接'}</button>
          <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'rgb(91, 107, 230)', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'white' }}>{saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}{saving ? '保存中...' : '保存设置'}</button>
        </div>
      </div>
    </div>
  );
}
