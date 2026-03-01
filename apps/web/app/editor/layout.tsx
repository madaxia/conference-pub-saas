'use client';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FB' }}>
      {children}
    </div>
  );
}
