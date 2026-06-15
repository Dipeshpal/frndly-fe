import { View, ScrollView, Text, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useSecretList, useUpdateSecret } from '@/features/vault/hooks/use-vault';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/feedback/loading-state';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { SECRET_CATEGORIES, CATEGORY_LABELS, type SecretCategory } from '@/types/vault.types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.enum(SECRET_CATEGORIES),
});

type EditForm = z.infer<typeof schema>;

export default function EditSecretScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const { data: secrets, isLoading } = useSecretList();
  const { mutate: updateSecret, isPending } = useUpdateSecret();

  const secret = secrets?.find((s) => s.id === id);

  const { control, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<EditForm>({
    resolver: zodResolver(schema),
  });

  const selectedCategory = watch('category');

  useEffect(() => {
    if (secret) {
      reset({ name: secret.name, description: secret.description ?? '', category: secret.category });
    }
  }, [secret, reset]);

  const onSubmit = (data: EditForm) => {
    if (!id) return;
    updateSecret(
      { id, data },
      {
        onSuccess: () => router.back(),
        onError: () => Alert.alert('Error', 'Failed to update secret'),
      },
    );
  };

  if (isLoading || !secret) return <LoadingState message="Loading secret…" />;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ gap: Spacing.lg, padding: Spacing.md, paddingBottom: Spacing.xxl }}
      keyboardShouldPersistTaps="handled"
    >
      <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
        <FormField label="Secret name" value={value ?? ''} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} />
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
                style={{ paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: Radius.pill, backgroundColor: isActive ? colors.primary : colors.surfaceCard, borderWidth: 1, borderColor: isActive ? colors.primary : colors.hairline }}
                accessibilityRole="button"
              >
                <Text style={{ ...Typography.caption, color: isActive ? colors.onPrimary : colors.muted }}>
                  {CATEGORY_LABELS[cat as SecretCategory]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Controller control={control} name="description" render={({ field: { onChange, onBlur, value } }) => (
        <FormField label="Notes (optional)" value={value ?? ''} onChangeText={onChange} onBlur={onBlur} />
      )} />

      <Button label="Save Changes" onPress={handleSubmit(onSubmit)} loading={isPending} fullWidth />
    </ScrollView>
  );
}
