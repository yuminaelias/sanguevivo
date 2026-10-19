import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard, useServerAction } from './use-sangue';
import { confirmDelete } from '@/lib/confirm';
import { errorMessage } from '../utils/options';
export function useActivityScreen() {
  const auth = useAuth(); const dashboard = useDashboard(); const action = useServerAction(); const [error, setError] = useState('');
  function cancel(kind: 'appeals' | 'responses', id: string) { confirmDelete({ title: kind === 'appeals' ? 'Cancelar este pedido?' : 'Cancelar esta intenção de visita?', message: 'Pode voltar a participar quando estiver disponível.', confirmLabel: 'Confirmar cancelamento', onConfirm: () => { void action.mutateAsync({ path: `/v1/private/${kind}/${id}/cancel`, method: 'PATCH' }).catch((e: unknown) => setError(errorMessage(e))); } }); }
  return { ...auth, dashboard, cancel, error };
}
