const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(response.status, error.message || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data: { tenantId: string; email: string; password: string }) =>
    fetchApi<{ access_token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  
  register: (data: { tenantId: string; email: string; password: string; name: string; role?: string }) =>
    fetchApi<{ access_token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  
  me: () => fetchApi<any>('/auth/me'),

  // Tenants
  createTenant: (name: string) =>
    fetchApi<any>('/tenants', { method: 'POST', body: JSON.stringify({ name }) }),
  
  getTenants: () => fetchApi<any[]>('/tenants'),

  // Projects
  getProjects: () => fetchApi<any[]>('/projects'),
  
  getProject: (id: string) => fetchApi<any>(`/projects/${id}`),
  
  createProject: (data: { tenantId: string; name: string; conferenceName: string; issueDate: string }) =>
    fetchApi<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  
  updateProject: (id: string, data: any) =>
    fetchApi<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  deleteProject: (id: string) =>
    fetchApi<any>(`/projects/${id}`, { method: 'DELETE' }),

  // Documents
  getDocuments: (projectId: string) => fetchApi<any[]>(`/documents/project/${projectId}`),
  
  getDocument: (id: string) => fetchApi<any>(`/documents/${id}`),
  
  createDocument: (data: { projectId: string; title: string; content?: any }) =>
    fetchApi<any>('/documents', { method: 'POST', body: JSON.stringify(data) }),
  
  updateDocument: (id: string, data: any) =>
    fetchApi<any>(`/documents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Templates
  getTemplates: (tenantId?: string) => fetchApi<any[]>(`/templates${tenantId ? `?tenantId=${tenantId}` : ''}`),

  // Export
  exportHtml: (documentId: string) => {
    const token = localStorage.getItem('token');
    window.open(`${API_URL}/export/html/${documentId}?token=${token}`, '_blank');
  },
  
  exportPdf: (documentId: string) => {
    const token = localStorage.getItem('token');
    window.open(`${API_URL}/export/pdf/${documentId}?token=${token}`, '_blank');
  },

  // Notifications
  getNotifications: (unreadOnly = false) => 
    fetchApi<any[]>(`/notifications${unreadOnly ? '?unread=true' : ''}`),
  
  getUnreadCount: () => 
    fetchApi<{ count: number }>('/notifications/unread-count'),
  
  markNotificationRead: (id: string) => 
    fetchApi<any>(`/notifications/${id}/read`, { method: 'PUT' }),
  
  markAllNotificationsRead: () => 
    fetchApi<any>('/notifications/read-all', { method: 'PUT' }),

  // Admin - Send bulk notification
  sendBulkNotification: (data: { type: string; title: string; message: string; userIds?: string[]; role?: string; groupId?: string }) =>
    fetchApi<any>('/notifications/bulk', { method: 'POST', body: JSON.stringify(data) }),

  // Admin - User Groups
  getUserGroups: () => fetchApi<any[]>('/admin/groups'),
  createUserGroup: (data: { name: string; description?: string }) =>
    fetchApi<any>('/admin/groups', { method: 'POST', body: JSON.stringify(data) }),
  deleteUserGroup: (id: string) =>
    fetchApi<any>(`/admin/groups/${id}`, { method: 'DELETE' }),
  getGroupMembers: (groupId: string) => fetchApi<any[]>(`/admin/groups/${groupId}/members`),
  addGroupMember: (groupId: string, userId: string) =>
    fetchApi<any>(`/admin/groups/${groupId}/members`, { method: 'POST', body: JSON.stringify({ userId }) }),
  removeGroupMember: (groupId: string, userId: string) =>
    fetchApi<any>(`/admin/groups/${groupId}/members/${userId}`, { method: 'DELETE' }),

  // Admin - User Fonts
  getUserFonts: (status?: string) => 
    fetchApi<any[]>(`/admin/fonts${status ? `?status=${status}` : ''}`),
  approveUserFont: (id: string) =>
    fetchApi<any>(`/admin/fonts/${id}/approve`, { method: 'PUT' }),
  rejectUserFont: (id: string, note?: string) =>
    fetchApi<any>(`/admin/fonts/${id}/reject`, { method: 'PUT', body: JSON.stringify({ note }) }),
  deleteUserFont: (id: string, warningMessage: string) =>
    fetchApi<any>(`/admin/fonts/${id}`, { method: 'DELETE', body: JSON.stringify({ warningMessage }) }),
};

export { ApiError };
