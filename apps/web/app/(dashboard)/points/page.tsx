'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Plus, Minus, History, Gift, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PointRecord {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  createdAt: string;
}

export default function PointsPage() {
  const [points, setPoints] = useState(2500);
  const [records, setRecords] = useState<PointRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = () => {
    setLoading(true);
    setTimeout(() => {
      setPoints(2500);
      setRecords([
        { id: '1', type: 'earn', amount: 100, description: '每日签到奖励', createdAt: '2026-02-25' },
        { id: '2', type: 'spend', amount: 50, description: '阅读电子书', createdAt: '2026-02-24' },
        { id: '3', type: 'earn', amount: 200, description: '邀请好友注册', createdAt: '2026-02-23' },
        { id: '4', type: 'spend', amount: 100, description: '下载资料', createdAt: '2026-02-22' },
        { id: '5', type: 'earn', amount: 50, description: '完善个人资料', createdAt: '2026-02-21' },
        { id: '6', type: 'earn', amount: 500, description: '首次充值奖励', createdAt: '2026-02-20' },
        { id: '7', type: 'spend', amount: 200, description: '打印服务', createdAt: '2026-02-19' },
      ]);
      setLoading(false);
    }, 500);
  };

  const earnPoints = records.filter(r => r.type === 'earn').reduce((a, b) => a + b.amount, 0);
  const spendPoints = records.filter(r => r.type === 'spend').reduce((a, b) => a + b.amount, 0);

  if (loading) {
    return <div style={{ padding: 24 }}><div style={{ height: 400, background: 'white', borderRadius: 12 }}></div></div>;
  }

  return (
    <div style={{ padding: 24, background: '#F5F7FB', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D3748', marginBottom: 6 }}>我的积分</h1>
        <p style={{ color: '#718096', fontSize: 14 }}>查看和管理您的积分</p>
      </div>

      {/* Points Card */}
      <div style={{ 
        background: 'linear-gradient(135deg, #5B6BE6 0%, #9B6BF5 100%)', 
        borderRadius: 16, padding: 32, color: 'white', marginBottom: 24 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>当前积分</div>
            <div style={{ fontSize: 48, fontWeight: 700 }}>{points}</div>
          </div>
          <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={28} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowUpRight size={18} /> <span>获得 {earnPoints}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowDownRight size={18} /> <span>消费 {spendPoints}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', cursor: 'pointer' }}>
          <Gift size={24} style={{ color: 'rgb(91, 107, 230)', marginBottom: 8 }} />
          <div style={{ fontSize: 14, fontWeight: 500, color: '#2D3748' }}>每日签到</div>
          <div style={{ fontSize: 12, color: '#718096' }}>+100积分</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', cursor: 'pointer' }}>
          <Plus size={24} style={{ color: 'rgb(91, 107, 230)', marginBottom: 8 }} />
          <div style={{ fontSize: 14, fontWeight: 500, color: '#2D3748' }}>充值积分</div>
          <div style={{ fontSize: 12, color: '#718096' }}>1元=10积分</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: 20, textAlign: 'center', cursor: 'pointer' }}>
          <History size={24} style={{ color: 'rgb(91, 107, 230)', marginBottom: 8 }} />
          <div style={{ fontSize: 14, fontWeight: 500, color: '#2D3748' }}>积分商城</div>
          <div style={{ fontSize: 12, color: '#718096' }}>礼品兑换</div>
        </div>
      </div>

      {/* Records */}
      <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2D3748', marginBottom: 16 }}>积分记录</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {records.map((record) => (
            <div key={record.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: record.type === 'earn' ? '#D1FAE5' : '#FEE2E2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: record.type === 'earn' ? '#059669' : '#F4726B' }}>
                  {record.type === 'earn' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#2D3748' }}>{record.description}</div>
                  <div style={{ fontSize: 12, color: '#A0AEC0' }}>{record.createdAt}</div>
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: record.type === 'earn' ? '#059669' : '#F4726B' }}>
                {record.type === 'earn' ? '+' : '-'}{record.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
