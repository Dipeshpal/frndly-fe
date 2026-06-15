import { Stack } from 'expo-router/stack';
import { useTheme } from '@/hooks/use-theme';

export default function VaultStack() {
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
      <Stack.Screen name="index" options={{ title: 'Vault' }} />
      <Stack.Screen
        name="add"
        options={{
          title: 'Add Secret',
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.6, 1.0],
          headerLargeTitle: false,
          headerShown: true,
          headerTransparent: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Edit Secret',
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.6, 1.0],
          headerLargeTitle: false,
          headerShown: true,
          headerTransparent: false,
        }}
      />
    </Stack>
  );
}
