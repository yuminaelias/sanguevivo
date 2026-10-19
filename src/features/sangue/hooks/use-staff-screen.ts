import { useState } from 'react';
import { Alert } from 'react-native';
import { useWorkspace, useServerAction } from './use-sangue';
import { confirmDelete } from '@/lib/confirm';
import { errorMessage } from '../utils/options';
export function useStaffScreen() {
  const workspace = useWorkspace(); const action = useServerAction(); const [error, setError] = useState(''); const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({}); const [message, setMessage] = useState('');
  async function run(path: string, body: unknown) { setError(''); setMessage(''); try { await action.mutateAsync({ path, method: 'PATCH', body }); setMessage('Actualização guardada.'); } catch (e) { setError(errorMessage(e)); } }
  function unitSelection(id: string, name: string) { setSelectedUnits({ ...selectedUnits, [id]: name }); }
  function publish(id: string, status: string) { const selected = workspace.data?.units.find((u) => u.name === selectedUnits[id]); if (status === 'published') { Alert.alert('Publicar necessidade verificada?', 'Confirme por meios independentes o vínculo da unidade e a necessidade. O pedido ficará público.', [{ text: 'Voltar', style: 'cancel' }, { text: 'Publicar', onPress: () => { void run(`/v1/private/staff/appeals/${id}`, { status, unitID: selected?.id }); } }]); return; } confirmDelete({ title: status === 'closed' ? 'Encerrar pedido?' : 'Rejeitar pedido?', message: 'O pedido deixará de aceitar respostas públicas.', confirmLabel: 'Confirmar', onConfirm: () => { void run(`/v1/private/staff/appeals/${id}`, { status, unitID: selected?.id }); } }); }
  function confirmDonation(id: string, donated: boolean) { Alert.alert(donated ? 'Confirmar doação efectuada?' : 'Concluir sem doação?', 'Confirme apenas o resultado registado pela equipa clínica. Uma intenção de visita não prova que houve doação.', [{ text: 'Voltar', style: 'cancel' }, { text: 'Confirmar registo', onPress: () => { void run(`/v1/private/staff/responses/${id}`, { status: donated ? 'donated' : 'not_donated' }); } }]); }
  function approve(userID: string, approve: boolean) { Alert.alert(approve ? 'Autorizar instituição?' : 'Recusar candidatura?', 'Antes de autorizar, verifique a identidade profissional, o vínculo e os dados oficiais da unidade por meios independentes.', [{ text: 'Voltar', style: 'cancel' }, { text: 'Confirmar decisão', onPress: () => { void run(`/v1/private/staff/applications/${userID}`, { approve }); } }]); }
  return { workspace, selectedUnits, unitSelection, publish, confirmDonation, approve, error, message, busy: action.isPending };
}
