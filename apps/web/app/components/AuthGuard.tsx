'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth(requiredRole?: 'member' | 'admin' | 'superadmin' | 'printer') {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      router.push('/login');
      return;
    }

    // 如果需要特定角色，检查角色
    if (requiredRole && userRole !== requiredRole && userRole !== 'superadmin') {
      // 角色不匹配，跳转到对应登录页
      if (userRole === 'admin' || userRole === 'superadmin') {
        router.push('http://localhost:3002/login');
      } else if (userRole === 'printer') {
        router.push('http://localhost:3005/login');
      } else {
        router.push('/login');
      }
      return;
    }

    setUser({ id: '', email: '', name: '', role: userRole || '' });
    setLoading(false);
  }, [requiredRole, router]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return { user, loading, logout };
}

export function requireAdmin() {
  const { user, loading } = useAuth('admin');
  return { user, loading };
}

export function requireMember() {
  const { user, loading } = useAuth('member');
  return { user, loading };
}
