import { View, ScrollView, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@/hooks/use-theme';
import { useCreateSecret } from '@/features/vault/hooks/use-vault';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { SECRET_CATEGORIES, CATEGORY_LABELS, type SecretCategory, type CreateSecretInput } from '@/types/vault.types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  value: z.string().min(1, 'Value is required'),
  description: z.string().optional(),
  category: z.enum(SECRET_CATEGORIES),
});

export default function AddSecretScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { create, loading, error } = useCreateSecret();

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateSecretInput>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', value: '', description: '', category: 'api_key' },
  });

  const selectedCategory = watch('category');

  const onSubmit = (data: CreateSecretInput) => {
    create(data, {
      onSuccess: () => router.back(),
      onError: () => Alert.alert('Error', error ?? 'Failed to save secret'),
    });
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ gap: Spacing.lg, padding: Spacing.md, paddingBottom: Spacing.xxl }}
      keyboardShouldPersistTaps="handled"
    >
      <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
        <FormField label="Secret name" placeholder="e.g. OpenAI API Key" value={value || ''} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} autoCapitalize="words" />
      )} />

      <View style={{ gap: Spacing.xs }}>
        <Text style={{ ...Typography.titleSm, color: colors.bodyStrong }}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs }}>
          {SECRET_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setValue('category', cat as SecretCategory)}
                style={({ pressed, hovered }: any) => ({
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  backgroundColor: isActive ? colors.brandBlue : hovered ? colors.surfaceSoft : colors.surfaceCard,
                  borderWidth: 1,
                  borderColor: isActive ? colors.brandBlue : colors.border,
                  opacity: pressed ? 0.8 : 1,
                })}
                accessibilityRole="button"
                accessibilityLabel={CATEGORY_LABELS[cat as SecretCategory]}
              >
                <Text style={{ ...Typography.caption, color: isActive ? '#ffffff' : colors.muted }}>
                  {CATEGORY_LABELS[cat as SecretCategory]}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {errors.category && <Text style={{ ...Typography.caption, color: colors.error }}>{errors.category.message}</Text>}
      </View>

      <Controller control={control} name="value" render={({ field: { onChange, onBlur, value } }) => (
        <FormField
          label="Secret value"
          placeholder="Paste your secret here"
          value={value || ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={errors.value?.message}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={{ height: 'auto' as unknown as number, minHeight: 44 }}
        />
      )} />

      <Controller control={control} name="description" render={({ field: { onChange, onBlur, value } }) => (
        <FormField label="Notes (optional)" placeholder="Any additional context…" value={value || ''} onChangeText={onChange} onBlur={onBlur} />
      )} />

      <Button label="Save Secret" onPress={handleSubmit(onSubmit)} loading={loading} fullWidth />
    </ScrollView>
  );
}
