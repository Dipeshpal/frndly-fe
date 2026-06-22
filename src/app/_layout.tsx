import '@/global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { ToastProvider } from '@/components/ui/toast';
import { MobileDrawer } from '@/components/nav/mobile-drawer';

import { PaperProvider } from 'react-native-paper';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

export default function RootLayout() {
  const initializeAuth = useAuthStore((s) => s.initialize);
  const initializeSettings = useSettingsStore((s) => s.initialize);

  useEffect(() => {
    initializeAuth();
    initializeSettings();
  }, [initializeAuth, initializeSettings]);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          {Platform.OS !== 'web' && <MobileDrawer />}
        </ToastProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
