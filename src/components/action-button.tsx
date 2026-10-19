import { Button, Spinner } from 'heroui-native';
import { pressHaptic } from '@/components/pressable';
export function ActionButton({ children, onPress, busy = false, disabled = false, secondary = false }: { children: string; onPress: () => void; busy?: boolean; disabled?: boolean; secondary?: boolean }) {
  return <Button variant={secondary ? 'secondary' : 'primary'} isDisabled={disabled || busy} onPress={() => { pressHaptic(); onPress(); }} className="min-h-12">{busy ? <Spinner size="sm" /> : <Button.Label>{children}</Button.Label>}</Button>;
}
