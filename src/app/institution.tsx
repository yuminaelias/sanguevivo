import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Checkbox, Chip } from 'heroui-native';
import { BackButton } from '@/components/back-button';
import { Field } from '@/components/field';
import { Card } from '@/components/card';
import { ActionButton } from '@/components/action-button';
import { pressHaptic } from '@/components/pressable';
import { useInstitutionScreen } from '@/features/sangue/hooks/use-institution-screen';
import { statuses } from '@/features/sangue/utils/options';
export default function InstitutionScreen() {
  const s = useInstitutionScreen(); const application = s.dashboard.data?.application;
  return <KeyboardAwareScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6" keyboardShouldPersistTaps="handled"><BackButton /><Text className="text-3xl font-bold text-foreground">Unidades sanitárias</Text><Text className="text-base text-muted leading-6">Só profissionais com vínculo institucional verificado podem publicar necessidades ou confirmar doações. Uma candidatura não concede acesso automático.</Text>{s.dashboard.data?.membership ? <ActionButton onPress={() => router.push('/staff')}>Abrir área da unidade</ActionButton> : null}{application ? <Card><View className="gap-3"><Chip variant="soft">{statuses[application.status] ?? application.status}</Chip><Text className="text-xl font-bold text-foreground">{application.unitName}</Text><Text className="text-base text-muted">{application.district}</Text><Text className="text-sm text-muted leading-5">A administração deve verificar a identidade, a unidade e o vínculo profissional por meios independentes antes de autorizar o acesso.</Text></View></Card> : <View className="gap-5"><Field label="Nome oficial da unidade" value={s.unit} onChange={s.setUnit} /><Field label="Distrito ou cidade" value={s.district} onChange={s.setDistrict} /><Field label="Endereço público da unidade" value={s.address} onChange={s.setAddress} /><Field label="E-mail profissional" value={s.email} onChange={s.setEmail} keyboardType="email-address" autoCapitalize="none" /><View className="flex-row items-center gap-3"><Checkbox accessibilityLabel="Confirmo o vínculo com a unidade" isSelected={s.consent} onSelectedChange={(v) => { pressHaptic(); s.setConsent(v); }} /><Text className="text-sm text-foreground flex-1 leading-5">Confirmo que represento esta unidade e autorizo a verificação do vínculo institucional.</Text></View><ActionButton busy={s.busy} disabled={s.dashboard.isPending} onPress={() => { void s.submit(); }}>Pedir validação institucional</ActionButton></View>}{s.error ? <Text className="text-danger" accessibilityRole="alert">{s.error}</Text> : null}</KeyboardAwareScrollView>;
}
