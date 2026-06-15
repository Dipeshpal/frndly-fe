import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_LABELS, type SecretCategory } from '@/types/vault.types';
import { maskValue, formatDate } from '@/utils/format';
import type { Secret } from '@/types/vault.types';

const CATEGORY_ICONS: Record<SecretCategory, string> = {
  api_key: 'key.fill',
  database: 'cylinder.split.1x2.fill',
  cloud: 'cloud.fill',
  personal: 'person.fill',
  other: 'doc.text.fill',
};

const CATEGORY_COLORS: Record<SecretCategory, string> = {
  api_key: '#ff4d8b',
  database: '#1a3a3a',
  cloud: '#b8a4ed',
  personal: '#ffb084',
  other: '#e8b94a',
};

interface SecretCardProps {
  secret: Secret;
  onDelete: (id: string) => void;
  onEdit: (secret: Secret) => void;
}

export function SecretCard({ secret, onDelete, onEdit }: SecretCardProps) {
  const { colors } = useTheme();
  const [revealed, setRevealed] = useState(false);
  const color = CATEGORY_COLORS[secret.category];

  const handleCopy = async () => {
    await Clipboard.setStringAsync(secret.value);
  };

  return (
    <View style={{
      backgroundColor: colors.canvas,
      borderRadius: Radius.lg,
      borderCurve: 'continuous',
      borderWidth: 1,
      borderColor: colors.hairline,
      padding: Spacing.md,
      gap: Spacing.sm,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, borderCurve: 'continuous', backgroundColor: `${color}18`, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={`sf:${CATEGORY_ICONS[secret.category]}`} style={{ width: 16, height: 16, tintColor: color }} contentFit="contain" />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ ...Typography.titleSm, color: colors.ink }}>{secret.name}</Text>
          <Badge label={CATEGORY_LABELS[secret.category]} />
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
          <Pressable onPress={() => onEdit(secret)} style={{ padding: 4 }} accessibilityLabel="Edit secret">
            <Image source="sf:pencil" style={{ width: 16, height: 16, tintColor: colors.muted }} contentFit="contain" />
          </Pressable>
          <Pressable onPress={() => onDelete(secret.id)} style={{ padding: 4 }} accessibilityLabel="Delete secret">
            <Image source="sf:trash" style={{ width: 16, height: 16, tintColor: colors.error }} contentFit="contain" />
          </Pressable>
        </View>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceCard,
        borderRadius: Radius.sm,
        borderCurve: 'continuous',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        gap: Spacing.xs,
      }}>
        <Text style={{ ...Typography.bodySm, color: colors.body, fontFamily: 'monospace', flex: 1 }} selectable={revealed} numberOfLines={1}>
          {revealed ? secret.value : maskValue(secret.value)}
        </Text>
        <Pressable onPress={() => setRevealed((v) => !v)} style={{ padding: 4 }} accessibilityLabel={revealed ? 'Hide value' : 'Reveal value'}>
          <Image source={`sf:${revealed ? 'eye.slash' : 'eye'}`} style={{ width: 14, height: 14, tintColor: colors.muted }} contentFit="contain" />
        </Pressable>
        <Pressable onPress={handleCopy} style={{ padding: 4 }} accessibilityLabel="Copy value">
          <Image source="sf:doc.on.doc" style={{ width: 14, height: 14, tintColor: colors.brandPink }} contentFit="contain" />
        </Pressable>
      </View>

      {secret.description && (
        <Text style={{ ...Typography.caption, color: colors.muted }}>{secret.description}</Text>
      )}
      <Text style={{ ...Typography.caption, color: colors.mutedSoft }}>Added {formatDate(secret.created_at)}</Text>
    </View>
  );
}
