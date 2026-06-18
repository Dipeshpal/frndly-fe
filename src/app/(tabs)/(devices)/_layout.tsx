import { Stack } from 'expo-router/stack';
import { useTheme } from '@/hooks/use-theme';
import { HamburgerButton } from '@/components/nav/hamburger-button';

export default function DevicesStack() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerLargeTitle: false,
        headerTransparent: false,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.canvas },
        headerLeft: () => <HamburgerButton />,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Devices' }} />
    </Stack>
  );
}
