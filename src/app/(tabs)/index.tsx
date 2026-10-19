import { ScrollView, Text, View, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor, Skeleton } from 'heroui-native';
import { Image } from '@/components/image';
import { NotificationBell } from '@/components/NotificationBell';
import { ActionButton } from '@/components/action-button';
import { Pressable } from '@/components/pressable';
import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { ChoiceField } from '@/components/choice-field';
import { useHomeScreen } from '@/features/sangue/hooks/use-home-screen';
import { bloodGroups, districts } from '@/features/sangue/utils/options';
import { imageFade } from '@/lib/motion';
export default function MobilizarScreen() {
  const s = useHomeScreen();
  const accent = useThemeColor('accent');
  const green = useThemeColor('success');
  return <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-6" showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={s.appeals.isRefetching} onRefresh={() => { void s.appeals.refetch(); void s.dashboard.refetch(); }} tintColor={accent} />}>
    <View className="flex-row justify-between items-center gap-3"><View className="gap-1 flex-1"><Text className="text-3xl font-bold text-foreground tracking-tight">SangueVivo<Text className="text-accent">.</Text></Text><Text className="text-sm text-muted">Uma ligação que salva vidas.</Text></View><NotificationBell /></View>
    <View className="gap-4"><View className="h-56 overflow-hidden rounded-3xl"><Image source={require('../../../assets/images/solidarity.jpg')} contentFit="cover" transition={imageFade} className="w-full h-full" accessibilityLabel="Mãos de um voluntário e de uma profissional de saúde, imagem ilustrativa" /><View className="absolute left-4 bottom-4 rounded-full bg-background px-3 py-2 flex-row items-center gap-2"><View className="size-2 rounded-full bg-success" /><Text className="text-xs font-semibold text-foreground">Voluntária. Solidária. Sem remuneração.</Text></View></View><Text className="text-4xl font-bold text-foreground tracking-tight leading-tight">A próxima ligação{ '\n' }pode começar consigo.</Text><Text className="text-base text-muted leading-6">Aproxime-se de quem precisa. Doe com segurança, sempre com avaliação da unidade sanitária.</Text><ActionButton onPress={s.donorAction}>{s.dashboard.data?.profile ? 'Actualizar disponibilidade' : 'Quero ser doador'}</ActionButton></View>
    <View className="gap-4"><View className="flex-row justify-between items-center gap-3"><Text className="text-xl font-bold text-foreground flex-1">Necessidades de sangue</Text><Pressable accessibilityLabel="Filtrar pedidos" className="size-11 items-center justify-center" onPress={() => s.setFiltering(!s.filtering)}><Ionicons name="options-outline" color={accent} size={24} /></Pressable></View>
      {s.filtering ? <View className="gap-3"><ChoiceField label="Distrito" value={s.district} options={['Todos os distritos', ...districts]} onChange={(value) => s.setFilters(value, s.group)} /><ChoiceField label="Grupo sanguíneo" value={s.group} options={['Todos os grupos', ...bloodGroups]} onChange={(value) => s.setFilters(s.district, value)} /></View> : null}
      {s.appeals.isPending ? <Skeleton className="h-24 w-full rounded-2xl" /> : null}
      {s.appeals.isError ? <View className="gap-3"><Text className="text-danger">Não foi possível obter os pedidos.</Text><ActionButton secondary onPress={() => { void s.appeals.refetch(); }}>Tentar novamente</ActionButton></View> : null}
      {!s.appeals.isPending && !s.appeals.isError && !s.requests.length ? <View className="border-y border-border py-6 gap-3"><Ionicons name="shield-checkmark-outline" size={28} color={green} /><Text className="text-lg font-semibold text-foreground">Sem pedidos publicados por agora</Text><Text className="text-base text-muted leading-6">Só mostramos necessidades validadas. Pode registar a sua disponibilidade enquanto a rede cresce.</Text></View> : null}
      {s.requests.map((request) => <Card key={request.id} list><ListRow title={`${request.bloodGroup}  ·  ${request.unitName}`} subtitle={`${request.district} — ${request.urgency}`} onPress={() => router.push({ pathname: '/appeal/[id]', params: { id: request.id } })} /></Card>)}
    </View>
    <View className="gap-3"><Text className="text-xl font-bold text-foreground">Conhece uma necessidade?</Text><Text className="text-base text-muted leading-6">Comunique-a à rede. Uma entidade autorizada terá de a validar antes da publicação.</Text><ActionButton secondary onPress={() => router.push(s.user ? '/new-appeal' : '/sign-in')}>Comunicar necessidade</ActionButton></View>
    <View className="flex-row gap-3 items-start"><Ionicons name="lock-closed-outline" color={accent} size={20} /><Text className="text-sm text-muted leading-5 flex-1">O seu distrito aproxima. A sua localização exacta fica consigo. O SangueVivo não substitui os serviços de urgência.</Text></View>
  </ScrollView>;
}
