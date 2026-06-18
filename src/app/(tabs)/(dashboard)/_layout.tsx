import { Platform } from 'react-native';
import { Stack } from 'expo-router/stack';
import { useTheme } from '@/hooks/use-theme';
import { HamburgerButton } from '@/components/nav/hamburger-button';

export default function DashboardStack() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: Platform.OS !== 'web',
        headerLargeTitle: true,
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerStyle: { backgroundColor: colors.canvas },
        headerTintColor: colors.ink,
        headerLeft: () => <HamburgerButton />,
        contentStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Frndly' }} />
      <Stack.Screen name="devices" options={{ title: 'Manage Devices', headerLargeTitle: false }} />
    </Stack>
  );
}
