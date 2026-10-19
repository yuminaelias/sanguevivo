import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { errorMessage } from '../utils/options';
export function useSignInScreen() {
  const auth = useAuth();
  const [mode, setMode] = useState('Criar conta');
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  useEffect(() => { if (auth.user) router.replace('/donor'); }, [auth.user]);
  async function submit() {
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Indique um e-mail válido.'); return; }
    if (password.length < 8) { setError('Use uma palavra-passe com pelo menos 8 caracteres.'); return; }
    if (mode === 'Criar conta' && (name.trim().length < 2 || !consent)) { setError('Indique o seu nome e aceite as condições de utilização.'); return; }
    setBusy(true);
    try { if (mode === 'Entrar') { await auth.signIn(email.trim().toLowerCase(), password); return; } await auth.signUp(email.trim().toLowerCase(), password, name.trim()); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  }
  return { mode, setMode, name, setName, email, setEmail, password, setPassword, consent, setConsent, busy, error, submit };
}
