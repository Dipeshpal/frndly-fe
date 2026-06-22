import { View, Text, Pressable, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/components/ui/toast';
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
  const toast = useToast();
  const color = CATEGORY_COLORS[secret.category] || CATEGORY_COLORS.other;

  let parsedJson: Record<string, any> | null = null;
  try {
    const trimmed = secret.value.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        parsedJson = parsed;
      }
    }
  } catch {
    // Treat as simple string if JSON parsing fails
  }

  const handleCopy = async () => {
    await Clipboard.setStringAsync(secret.value);
    toast.show('Copied to clipboard', 'success');
  };

  return (
    <Pressable
      onPress={handleCopy}
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
          <Pressable onPress={(e) => { e.stopPropagation?.(); onEdit(secret); }} style={({ pressed, hovered }: any) => ({ opacity: pressed ? 0.6 : 1, backgroundColor: hovered ? colors.surfaceCard : 'transparent', padding: 4, borderRadius: 4 })}>
            <MaterialIcons name="edit" size={18} color={colors.muted} />
          </Pressable>
          <Pressable onPress={(e) => { e.stopPropagation?.(); onDelete(secret.id); }} style={({ pressed, hovered }: any) => ({ opacity: pressed ? 0.6 : 1, backgroundColor: hovered ? colors.surfaceCard : 'transparent', padding: 4, borderRadius: 4 })}>
            <MaterialIcons name="delete-outline" size={18} color={colors.error} />
          </Pressable>
        </View>
      </View>

      {/* Value Area */}
      <View style={{ backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: Spacing.md, gap: Spacing.md }}>
        {parsedJson ? (
          <View style={{ gap: Spacing.sm }}>
            {Object.entries(parsedJson).map(([key, val]) => {
              const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
              return (
                <View key={key} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 2 }}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={{ ...Typography.caption, color: colors.muted, textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {revealed ? (
                        <Text style={{ ...Typography.monoCode, color: colors.ink }}>{valStr}</Text>
                      ) : (
                        <Text style={{ ...Typography.monoCode, color: colors.muted, letterSpacing: 2 }}>••••••••••••</Text>
                      )}
                    </ScrollView>
                  </View>
                  <View style={{ flexDirection: 'row', gap: Spacing.xs, marginLeft: Spacing.sm }}>
                    <Pressable
                      onPress={async (e) => {
                        e.stopPropagation?.();
                        await Clipboard.setStringAsync(valStr);
                        toast.show(`Copied ${key.replace(/_/g, ' ')}`, 'success');
                      }}
                      style={({ pressed, hovered }: any) => ({
                        opacity: pressed ? 0.6 : 1,
                        backgroundColor: hovered ? colors.surfaceCard : 'transparent',
                        padding: 6,
                        borderRadius: 4
                      })}
                    >
                      <MaterialIcons name="content-copy" size={16} color={colors.muted} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.md }}>
            <ScrollView horizontal scrollEventThrottle={16} showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
              {revealed ? (
                <Text style={{ ...Typography.monoCode, color: colors.ink }}>{secret.value}</Text>
              ) : (
                <Text style={{ ...Typography.monoCode, color: colors.muted, letterSpacing: 2 }}>••••••••••••</Text>
              )}
            </ScrollView>
          </View>
        )}

        {/* Action Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: Spacing.sm, borderTopWidth: parsedJson ? 1 : 0, borderTopColor: colors.border, paddingTop: parsedJson ? Spacing.sm : 0 }}>
          {parsedJson && (
            <Text style={{ ...Typography.caption, color: colors.muted, marginRight: 'auto' }}>
              Database fields format
            </Text>
          )}
          <Pressable onPress={(e) => { e.stopPropagation?.(); setRevealed((v) => !v); }} style={({ pressed, hovered }: any) => ({ opacity: pressed ? 0.6 : 1, backgroundColor: hovered ? colors.surfaceCard : 'transparent', padding: 4, borderRadius: 4 })}>
            <MaterialIcons name={revealed ? 'visibility-off' : 'visibility'} size={18} color={colors.muted} />
          </Pressable>
          <Pressable onPress={(e) => { e.stopPropagation?.(); handleCopy(); }} style={({ pressed, hovered }: any) => ({ opacity: pressed ? 0.6 : 1, backgroundColor: hovered ? colors.surfaceCard : 'transparent', padding: 4, borderRadius: 4 })}>
            <MaterialIcons name="content-copy" size={18} color={color} />
          </Pressable>
        </View>
      </View>

    </Pressable>
  );
}
