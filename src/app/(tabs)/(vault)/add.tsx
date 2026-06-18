import { View, ScrollView, Text, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useCreateSecret, useFolderList } from '@/features/vault/hooks/use-vault';
import { Button } from '@/components/ui/button';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { SECRET_CATEGORIES, CATEGORY_LABELS, type SecretCategory, type CreateSecretInput } from '@/types/vault.types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  value: z.string().min(1, 'Value is required'),
  description: z.string().optional(),
  category: z.enum(SECRET_CATEGORIES),
  folder: z.string().min(1, 'Folder is required'),
});

const CATEGORY_META: Record<SecretCategory, { icon: string; color: string }> = {
  api_key:  { icon: 'vpn-key',      color: '#ff4d8b' },
  database: { icon: 'storage',      color: '#4f9cf9' },
  cloud:    { icon: 'cloud',        color: '#b8a4ed' },
  personal: { icon: 'person',       color: '#ffb084' },
  other:    { icon: 'more-horiz',   color: '#e8b94a' },
};

export default function AddSecretScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { folder: prefillFolder } = useLocalSearchParams<{ folder?: string }>();
  const { create, loading, error } = useCreateSecret();
  const { data: existingFolders } = useFolderList();
  const [valueRevealed, setValueRevealed] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateSecretInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      value: '',
      description: '',
      category: 'api_key',
      folder: prefillFolder ?? 'General',
    },
  });

  const selectedCategory = watch('category');
  const folderValue = watch('folder');

  const onSubmit = (data: CreateSecretInput) => {
    create(data, {
      onSuccess: () => router.back(),
    });
  };

  const sectionCard = {
    backgroundColor: colors.surfaceCard,
    borderRadius: Radius.lg,
    borderCurve: 'continuous' as const,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden' as const,
  };

  const fieldRow = {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  };

  const divider = {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: Spacing.md,
  };

  const labelStyle = { ...Typography.caption, color: colors.muted, marginBottom: 4 };
  const inputStyle = {
    ...Typography.bodyLg,
    color: colors.ink,
    paddingVertical: 0,
    outlineStyle: 'none' as const,
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Add Secret' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ gap: Spacing.lg, padding: Spacing.md, paddingBottom: Spacing.xxl * 2 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Folder / Project ──────────────────────────────── */}
        <View style={{ gap: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: 2 }}>
            <MaterialIcons name="folder-open" size={16} color={colors.muted} />
            <Text style={{ ...Typography.titleSm, color: colors.muted }}>Folder / Project</Text>
          </View>
          <View style={sectionCard}>
            <Controller
              control={control}
              name="folder"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ ...fieldRow, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                  <MaterialIcons name="folder" size={20} color={colors.brandBlue} />
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. Work, Personal, Project X"
                    placeholderTextColor={colors.muted}
                    autoCapitalize="words"
                    style={{ ...inputStyle, flex: 1, paddingVertical: Spacing.sm }}
                  />
                </View>
              )}
            />
          </View>
          {errors.folder && (
            <Text style={{ ...Typography.caption, color: colors.error, paddingHorizontal: 2 }}>{errors.folder.message}</Text>
          )}
          {existingFolders && existingFolders.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs }}>
              {existingFolders.map((f) => {
                const isActive = folderValue === f.name;
                return (
                  <Pressable
                    key={f.name}
                    onPress={() => setValue('folder', f.name)}
                    style={({ pressed, hovered }: any) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: Radius.pill,
                      borderCurve: 'continuous',
                      backgroundColor: isActive ? colors.brandBlue : hovered ? colors.surfaceSoft : colors.surfaceCard,
                      borderWidth: 1,
                      borderColor: isActive ? colors.brandBlue : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <MaterialIcons name="folder" size={12} color={isActive ? '#ffffff' : colors.muted} />
                    <Text style={{ ...Typography.caption, color: isActive ? '#ffffff' : colors.muted }}>{f.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* ── Secret Details ────────────────────────────────── */}
        <View style={{ gap: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: 2 }}>
            <MaterialIcons name="lock" size={16} color={colors.muted} />
            <Text style={{ ...Typography.titleSm, color: colors.muted }}>Secret Details</Text>
          </View>
          <View style={sectionCard}>
            {/* Name */}
            <View style={fieldRow}>
              <Text style={labelStyle}>Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. OpenAI API Key"
                    placeholderTextColor={colors.muted}
                    autoCapitalize="words"
                    style={{ ...inputStyle, paddingVertical: 4 }}
                  />
                )}
              />
              {errors.name && <Text style={{ ...Typography.caption, color: colors.error, marginTop: 4 }}>{errors.name.message}</Text>}
            </View>

            <View style={divider} />

            {/* Category */}
            <View style={fieldRow}>
              <Text style={labelStyle}>Category</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: 6 }}>
                {SECRET_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  const meta = CATEGORY_META[cat as SecretCategory];
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setValue('category', cat as SecretCategory)}
                      style={({ pressed, hovered }: any) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: Radius.pill,
                        borderCurve: 'continuous',
                        backgroundColor: isActive ? meta.color + '22' : hovered ? colors.surfaceSoft : 'transparent',
                        borderWidth: 1.5,
                        borderColor: isActive ? meta.color : colors.border,
                        opacity: pressed ? 0.75 : 1,
                      })}
                    >
                      <MaterialIcons
                        name={meta.icon as any}
                        size={14}
                        color={isActive ? meta.color : colors.muted}
                      />
                      <Text style={{
                        ...Typography.caption,
                        color: isActive ? meta.color : colors.muted,
                        fontWeight: isActive ? '600' : '400',
                      }}>
                        {CATEGORY_LABELS[cat as SecretCategory]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* ── Secret Value ──────────────────────────────────── */}
        <View style={{ gap: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: 2 }}>
            <MaterialIcons name="vpn-key" size={16} color={colors.muted} />
            <Text style={{ ...Typography.titleSm, color: colors.muted }}>Credentials</Text>
          </View>
          <View style={sectionCard}>
            {/* Value */}
            <View style={{ ...fieldRow }}>
              <Text style={labelStyle}>Secret value</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <Controller
                  control={control}
                  name="value"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Paste your secret here"
                      placeholderTextColor={colors.muted}
                      secureTextEntry={!valueRevealed}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', paddingVertical: 4 }}
                    />
                  )}
                />
                <Pressable
                  onPress={() => setValueRevealed((v) => !v)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <MaterialIcons
                    name={valueRevealed ? 'visibility-off' : 'visibility'}
                    size={20}
                    color={colors.muted}
                  />
                </Pressable>
              </View>
              {errors.value && <Text style={{ ...Typography.caption, color: colors.error, marginTop: 4 }}>{errors.value.message}</Text>}
            </View>

            <View style={divider} />

            {/* Notes */}
            <View style={fieldRow}>
              <Text style={labelStyle}>Notes (optional)</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Any additional context…"
                    placeholderTextColor={colors.muted}
                    multiline
                    numberOfLines={3}
                    style={{ ...inputStyle, paddingVertical: 4, minHeight: 60 }}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {error && (
          <View style={{ ...sectionCard, padding: Spacing.md, borderColor: colors.error + '44', backgroundColor: colors.error + '11' }}>
            <Text style={{ ...Typography.bodySm, color: colors.error }}>{error}</Text>
          </View>
        )}

        <Button label="Save Secret" onPress={handleSubmit(onSubmit)} loading={loading} fullWidth />
      </ScrollView>
    </>
  );
}
