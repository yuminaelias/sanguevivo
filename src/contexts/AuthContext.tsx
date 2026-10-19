import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AppState } from 'react-native';
import { authClient, clearTokens, refreshJWT } from '@/lib/auth';
import { queryClient } from '@/lib/query-client';
import type { AuthUser } from '@/features/sangue/types/sangue';
const AuthContext = createContext<{ user: AuthUser | null; loading: boolean; signIn: (email: string, password: string) => Promise<void>; signUp: (email: string, password: string, name: string) => Promise<void>; signOut: () => Promise<void>; deleteAccount: (password: string) => Promise<void> } | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  async function loadSession() { try { const { data } = await authClient.getSession(); setUser(data?.user ?? null); if (data?.user) await refreshJWT(); } catch { setUser(null); } finally { setLoading(false); } }
  useEffect(() => { void loadSession(); const sub = AppState.addEventListener('change', (state) => { if (state === 'active') void loadSession(); }); return () => sub.remove(); }, []);
  async function signIn(email: string, password: string) { const { data, error } = await authClient.signIn.email({ email, password }); if (error) throw new Error('E-mail ou palavra-passe incorrectos.'); if (!data?.user) throw new Error('Não foi possível iniciar sessão.'); await refreshJWT(); queryClient.clear(); setUser(data.user); }
  async function signUp(email: string, password: string, name: string) { const { data, error } = await authClient.signUp.email({ email, password, name }); if (error) throw new Error('Não foi possível criar a conta. Verifique o e-mail ou tente iniciar sessão.'); if (!data?.user) throw new Error('Não foi possível criar a conta.'); await refreshJWT(); queryClient.clear(); setUser(data.user); }
  async function signOut() { await authClient.signOut(); await clearTokens(); queryClient.clear(); setUser(null); }
  async function deleteAccount(password: string) { const { error } = await authClient.deleteUser({ password }); if (error) throw new Error('Não foi possível eliminar. Confirme a palavra-passe e tente novamente.'); await clearTokens(); queryClient.clear(); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, deleteAccount }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('AuthProvider em falta'); return value; }
