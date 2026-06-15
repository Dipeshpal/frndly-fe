import { Stack } from 'expo-router/stack';
import { useTheme } from '@/hooks/use-theme';

export default function ClipboardStack() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        contentStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Clipboard' }} />
    </Stack>
  );
}
