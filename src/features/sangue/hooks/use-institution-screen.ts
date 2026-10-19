import { useState } from 'react';
import { useDashboard, useServerAction } from './use-sangue';
import { errorMessage } from '../utils/options';
export function useInstitutionScreen() {
  const dashboard = useDashboard(); const action = useServerAction(); const [unit, setUnit] = useState(''); const [district, setDistrict] = useState(''); const [address, setAddress] = useState(''); const [email, setEmail] = useState(''); const [consent, setConsent] = useState(false); const [error, setError] = useState('');
  async function submit() { setError(''); if ([unit, district, address].some((v) => v.trim().length < 2) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !consent) { setError('Preencha os dados da unidade, um e-mail válido e confirme a sua representação.'); return; } try { await action.mutateAsync({ path: '/v1/private/application', body: { unitName: unit.trim(), district: district.trim(), address: address.trim(), professionalEmail: email.trim() } }); } catch (e) { setError(errorMessage(e)); } }
  return { dashboard, unit, setUnit, district, setDistrict, address, setAddress, email, setEmail, consent, setConsent, error, submit, busy: action.isPending };
}
