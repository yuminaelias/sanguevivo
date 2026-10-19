import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useThemeColor } from 'heroui-native';
import { Pressable } from '@/components/pressable';
import { useNotifications } from '@/contexts/NotificationContext';
export function NotificationBell() {
  const { hasPermission, requestPermission } = useNotifications();
  const foreground = useThemeColor('foreground');
  return <Pressable accessibilityLabel="Alertas e notificações" className="size-12 items-center justify-center rounded-full bg-surface" onPress={() => { if (!hasPermission) void requestPermission().catch(() => {}); router.push('/notification-preferences'); }}><Ionicons name="notifications-outline" size={23} color={foreground} />{!hasPermission ? <View className="absolute top-2 right-2 size-2 rounded-full bg-accent" /> : null}</Pressable>;
}
