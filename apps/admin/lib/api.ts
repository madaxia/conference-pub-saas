const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('printerToken') : null;
  
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
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export const portalApi = {
  // Printer login (special endpoint)
  login: (data: { printerId: string; code: string }) =>
    fetchApi<{ access_token: string; printer: any }>('/printers/login', { method: 'POST', body: JSON.stringify(data) }),
  
  // Get orders for this printer
  getOrders: () => fetchApi<any[]>('/printers/orders'),
  
  // Update order status
  updateStatus: (orderId: string, status: string) =>
    fetchApi<any>(`/printers/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  
  // Get order details
  getOrder: (orderId: string) => fetchApi<any>(`/printers/orders/${orderId}`),
};
