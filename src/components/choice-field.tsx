import { Select, ScrollShadow } from 'heroui-native';
import { Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { pressHaptic } from '@/components/pressable';
export function ChoiceField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <View className="gap-2"><Text className="text-sm font-semibold text-foreground">{label}</Text><Select value={{ value, label: value }} onValueChange={(option) => { if (!option || Array.isArray(option)) return; pressHaptic(); onChange(option.value); }}><Select.Trigger accessibilityLabel={label}><Select.Value placeholder="Escolher" /><Select.TriggerIndicator /></Select.Trigger><Select.Portal><Select.Overlay /><Select.Content presentation="popover" width="trigger"><Select.ListLabel>{label}</Select.ListLabel><ScrollShadow LinearGradientComponent={LinearGradient} className="max-h-72"><ScrollView keyboardShouldPersistTaps="handled">{options.map((option) => <Select.Item key={option} value={option} label={option}><Select.ItemLabel /><Select.ItemIndicator /></Select.Item>)}</ScrollView></ScrollShadow></Select.Content></Select.Portal></Select></View>;
}
