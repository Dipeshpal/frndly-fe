import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <NativeTabs
      tintColor={colors.brandBlue}
      {...(process.env.EXPO_OS === 'ios' ? { minimizeBehavior: 'onScrollDown' } : {})}
    >
      <NativeTabs.Trigger name="(dashboard)">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(clipboard)">
        <NativeTabs.Trigger.Icon sf={{ default: 'doc.on.clipboard', selected: 'doc.on.clipboard.fill' }} md="content_copy" />
        <NativeTabs.Trigger.Label>Clipboard</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(vault)">
        <NativeTabs.Trigger.Icon sf={{ default: 'lock', selected: 'lock.fill' }} md="lock" />
        <NativeTabs.Trigger.Label>Vault</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(alerts)">
        <NativeTabs.Trigger.Icon sf={{ default: 'bell', selected: 'bell.fill' }} md="notifications" />
        <NativeTabs.Trigger.Label>Alerts</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(settings)">
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
