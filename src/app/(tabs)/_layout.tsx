import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useTheme } from '@/hooks/use-theme';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <NativeTabs
      tintColor={colors.brandBlue}
      {...(Platform.OS === 'ios' ? { minimizeBehavior: 'onScrollDown' } : {})}
    >
      <NativeTabs.Trigger name="(dashboard)">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} drawable="home" />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(clipboard)">
        <Icon sf={{ default: 'doc.on.clipboard', selected: 'doc.on.clipboard.fill' }} drawable="content_copy" />
        <Label>Clipboard</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(vault)">
        <Icon sf={{ default: 'lock', selected: 'lock.fill' }} drawable="lock" />
        <Label>Vault</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(notes)">
        <Icon sf={{ default: 'note.text', selected: 'note.text.badge.plus' }} drawable="description" />
        <Label>Notes</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(alerts)">
        <Icon sf={{ default: 'bell', selected: 'bell.fill' }} drawable="notifications" />
        <Label>Alerts</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(devices)">
        <Icon sf={{ default: 'desktopcomputer', selected: 'desktopcomputer' }} drawable="computer" />
        <Label>Devices</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(settings)">
        <Icon sf="gear" drawable="settings" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
