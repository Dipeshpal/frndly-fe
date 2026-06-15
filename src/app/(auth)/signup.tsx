import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useSignup } from '@/features/auth/hooks/use-signup';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import type { SignupInput } from '@/types/auth.types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export default function SignupScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { submit, error, loading } = useSignup();

  const { control, handleSubmit, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirm_password: '' },
  });

  useEffect(() => {
    if (isAuthenticated) router.replace('/(tabs)/(dashboard)');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) Alert.alert('Signup failed', error);
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

        {/* Header */}
        <View style={{ zIndex: 10, gap: Spacing.xs }}>
          <Text style={{ ...Typography.headlineLgMobile, color: colors.brandBlue }}>Frndly</Text>
          <Text style={{ ...Typography.displaySm, color: colors.ink }}>Create account</Text>
          <Text style={{ ...Typography.bodyLg, color: colors.body }}>Your cross-device clipboard and secret vault</Text>
        </View>

        {/* Form */}
        <View style={{ zIndex: 10, gap: Spacing.md }}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Full name"
                placeholder="Jane Doe"
                autoCapitalize="words"
                textContentType="name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
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
                label="Password"
                placeholder="At least 8 characters"
                secureTextEntry
                textContentType="newPassword"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Confirm password"
                placeholder="Repeat your password"
                secureTextEntry
                textContentType="newPassword"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirm_password?.message}
              />
            )}
          />
        </View>

        {/* CTA */}
        <View style={{ zIndex: 10, gap: Spacing.sm }}>
          <Button
            label="Create account"
            onPress={handleSubmit(submit)}
            loading={loading}
            variant="blue"
            fullWidth
            size="lg"
          />
          <Text style={{ ...Typography.bodySm, color: colors.body, textAlign: 'center' }}>
            Already have an account?{' '}
            <Text style={{ ...Typography.bodySm, color: colors.brandBlue, fontWeight: '600' }} onPress={() => router.back()}>
              Sign in
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
