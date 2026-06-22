import { View, ScrollView, Text, Pressable, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useSecretList, useUpdateSecret, useFolderList } from '@/features/vault/hooks/use-vault';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/feedback/loading-state';
import { Spacing, Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { SECRET_CATEGORIES, CATEGORY_LABELS, type SecretCategory, type CreateSecretInput } from '@/types/vault.types';

// ── Field config (mirrors add.tsx) ───────────────────────────────────────────

type FieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  secret?: boolean;
  mono?: boolean;
  optional?: boolean;
  keyboard?: 'default' | 'url' | 'email-address' | 'numeric';
  icon?: string;
  multiline?: boolean;
};

const CATEGORY_FIELDS: Record<SecretCategory, FieldConfig[]> = {
  api_key: [
    { name: 'f_value',    label: 'API Key',         placeholder: 'sk-…',                    secret: true, mono: true, icon: 'vpn-key' },
    { name: 'f_base_url', label: 'Base URL',         placeholder: 'https://api.example.com', optional: true, keyboard: 'url', icon: 'link' },
  ],
  database: [
    { name: 'f_host',     label: 'Host',             placeholder: 'localhost or db.example.com', icon: 'dns' },
    { name: 'f_port',     label: 'Port',             placeholder: '5432',                    keyboard: 'numeric', icon: 'settings-ethernet', optional: true },
    { name: 'f_db_name',  label: 'Database Name',    placeholder: 'mydb',                    icon: 'table-chart' },
    { name: 'f_username', label: 'Username',         placeholder: 'postgres',                icon: 'person-outline' },
    { name: 'f_password', label: 'Password',         placeholder: '••••••••',                secret: true, mono: true, icon: 'lock-outline' },
  ],
  cloud: [
    { name: 'f_provider',   label: 'Provider',          placeholder: 'AWS, GCP, Azure…',      icon: 'cloud-queue' },
    { name: 'f_region',     label: 'Region',            placeholder: 'us-east-1',             optional: true, icon: 'location-on' },
    { name: 'f_access_key', label: 'Access Key ID',     placeholder: 'AKIAIOSFODNN7EXAMPLE',  mono: true, icon: 'badge' },
    { name: 'f_secret_key', label: 'Secret Access Key', placeholder: '••••••••',              secret: true, mono: true, icon: 'lock-outline' },
  ],
  personal: [
    { name: 'f_value', label: 'Value', placeholder: 'Your personal secret', secret: true, mono: true, icon: 'lock-outline' },
  ],
  credentials: [
    { name: 'f_site',     label: 'Site',              placeholder: 'github.com',             keyboard: 'url',           icon: 'language' },
    { name: 'f_username', label: 'Email / Username',  placeholder: 'user@example.com',       keyboard: 'email-address', icon: 'person-outline' },
    { name: 'f_password', label: 'Password',          placeholder: '••••••••',               secret: true, mono: true,  icon: 'lock-outline' },
  ],
  other: [
    { name: 'f_value', label: 'Value', placeholder: 'Your secret value', secret: true, mono: true, icon: 'lock-outline' },
  ],
};

const NAME_PLACEHOLDER: Record<SecretCategory, string> = {
  api_key:     'e.g. OpenAI API Key',
  database:    'e.g. Production DB',
  cloud:       'e.g. AWS S3 Bucket',
  personal:    'e.g. SSH Key',
  credentials: 'e.g. GitHub Login',
  other:       'e.g. My Secret',
};

const SECTION_LABEL: Record<SecretCategory, string> = {
  api_key:     'API Key Details',
  database:    'Connection Details',
  cloud:       'Cloud Credentials',
  personal:    'Secret Value',
  credentials: 'Login Details',
  other:       'Secret Value',
};

const ALL_FIELD_NAMES = Array.from(
  new Set(Object.values(CATEGORY_FIELDS).flatMap((fs) => fs.map((f) => f.name)))
);

// ── Schema ────────────────────────────────────────────────────────────────────

const baseSchema = z.object({
  name:        z.string().min(1, 'Name is required'),
  category:    z.enum(SECRET_CATEGORIES),
  folder:      z.string().min(1, 'Folder is required'),
  description: z.string().optional(),
  ...Object.fromEntries(ALL_FIELD_NAMES.map((n) => [n, z.string().optional()])),
});

const schema = baseSchema.superRefine((data, ctx) => {
  const fields = CATEGORY_FIELDS[data.category as SecretCategory] ?? [];
  for (const f of fields) {
    if (!f.optional && !data[f.name as keyof typeof data]) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${f.label} is required`, path: [f.name] });
    }
  }
});

// ── Category meta ─────────────────────────────────────────────────────────────

const CATEGORY_META: Record<SecretCategory, { icon: string; color: string }> = {
  api_key:     { icon: 'vpn-key',    color: '#ff4d8b' },
  database:    { icon: 'storage',    color: '#4f9cf9' },
  cloud:       { icon: 'cloud',      color: '#b8a4ed' },
  personal:    { icon: 'person',     color: '#ffb084' },
  credentials: { icon: 'password',   color: '#34c98a' },
  other:       { icon: 'more-horiz', color: '#e8b94a' },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function EditSecretScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const { data: secrets, isLoading } = useSecretList();
  const { mutate: updateSecret, isPending } = useUpdateSecret();
  const { data: existingFolders } = useFolderList();

  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const toggleReveal = (name: string) => setRevealed((p) => ({ ...p, [name]: !p[name] }));

  const secret = secrets?.find((s) => s.id === id);

  const defaultValues: Record<string, string> = {
    name: '', category: 'api_key', folder: 'General', description: '',
    ...Object.fromEntries(ALL_FIELD_NAMES.map((n) => [n, ''])),
  };

  const { control, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const selectedCategory: SecretCategory = watch('category');
  const folderValue: string = watch('folder');

  // Parse existing secret.value JSON and pre-fill dynamic fields
  useEffect(() => {
    if (!secret) return;
    const parsed: Record<string, string> = (() => {
      try { return JSON.parse(secret.value) ?? {}; } catch { return {}; }
    })();

    const fieldReset: Record<string, string> = Object.fromEntries(ALL_FIELD_NAMES.map((n) => [n, '']));
    // map parsed keys back to f_* field names
    for (const [k, v] of Object.entries(parsed)) {
      const fieldName = `f_${k}`;
      if (ALL_FIELD_NAMES.includes(fieldName)) fieldReset[fieldName] = v as string;
    }

    reset({
      name: secret.name,
      description: secret.description ?? '',
      category: secret.category,
      folder: secret.folder,
      ...fieldReset,
    });
  }, [secret, reset]);

  const onSubmit = (data: any) => {
    if (!id) return;
    const fields = CATEGORY_FIELDS[data.category as SecretCategory] ?? [];
    const structured: Record<string, string> = {};
    for (const f of fields) {
      if (data[f.name]) structured[f.name.replace('f_', '')] = data[f.name];
    }
    const payload: Partial<CreateSecretInput> = {
      name: data.name,
      category: data.category,
      folder: data.folder,
      description: data.description,
      value: JSON.stringify(structured),
    };
    updateSecret(
      { id, data: payload },
      {
        onSuccess: () => router.back(),
        onError: () => Alert.alert('Error', 'Failed to update secret'),
      },
    );
  };

  if (isLoading || !secret) return <LoadingState message="Loading secret…" />;

  // ── Styles ──────────────────────────────────────────────────────────────────

  const sectionCard = {
    backgroundColor: colors.surfaceCard,
    borderRadius: Radius.lg,
    borderCurve: 'continuous' as const,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden' as const,
  };
  const fieldRow = { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm };
  const divider = { height: 1, backgroundColor: colors.border, marginLeft: Spacing.md };
  const labelStyle = { ...Typography.caption, color: colors.muted, marginBottom: 4 };
  const inputStyle = { ...Typography.bodyLg, color: colors.ink, paddingVertical: 0, outlineStyle: 'none' as any };

  const activeFields = CATEGORY_FIELDS[selectedCategory] ?? [];

  const renderField = (f: FieldConfig, isLast: boolean) => (
    <View key={f.name}>
      <View style={fieldRow}>
        <Text style={labelStyle}>{f.label}{f.optional ? ' (optional)' : ''}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          {f.icon && <MaterialIcons name={f.icon as any} size={16} color={colors.muted} />}
          <Controller
            control={control}
            name={f.name}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={f.placeholder}
                placeholderTextColor={colors.muted}
                secureTextEntry={f.secret && !revealed[f.name]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={f.keyboard ?? 'default'}
                multiline={f.multiline}
                style={[{
                  ...inputStyle,
                  flex: 1,
                  fontFamily: f.mono ? 'monospace' : undefined,
                  paddingVertical: 4,
                  minHeight: f.multiline ? 60 : undefined,
                } as any]}
              />
            )}
          />
          {f.secret && (
            <Pressable onPress={() => toggleReveal(f.name)} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
              <MaterialIcons name={revealed[f.name] ? 'visibility-off' : 'visibility'} size={20} color={colors.muted} />
            </Pressable>
          )}
        </View>
        {(errors as any)[f.name] && (
          <Text style={{ ...Typography.caption, color: colors.error, marginTop: 4 }}>
            {(errors as any)[f.name].message}
          </Text>
        )}
      </View>
      {!isLast && <View style={divider} />}
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Edit Secret' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ gap: Spacing.lg, padding: Spacing.md, paddingBottom: Spacing.xxl * 2 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ scrollbarWidth: 'none' } as any}
      >
        {/* ── Folder / Project ────────────────────────────────── */}
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
                    style={[{ ...inputStyle, flex: 1, paddingVertical: Spacing.sm } as any]}
                  />
                </View>
              )}
            />
          </View>
          {(errors as any).folder && (
            <Text style={{ ...Typography.caption, color: colors.error, paddingHorizontal: 2 }}>{(errors as any).folder.message}</Text>
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
                      flexDirection: 'row', alignItems: 'center', gap: 4,
                      paddingHorizontal: 12, paddingVertical: 6,
                      borderRadius: Radius.pill, borderCurve: 'continuous',
                      backgroundColor: isActive ? colors.brandBlue : hovered ? colors.surfaceSoft : colors.surfaceCard,
                      borderWidth: 1, borderColor: isActive ? colors.brandBlue : colors.border,
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

        {/* ── Secret Details ──────────────────────────────────── */}
        <View style={{ gap: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: 2 }}>
            <MaterialIcons name="lock" size={16} color={colors.muted} />
            <Text style={{ ...Typography.titleSm, color: colors.muted }}>Secret Details</Text>
          </View>
          <View style={sectionCard}>
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
                    placeholder={NAME_PLACEHOLDER[selectedCategory]}
                    placeholderTextColor={colors.muted}
                    autoCapitalize="words"
                    style={[{ ...inputStyle, paddingVertical: 4 } as any]}
                  />
                )}
              />
              {(errors as any).name && <Text style={{ ...Typography.caption, color: colors.error, marginTop: 4 }}>{(errors as any).name.message}</Text>}
            </View>

            <View style={divider} />

            <View style={fieldRow}>
              <Text style={labelStyle}>Category</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: 6 }}>
                {SECRET_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  const meta = CATEGORY_META[cat];
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setValue('category', cat)}
                      style={({ pressed, hovered }: any) => ({
                        flexDirection: 'row', alignItems: 'center', gap: 6,
                        paddingHorizontal: 14, paddingVertical: 8,
                        borderRadius: Radius.pill, borderCurve: 'continuous',
                        backgroundColor: isActive ? meta.color + '22' : hovered ? colors.surfaceSoft : 'transparent',
                        borderWidth: 1.5, borderColor: isActive ? meta.color : colors.border,
                        opacity: pressed ? 0.75 : 1,
                      })}
                    >
                      <MaterialIcons name={meta.icon as any} size={14} color={isActive ? meta.color : colors.muted} />
                      <Text style={{ ...Typography.caption, color: isActive ? meta.color : colors.muted, fontWeight: isActive ? '600' : '400' }}>
                        {CATEGORY_LABELS[cat]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* ── Dynamic Fields ──────────────────────────────────── */}
        <View style={{ gap: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: 2 }}>
            <MaterialIcons name={CATEGORY_META[selectedCategory].icon as any} size={16} color={colors.muted} />
            <Text style={{ ...Typography.titleSm, color: colors.muted }}>{SECTION_LABEL[selectedCategory]}</Text>
          </View>
          <View style={sectionCard}>
            {activeFields.map((f, i) => renderField(f, i === activeFields.length - 1))}
            <View style={divider} />
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
                    style={[{ ...inputStyle, paddingVertical: 4, minHeight: 60 } as any]}
                  />
                )}
              />
            </View>
          </View>
        </View>

        <Button label="Save Changes" onPress={handleSubmit(onSubmit)} loading={isPending} fullWidth />
      </ScrollView>
    </>
  );
}
