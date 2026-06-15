import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useLogin } from '@/features/auth/hooks/use-login';
import { FormField } from '@/components/forms/form-field';
import { PasswordInput } from '@/components/forms/password-input';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import type { LoginInput } from '@/types/auth.types';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { submit, error, loading } = useLogin();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) router.replace('/(tabs)/(dashboard)');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) Alert.alert('Login failed', error);
  }, [error]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.canvas }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1, padding: Spacing.lg, justifyContent: 'center', gap: Spacing.xxl }}>
        <View style={{ gap: Spacing.xs }}>
          <Text style={{ ...Typography.displayMd, color: colors.ink }}>Welcome back</Text>
          <Text style={{ ...Typography.bodyMd, color: colors.muted }}>Sign in to your Frndly account</Text>
        </View>

        <View style={{ gap: Spacing.md }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label="Password"
                placeholder="Your password"
                textContentType="password"
                autoComplete="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Pressable onPress={() => {}} accessibilityRole="button" style={{ alignSelf: 'flex-end' }}>
            <Text style={{ ...Typography.bodySm, color: colors.brandPink }}>Forgot password?</Text>
          </Pressable>
        </View>

        <View style={{ gap: Spacing.sm }}>
          <Button
            label="Sign in"
            onPress={handleSubmit(submit)}
            loading={loading}
            fullWidth
          />
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: Spacing.xs }}>
            <Text style={{ ...Typography.bodyMd, color: colors.muted }}>Don't have an account?</Text>
            <Pressable onPress={() => router.push('/(auth)/signup')} accessibilityRole="link">
              <Text style={{ ...Typography.bodyMd, color: colors.ink, fontWeight: '600' }}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
