import { Input, TextField } from 'heroui-native';
import { Text } from 'react-native';
export function Field({ label, value, onChange, placeholder, secure = false, keyboardType = 'default', autoCapitalize = 'sentences' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; secure?: boolean; keyboardType?: 'default' | 'email-address' | 'number-pad'; autoCapitalize?: 'none' | 'words' | 'sentences' }) {
  return <TextField><Text className="text-sm text-foreground font-semibold">{label}</Text><Input accessibilityLabel={label} value={value} onChangeText={onChange} placeholder={placeholder} secureTextEntry={secure} keyboardType={keyboardType} autoCapitalize={autoCapitalize} className="leading-none" /></TextField>;
}
