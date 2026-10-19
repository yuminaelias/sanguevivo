import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Constants from 'expo-constants';
import { OneSignal } from 'react-native-onesignal';
import type { NotificationWillDisplayEvent } from 'react-native-onesignal';
import { useAuth } from './AuthContext';
import { usePreferences } from '@/features/sangue/store/preferences-store';
import type { NotificationState } from '@/features/sangue/types/sangue';
const appID: unknown = Constants.expoConfig?.extra?.oneSignalAppId;
const available = typeof appID === 'string' && appID.length > 0;
const NotificationContext = createContext<NotificationState>({ hasPermission: false, permissionDenied: false, loading: false, isWeb: false, requestPermission: async () => false, sendTag: () => {}, deleteTag: () => {} });
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(false);
  const urgent = usePreferences((s) => s.urgent);
  const campaigns = usePreferences((s) => s.campaigns);
  const visits = usePreferences((s) => s.visits);
  useEffect(() => {
    if (!available) { console.warn('Notificações ainda não configuradas.'); return; }
    OneSignal.initialize(appID);
    void OneSignal.Notifications.getPermissionAsync().then(setHasPermission);
    const foreground = (event: NotificationWillDisplayEvent) => { event.getNotification().display(); };
    const permission = (granted: boolean) => { setHasPermission(granted); setPermissionDenied(!granted); };
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', foreground);
    OneSignal.Notifications.addEventListener('permissionChange', permission);
    return () => { OneSignal.Notifications.removeEventListener('foregroundWillDisplay', foreground); OneSignal.Notifications.removeEventListener('permissionChange', permission); };
  }, []);
  useEffect(() => { if (!available) return; if (user) { OneSignal.login(user.id); return; } OneSignal.logout(); }, [user]);
  useEffect(() => { if (!available) return; OneSignal.User.addTags({ urgent: urgent ? 'on' : 'off', campaigns: campaigns ? 'on' : 'off', visits: visits ? 'on' : 'off' }); }, [urgent, campaigns, visits, user]);
  async function requestPermission() { if (!available) return false; setLoading(true); try { const granted = await OneSignal.Notifications.requestPermission(true); setHasPermission(granted); setPermissionDenied(!granted); return granted; } finally { setLoading(false); } }
  function sendTag(key: string, value: string) { if (available) OneSignal.User.addTag(key, value); }
  function deleteTag(key: string) { if (available) OneSignal.User.removeTag(key); }
  return <NotificationContext.Provider value={{ hasPermission, permissionDenied, loading, isWeb: false, requestPermission, sendTag, deleteTag }}>{children}</NotificationContext.Provider>;
}
export function useNotifications() { return useContext(NotificationContext); }
