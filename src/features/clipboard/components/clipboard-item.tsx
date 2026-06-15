import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { truncate, formatDate } from '@/utils/format';
import type { ClipboardItem as ClipboardItemType } from '@/types/clipboard.types';

interface ClipboardItemProps {
  item: ClipboardItemType;
  onDelete: (id: string) => void;
}

export function ClipboardItemCard({ item, onDelete }: ClipboardItemProps) {
  const { colors } = useTheme();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(item.content);
  };

  return (
    <View style={{
      backgroundColor: colors.canvas,
      borderRadius: Radius.md,
      borderCurve: 'continuous',
      borderWidth: 1,
      borderColor: colors.hairline,
      padding: Spacing.md,
      gap: Spacing.xs,
    }}>
      <Text style={{ ...Typography.bodyMd, color: colors.ink }} selectable numberOfLines={3}>
        {truncate(item.content, 200)}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xxs }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
          <Image source="sf:iphone" style={{ width: 12, height: 12, tintColor: colors.mutedSoft }} contentFit="contain" />
          <Text style={{ ...Typography.caption, color: colors.mutedSoft }}>{item.device_name}</Text>
          <Text style={{ ...Typography.caption, color: colors.hairline }}>·</Text>
          <Text style={{ ...Typography.caption, color: colors.mutedSoft }}>{formatDate(item.created_at)}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
          <Pressable onPress={handleCopy} style={{ padding: 4 }} accessibilityLabel="Copy">
            <Image source="sf:doc.on.doc" style={{ width: 16, height: 16, tintColor: colors.brandPink }} contentFit="contain" />
          </Pressable>
          <Pressable onPress={() => onDelete(item.id)} style={{ padding: 4 }} accessibilityLabel="Delete">
            <Image source="sf:trash" style={{ width: 16, height: 16, tintColor: colors.error }} contentFit="contain" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
