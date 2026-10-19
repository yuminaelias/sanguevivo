import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Checkbox } from 'heroui-native';
import { router } from 'expo-router';
import { BackButton } from '@/components/back-button';
import { Field } from '@/components/field';
import { ChoiceField } from '@/components/choice-field';
import { Segmented } from '@/components/segmented';
import { ActionButton } from '@/components/action-button';
import { SuccessMoment } from '@/components/success-moment';
import { pressHaptic } from '@/components/pressable';
import { useAppealFormScreen } from '@/features/sangue/hooks/use-appeal-form-screen';
import { bloodGroups } from '@/features/sangue/utils/options';
export default function NewAppealScreen() {
  const s = useAppealFormScreen();
  if (s.saved) return <View className="flex-1 bg-background px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6"><BackButton /><SuccessMoment title="Necessidade comunicada" message="O pedido está privado e aguarda validação institucional. Ainda não foi publicado nem foram enviados alertas." /><ActionButton onPress={() => router.replace('/(tabs)/activity')}>Acompanhar pedido</ActionButton></View>;
  return <KeyboardAwareScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6" keyboardShouldPersistTaps="handled"><BackButton /><View className="gap-2"><Text className="text-3xl font-bold text-foreground">Comunicar necessidade</Text><Text className="text-base text-muted leading-6">Sem nomes de pacientes nem dados clínicos. Uma entidade autorizada validará a informação.</Text></View><Field label="Unidade sanitária" value={s.unit} onChange={s.setUnit} placeholder="Nome do hospital ou banco de sangue" /><Field label="Distrito ou cidade" value={s.district} onChange={s.setDistrict} /><ChoiceField label="Grupo necessário" value={s.group} options={bloodGroups} onChange={s.setGroup} /><View className="gap-2"><Text className="text-sm font-semibold text-foreground">Urgência indicada</Text><Segmented values={['Urgente', 'Prioritário', 'Regular']} selectedIndex={['Urgente', 'Prioritário', 'Regular'].indexOf(s.urgency)} onChange={(i) => s.setUrgency(['Urgente', 'Prioritário', 'Regular'][i] ?? 'Regular')} /></View><Field label="Unidades de sangue necessárias" value={s.quantity} onChange={s.setQuantity} keyboardType="number-pad" /><View className="flex-row gap-3 items-center"><Checkbox accessibilityLabel="Confirmo que o pedido precisa de validação" isSelected={s.consent} onSelectedChange={(v) => { pressHaptic(); s.setConsent(v); }} /><Text className="text-sm text-foreground flex-1 leading-5">Compreendo que comunicar não é publicar. Confirmo a boa-fé desta informação e aceito a verificação institucional.</Text></View><Text className="text-sm text-muted leading-5">O pedido fica válido por 7 dias. Em caso de emergência, procure directamente os serviços de saúde.</Text>{s.error ? <Text className="text-danger" accessibilityRole="alert">{s.error}</Text> : null}<ActionButton busy={s.busy} onPress={() => { void s.submit(); }}>Enviar para validação</ActionButton></KeyboardAwareScrollView>;
}
