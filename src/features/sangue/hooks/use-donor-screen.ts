import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard, useServerAction } from './use-sangue';
import { errorMessage } from '../utils/options';
export function useDonorScreen() {
  const { user, loading } = useAuth(); const dashboard = useDashboard(); const action = useServerAction();
  const [name, setName] = useState(''); const [group, setGroup] = useState('Não sei'); const [district, setDistrict] = useState('KaMpfumo');
  const [available, setAvailable] = useState(true); const [consent, setConsent] = useState(false); const [adult, setAdult] = useState(false);
  const [hydrated, setHydrated] = useState(false); const [saved, setSaved] = useState(false); const [error, setError] = useState('');
  useEffect(() => { if (!loading && !user) router.replace('/sign-in'); }, [user, loading]);
  useEffect(() => { if (!user || !dashboard.isSuccess || hydrated) return; const p = dashboard.data.profile; setName(p?.name ?? user.name ?? ''); setGroup(p?.bloodGroup ?? 'Não sei'); setDistrict(p?.district ?? 'KaMpfumo'); setAvailable(p?.available ?? true); setConsent(!!p); setAdult(!!p); setHydrated(true); }, [dashboard.data, dashboard.isSuccess, hydrated, user]);
  async function save() { setError(''); if (name.trim().length < 2) { setError('Indique o seu nome.'); return; } if (!consent || !adult) { setError('Confirme a idade e o consentimento para continuar.'); return; } try { await action.mutateAsync({ path: '/v1/private/donor', method: 'PUT', body: { name: name.trim(), bloodGroup: group, district, available, consent: true, adult: true } }); setSaved(true); } catch (e) { setError(errorMessage(e)); } }
  return { name, setName, group, setGroup, district, setDistrict, available, setAvailable, consent, setConsent, adult, setAdult, saved, error, save, busy: action.isPending, loading: dashboard.isPending, failed: dashboard.isError, retry: dashboard.refetch };
}
