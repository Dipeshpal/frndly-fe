import { Stack } from 'expo-router/stack';
import { useTheme } from '@/hooks/use-theme';
import { HamburgerButton } from '@/components/nav/hamburger-button';

export default function NotesStack() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: process.env.EXPO_OS !== 'web',
        headerLargeTitle: true,
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        contentStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Notes', headerLeft: () => <HamburgerButton /> }} />
      <Stack.Screen
        name="new"
        options={{
          title: 'New Note',
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [1.0],
          headerLargeTitle: false,
          headerShown: true,
          headerTransparent: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: '',
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [1.0],
          headerLargeTitle: false,
          headerShown: true,
          headerTransparent: false,
        }}
      />
    </Stack>
  );
}
