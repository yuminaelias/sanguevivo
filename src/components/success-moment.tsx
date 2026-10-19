import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useThemeColor } from 'heroui-native';
import { useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { Presets } from 'react-native-pulsar';
import { timing } from '@/lib/motion';
export function SuccessMoment({ title, message }: { title: string; message: string }) {
  const success = useThemeColor('success');
  const soft = useThemeColor('success-soft');
  const reduced = useReducedMotion();
  const progress = useSharedValue(0);
  const path = Skia.Path.Make(); path.moveTo(18, 29); path.lineTo(26, 37); path.lineTo(40, 20);
  useEffect(() => { progress.set(reduced ? 1 : withTiming(1, timing.enter)); Presets.System.notificationSuccess(); }, [progress, reduced]);
  return <View className="gap-3 items-center py-6"><Canvas style={{ width: 58, height: 58 }}><Circle cx={29} cy={29} r={28} color={soft} /><Path path={path} color={success} style="stroke" strokeWidth={3} strokeCap="round" strokeJoin="round" start={0} end={progress} /></Canvas><Text className="text-xl font-bold text-foreground text-center">{title}</Text><Text className="text-base text-muted text-center leading-6">{message}</Text></View>;
}
