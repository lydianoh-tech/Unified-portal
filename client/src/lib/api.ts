export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'CUSTOMER' | 'ADMIN';
  avatarUrl?: string | null;
}

export interface Booking {
  id: string;
  serviceId: string;
  service?: {
    id: string;
    name: string;
  } | null;
  customerId: string;
  providerId?: string | null;
  scheduledAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

const TOKEN_KEY = 'accessToken';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };
  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  register: (data: { email: string; password: string; name: string }) =>
    request<{ user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ accessToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request<{ user: User }>('/auth/me'),

  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST' }),

  securityDashboard: () =>
    request<{
      stats: Record<string, number>;
      recentLogs: Array<{ id: string; event: string; severity: string; createdAt: string }>;
    }>('/security/dashboard'),

  securityLogs: () =>
    request<{ logs: Array<{ id: string; event: string; source: string; severity: string; createdAt: string }> }>(
      '/security/logs'
    ),

  monitoring: () =>
    request<{ status: string; uptime: number; memoryMb: number; eventsLastHour: number }>(
      '/security/monitoring'
    ),

  services: () => request<{ services: Array<{ id: string; name: string; description: string; price: string }> }>('/bookings/services'),

  bookings: () => request<{ bookings: Booking[] }>('/bookings/bookings'),

  listings: () => request<{ listings: unknown[] }>('/marketplace'),

  tickets: () => request<{ tickets: unknown[] }>('/tickets'),

  tasks: () => request<{ tasks: unknown[] }>('/tasks'),
};
