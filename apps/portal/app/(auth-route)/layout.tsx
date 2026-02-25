'use client';

// Auth route layout - clean without dashboard sidebar
export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
