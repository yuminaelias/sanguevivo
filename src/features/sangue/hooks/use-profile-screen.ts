import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard, useServerAction } from './use-sangue';
import { confirmDelete } from '@/lib/confirm';
import { errorMessage } from '../utils/options';
export function useProfileScreen() {
  const auth = useAuth(); const dashboard = useDashboard(); const action = useServerAction(); const [error, setError] = useState('');
  function withdraw() { confirmDelete({ title: 'Retirar o consentimento?', message: 'O perfil de doador e as respostas associadas serão eliminados. A sua conta mantém-se.', confirmLabel: 'Retirar e eliminar perfil', onConfirm: () => { void action.mutateAsync({ path: '/v1/private/donor', method: 'DELETE' }).catch((e: unknown) => setError(errorMessage(e))); } }); }
  async function signOut() { try { await auth.signOut(); router.replace('/(tabs)'); } catch (e) { setError(errorMessage(e)); } }
  return { ...auth, dashboard, error, withdraw, signOut };
}
