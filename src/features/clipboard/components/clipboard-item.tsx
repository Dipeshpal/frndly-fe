import { View, Text, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/components/ui/toast';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { truncate, formatDate } from '@/utils/format';
import type { ClipboardItem as ClipboardItemType } from '@/types/clipboard.types';

interface ClipboardItemProps {
  item: ClipboardItemType;
  onDelete?: (id: string) => void;
}

export function ClipboardItemCard({ item, onDelete }: ClipboardItemProps) {
  const { colors } = useTheme();
  const toast = useToast();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(item.content);
    toast.show('Copied to clipboard', 'success');
  };

  return (
    <Pressable
      onPress={handleCopy}
      style={({ pressed }: any) => ({
        backgroundColor: pressed ? 'rgba(30,30,30,0.95)' : 'rgba(20,20,20,0.9)',
        borderRadius: 12,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: '#262626',
        borderLeftWidth: 4,
        borderLeftColor: colors.brandBlue,
        padding: Spacing.md,
        gap: Spacing.sm,
      })}
    >
      <Text style={{ ...Typography.bodyLg, color: colors.ink }} selectable numberOfLines={2}>
        {truncate(item.content, 150)}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
          <Text style={{ ...Typography.bodySm, color: colors.muted }}>{item.device_name}</Text>
          <Text style={{ ...Typography.bodySm, color: colors.muted }}>·</Text>
          <Text style={{ ...Typography.bodySm, color: colors.muted }}>{formatDate(item.created_at)}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); handleCopy(); }}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
            accessibilityLabel="Copy"
          >
            <MaterialIcons name="content-copy" size={16} color={colors.brandBlue} />
          </Pressable>
          {onDelete && (
            <Pressable
              onPress={(e) => { e.stopPropagation?.(); onDelete(item.id); }}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
              accessibilityLabel="Delete"
            >
              <MaterialIcons name="delete-outline" size={16} color={colors.error} />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}
