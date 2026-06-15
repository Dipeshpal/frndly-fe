import { useEffect } from 'react';
import { Stack } from 'expo-router/stack';
import { ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { ToastProvider } from '@/components/ui/toast';
import { MobileDrawer } from '@/components/nav/mobile-drawer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          {process.env.EXPO_OS !== 'web' && <MobileDrawer />}
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
