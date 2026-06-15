import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { truncate, formatDate } from '@/utils/format';
import type { ClipboardItem as ClipboardItemType } from '@/types/clipboard.types';

interface ClipboardItemProps {
  item: ClipboardItemType;
  onDelete: (id: string) => void;
}

export function ClipboardItemCard({ item, onDelete }: ClipboardItemProps) {
  const { colors } = useTheme();
  const isWeb = process.env.EXPO_OS === 'web';

  const handleCopy = async () => {
    await Clipboard.setStringAsync(item.content);
  };

  return (
    <View style={{
      backgroundColor: 'rgba(20,20,20,0.9)',
      borderRadius: 12,
      borderCurve: 'continuous',
      borderWidth: 1,
      borderColor: '#262626',
      borderLeftWidth: 4,
      borderLeftColor: colors.brandBlue,
      padding: Spacing.md,
      gap: Spacing.sm,
    }}>
      <Text style={{ ...Typography.bodyLg, color: colors.ink }} selectable numberOfLines={2}>
        {truncate(item.content, 150)}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
          <Text style={{ ...Typography.bodySm, color: colors.muted }}>{item.device_name}</Text>
          <Text style={{ ...Typography.bodySm, color: colors.muted }}>·</Text>
          <Text style={{ ...Typography.bodySm, color: colors.muted }}>{formatDate(item.created_at)}</Text>
        </View>
        {!isWeb && (
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
            <Pressable onPress={handleCopy} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })} accessibilityLabel="Copy">
              <Image source="sf:doc.on.doc" style={{ width: 16, height: 16, tintColor: colors.brandBlue }} contentFit="contain" />
            </Pressable>
            <Pressable onPress={() => onDelete(item.id)} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })} accessibilityLabel="Delete">
              <Image source="sf:trash" style={{ width: 16, height: 16, tintColor: colors.error }} contentFit="contain" />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
