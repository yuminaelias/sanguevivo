import { useState } from 'react';
import { Linking } from 'react-native';
import { useNotifications } from '@/contexts/NotificationContext';
import { usePreferences } from '../store/preferences-store';
import type { PreferenceKey } from '../types/sangue';
import { errorMessage } from '../utils/options';
export function useNotificationPreferencesScreen() {
  const notifications = useNotifications(); const preferences = usePreferences(); const [error, setError] = useState('');
  function change(key: PreferenceKey, value: boolean) { preferences.setPreference(key, value); notifications.sendTag(key, value ? 'on' : 'off'); }
  async function enable() { setError(''); try { await notifications.requestPermission(); } catch (e) { setError(errorMessage(e)); } }
  function openSettings() { void Linking.openSettings().catch((e: unknown) => setError(errorMessage(e))); }
  return { notifications, preferences, change, enable, openSettings, error };
}
