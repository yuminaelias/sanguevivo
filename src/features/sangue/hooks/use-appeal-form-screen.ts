import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useServerAction } from './use-sangue';
import { errorMessage } from '../utils/options';
export function useAppealFormScreen() {
  const { user, loading } = useAuth(); const action = useServerAction();
  const [unit, setUnit] = useState(''); const [district, setDistrict] = useState('KaMpfumo'); const [group, setGroup] = useState('O-'); const [urgency, setUrgency] = useState('Urgente'); const [quantity, setQuantity] = useState('1'); const [consent, setConsent] = useState(false); const [saved, setSaved] = useState(false); const [error, setError] = useState('');
  useEffect(() => { if (!loading && !user) router.replace('/sign-in'); }, [loading, user]);
  async function submit() { setError(''); if (unit.trim().length < 2 || district.trim().length < 2) { setError('Indique a unidade sanitária e o distrito.'); return; } if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1 || Number(quantity) > 50) { setError('Indique entre 1 e 50 unidades de sangue.'); return; } if (!consent) { setError('Confirme as condições antes de comunicar.'); return; } try { await action.mutateAsync({ path: '/v1/private/appeals', body: { unitName: unit.trim(), district: district.trim(), bloodGroup: group, urgency, quantity: Number(quantity) } }); setSaved(true); } catch (e) { setError(errorMessage(e)); } }
  return { unit, setUnit, district, setDistrict, group, setGroup, urgency, setUrgency, quantity, setQuantity, consent, setConsent, saved, error, submit, busy: action.isPending };
}
