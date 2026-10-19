import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Checkbox } from 'heroui-native';
import { BackButton } from '@/components/back-button';
import { Field } from '@/components/field';
import { Segmented } from '@/components/segmented';
import { ActionButton } from '@/components/action-button';
import { Pressable, pressHaptic } from '@/components/pressable';
import { useSignInScreen } from '@/features/sangue/hooks/use-sign-in-screen';
export default function SignInScreen() {
  const s = useSignInScreen();
  return <KeyboardAwareScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6" keyboardShouldPersistTaps="handled"><BackButton /><View className="gap-3"><Text className="text-3xl font-bold text-foreground">Faça parte da ligação.</Text><Text className="text-base text-muted leading-6">Uma conta para guardar o seu perfil e acompanhar cada resposta, em segurança.</Text></View><Segmented values={['Criar conta', 'Entrar']} selectedIndex={s.mode === 'Criar conta' ? 0 : 1} onChange={(index) => s.setMode(index === 0 ? 'Criar conta' : 'Entrar')} />{s.mode === 'Criar conta' ? <Field label="Nome" value={s.name} onChange={s.setName} placeholder="Como prefere ser tratado" autoCapitalize="words" /> : null}<Field label="E-mail" value={s.email} onChange={s.setEmail} placeholder="nome@exemplo.com" keyboardType="email-address" autoCapitalize="none" /><Field label="Palavra-passe" value={s.password} onChange={s.setPassword} placeholder="Pelo menos 8 caracteres" secure autoCapitalize="none" />{s.mode === 'Criar conta' ? <View className="gap-3"><View className="flex-row gap-3 items-center"><Checkbox accessibilityLabel="Aceito as condições de utilização" isSelected={s.consent} onSelectedChange={(v) => { pressHaptic(); s.setConsent(v); }} /><Text className="text-sm text-foreground leading-5 flex-1">Aceito as condições de utilização: participação voluntária, sem abuso, fraude ou pedidos não autorizados.</Text></View><Pressable className="min-h-11 justify-center" onPress={() => router.push('/privacy')}><Text className="text-accent font-medium">Ler privacidade e condições</Text></Pressable></View> : null}{s.error ? <Text className="text-danger text-base" accessibilityRole="alert">{s.error}</Text> : null}<ActionButton busy={s.busy} onPress={() => { void s.submit(); }}>{s.mode === 'Criar conta' ? 'Criar a minha conta' : 'Entrar na minha conta'}</ActionButton><Text className="text-sm text-muted leading-5">Não precisa de criar conta para consultar os pedidos públicos.</Text></KeyboardAwareScrollView>;
}
