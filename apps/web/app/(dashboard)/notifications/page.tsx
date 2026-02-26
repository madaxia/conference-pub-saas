'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Mail, AlertCircle, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/notifications', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('加载通知失败');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/notifications/${id}/read`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (e) {
      console.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/notifications/read-all', {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error('Failed to mark all as read');
    }
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || !n.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} style={{ color: 'rgb(91, 107, 230)' }} />;
      case 'warning': return <AlertCircle size={20} style={{ color: 'rgb(91, 107, 230)' }} />;
      case 'error': return <AlertCircle size={20} style={{ color: '#F4726B' }} />;
      default: return <Mail size={20} style={{ color: "rgb(91, 107, 230)" }} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ height: '32px', width: '150px', background: '#E2E8F0', borderRadius: '6px', marginBottom: '8px' }}></div>
          <div style={{ height: '20px', width: '100px', background: '#E2E8F0', borderRadius: '6px' }}></div>
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            marginBottom: '12px', animation: 'shimmer 1.5s infinite'
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#E2E8F0', borderRadius: '8px' }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ height: '18px', width: '60%', background: '#E2E8F0', borderRadius: '6px', marginBottom: '8px' }}></div>
                <div style={{ height: '14px', width: '80%', background: '#E2E8F0', borderRadius: '6px' }}></div>
              </div>
            </div>
          </div>
        ))}
        <style jsx>{`
          @keyframes shimmer {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>
            通知中心
          </h1>
          <p style={{ color: '#718096', fontSize: '14px' }}>
            {unreadCount > 0 ? `${unreadCount} 条未读消息` : '暂无未读消息'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px', background: 'white', border: '1px solid #E2E8F0',
            borderRadius: '8px', color: "rgb(91, 107, 230)", fontSize: '14px', cursor: 'pointer'
          }}>
            <Check size={16} /> 全部已读
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div style={{ padding: '12px', background: '#FDECEC', borderRadius: '8px', color: '#F4726B', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            background: filter === 'all' ? '#5B6BE6' : '#F5F7FB',
            color: filter === 'all' ? 'white' : '#718096',
            fontSize: '14px', cursor: 'pointer'
          }}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            background: filter === 'unread' ? '#5B6BE6' : '#F5F7FB',
            color: filter === 'unread' ? 'white' : '#718096',
            fontSize: '14px', cursor: 'pointer'
          }}
        >
          未读 {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div>
          {filteredNotifications.map((notification) => (
            <div key={notification.id} style={{
              display: 'flex', gap: '16px', padding: '20px',
              background: notification.read ? 'white' : '#F8FAFC',
              borderRadius: '12px', marginBottom: '12px',
              border: '1px solid #E2E8F0',
              transition: 'all 0.2s'
            }}>
              <div style={{
                width: '40px', height: '40px', background: notification.read ? '#F5F7FB' : '#E8EAFC',
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {getNotificationIcon(notification.type)}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2D3748' }}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <span style={{
                      width: '8px', height: '8px', background: '#5B6BE6', borderRadius: '50%', flexShrink: 0, marginTop: '6px'
                    }}></span>
                  )}
                </div>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '12px' }}>
                  {notification.content}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#A0AEC0' }}>
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString('zh-CN') : ''}
                  </span>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      style={{
                        padding: '6px 12px', background: 'transparent', border: '1px solid #E2E8F0',
                        borderRadius: '6px', color: '#718096', fontSize: '12px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <Check size={12} /> 标记已读
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          textAlign: 'center', padding: '80px 20px', background: 'white',
          borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔔</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748', marginBottom: '8px' }}>
            {filter === 'unread' ? '暂无未读通知' : '暂无通知'}
          </h3>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            {filter === 'unread' ? '您已阅读所有通知' : '有新消息时会在这里显示'}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
