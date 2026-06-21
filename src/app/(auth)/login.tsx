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
import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/features/auth/components/google-sign-in-button';
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
    defaultValues: { email: '', password: '' },
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
      <View style={{ flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxl, paddingBottom: Spacing.lg, gap: Spacing.xxl, maxWidth: 320, alignSelf: 'center', width: '100%' }}>
        {/* Decorative blur */}
        <View style={{ position: 'absolute', top: -100, right: -100, width: 250, height: 250, borderRadius: 125, backgroundColor: colors.brandBlue, opacity: 0.1, zIndex: 0 }} />
        <View style={{ position: 'absolute', top: 200, left: -80, width: 300, height: 300, borderRadius: 150, backgroundColor: colors.brandLavender, opacity: 0.05, zIndex: 0 }} />

        {/* Header */}
        <View style={{ zIndex: 10, gap: Spacing.xs }}>
          <Text style={{ ...Typography.headlineLgMobile, color: colors.brandBlue }}>Frndly</Text>
          <Text style={{ ...Typography.displaySm, color: colors.ink }}>Welcome back</Text>
          <Text style={{ ...Typography.bodyLg, color: colors.body }}>Sign in to your premium experience.</Text>
        </View>

        {/* Login Form */}
        <View style={{ zIndex: 10, gap: Spacing.md }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="EMAIL ADDRESS"
                placeholder="name@company.com"
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
              <FormField
                label="PASSWORD"
                placeholder="••••••••"
                secureTextEntry
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
            <Text style={{ ...Typography.labelCaps, color: colors.brandBlue, textTransform: 'uppercase' }}>Forgot password?</Text>
          </Pressable>
        </View>

        {/* CTA */}
        <View style={{ zIndex: 10, gap: Spacing.sm }}>
          <Button
            label="Login"
            onPress={handleSubmit(submit)}
            loading={loading}
            variant="blue"
            fullWidth
            size="lg"
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
            <Text style={{ ...Typography.bodySm, color: colors.muted }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.hairline }} />
          </View>
          <GoogleSignInButton />
        </View>

        {/* Footer */}
        <View style={{ marginTop: 'auto', zIndex: 10, alignItems: 'center', gap: Spacing.xs }}>
          <Text style={{ ...Typography.bodySm, color: colors.body }}>
            Don&apos;t have an account?{' '}
            <Text style={{ ...Typography.bodySm, color: colors.brandBlue, fontWeight: '600' }} onPress={() => router.push('/(auth)/signup')}>
              Create Account
            </Text>
          </Text>
          <View style={{ height: 1, width: 48, backgroundColor: colors.hairline }} />
          <Text style={{ ...Typography.labelCaps, color: colors.muted, textTransform: 'uppercase', letterSpacing: 2 }}>Encrypted Access</Text>
        </View>
      </View>
    </ScrollView>
  );
}
