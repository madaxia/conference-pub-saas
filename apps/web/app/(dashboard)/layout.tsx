'use client';

import dynamic from 'next/dynamic';

// 动态导入 DashboardLayout，禁用 SSR 以避免 lucide-react Hydration 错误
const DashboardLayout = dynamic(() => import('../components/DashboardLayout'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 240, background: '#f5f5f5' }} />
      <main style={{ flex: 1, padding: 24 }}>加载中...</main>
    </div>
  ),
});

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout isAdmin={false}>{children}</DashboardLayout>;
}
