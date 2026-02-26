'use client';
import { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit, Trash2, Gift } from 'lucide-react';

interface Rule {
  id: string;
  name: string;
  points: number;
  type: 'earn' | 'spend';
  description: string;
}

export default function Page() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRules([
        { id: '1', name: '每日签到', points: 100, type: 'earn', description: '每日签到奖励' },
        { id: '2', name: '邀请好友', points: 200, type: 'earn', description: '成功邀请一位好友' },
        { id: '3', name: '阅读电子书', points: 50, type: 'spend', description: '阅读一本电子书' },
        { id: '4', name: '下载资料', points: 100, type: 'spend', description: '下载一份资料' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div style={{ padding: 24 }}><div style={{ height: 400, background: 'white', borderRadius: 12 }}></div></div>;

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>积分配置</h1><p style={{ color: '#718096', fontSize: 14 }}>管理积分规则</p></div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgb(91, 107, 230)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}><Plus size={18} /> 新建规则</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {rules.map((rule) => (
          <div key={rule.id} style={{ background: 'white', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: rule.type === 'earn' ? '#D1FAE5' : '#FEE2E2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rule.type === 'earn' ? '#059669' : '#F4726B' }}><Gift size={20} /></div>
                <div><h3 style={{ fontSize: 15, fontWeight: 600, color: '#2D3748' }}>{rule.name}</h3><p style={{ fontSize: 13, color: '#718096' }}>{rule.description}</p></div>
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: rule.type === 'earn' ? '#059669' : '#F4726B' }}>{rule.type === 'earn' ? '+' : '-'}{rule.points}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
