import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { useThemeColor } from 'heroui-native';
import { Pressable } from '@/components/pressable';
export function BackButton() {
  const accent = useThemeColor('accent');
  return <Pressable accessibilityLabel="Voltar" className="min-h-11 flex-row items-center gap-2 self-start" onPress={() => { if (router.canGoBack()) { router.back(); return; } router.replace('/'); }}><Ionicons name="arrow-back" size={22} color={accent} /><Text className="text-accent text-base font-medium">Voltar</Text></Pressable>;
}
