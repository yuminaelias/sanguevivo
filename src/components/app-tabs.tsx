import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useThemeColor } from 'heroui-native';
export default function AppTabs() {
  const accent = useThemeColor('accent');
  const background = useThemeColor('background');
  return <NativeTabs backgroundColor={background} tintColor={accent}>
    <NativeTabs.Trigger name="index" disableAutomaticContentInsets><NativeTabs.Trigger.Label>Mobilizar</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon sf="drop.fill" md="water_drop" /></NativeTabs.Trigger>
    <NativeTabs.Trigger name="activity" disableAutomaticContentInsets><NativeTabs.Trigger.Label>Actividade</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon sf="heart.text.clipboard" md="event_note" /></NativeTabs.Trigger>
    <NativeTabs.Trigger name="profile" disableAutomaticContentInsets><NativeTabs.Trigger.Label>Perfil</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon sf="person.crop.circle" md="account_circle" /></NativeTabs.Trigger>
  </NativeTabs>;
}
