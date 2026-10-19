import { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAppeals, useDashboard, useServerAction } from './use-sangue';
import { dayOffset, errorMessage } from '../utils/options';
export function useAppealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const auth = useAuth(); const appeals = useAppeals(); const dashboard = useDashboard(); const action = useServerAction();
  const [day, setDay] = useState(0); const [consent, setConsent] = useState(false); const [saved, setSaved] = useState(false); const [error, setError] = useState(''); const [reported, setReported] = useState(false); const [reason, setReason] = useState('Pedido suspeito'); const [reporting, setReporting] = useState(false);
  const appeal = appeals.data?.find((v) => v.id === id); const profile = dashboard.data?.profile;
  const already = dashboard.data?.visits.some((v) => v.response.appealID === id && v.response.status !== 'cancelled');
  async function respond() { setError(''); if (!auth.user) { router.push('/sign-in'); return; } if (!profile) { router.push('/donor'); return; } if (!consent) { setError('Autorize a partilha com a unidade para continuar.'); return; } try { await action.mutateAsync({ path: '/v1/private/responses', body: { appealID: id, visitDay: dayOffset(day) } }); setSaved(true); } catch (e) { setError(errorMessage(e)); } }
  async function report() { if (!auth.user) { router.push('/sign-in'); return; } try { await action.mutateAsync({ path: '/v1/private/reports', body: { appealID: id, reason } }); setReported(true); } catch (e) { setError(errorMessage(e)); } }
  return { appeal, appeals, profile, day, setDay, consent, setConsent, saved, error, respond, already, busy: action.isPending, reported, reason, setReason, reporting, setReporting, report };
}
