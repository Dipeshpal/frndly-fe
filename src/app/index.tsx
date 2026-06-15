import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { Colors } from '@/theme/colors';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.light.canvas, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (isAuthenticated) return <Redirect href="/(tabs)/(dashboard)" />;
  return <Redirect href="/(auth)/login" />;
}
