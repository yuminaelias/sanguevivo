import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePreferences } from '../store/preferences-store';
import { useAppeals, useDashboard } from './use-sangue';
export function useHomeScreen() {
  const { user } = useAuth();
  const appeals = useAppeals();
  const dashboard = useDashboard();
  const district = usePreferences((s) => s.district);
  const group = usePreferences((s) => s.group);
  const setFilters = usePreferences((s) => s.setFilters);
  const [filtering, setFiltering] = useState(false);
  const requests = (appeals.data ?? []).filter((r) => (district === 'Todos os distritos' || r.district === district) && (group === 'Todos os grupos' || r.bloodGroup === group));
  function donorAction() { if (!user) { router.push('/sign-in'); return; } router.push('/donor'); }
  return { user, appeals, dashboard, district, group, setFilters, filtering, setFiltering, requests, donorAction };
}
