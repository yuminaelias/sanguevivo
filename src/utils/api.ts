import { API_URL, getBearerToken, refreshJWT } from '@/lib/auth';
export async function apiRequest<T>(path: string, method = 'GET', body?: unknown, retried = false): Promise<T> {
  const token = getBearerToken();
  const response = await fetch(`${API_URL}${path}`, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  if (response.status === 401 && !retried) { const fresh = await refreshJWT(); if (fresh) return apiRequest<T>(path, method, body, true); }
  if (!response.ok) { const data: unknown = await response.json().catch(() => null); if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') throw new Error(data.error); throw new Error('Não foi possível guardar. Verifique os dados e tente novamente.'); }
  return response.json() as Promise<T>;
}
