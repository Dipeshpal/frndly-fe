import { View, Text, Switch, Pressable, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

type RowType = 'toggle' | 'link' | 'destructive';

interface PreferenceRowProps {
  icon?: string;
  iconColor?: string;
  label: string;
  subtitle?: string;
  type?: RowType;
  value?: boolean;
  onValueChange?: (v: boolean) => void;
  onPress?: () => void;
  style?: ViewStyle;
}

export function PreferenceRow({
  icon,
  iconColor,
  label,
  subtitle,
  type = 'link',
  value,
  onValueChange,
  onPress,
  style,
}: PreferenceRowProps) {
  const { colors } = useTheme();
  const textColor = type === 'destructive' ? colors.error : colors.ink;

  const content = (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md }, style]}>
      {icon && (
        <View style={{ width: 32, height: 32, borderRadius: 8, borderCurve: 'continuous', backgroundColor: iconColor ? `${iconColor}18` : colors.surfaceCard, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={`sf:${icon}`} style={{ width: 15, height: 15, tintColor: iconColor ?? colors.muted }} contentFit="contain" />
        </View>
      )}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ ...Typography.bodyMd, color: textColor }}>{label}</Text>
        {subtitle && <Text style={{ ...Typography.caption, color: colors.muted }}>{subtitle}</Text>}
      </View>
      {type === 'toggle' && onValueChange && (
        <Switch value={value} onValueChange={onValueChange} />
      )}
      {type === 'link' && (
        <Image source="sf:chevron.right" style={{ width: 14, height: 14, tintColor: colors.mutedSoft }} contentFit="contain" />
      )}
    </View>
  );

  if (type === 'toggle') return content;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      {content}
    </Pressable>
  );
}
