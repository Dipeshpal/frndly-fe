import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { CATEGORY_LABELS, type SecretCategory, type Secret } from '@/types/vault.types';

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
  const isWeb = Platform.OS === 'web';
  const color = CATEGORY_COLORS[secret.category];

  const handleCopy = async () => {
    await Clipboard.setStringAsync(secret.value);
  };

  return (
    <Pressable
      style={({ hovered }: any) => ({
        backgroundColor: hovered ? colors.surfaceSoft : colors.surfaceCard,
        borderRadius: 12,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: hovered ? color : colors.border,
        borderLeftWidth: 4,
        borderLeftColor: color,
        padding: Spacing.md,
        gap: Spacing.md,
        transition: 'all 0.2s',
      })}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, gap: Spacing.xs }}>
          <Text style={{ ...Typography.headlineLgMobile, color: colors.ink }}>{secret.name}</Text>
          <Text style={{ ...Typography.labelCaps, color: color, textTransform: 'uppercase' }}>{CATEGORY_LABELS[secret.category]}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <Pressable onPress={() => onEdit(secret)} style={({ pressed, hovered }: any) => ({ opacity: pressed ? 0.6 : 1, backgroundColor: hovered ? colors.surfaceCard : 'transparent', padding: 4, borderRadius: 4 })}>
            {!isWeb ? (
              <Image source="sf:pencil" style={{ width: 20, height: 20, tintColor: colors.muted }} contentFit="contain" />
            ) : (
              <Text style={{ fontSize: 16 }}>✏️</Text>
            )}
          </Pressable>
          <Pressable onPress={() => onDelete(secret.id)} style={({ pressed, hovered }: any) => ({ opacity: pressed ? 0.6 : 1, backgroundColor: hovered ? colors.surfaceCard : 'transparent', padding: 4, borderRadius: 4 })}>
            {!isWeb ? (
              <Image source="sf:trash" style={{ width: 20, height: 20, tintColor: colors.error }} contentFit="contain" />
            ) : (
              <Text style={{ fontSize: 16 }}>🗑️</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Value Area */}
      <View style={{ backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.md }}>
        <ScrollView horizontal scrollEventThrottle={16} showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
          {revealed ? (
            <Text style={{ ...Typography.monoCode, color: colors.ink }}>{secret.value}</Text>
          ) : (
            <Text style={{ ...Typography.monoCode, color: colors.muted, letterSpacing: 2 }}>••••••••••••</Text>
          )}
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <Pressable onPress={() => setRevealed((v) => !v)} style={({ pressed, hovered }: any) => ({ opacity: pressed ? 0.6 : 1, backgroundColor: hovered ? colors.surfaceCard : 'transparent', padding: 4, borderRadius: 4 })}>
            {!isWeb ? (
              <Image source={`sf:${revealed ? 'eye.slash' : 'eye'}`} style={{ width: 20, height: 20, tintColor: colors.muted }} contentFit="contain" />
            ) : (
              <Text style={{ fontSize: 16 }}>{revealed ? '🙈' : '👁️'}</Text>
            )}
          </Pressable>
          <Pressable onPress={handleCopy} style={({ pressed, hovered }: any) => ({ opacity: pressed ? 0.6 : 1, backgroundColor: hovered ? colors.surfaceCard : 'transparent', padding: 4, borderRadius: 4 })}>
            {!isWeb ? (
              <Image source="sf:doc.on.doc" style={{ width: 20, height: 20, tintColor: color }} contentFit="contain" />
            ) : (
              <Text style={{ fontSize: 16 }}>📄</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
