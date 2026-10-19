import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { confirmDelete } from '@/lib/confirm';
import { errorMessage } from '../utils/options';
export function useDeleteAccountScreen() {
  const { deleteAccount } = useAuth(); const [password, setPassword] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  function remove() { if (!password) { setError('Indique a sua palavra-passe.'); return; } confirmDelete({ title: 'Eliminar a conta permanentemente?', message: 'O perfil, pedidos, respostas, candidaturas e histórico associados serão eliminados. Não é possível recuperar estes dados.', confirmLabel: 'Eliminar definitivamente', onConfirm: () => { setBusy(true); void deleteAccount(password).then(() => router.replace('/(tabs)')).catch((e: unknown) => setError(errorMessage(e))).finally(() => setBusy(false)); } }); }
  return { password, setPassword, busy, error, remove };
}
