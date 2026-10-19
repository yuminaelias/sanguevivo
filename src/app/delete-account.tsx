import { Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { BackButton } from '@/components/back-button';
import { Field } from '@/components/field';
import { ActionButton } from '@/components/action-button';
import { useDeleteAccountScreen } from '@/features/sangue/hooks/use-delete-account-screen';
export default function DeleteAccountScreen() {
  const s = useDeleteAccountScreen();
  return <KeyboardAwareScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6" keyboardShouldPersistTaps="handled"><BackButton /><Text className="text-3xl font-bold text-foreground">Eliminar a minha conta</Text><Text className="text-base text-muted leading-6">Esta acção elimina permanentemente o perfil de doador, as respostas, o histórico e os pedidos associados à sua conta. Para apenas pausar a participação, pode alterar a disponibilidade no perfil.</Text><Field label="Confirme a palavra-passe" value={s.password} onChange={s.setPassword} secure autoCapitalize="none" />{s.error ? <Text className="text-danger" accessibilityRole="alert">{s.error}</Text> : null}<ActionButton busy={s.busy} onPress={s.remove}>Eliminar definitivamente</ActionButton></KeyboardAwareScrollView>;
}
